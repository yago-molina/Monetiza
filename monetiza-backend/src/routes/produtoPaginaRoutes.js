const express = require('express')
const path = require('path')
const { buscarPublico } = require('../services/produtoSlugService')
const router = express.Router()

router.get(['/produto/:referencia', '/vitrine/produto/:referencia'], async (req, res, next) => {
    try {
        const produto = await buscarPublico(req.params.referencia)
        res.set('Cache-Control', 'no-store')
        if (!produto) return res.status(404).send('Produto não encontrado ou indisponível.')
        const destino = `/produto/${produto.slug}`
        if (req.path !== destino) {
            // Preserva ref e os demais parâmetros, inclusive parâmetros repetidos.
            const indice = req.originalUrl.indexOf('?')
            const consulta = indice === -1 ? '' : req.originalUrl.slice(indice)
            return res.redirect(301, destino + consulta)
        }
        return res.sendFile(path.join(__dirname, '../public/paginaDoProduto.html'))
    } catch (erro) { next(erro) }
})

module.exports = router
