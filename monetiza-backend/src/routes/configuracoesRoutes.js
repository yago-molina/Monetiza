const express = require('express')
const router = express.Router()

const {
    buscarConfiguracoes,
    atualizarPerfil,
    atualizarPreferencias,
    salvarPagamento,
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

router.put(
    '/pagamento',
    salvarPagamento
)

router.put(
    '/seguranca',
    alterarSenha
)

module.exports = router