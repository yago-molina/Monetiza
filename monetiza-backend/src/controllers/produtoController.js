const db = require('../config/db')

const statusPermitidos = ['Rascunho', 'Ativo', 'Inativo']

function validarUrlHttp(url) {
  try {
    const urlValida = new URL(url)

    return ['http:', 'https:'].includes(urlValida.protocol)
  } catch {
    return false
  }
}

const criar = async (req, res) => {
  const {
    titulo,
    descricao_curta,
    descricao_completa,
    preco,
    categoria,
    comissao,
    status_produto,
    capa,
    produto_arquivo
  } = req.body

  const usuario_id = req.usuario.id

  if (
    !titulo?.trim() ||
    preco === undefined ||
    !categoria?.trim() ||
    !capa?.trim() ||
    !produto_arquivo?.trim()
  ) {
    return res.status(400).json({
      erro: 'Título, preço, categoria, imagem e link do produto são obrigatórios'
    })
  }

  if (!validarUrlHttp(capa) || !validarUrlHttp(produto_arquivo)) {
    return res.status(400).json({
      erro: 'Informe links HTTP ou HTTPS válidos para a imagem e para o produto'
    })
  }

  const precoNumero = Number(preco)
  const comissaoNumero = Number(comissao || 0)
  const statusProduto = status_produto || 'Rascunho'

  if (Number.isNaN(precoNumero) || precoNumero <= 0) {
    return res.status(400).json({
      erro: 'Informe um preço válido'
    })
  }

  if (
    Number.isNaN(comissaoNumero) ||
    comissaoNumero < 0 ||
    comissaoNumero > 100
  ) {
    return res.status(400).json({
      erro: 'A comissão deve estar entre 0 e 100'
    })
  }

  if (!statusPermitidos.includes(statusProduto)) {
    return res.status(400).json({
      erro: 'Status do produto inválido'
    })
  }

  try {
    const [resultado] = await db.query(
      `INSERT INTO produtos (
        titulo,
        descricao_curta,
        descricao_completa,
        preco,
        categoria,
        comissao,
        status_produto,
        capa,
        produto_arquivo,
        usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo.trim(),
        descricao_curta?.trim() || null,
        descricao_completa?.trim() || null,
        precoNumero,
        categoria.trim(),
        comissaoNumero,
        statusProduto,
        capa.trim(),
        produto_arquivo.trim(),
        usuario_id
      ]
    )

    return res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso!',
      id: resultado.insertId
    })
  } catch (erro) {
    console.error('Erro ao cadastrar produto:', erro)

    return res.status(500).json({
      erro: 'Erro interno ao cadastrar produto'
    })
  }
}

const listar = async (req, res) => {
  const usuario_id = req.usuario.id

  try {
    const [produtos] = await db.query(
      `SELECT
        id,
        titulo,
        descricao_curta,
        descricao_completa,
        preco,
        categoria,
        comissao,
        status_produto,
        capa,
        produto_arquivo,
        criado_em,
        atualizado_em
      FROM produtos
      WHERE usuario_id = ?
      AND excluido_em IS NULL
      ORDER BY criado_em DESC`,
      [usuario_id]
    )

    return res.json(produtos)
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro)

    return res.status(500).json({
      erro: 'Erro interno ao listar produtos'
    })
  }
}

const buscarPorId = async (req, res) => {
  const { id } = req.params
  const usuario_id = req.usuario.id

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({
      erro: 'ID do produto inválido'
    })
  }

  try {
    const [produtos] = await db.query(
      `SELECT
        id,
        titulo,
        descricao_curta,
        descricao_completa,
        preco,
        categoria,
        comissao,
        status_produto,
        capa,
        produto_arquivo,
        criado_em,
        atualizado_em
      FROM produtos
      WHERE id = ?
      AND usuario_id = ?
      AND excluido_em IS NULL`,
      [id, usuario_id]
    )

    if (produtos.length === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado'
      })
    }

    return res.json(produtos[0])
  } catch (erro) {
    console.error('Erro ao buscar produto:', erro)

    return res.status(500).json({
      erro: 'Erro interno ao buscar produto'
    })
  }
}

const atualizar = async (req, res) => {
  const { id } = req.params
  const usuario_id = req.usuario.id

  const {
    titulo,
    descricao_curta,
    descricao_completa,
    preco,
    categoria,
    comissao,
    status_produto,
    capa,
    produto_arquivo
  } = req.body

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({
      erro: 'ID do produto inválido'
    })
  }

  if (
    !titulo?.trim() ||
    preco === undefined ||
    !categoria?.trim() ||
    !capa?.trim() ||
    !produto_arquivo?.trim()
  ) {
    return res.status(400).json({
      erro: 'Título, preço, categoria, imagem e link do produto são obrigatórios'
    })
  }

  if (!validarUrlHttp(capa) || !validarUrlHttp(produto_arquivo)) {
    return res.status(400).json({
      erro: 'Informe links HTTP ou HTTPS válidos para a imagem e para o produto'
    })
  }

  const precoNumero = Number(preco)
  const comissaoNumero = Number(comissao || 0)
  const statusProduto = status_produto || 'Rascunho'

  if (Number.isNaN(precoNumero) || precoNumero <= 0) {
    return res.status(400).json({
      erro: 'Informe um preço válido'
    })
  }

  if (
    Number.isNaN(comissaoNumero) ||
    comissaoNumero < 0 ||
    comissaoNumero > 100
  ) {
    return res.status(400).json({
      erro: 'A comissão deve estar entre 0 e 100'
    })
  }

  if (!statusPermitidos.includes(statusProduto)) {
    return res.status(400).json({
      erro: 'Status do produto inválido'
    })
  }

  try {
    const [resultado] = await db.query(
      `UPDATE produtos SET
        titulo = ?,
        descricao_curta = ?,
        descricao_completa = ?,
        preco = ?,
        categoria = ?,
        comissao = ?,
        status_produto = ?,
        capa = ?,
        produto_arquivo = ?
      WHERE id = ?
      AND usuario_id = ?
      AND excluido_em IS NULL`,
      [
        titulo.trim(),
        descricao_curta?.trim() || null,
        descricao_completa?.trim() || null,
        precoNumero,
        categoria.trim(),
        comissaoNumero,
        statusProduto,
        capa.trim(),
        produto_arquivo.trim(),
        id,
        usuario_id
      ]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado'
      })
    }

    return res.json({
      mensagem: 'Produto atualizado com sucesso!'
    })
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro)

    return res.status(500).json({
      erro: 'Erro interno ao atualizar produto'
    })
  }
}

const excluir = async (req, res) => {
  const { id } = req.params
  const usuario_id = req.usuario.id

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({
      erro: 'ID do produto inválido'
    })
  }

  try {
    const [resultado] = await db.query(
      `UPDATE produtos
      SET
        status_produto = 'Inativo',
        excluido_em = CURRENT_TIMESTAMP
      WHERE id = ?
      AND usuario_id = ?
      AND excluido_em IS NULL`,
      [id, usuario_id]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado'
      })
    }

    return res.json({
      mensagem: 'Produto excluído com sucesso!'
    })
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro)

    return res.status(500).json({
      erro: 'Erro interno ao excluir produto'
    })
  }
}

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir
}