const express = require('express')
const router = express.Router()
const autenticar = require('../middlewares/authMiddleware')

router.get('/perfil', autenticar, (req, res) => {
  res.json({ mensagem: 'Rota protegida!', usuario: req.usuario })
})

module.exports = router