const express = require('express')
const path = require('path')
const autenticar = require('../middlewares/authMiddleware')
const { criarServicoRascunhos, nomePdf, ErroRascunho } = require('../services/rascunhos/rascunhoService')
function criarRotasRascunhos(servico) {
    const router = express.Router()
    router.use((_req,res,next) => { res.set('Cache-Control','private, no-store'); next() })
    router.use(autenticar)
    router.use(express.json({ limit: '2200kb' }))
    router.get('/', async (req,res,next) => {
        try { res.json(await servico.listar(req.usuario.id)) } catch (erro) { next(erro) }
    })
    router.get('/:id', async (req,res,next) => {
        try { res.json(await servico.obter(req.usuario.id,req.params.id)) } catch (erro) { next(erro) }
    })
    router.put('/:id', async (req,res,next) => {
        try { res.json(await servico.salvar(req.usuario.id,req.params.id,req.body || {})) } catch (erro) { next(erro) }
    })
    router.get('/:id/pdf', async (req,res,next) => {
        try {
            const registro = await servico.obter(req.usuario.id,req.params.id)
            const nome = nomePdf(registro.estado.pdfPublicado, Number(req.usuario.id))
            if (!nome) throw new ErroRascunho(404,'PDF não encontrado neste rascunho.')
            res.set('X-Content-Type-Options','nosniff')
            res.download(path.join(__dirname,'../private/uploads/produtos',nome),'produto.pdf', erro => {
                if (erro && !res.headersSent && !res.destroyed) res.status(404).json({erro:'PDF não encontrado. Reconstrua usando os capítulos salvos.'})
            })
        } catch (erro) { next(erro) }
    })
    router.use((erro,_req,res,_next) => {
        const status = erro instanceof ErroRascunho ? erro.status : erro.type === 'entity.too.large' ? 413 : erro.type === 'entity.parse.failed' ? 400 : 500
        res.status(status).json({erro: erro instanceof ErroRascunho ? erro.message : status===500
            ? 'Não foi possível acessar os rascunhos. Confira a conexão e a tabela ia_rascunhos.' : 'Dados inválidos ou rascunho muito grande.'})
    })
    return router
}
// A conexão é carregada apenas ao atender uma chamada.
const db = new Proxy({}, { get: (_alvo, nome) => (...args) => require('../config/db')[nome](...args) })
module.exports = criarRotasRascunhos(criarServicoRascunhos(db))
module.exports.criarRotasRascunhos = criarRotasRascunhos
