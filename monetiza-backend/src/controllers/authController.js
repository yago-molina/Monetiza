const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body || {}

  if (typeof nome !== 'string' || !nome.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof senha !== 'string' || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' })
  }

  if (senha.length < 8) {
    return res.status(400).json({ erro: 'A senha deve conter pelo menos 8 caracteres' })
  }

  try {
    const [existente] = await db.query('select id from usuarios where email = ?', [email])
    if (existente.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)
    await db.query(
      'insert into usuarios (nome, email, senha) values (?, ?, ?)',
      [nome, email, senhaCriptografada]
    )

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' })
  } catch (erro) {
    console.error('Erro no cadastro:', erro)
    res.status(500).json({ erro: 'Não foi possível concluir a operação. Tente novamente.' })
  }
}

const login = async (req, res) => {
  const { email, senha } = req.body || {}

  if (typeof email !== 'string' || !email.trim() ||
      typeof senha !== 'string' || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' })
  }

  try {
    const [usuarios] = await db.query('select * from usuarios where email = ?', [email])

    if (usuarios.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' })
    }

    const usuario = usuarios[0]
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' })
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ mensagem: 'Login realizado com sucesso!', token })
  } catch (erro) {
    console.error('Erro no login:', erro)
    res.status(500).json({ erro: 'Não foi possível concluir a operação. Tente novamente.' })
  }
}

module.exports = { cadastrar, login }
