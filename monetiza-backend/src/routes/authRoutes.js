const express = require('express')
const router = express.Router()
const { cadastrar, login } = require('../controllers/authController')

router.post('/cadastro', cadastrar)
router.post('/login', login)

module.exports = router