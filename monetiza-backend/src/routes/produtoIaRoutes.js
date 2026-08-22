const express = require('express')

const autenticar =
    require('../middlewares/authMiddleware')

const {
    status,
    gerar
} = require('../controllers/produtoIaController')

const router = express.Router()

router.use(autenticar)

router.get('/status', status)
router.post('/gerar', gerar)

module.exports = router