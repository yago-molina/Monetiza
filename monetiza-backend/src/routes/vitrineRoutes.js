const express = require('express')
const router = express.Router()

const {
    listarProdutos,
    buscarProdutoPorId,
    comprar
} = require('../controllers/vitrineController')

const autenticar =
    require('../middlewares/authMiddleware')

// Rotas públicas da vitrine
router.get('/produtos', listarProdutos)

router.get(
    '/produtos/:id',
    buscarProdutoPorId
)

// Comprar exige usuário logado
router.post(
    '/comprar',
    autenticar,
    comprar
)

module.exports = router