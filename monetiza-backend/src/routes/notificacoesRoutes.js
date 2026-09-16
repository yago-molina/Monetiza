const express = require('express')
const router = express.Router()

const {
    listar,
    naoLidas,
    marcarComoLida,
    marcarTodasComoLidas
} = require('../controllers/notificacoesController')

const autenticar =
    require('../middlewares/authMiddleware')

router.use(autenticar)

router.get('/', listar)
router.get('/nao-lidas', naoLidas)
router.put('/:id/lida', marcarComoLida)
router.put('/marcar-todas/lidas', marcarTodasComoLidas)

module.exports = router