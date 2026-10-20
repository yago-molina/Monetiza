const crypto = require('crypto')
const db = require('../config/db')
const operacoes = require('../services/operacaoService')

const listarProdutos = async (req, res) => {
    try {
        const [produtos] = await db.query(
            `SELECT
                p.id,
                p.titulo,
                p.descricao_curta,
                p.descricao_completa,
                p.preco,
                p.categoria,
                p.comissao,
                p.capa,
                p.criado_em,
                u.id AS produtor_id,
                u.nome AS produtor,
                COUNT(
                    CASE
                        WHEN v.status_venda = 'pago'
                        THEN vi.id
                    END
                ) AS total_vendas
            FROM produtos p
            INNER JOIN usuarios u
                ON u.id = p.usuario_id
            LEFT JOIN venda_itens vi
                ON vi.produto_id = p.id
            LEFT JOIN vendas v
                ON v.id = vi.venda_id
            WHERE p.status_produto = 'Ativo'
              AND p.excluido_em IS NULL
            GROUP BY
                p.id,
                p.titulo,
                p.descricao_curta,
                p.descricao_completa,
                p.preco,
                p.categoria,
                p.comissao,
                p.capa,
                p.criado_em,
                u.id,
                u.nome
            ORDER BY p.criado_em DESC`
        )

        const produtosFormatados = produtos.map(produto => ({
            ...produto,
            preco: Number(produto.preco || 0),
            comissao: Number(produto.comissao || 0),
            total_vendas: Number(produto.total_vendas || 0)
        }))

        return res.json(produtosFormatados)
    } catch (erro) {
        console.error(
            'Erro ao listar produtos da vitrine:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao carregar a vitrine'
        })
    }
}

const buscarProdutoPorId = async (req, res) => {
    const { id } = req.params

    if (
        Number.isNaN(Number(id)) ||
        Number(id) <= 0
    ) {
        return res.status(400).json({
            erro: 'ID do produto inválido'
        })
    }

    try {
        const [produtos] = await db.query(
            `SELECT
                p.id,
                p.titulo,
                p.descricao_curta,
                p.descricao_completa,
                p.preco,
                p.categoria,
                p.comissao,
                p.capa,
                p.criado_em,
                u.id AS produtor_id,
                u.nome AS produtor,
                COUNT(
                    CASE
                        WHEN v.status_venda = 'pago'
                        THEN vi.id
                    END
                ) AS total_vendas
            FROM produtos p
            INNER JOIN usuarios u
                ON u.id = p.usuario_id
            LEFT JOIN venda_itens vi
                ON vi.produto_id = p.id
            LEFT JOIN vendas v
                ON v.id = vi.venda_id
            WHERE p.id = ?
              AND p.status_produto = 'Ativo'
              AND p.excluido_em IS NULL
            GROUP BY
                p.id,
                p.titulo,
                p.descricao_curta,
                p.descricao_completa,
                p.preco,
                p.categoria,
                p.comissao,
                p.capa,
                p.criado_em,
                u.id,
                u.nome`,
            [id]
        )

        if (produtos.length === 0) {
            return res.status(404).json({
                erro: 'Produto não encontrado ou indisponível'
            })
        }

        const produto = produtos[0]

        return res.json({
            ...produto,
            preco: Number(produto.preco || 0),
            comissao: Number(produto.comissao || 0),
            total_vendas: Number(produto.total_vendas || 0)
        })
    } catch (erro) {
        console.error(
            'Erro ao buscar produto da vitrine:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao buscar produto'
        })
    }
}

