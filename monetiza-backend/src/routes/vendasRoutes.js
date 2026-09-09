const express = require('express')
const router = express.Router()

const {
    resumo,
    listarVendas,
    listarComissoes,
    listarCompras
} = require('../controllers/vendasController')

const autenticar =
    require('../middlewares/authMiddleware')

router.use(autenticar)

router.get('/resumo', resumo)
router.get('/minhas', listarVendas)
router.get('/comissoes', listarComissoes)
router.get('/compras', listarCompras)

module.exports = router