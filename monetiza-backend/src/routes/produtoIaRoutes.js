const express = require('express')

const autenticar =
    require('../middlewares/authMiddleware')

const {limitarUsoIa, impedirGeracoesSimultaneas} = require('../middlewares/iaRateLimitMiddleware')

const {status, gerar } = require('../controllers/produtoIaController')

const router = express.Router()

router.use(autenticar)
router.get('/status', status)
router.post('/gerar', impedirGeracoesSimultaneas, limitarUsoIa, gerar)

module.exports = router