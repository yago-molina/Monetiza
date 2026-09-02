const express = require('express')
const router = express.Router()

const {
    listarAfiliacoes,
    listar,
    buscarPorId,
    criar,
    atualizar,
    atualizarStatus,
    aceitar
} = require('../controllers/contratosController')

const autenticar = require('../middlewares/authMiddleware')
const uploadContrato = require('../middlewares/uploadContrato')

router.use(autenticar)

router.get('/afiliacoes', listarAfiliacoes)
router.get('/', listar)
router.get('/:id', buscarPorId)

router.post(
    '/',
    uploadContrato.single('arquivo_pdf'),
    criar
)

router.put(
    '/:id',
    uploadContrato.single('arquivo_pdf'),
    atualizar
)

router.patch('/:id/status', atualizarStatus)
router.patch('/:id/aceitar', aceitar)

module.exports = router