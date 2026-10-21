const express = require('express')
const router = express.Router()

const {
  listarDisponiveis,
  solicitar,
  listarMinhas,
  listarRecebidas,
  alterarStatus,
  registrarClique
} = require('../controllers/afiliadosController')

const autenticar = require('../middlewares/authMiddleware')

router.post('/link/:codigo/clique', registrarClique)

router.use(autenticar)

router.get('/disponiveis', listarDisponiveis)
router.get('/minhas', listarMinhas)
router.get('/recebidas', listarRecebidas)
router.post('/', solicitar)
router.patch('/:id/status', alterarStatus)

module.exports = router