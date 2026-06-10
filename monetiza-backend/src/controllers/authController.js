const db = require('../config/db')
const bcrypt = require('bcryptjs')

const cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' })
  }

  try {
    // Verifica se o email já existe
    const [existente] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email])
    if (existente.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado' })
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    // Insere no banco
    await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaCriptografada]
    )

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' })

  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno: ' + erro.message })
  }
}

const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' })
  }

  try {
    // Busca o usuário pelo email
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email])
    
    if (usuarios.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' })
    }

    const usuario = usuarios[0]

    // Compara a senha digitada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' })
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ mensagem: 'Login realizado com sucesso!', token })

  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno: ' + erro.message })
  }
}

module.exports = { cadastrar, login }