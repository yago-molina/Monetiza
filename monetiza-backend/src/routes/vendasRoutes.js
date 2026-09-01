const express = require('express')
const router = express.Router()

const {
    resumo,
    listarVendas,
    listarComissoes
} = require('../controllers/vendasController')

const autenticar =
    require('../middlewares/authMiddleware')

router.use(autenticar)

router.get('/resumo', resumo)
router.get('/minhas', listarVendas)
router.get('/comissoes', listarComissoes)

module.exports = router