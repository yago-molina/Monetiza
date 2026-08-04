const express = require('express')
const path = require('path')
const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

require('./config/db')

const authRoutes = require('./routes/authRoutes')
const usuarioRoutes = require('./routes/usuarioRoutes')
const produtoRoutes = require('./routes/produtoRoutes')

app.use('/auth', authRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/produtos', produtoRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Monetiza funcionando!' })
})

module.exports = app