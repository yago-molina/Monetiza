const express = require('express')

const autenticar =
    require('../middlewares/authMiddleware')

const {limitarUsoIa, impedirGeracoesSimultaneas, definirEtapaIa} = require('../middlewares/iaRateLimitMiddleware')

const {status, gerar, gerarCapitulo} = require('../controllers/produtoIaController')

const router = express.Router()

router.use(autenticar)
router.get('/status', status)
router.post('/gerar', impedirGeracoesSimultaneas, limitarUsoIa, gerar)
router.post('/gerar-capitulo', definirEtapaIa('capitulo'), impedirGeracoesSimultaneas, limitarUsoIa, gerarCapitulo)

module.exports = router