const express = require('express')
const router = express.Router()

const {
    buscarConfiguracoes,
    atualizarPerfil,
    atualizarPreferencias,
    listarPagamentos,
    adicionarPagamento,
    editarPagamento,
    excluirPagamento,
    alterarSenha
} = require('../controllers/configuracoesController')

const autenticar =
    require('../middlewares/authMiddleware')

router.use(autenticar)

router.get(
    '/',
    buscarConfiguracoes
)

router.put(
    '/perfil',
    atualizarPerfil
)

router.put(
    '/notificacoes',
    atualizarPreferencias
)

router.get(
    '/pagamentos',
    listarPagamentos
)

router.post(
    '/pagamentos',
    adicionarPagamento
)

router.put(
    '/pagamentos/:id',
    editarPagamento
)

router.delete(
    '/pagamentos/:id',
    excluirPagamento
)

router.put(
    '/seguranca',
    alterarSenha
)

module.exports = router