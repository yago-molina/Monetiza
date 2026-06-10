const db = require('../config/db')

const criar = async (req, res) => {
  const { nome, descricao, preco } = req.body
  const usuario_id = req.usuario.id

  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' })
  }

  try {
    await db.query(
      'insert into produtos (nome, descricao, preco, usuario_id) values (?, ?, ?, ?)',
      [nome, descricao, preco, usuario_id]
    )
    res.status(201).json({ mensagem: 'Produto criado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno: ' + erro.message })
  }
}

const listar = async (req, res) => {
  try {
    const [produtos] = await db.query('select * from produtos')
    res.json(produtos)
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno: ' + erro.message })
  }
}

module.exports = { criar, listar }