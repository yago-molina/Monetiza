const express = require('express')
const router = express.Router()
const { criar, listar } = require('../controllers/produtoController')
const autenticar = require('../middlewares/authMiddleware')

router.post('/', autenticar, criar)
router.get('/', listar)

module.exports = router