const express = require('express')
const router = express.Router()

const { resumo } = require('../controllers/dashboardController')
const autenticar = require('../middlewares/authMiddleware')

router.get('/resumo', autenticar, resumo)

module.exports = router