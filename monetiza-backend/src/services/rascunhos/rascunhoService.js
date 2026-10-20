const { validarProdutoGerado } = require('../../validators/produtoIaValidator')
const { validarCapituloGerado } = require('../../validators/capituloIaValidator')
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
class ErroRascunho extends Error {
    constructor(status, mensagem) { super(mensagem); this.status = status }
}
function usuarioValido(id) {
    if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0) throw new ErroRascunho(401, 'Sessão inválida.')
    return Number(id)
}
function idValido(id) {
    if (!UUID.test(id || '')) throw new ErroRascunho(400, 'Identificador de rascunho inválido.')
}
function nomePdf(url, usuario) {
    try {
        const caminho = new URL(url).pathname
        const nome = caminho.slice('/uploads/produtos/'.length)
        if (caminho.startsWith('/uploads/produtos/') && nome.startsWith(`${usuario}-`) &&
            UUID.test(nome.slice(String(usuario).length + 1, -4)) && nome.endsWith('.pdf')) return nome
    } catch {}
    return null
}
function validarEstado(estado, usuario) {
    if (!estado || Array.isArray(estado) || typeof estado !== 'object' || estado.schema !== 1 ||
        !['consultor', 'promptBuilder', 'produto'].includes(estado.etapaAtual)) {
        throw new ErroRascunho(400, 'Rascunho inválido.')
    }
    if (Buffer.byteLength(JSON.stringify(estado)) > 2 * 1024 * 1024) {
        throw new ErroRascunho(413, 'O rascunho excedeu 2 MB.')
    }
    for (const chave of ['ideiaEscolhida', 'promptGerado', 'textoPrompt']) {
        if (typeof estado[chave] !== 'string' || estado[chave].length > 50000) throw new ErroRascunho(400, 'Texto do rascunho inválido.')
    }
    for (const etapa of ['consultor', 'promptBuilder', 'produto']) {
        const mensagens = estado.historicos?.[etapa]
        if (!Array.isArray(mensagens) || mensagens.length > 20 || mensagens.some(m =>
            !m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 200000)) {
            throw new ErroRascunho(400, 'Histórico inválido.')
        }
    }
    if (!Array.isArray(estado.capitulosPdfProntos) || estado.capitulosPdfProntos.length > 30) throw new ErroRascunho(400, 'Capítulos inválidos.')
    try {
        if (estado.produtoGerado) validarProdutoGerado(estado.produtoGerado)
        estado.capitulosPdfProntos.forEach((capitulo, indice) => {
            if (!capitulo) return
            const estrutura = estado.produtoGerado?.produto?.capitulos?.[indice]
            if (!estrutura) throw Error('Capítulo sem estrutura')
            validarCapituloGerado(capitulo, estrutura)
        })
    } catch { throw new ErroRascunho(400, 'A estrutura do produto ou dos capítulos está inválida.') }
    if (estado.pdfPublicado && (!estado.produtoGerado || !nomePdf(estado.pdfPublicado, usuario))) {
        throw new ErroRascunho(400, 'O PDF precisa pertencer à sua conta.')
    }
    return estado
}
function decodificar(linha) {
    return { ...linha, estado: typeof linha.estado === 'string' ? JSON.parse(linha.estado) : linha.estado }
}
function criarServicoRascunhos(db) {
    async function listar(usuario) {
        usuario = usuarioValido(usuario)
        const [linhas] = await db.execute(`SELECT id, titulo, versao, produto_publicado_id, atualizado_em
            FROM ia_rascunhos WHERE usuario_id = ? ORDER BY atualizado_em DESC, id LIMIT 100`, [usuario])
        return linhas
    }
    async function obter(usuario, id) {
        usuario = usuarioValido(usuario); idValido(id)
        const [linhas] = await db.execute('SELECT * FROM ia_rascunhos WHERE id = ? AND usuario_id = ?', [id, usuario])
        if (!linhas.length) throw new ErroRascunho(404, 'Rascunho não encontrado.')
        return decodificar(linhas[0])
    }
    async function salvar(usuario, id, dados) {
        usuario = usuarioValido(usuario); idValido(id); idValido(dados.gravacao)
        if (!Number.isSafeInteger(dados.versao) || dados.versao < 0) throw new ErroRascunho(400, 'Versão inválida.')
        const estado = validarEstado(dados.estado, usuario)
        const titulo = String(estado.produtoGerado?.cadastro?.titulo || estado.ideiaEscolhida || estado.textoPrompt || 'Novo produto').slice(0,100)
        const conexao = await db.getConnection()
        try {
            await conexao.beginTransaction()
            // Limite por conta e criações concorrentes são serializados.
            await conexao.query('SELECT id FROM usuarios WHERE id = ? FOR UPDATE', [usuario])
            const [linhas] = await conexao.query('SELECT * FROM ia_rascunhos WHERE id = ? AND usuario_id = ? FOR UPDATE', [id,usuario])
            const atual = linhas[0]
            if (atual?.ultima_gravacao === dados.gravacao) {
                await conexao.commit()
                return { id, versao: atual.versao }
            }
            if (atual?.produto_publicado_id) throw new ErroRascunho(409, 'Este rascunho já foi publicado. Crie um novo produto.')
            if ((atual?.versao || 0) !== dados.versao) throw new ErroRascunho(409, 'O rascunho mudou em outra aba. Abra a versão salva; suas alterações não foram sobrescritas.')
            const versao = dados.versao + 1
            if (atual) {
                await conexao.execute(`UPDATE ia_rascunhos SET titulo=?, estado=?, versao=?, ultima_gravacao=?
                    WHERE id=? AND usuario_id=?`, [titulo,JSON.stringify(estado),versao,dados.gravacao,id,usuario])
            } else {
                const [[total]] = await conexao.query('SELECT COUNT(*) AS total FROM ia_rascunhos WHERE usuario_id = ?', [usuario])
                if (Number(total.total) >= 100) throw new ErroRascunho(409, 'Limite de 100 rascunhos atingido nesta conta.')
                await conexao.execute(`INSERT INTO ia_rascunhos (id,usuario_id,titulo,estado,versao,ultima_gravacao)
                    VALUES (?,?,?,?,?,?)`, [id,usuario,titulo,JSON.stringify(estado),versao,dados.gravacao])
            }
            await conexao.commit()
            return { id, versao }
        } catch (erro) {
            await conexao.rollback().catch(() => {})
            if (erro.code === 'ER_DUP_ENTRY') throw new ErroRascunho(409, 'Identificador em uso. Reabra seus rascunhos.')
            throw erro
        } finally { conexao.release() }
    }
    return { listar, obter, salvar }
}
module.exports = { criarServicoRascunhos, validarEstado, nomePdf, ErroRascunho, UUID }
