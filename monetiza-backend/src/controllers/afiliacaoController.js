const db = require('../config/db')
const crypto = require('crypto')

const listarDisponiveis = async (req, res) => {
  const usuario_id = req.usuario.id

  try {
    const [produtos] = await db.query(
      `SELECT
        p.id,
        p.titulo,
        p.descricao_curta,
        p.preco,
        p.categoria,
        p.comissao,
        p.capa,
        u.nome AS produtor
      FROM produtos p
      INNER JOIN usuarios u ON u.id = p.usuario_id
      WHERE p.status_produto = 'Ativo'
        AND p.usuario_id <> ?
        AND NOT EXISTS (
          SELECT 1
          FROM afiliacoes a
          WHERE a.produto_id = p.id
            AND a.usuario_id = ?
        )
      ORDER BY p.criado_em DESC`,
      [usuario_id, usuario_id]
    )

    res.json(produtos)
  } catch (erro) {
    console.error('Erro ao listar produtos disponíveis:', erro)

    res.status(500).json({
      erro: 'Erro interno ao listar produtos disponíveis'
    })
  }
}

const solicitar = async (req, res) => {
  const usuario_id = req.usuario.id
  const { produto_id } = req.body

  if (!produto_id) {
    return res.status(400).json({
      erro: 'Selecione um produto'
    })
  }

  try {
    const [produtos] = await db.query(
      `SELECT id, usuario_id, comissao, status_produto
       FROM produtos
       WHERE id = ?`,
      [produto_id]
    )

    if (produtos.length === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado'
      })
    }

    const produto = produtos[0]

    if (produto.usuario_id === usuario_id) {
      return res.status(400).json({
        erro: 'Você não pode se afiliar ao próprio produto'
      })
    }

    if (produto.status_produto !== 'Ativo') {
      return res.status(400).json({
        erro: 'Este produto não está disponível para afiliação'
      })
    }

    const codigoLink = crypto.randomUUID().replaceAll('-', '')

    const [resultado] = await db.query(
      `INSERT INTO afiliacoes (
        produto_id,
        usuario_id,
        comissao,
        codigo_link
      ) VALUES (?, ?, ?, ?)`,
      [
        produto.id,
        usuario_id,
        produto.comissao,
        codigoLink
      ]
    )

    res.status(201).json({
      mensagem: 'Solicitação de afiliação enviada!',
      id: resultado.insertId
    })
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        erro: 'Você já possui uma solicitação para este produto'
      })
    }

    console.error('Erro ao solicitar afiliação:', erro)

    res.status(500).json({
      erro: 'Erro interno ao solicitar afiliação'
    })
  }
}

const listarMinhas = async (req, res) => {
  const usuario_id = req.usuario.id

  try {
    const [afiliacoes] = await db.query(
      `SELECT
        a.id,
        a.codigo_link,
        a.comissao,
        a.status_afiliacao,
        a.aprovado_em,
        a.criado_em,
        p.id AS produto_id,
        p.titulo AS produto,
        p.capa,
        p.preco,
        u.nome AS produtor,
        COALESCE(c.total_cliques, 0) AS cliques,
        COALESCE(m.conversoes, 0) AS conversoes,
        COALESCE(m.total_ganho, 0) AS total_ganho
      FROM afiliacoes a
      INNER JOIN produtos p ON p.id = a.produto_id
      INNER JOIN usuarios u ON u.id = p.usuario_id
      LEFT JOIN (
        SELECT afiliacao_id, COUNT(*) AS total_cliques
        FROM cliques_afiliacao
        GROUP BY afiliacao_id
      ) c ON c.afiliacao_id = a.id
      LEFT JOIN (
        SELECT
          vi.afiliacao_id,
          COUNT(*) AS conversoes,
          SUM(vi.comissao_afiliado) AS total_ganho
        FROM venda_itens vi
        INNER JOIN vendas v ON v.id = vi.venda_id
        WHERE v.status_venda = 'pago'
          AND vi.afiliacao_id IS NOT NULL
        GROUP BY vi.afiliacao_id
      ) m ON m.afiliacao_id = a.id
      WHERE a.usuario_id = ?
      ORDER BY a.criado_em DESC`,
      [usuario_id]
    )

    const afiliacoesFormatadas = afiliacoes.map(afiliacao => ({
      ...afiliacao,
      preco: Number(afiliacao.preco),
      comissao: Number(afiliacao.comissao),
      cliques: Number(afiliacao.cliques),
      conversoes: Number(afiliacao.conversoes),
      total_ganho: Number(afiliacao.total_ganho)
    }))

    const resumo = afiliacoesFormatadas.reduce(
      (total, afiliacao) => {
        total.cliques += afiliacao.cliques
        total.conversoes += afiliacao.conversoes
        total.total_ganho += afiliacao.total_ganho
        return total
      },
      {
        cliques: 0,
        conversoes: 0,
        total_ganho: 0
      }
    )

    res.json({
      resumo,
      afiliacoes: afiliacoesFormatadas
    })
  } catch (erro) {
    console.error('Erro ao listar afiliações:', erro)

    res.status(500).json({
      erro: 'Erro interno ao listar afiliações'
    })
  }
}

