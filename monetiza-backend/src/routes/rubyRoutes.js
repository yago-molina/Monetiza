const express = require('express')

const autenticar = require(
    '../middlewares/authMiddleware'
)

const {
    criarServicoRuby,
    ErroRuby
} = require('../services/ruby/rubyService')

function criarRotasRuby(
    servico = criarServicoRuby()
) {
    const router = express.Router()

    router.use((_req, res, next) => {
        res.set('Cache-Control', 'no-store')
        next()
    })

    router.use(autenticar)

    router.use((req, res, next) => {
        if (
            !Number.isSafeInteger(
                Number(req.usuario?.id)
            ) ||
            Number(req.usuario.id) <= 0
        ) {
            return res.status(401).json({
                error: 'Sessão inválida. Entre novamente.'
            })
        }

        next()
    })

    router.use(
        express.json({
            limit: '16kb',
            strict: true
        })
    )

    // Recupera a conversa do usuário autenticado.
    router.get('/', (req, res, next) => {
        try {
            res.json(
                servico.historico(req.usuario.id)
            )
        } catch (erro) {
            next(erro)
        }
    })

    // Limpa somente a conversa do usuário autenticado.
    router.delete('/', (req, res, next) => {
        try {
            servico.limpar(req.usuario.id)

            res.json({
                mensagem: 'Conversa reiniciada.'
            })
        } catch (erro) {
            next(erro)
        }
    })

    router.post('/', async (req, res, next) => {
        if (!req.is('application/json')) {
            return res.status(415).json({
                error: 'Envie a mensagem em JSON.'
            })
        }

        const abort = new AbortController()

        const cancelar = () => {
            if (!res.writableEnded) {
                abort.abort()
            }
        }

        res.on('close', cancelar)

        try {
            const dados = await servico.responder(
                req.usuario.id,
                req.body?.message,
                abort.signal
            )

            if (!res.destroyed) {
                res.json(dados)
            }
        } catch (erro) {
            if (!res.destroyed) {
                next(erro)
            }
        } finally {
            res.off('close', cancelar)
        }
    })

    router.use((erro, _req, res, _next) => {
        if (erro instanceof ErroRuby) {
            if (erro.retryAfter) {
                res.set(
                    'Retry-After',
                    String(erro.retryAfter)
                )
            }

            return res.status(erro.status).json({
                error: erro.message,
                retryAfter: erro.retryAfter || null
            })
        }

        if (erro.type === 'entity.too.large') {
            return res.status(413).json({
                error: 'A mensagem enviada é muito grande.'
            })
        }

        if (erro.type === 'entity.parse.failed') {
            return res.status(400).json({
                error: 'JSON inválido.'
            })
        }

        res.status(500).json({
            error: 'Não foi possível concluir a operação com a Ruby.'
        })
    })

    return router
}

module.exports = criarRotasRuby()
module.exports.criarRotasRuby = criarRotasRuby