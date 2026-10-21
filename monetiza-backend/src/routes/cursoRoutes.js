const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const path = require('node:path')
const fs = require('node:fs/promises')
const { randomUUID } = require('node:crypto')
const db = require('../config/db')
const autenticar = require('../middlewares/authMiddleware')
const operacoes = require('../services/operacaoService')
const { UUID, exigir, texto, capaValida, validarEstrutura } = require('../services/cursoValidacao')
const router = express.Router()
const pasta = path.join(__dirname, '../private/uploads/cursos')
const ler = valor => typeof valor === 'string' ? JSON.parse(valor) : valor
const tratar = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next)

router.use((_req, res, next) => {
    res.set('Cache-Control', 'private, no-store')
    res.set('X-Content-Type-Options', 'nosniff')
    next()
})

async function acesso(id, usuario, produtor = false, conexao = db) {
    exigir(Number.isSafeInteger(Number(id)) && Number(id) > 0, 'Curso inválido.')
    const [[curso]] = await conexao.query(`SELECT c.*, p.usuario_id, p.titulo, p.preco, p.comissao,
        p.capa, p.status_produto, p.excluido_em, p.descricao_curta,
        EXISTS(SELECT 1 FROM venda_itens vi JOIN vendas v ON v.id = vi.venda_id
        WHERE vi.produto_id = p.id AND v.comprador_id = ? AND v.status_venda = 'pago') AS comprado
        FROM cursos c JOIN produtos p ON p.id = c.produto_id WHERE p.id = ?`, [usuario, id])
    const dono = curso && Number(curso.usuario_id) === Number(usuario)
    exigir(curso && (dono || curso.comprado), 'Curso indisponível para esta conta.', 404)
    exigir(!produtor || (dono && !curso.excluido_em), 'Somente o produtor pode editar este curso.', 403)
    curso.estrutura = ler(curso.estrutura)
    curso.editor = Boolean(dono && !curso.excluido_em)
    return curso
}

// O player usa cookie HttpOnly; o JWT nunca entra na URL do vídeo.
// O cookie é aceito apenas nesta rota de leitura, nunca para alterações.
router.get('/:id/midia/:arquivo', tratar(async (req, res) => {
    const valor = (req.headers.cookie || '').split(';').map(s => s.trim())
        .find(s => s.startsWith('monetiza_curso='))?.slice('monetiza_curso='.length)
    let usuario
    try { usuario = jwt.verify(valor || '', process.env.JWT_SECRET, { audience: 'monetiza-cursos' })
        exigir(usuario.curso === Number(req.params.id), 'Sessão de vídeo inválida.', 401) } catch {
        return res.status(401).json({ erro: 'Entre novamente para assistir.' })
    }
    const curso = await acesso(req.params.id, usuario.id)
    exigir(UUID.test(req.params.arquivo), 'Arquivo inválido.')
    const [[arquivo]] = await db.query('SELECT * FROM curso_arquivos WHERE id = ? AND produto_id = ?', [req.params.arquivo, req.params.id])
    const referenciado = curso.estrutura.some(m => m.aulas.some(a => a.video === req.params.arquivo || a.material === req.params.arquivo))
    exigir(arquivo && (curso.editor || referenciado), 'Arquivo não encontrado.', 404)
    const extensao = arquivo.tipo === 'video' ? '.mp4' : '.pdf'
    if (arquivo.tipo === 'material') res.attachment(`material-${arquivo.id}.pdf`)
    res.type(arquivo.tipo === 'video' ? 'video/mp4' : 'application/pdf')
    res.sendFile(path.join(pasta, arquivo.id + extensao), { cacheControl: false }, erro => {
        if (erro && !res.headersSent) res.status(erro.statusCode === 416 ? 416 : 404).end()
    })
}))

router.use(autenticar)

