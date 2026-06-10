const express = require('express')
const app = express()

app.use(express.json())

require('./config/db')

const authRoutes = require('./routes/authRoutes')
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Monetiza funcionando!' })
})

module.exports = app