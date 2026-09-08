const express = require('express')
const router = express.Router()
const autenticar = require('../middlewares/authMiddleware')

const {
    listarContatos,
    listarConversas,
    criarConversa,
    iniciarConversaProduto,
    listarMensagens,
    enviarMensagem,
    marcarComoLidas
} = require('../controllers/mensagensController')

router.use(autenticar)

router.get('/contatos', listarContatos)
router.get('/conversas', listarConversas)
router.post('/conversas', criarConversa)
router.post('/produto', iniciarConversaProduto)
router.get('/conversas/:id/mensagens', listarMensagens)
router.post('/conversas/:id/mensagens', enviarMensagem)
router.patch('/conversas/:id/lidas', marcarComoLidas)

module.exports = router