router.post('/', tratar(async (req, res) => {
    const titulo = texto(req.body.titulo, 100, true)
    const descricao = texto(req.body.descricao_curta || '', 255)
    const apresentacao = texto(req.body.descricao_completa || '', 10000)
    const capa = texto(req.body.capa, 2000, true)
    const preco = Number(req.body.preco)
    const comissao = Number(req.body.comissao || 0)
    exigir(capaValida(capa), 'Capa inválida.')
    exigir(Number.isFinite(preco) && preco > 0 && preco <= 999999.99, 'Preço inválido.')
    exigir(Number.isFinite(comissao) && comissao >= 0 && comissao <= 100, 'Comissão inválida.')
    const cx = await db.getConnection()
    try {
        await cx.beginTransaction()
        const reserva = await operacoes.iniciar(cx, req, 'criar-curso')
        if (reserva.repeticao) {
            await cx.commit()
            return res.status(reserva.repeticao.status).json(reserva.repeticao.corpo)
        }
        const [produto] = await cx.query(`INSERT INTO produtos
            (usuario_id, titulo, descricao_curta, descricao_completa, preco, comissao, categoria, status_produto, capa, produto_arquivo)
            VALUES (?, ?, ?, ?, ?, ?, 'Curso', 'Rascunho', ?, '')`,
        [req.usuario.id, titulo, descricao, apresentacao, preco, comissao, capa])
        await cx.query('UPDATE produtos SET produto_arquivo = ? WHERE id = ?', [`/cursos/${produto.insertId}`, produto.insertId])
        await cx.query('INSERT INTO cursos (produto_id, apresentacao, estrutura) VALUES (?, ?, ?)', [produto.insertId, apresentacao, '[]'])
        const corpo = { id: produto.insertId, mensagem: 'Curso criado como rascunho. Adicione suas aulas.' }
        await operacoes.concluir(cx, reserva, 201, corpo)
        res.status(201).json(corpo)
    } catch (erro) {
        await cx.rollback()
        throw erro
    } finally { cx.release() }
}))

router.get('/:id', tratar(async (req, res) => {
    const curso = await acesso(req.params.id, req.usuario.id)
    const [progresso] = await db.query('SELECT aula_id FROM curso_progresso WHERE produto_id = ? AND usuario_id = ? AND concluida = 1', [req.params.id, req.usuario.id])
    const { comprado, usuario_id, excluido_em, ...dados } = curso
    res.json({ ...dados, concluidas: progresso.map(p => p.aula_id) })
}))

router.post('/:id/sessao', tratar(async (req, res) => {
    await acesso(req.params.id, req.usuario.id)
    const validade = Math.min(900, Math.floor(Number(req.usuario.exp) - Date.now() / 1000))
    exigir(validade > 0, 'Sessão expirada.', 401)
    const sessao = jwt.sign({ id: req.usuario.id, curso: Number(req.params.id) }, process.env.JWT_SECRET, {
        audience: 'monetiza-cursos', expiresIn: validade
    })
    res.cookie('monetiza_curso', sessao, {
        maxAge: validade * 1000,
        httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
        path: `/api/cursos/${Number(req.params.id)}/midia`
    })
    res.json({ ok: true })
}))

router.put('/:id', tratar(async (req, res) => {
    const cx = await db.getConnection()
    try {
        await cx.beginTransaction()
        await cx.query('SELECT id FROM produtos WHERE id = ? FOR UPDATE', [req.params.id])
        const curso = await acesso(req.params.id, req.usuario.id, true, cx)
        exigir(req.body.versao === curso.versao, 'O curso mudou em outra aba. Recarregue antes de editar.', 409)
        const titulo = texto(req.body.titulo, 100, true)
        const apresentacao = texto(req.body.apresentacao, 10000)
        const preco = Number(req.body.preco)
        const comissao = Number(req.body.comissao)
        exigir(Number.isFinite(preco) && preco > 0 && preco <= 999999.99, 'Preço inválido.')
        exigir(Number.isFinite(comissao) && comissao >= 0 && comissao <= 100, 'Comissão inválida.')
        exigir(/^#[0-9a-f]{6}$/i.test(req.body.cor), 'Cor inválida.')
        exigir(['Rascunho', 'Ativo', 'Inativo'].includes(req.body.status_produto), 'Status inválido.')
        const capa = texto(req.body.capa, 2000, true)
        exigir(capaValida(capa), 'Capa inválida.')
        const [arquivos] = await cx.query('SELECT id, tipo FROM curso_arquivos WHERE produto_id = ?', [req.params.id])
        const estrutura = validarEstrutura(req.body.estrutura, arquivos, req.body.status_produto === 'Ativo')
        await cx.query('UPDATE cursos SET cor = ?, apresentacao = ?, estrutura = ?, versao = versao + 1 WHERE produto_id = ?',
            [req.body.cor, apresentacao, JSON.stringify(estrutura), req.params.id])
        await cx.query(`UPDATE produtos SET titulo = ?, descricao_completa = ?, preco = ?, comissao = ?, capa = ?, status_produto = ? WHERE id = ?`,
            [titulo, apresentacao, preco, comissao, capa, req.body.status_produto, req.params.id])
        await cx.commit()
        res.json({ versao: curso.versao + 1 })
    } catch (erro) { await cx.rollback(); throw erro } finally { cx.release() }
}))

const upload = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => fs.mkdir(pasta, { recursive: true }).then(() => cb(null, pasta), cb),
        filename: (_req, _file, cb) => cb(null, `${randomUUID()}.tmp`)
    }),
    limits: { fileSize: 250 * 1024 * 1024, files: 1, fields: 0 }
}).single('arquivo')

