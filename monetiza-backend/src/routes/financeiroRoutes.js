const express = require('express')
const router = express.Router()

const {
    resumo,
    listarTransacoes,
    criarTransacao,
    resumoComissoes,
    listarComissoes
} = require('../controllers/financeiroController')

const autenticar =
    require('../middlewares/authMiddleware')

router.use(autenticar)

router.get('/resumo', resumo)

router.get(
    '/transacoes',
    listarTransacoes
)

router.post(
    '/transacoes',
    criarTransacao
)

router.get(
    '/comissoes/resumo',
    resumoComissoes
)

router.get(
    '/comissoes',
    listarComissoes
)

module.exports = router