const listarRecebidas = async (req, res) => {
  const usuario_id = req.usuario.id

  try {
    const [solicitacoes] = await db.query(
      `SELECT
        a.id,
        a.comissao,
        a.status_afiliacao,
        a.aprovado_em,
        a.criado_em,
        p.id AS produto_id,
        p.titulo AS produto,
        u.id AS afiliado_id,
        u.nome AS afiliado,
        u.email AS afiliado_email
      FROM afiliacoes a
      INNER JOIN produtos p ON p.id = a.produto_id
      INNER JOIN usuarios u ON u.id = a.usuario_id
      WHERE p.usuario_id = ?
      ORDER BY
        CASE a.status_afiliacao
          WHEN 'Pendente' THEN 1
          WHEN 'Ativa' THEN 2
          WHEN 'Rejeitada' THEN 3
          ELSE 4
        END,
        a.criado_em DESC`,
      [usuario_id]
    )

    res.json(solicitacoes)
  } catch (erro) {
    console.error('Erro ao listar solicitações recebidas:', erro)

    res.status(500).json({
      erro: 'Erro interno ao listar solicitações recebidas'
    })
  }
}

const alterarStatus = async (req, res) => {
  const usuario_id = req.usuario.id
  const { id } = req.params
  const { status } = req.body

  const statusPermitidos = [
    'Ativa',
    'Rejeitada',
    'Encerrada'
  ]

  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({
      erro: 'Status de afiliação inválido'
    })
  }

  try {
    const [afiliacoes] = await db.query(
      `SELECT
        a.id,
        p.usuario_id AS produtor_id
      FROM afiliacoes a
      INNER JOIN produtos p ON p.id = a.produto_id
      WHERE a.id = ?`,
      [id]
    )

    if (
      afiliacoes.length === 0 ||
      afiliacoes[0].produtor_id !== usuario_id
    ) {
      return res.status(404).json({
        erro: 'Solicitação de afiliação não encontrada'
      })
    }

    await db.query(
      `UPDATE afiliacoes
       SET
         status_afiliacao = ?,
         aprovado_em = CASE
           WHEN ? = 'Ativa'
           THEN COALESCE(aprovado_em, CURRENT_TIMESTAMP)
           ELSE aprovado_em
         END
       WHERE id = ?`,
      [status, status, id]
    )

    res.json({
      mensagem: `Afiliação atualizada para ${status}`
    })
  } catch (erro) {
    console.error('Erro ao atualizar afiliação:', erro)

    res.status(500).json({
      erro: 'Erro interno ao atualizar afiliação'
    })
  }
}

const registrarClique = async (req, res) => {
  const { codigo } = req.params

  try {
    const [afiliacoes] = await db.query(
      `SELECT
        a.id AS afiliacao_id,
        p.id AS produto_id,
        p.titulo,
        p.descricao_curta,
        p.descricao_completa,
        p.preco,
        p.categoria,
        p.capa,
        u.nome AS produtor
      FROM afiliacoes a
      INNER JOIN produtos p ON p.id = a.produto_id
      INNER JOIN usuarios u ON u.id = p.usuario_id
      WHERE a.codigo_link = ?
        AND a.status_afiliacao = 'Ativa'
        AND p.status_produto = 'Ativo'`,
      [codigo]
    )

    if (afiliacoes.length === 0) {
      return res.status(404).json({
        erro: 'Link de afiliado inválido ou inativo'
      })
    }

    const origem = (req.get('referer') || '').slice(0, 255) || null

    await db.query(
      `INSERT INTO cliques_afiliacao (
        afiliacao_id,
        origem
      ) VALUES (?, ?)`,
      [afiliacoes[0].afiliacao_id, origem]
    )

    res.json(afiliacoes[0])
  } catch (erro) {
    console.error('Erro ao registrar clique:', erro)

    res.status(500).json({
      erro: 'Erro interno ao acessar o link de afiliado'
    })
  }
}

module.exports = {
  listarDisponiveis,
  solicitar,
  listarMinhas,
  listarRecebidas,
  alterarStatus,
  registrarClique
}