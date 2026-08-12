const express = require('express')
const path = require('path')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./config/db')

app.use(express.static(path.join(__dirname, 'public')))

const authRoutes = require('./routes/authRoutes')
const usuarioRoutes = require('./routes/usuarioRoutes')
const produtoRoutes = require('./routes/produtoRoutes')

app.use('/auth', authRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/produtos', produtoRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro.html'))
})

app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'))
})

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
})

app.get('/produto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'produto.html'))
})

app.get('/minhasVendas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'minhasVendas.html'))
})

app.get('/afiliados', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'afiliados.html'))
})

app.get('/financeiro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'financeiro.html'))
})

app.get('/contratos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contratos.html'))
})

app.get('/mensagens', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mensagens.html'))
})

app.get('/configuracoes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'configuracoes.html'))
})

module.exports = app