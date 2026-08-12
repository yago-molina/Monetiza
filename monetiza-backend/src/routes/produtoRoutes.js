const express = require('express')
const router = express.Router()

const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir
} = require('../controllers/produtoController')

const autenticar = require('../middlewares/authMiddleware')

router.use(autenticar)

router.post('/', criar)
router.get('/', listar)
router.get('/:id', buscarPorId)
router.put('/:id', atualizar)
router.delete('/:id', excluir)

module.exports = router