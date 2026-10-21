const mysql = require('mysql2')
require('dotenv').config()

const conexao = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
})

conexao.getConnection((erro, conn) => {
  if (erro) {
    console.error('Erro ao conectar no banco:', erro.message)
    return
  }
  console.log('MySQL conectado com sucesso!')
  conn.release()
})

module.exports = conexao.promise()