router.post('/:id/arquivos/:tipo', tratar(async (req, res) => {
    await acesso(req.params.id, req.usuario.id, true)
    const tipo = req.params.tipo
    exigir(['video', 'material'].includes(tipo), 'Tipo inválido.')
    await new Promise((resolve, reject) => upload(req, res, erro => erro ? reject(erro) : resolve()))
    exigir(req.file, 'Selecione um arquivo.')
    let destino = req.file.path
    let cx
    let salvo = false
    try {
        const arquivo = await fs.open(req.file.path, 'r')
        const assinatura = Buffer.alloc(12)
        try { await arquivo.read(assinatura, 0, 12, 0) } finally { await arquivo.close() }
        exigir(tipo === 'video'
            ? assinatura.toString('ascii', 4, 8) === 'ftyp'
            : assinatura.toString('ascii', 0, 5) === '%PDF-', 'Use vídeo MP4 ou material PDF válido.')
        exigir(tipo !== 'material' || req.file.size <= 20 * 1024 * 1024, 'O PDF deve ter até 20 MB.')
        cx = await db.getConnection()
        await cx.beginTransaction()
        await cx.query('SELECT id FROM produtos WHERE id = ? FOR UPDATE', [req.params.id])
        await acesso(req.params.id, req.usuario.id, true, cx)
        const [[uso]] = await cx.query('SELECT COALESCE(SUM(bytes), 0) AS total FROM curso_arquivos WHERE produto_id = ?', [req.params.id])
        exigir(Number(uso.total) + req.file.size <= 2 * 1024 ** 3, 'Limite de 2 GB de arquivos por curso atingido.')
        const id = randomUUID()
        const nome = path.join(pasta, id + (tipo === 'video' ? '.mp4' : '.pdf'))
        await fs.rename(destino, nome)
        destino = nome
        await cx.query('INSERT INTO curso_arquivos (id, produto_id, tipo, bytes) VALUES (?, ?, ?, ?)', [id, req.params.id, tipo, req.file.size])
        await cx.commit()
        salvo = true
        res.status(201).json({ id })
    } finally {
        if (!salvo) {
            if (cx) await cx.rollback().catch(() => {})
            await fs.unlink(destino).catch(() => {})
        }
        cx?.release()
    }
}))

router.put('/:id/progresso/:aula', tratar(async (req, res) => {
    const curso = await acesso(req.params.id, req.usuario.id)
    exigir(curso.estrutura.some(m => m.aulas.some(a => a.id === req.params.aula)), 'Aula não encontrada.', 404)
    exigir(typeof req.body.concluida === 'boolean', 'Progresso inválido.')
    await db.query(`INSERT INTO curso_progresso (produto_id, usuario_id, aula_id, concluida) VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE concluida = VALUES(concluida)`, [req.params.id, req.usuario.id, req.params.aula, req.body.concluida])
    res.json({ ok: true })
}))

router.use((erro, _req, res, _next) => {
    console.error('Erro no curso:', erro.code || erro.message)
    const status = erro instanceof multer.MulterError ? 400 : erro.status || 500
    res.status(status).json({ erro: status < 500 ? erro.message : 'Não foi possível concluir a operação do curso.' })
})
module.exports = router
