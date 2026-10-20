const express = require('express')
const path = require('path')
const autenticar = require('../middlewares/authMiddleware')

function nomePdfProduto(titulo, id) {
    let nome = String(titulo || '').normalize('NFC')
        .replace(/[<>:"/\\|?*\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ')
        .replace(/\s+/g, ' ').trim()
        .replace(/(?:\.pdf)+$/i, '').replace(/^[. ]+|[. ]+$/g, '')
    nome = Array.from(nome).slice(0, 100).join('').replace(/[. ]+$/g, '')
    if (!nome) nome = `produto-${id}`
    if (/^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/i.test(nome)) nome = `Produto ${nome}`
    return `${nome}.pdf`
}

function criarRotasArquivos({
    obterDb = () => require('../config/db'),
    pasta = path.join(__dirname, '../private/uploads/produtos')
} = {}) {
    const router = express.Router()
    router.use((_req, res, next) => {
        res.set('Cache-Control', 'private, no-store')
        res.set('X-Content-Type-Options', 'nosniff')
        next()
    })
    router.use(autenticar)
    router.get('/:id', async (req, res) => {
        const id = Number(req.params.id)
        const usuario = Number(req.usuario.id)
        if (!Number.isSafeInteger(id) || id <= 0 ||
            !Number.isSafeInteger(usuario) || usuario <= 0) {
            return res.status(400).json({ erro: 'Pedido inválido.' })
        }
        try {
            const [produtos] = await obterDb().execute(`
                SELECT p.id, p.usuario_id, p.titulo, p.produto_arquivo
                FROM produtos p
                WHERE p.id = ? AND (
                    p.usuario_id = ? OR EXISTS (
                        SELECT 1 FROM venda_itens vi
                        JOIN vendas v ON v.id = vi.venda_id
                        WHERE vi.produto_id = p.id
                        AND v.comprador_id = ?
                        AND v.status_venda = 'pago'
                    )
                ) LIMIT 1`, [id, usuario, usuario])
            if (!produtos.length) {
                return res.status(404).json({ erro: 'Produto indisponível para esta conta.' })
            }
            const produto = produtos[0]
            const url = new URL(produto.produto_arquivo)
            if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
                return res.status(400).json({ erro: 'Endereço do produto inválido.' })
            }
            const prefixo = '/uploads/produtos/'
            if (!url.pathname.startsWith(prefixo)) {
                // Links externos não recebem o token da Monetiza.
                return res.json({ url: url.href })
            }
            const nome = url.pathname.slice(prefixo.length)
            const arquivo = nome.match(/^(\d+)-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.pdf$/i)
            // Impede cadastrar o arquivo de outro produtor como se fosse seu.
            if (!arquivo || Number(arquivo[1]) !== Number(produto.usuario_id)) {
                return res.status(404).json({ erro: 'Arquivo indisponível.' })
            }
            return res.download(path.join(pasta, nome), nomePdfProduto(produto.titulo, id), erro => {
                if (erro && !res.headersSent && !res.destroyed) {
                    res.status(404).json({ erro: 'Arquivo não encontrado.' })
                }
            })
        } catch {
            if (!res.headersSent) {
                res.status(500).json({ erro: 'Não foi possível acessar o produto.' })
            }
        }
    })
    return router
}
module.exports = criarRotasArquivos()
module.exports.criarRotasArquivos = criarRotasArquivos
