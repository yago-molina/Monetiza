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

// Todas as rotas de produtos precisam de autenticação
router.use(autenticar)

// Criar produto
router.post('/', criar)

// Listar produtos do usuário
router.get('/', listar)

// Buscar produto específico
router.get('/:id', buscarPorId)

// Atualizar produto
router.put('/:id', atualizar)

// Excluir produto
router.delete('/:id', excluir)

module.exports = router