const comprar = async (req, res) => {
    const comprador_id = req.usuario.id

    const {
        produto_id,
        codigo_afiliado
    } = req.body

    if (
        !Number.isSafeInteger(Number(produto_id)) ||
        Number(produto_id) <= 0
    ) {
        return res.status(400).json({
            erro: 'Produto inválido'
        })
    }

    let conexao

    try {
        conexao = await db.getConnection()

        await conexao.beginTransaction()
        const reserva = await operacoes.iniciar(conexao, req, 'comprar')
        if (reserva.repeticao) {
            await conexao.commit()
            return res.status(reserva.repeticao.status).json(reserva.repeticao.corpo)
        }

        const [produtos] = await conexao.query(
            `SELECT
                id,
                usuario_id,
                titulo,
                preco,
                comissao,
                status_produto,
                produto_arquivo
            FROM produtos
            WHERE id = ?
              AND status_produto = 'Ativo'
              AND excluido_em IS NULL
            FOR UPDATE`,
            [produto_id]
        )

        if (produtos.length === 0) {
            await conexao.rollback()

            return res.status(404).json({
                erro: 'Produto não encontrado ou indisponível'
            })
        }

        const produto = produtos[0]

        if (
            Number(produto.usuario_id) ===
            Number(comprador_id)
        ) {
            await conexao.rollback()

            return res.status(400).json({
                erro: 'Você não pode comprar seu próprio produto'
            })
        }

        // Produtos digitais dão acesso único por comprador. O bloqueio do produto
        // serializa compras também quando vierem de abas/chaves diferentes.
        const [[existente]] = await conexao.query(`SELECT v.id, v.codigo_venda, v.forma_pagamento,
            vi.id AS item_id, vi.produto_id, vi.titulo_produto AS produto,
            vi.preco_unitario AS valor, vi.afiliacao_id, vi.comissao_afiliado
            FROM vendas v INNER JOIN venda_itens vi ON vi.venda_id = v.id
            WHERE v.comprador_id = ? AND vi.produto_id = ? AND v.status_venda = 'pago'
            ORDER BY v.id LIMIT 1 FOR UPDATE`, [comprador_id, produto.id])
        if (existente) {
            const corpo = { mensagem: 'Você já possui este produto. Acesse Minhas compras.',
                venda: { ...existente, valor: Number(existente.valor), status: 'pago',
                    afiliacao_aplicada: Boolean(existente.afiliacao_id),
                    comissao_afiliado: Number(existente.comissao_afiliado) },
                acesso_produto: produto.produto_arquivo }
            await operacoes.concluir(conexao, reserva, 200, corpo)
            return res.json(corpo)
        }

        let afiliacao_id = null
        let afiliado_id = null
        let comissao_afiliado = 0

        if (
            codigo_afiliado &&
            String(codigo_afiliado).trim()
        ) {
            const [afiliacoes] = await conexao.query(
                `SELECT
                    a.id,
                    a.usuario_id AS afiliado_id,
                    a.comissao
                FROM afiliacoes a
                WHERE a.codigo_link = ?
                  AND a.produto_id = ?
                  AND a.status_afiliacao = 'Ativa'
                LIMIT 1`,
                [
                    String(codigo_afiliado).trim(),
                    produto_id
                ]
            )

            if (afiliacoes.length > 0) {
                const afiliacao = afiliacoes[0]

                if (
                    Number(afiliacao.afiliado_id) !==
                    Number(comprador_id)
                ) {
                    afiliacao_id = afiliacao.id
                    afiliado_id = afiliacao.afiliado_id

                    const percentual =
                        Number(afiliacao.comissao || 0)

                    comissao_afiliado =
                        Number(produto.preco) *
                        (percentual / 100)

                    comissao_afiliado =
                        Number(
                            comissao_afiliado.toFixed(2)
                        )
                }
            }
        }

        const codigoVenda = crypto.randomUUID()
        const valorTotal = Number(produto.preco)

        const [resultadoVenda] = await conexao.query(
            `INSERT INTO vendas (
                codigo_venda,
                comprador_id,
                valor_total,
                status_venda,
                forma_pagamento,
                data_venda,
                pago_em
            )
            VALUES (
                ?,
                ?,
                ?,
                'pago',
                'simulado',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )`,
            [
                codigoVenda,
                comprador_id,
                valorTotal
            ]
        )

        const venda_id = resultadoVenda.insertId

        const [resultadoItem] = await conexao.query(
            `INSERT INTO venda_itens (
                venda_id,
                produto_id,
                titulo_produto,
                vendedor_id,
                afiliacao_id,
                afiliado_id,
                preco_unitario,
                quantidade,
                comissao_afiliado
            )
            VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                1,
                ?
            )`,
            [
                venda_id,
                produto.id,
                produto.titulo,
                produto.usuario_id,
                afiliacao_id,
                afiliado_id,
                valorTotal,
                comissao_afiliado
            ]
        )

        const corpo = {
            mensagem: 'Compra simulada realizada com sucesso!',
            venda: {
                id: venda_id,
                item_id: resultadoItem.insertId,
                codigo_venda: codigoVenda,
                produto_id: Number(produto.id),
                produto: produto.titulo,
                valor: valorTotal,
                forma_pagamento: 'simulado',
                status: 'pago',
                afiliacao_aplicada: Boolean(afiliacao_id),
                comissao_afiliado
            },
            acesso_produto: produto.produto_arquivo
        }
        await operacoes.concluir(conexao, reserva, 201, corpo)
        return res.status(201).json(corpo)
    } catch (erro) {
        if (conexao) {
            try {
                await conexao.rollback()
            } catch (erroRollback) {
                console.error(
                    'Erro ao desfazer compra:',
                    erroRollback
                )
            }
        }

        if (erro instanceof operacoes.ErroOperacao) return res.status(erro.status).json({ erro: erro.message })

        console.error(
            'Erro ao realizar compra simulada:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao realizar compra'
        })
    } finally {
        if (conexao) {
            conexao.release()
        }
    }
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    comprar
}