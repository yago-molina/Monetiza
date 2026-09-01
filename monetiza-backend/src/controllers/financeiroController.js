const db = require('../config/db')

const resumo = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [[vendas]] = await db.query(
            `SELECT
                COALESCE(
                    SUM(
                        (vi.preco_unitario * vi.quantidade)
                        - vi.comissao_afiliado
                    ),
                    0
                ) AS total
            FROM venda_itens vi
            INNER JOIN vendas v
                ON v.id = vi.venda_id
            WHERE vi.vendedor_id = ?
              AND v.status_venda = 'pago'`,
            [usuario_id]
        )

        const [[comissoes]] = await db.query(
            `SELECT
                COALESCE(
                    SUM(vi.comissao_afiliado),
                    0
                ) AS total
            FROM venda_itens vi
            INNER JOIN vendas v
                ON v.id = vi.venda_id
            WHERE vi.afiliado_id = ?
              AND v.status_venda = 'pago'`,
            [usuario_id]
        )

        const [[ajustesEntrada]] = await db.query(
            `SELECT
                COALESCE(SUM(valor), 0) AS total
            FROM movimentacoes_financeiras
            WHERE usuario_id = ?
              AND tipo = 'Entrada'
              AND categoria = 'Ajuste'
              AND status_movimentacao = 'Confirmada'`,
            [usuario_id]
        )

        const [[ajustesSaida]] = await db.query(
            `SELECT
                COALESCE(SUM(valor), 0) AS total
            FROM movimentacoes_financeiras
            WHERE usuario_id = ?
              AND tipo = 'Saida'
              AND categoria = 'Ajuste'
              AND status_movimentacao = 'Confirmada'`,
            [usuario_id]
        )

        const [[saques]] = await db.query(
            `SELECT
                COALESCE(SUM(valor), 0) AS total
            FROM saques
            WHERE usuario_id = ?
              AND status_saque IN (
                  'Pendente',
                  'Aprovado',
                  'Concluido'
              )`,
            [usuario_id]
        )

        const totalVendas =
            Number(vendas.total || 0)

        const totalComissoes =
            Number(comissoes.total || 0)

        const totalAjustesEntrada =
            Number(ajustesEntrada.total || 0)

        const totalAjustesSaida =
            Number(ajustesSaida.total || 0)

        const totalSaques =
            Number(saques.total || 0)

        const totalEntradas =
            totalVendas +
            totalComissoes +
            totalAjustesEntrada

        const totalSaidas =
            totalAjustesSaida +
            totalSaques

        const saldoDisponivel =
            totalEntradas - totalSaidas

        return res.json({
            saldo_disponivel: saldoDisponivel,
            total_entradas: totalEntradas,
            total_saidas: totalSaidas,
            vendas: totalVendas,
            comissoes: totalComissoes
        })
    } catch (erro) {
        console.error(
            'Erro ao carregar resumo financeiro:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao carregar resumo financeiro'
        })
    }
}

const listarTransacoes = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [transacoes] = await db.query(
            `SELECT *
            FROM (
                SELECT
                    CONCAT('venda-', vi.id) AS id,
                    'Entrada' AS tipo,
                    CONCAT(
                        'Venda de ',
                        vi.titulo_produto
                    ) AS descricao,
                    'Venda' AS categoria,
                    v.data_venda AS data_movimentacao,
                    (
                        (vi.preco_unitario * vi.quantidade)
                        - vi.comissao_afiliado
                    ) AS valor,
                    CASE
                        WHEN v.status_venda = 'pago'
                            THEN 'Confirmada'
                        WHEN v.status_venda = 'pendente'
                            THEN 'Pendente'
                        ELSE 'Cancelada'
                    END AS status
                FROM venda_itens vi
                INNER JOIN vendas v
                    ON v.id = vi.venda_id
                WHERE vi.vendedor_id = ?

                UNION ALL

                SELECT
                    CONCAT('comissao-', vi.id) AS id,
                    'Entrada' AS tipo,
                    CONCAT(
                        'Comissão de ',
                        vi.titulo_produto
                    ) AS descricao,
                    'Comissao' AS categoria,
                    v.data_venda AS data_movimentacao,
                    vi.comissao_afiliado AS valor,
                    CASE
                        WHEN v.status_venda = 'pago'
                            THEN 'Confirmada'
                        WHEN v.status_venda = 'pendente'
                            THEN 'Pendente'
                        ELSE 'Cancelada'
                    END AS status
                FROM venda_itens vi
                INNER JOIN vendas v
                    ON v.id = vi.venda_id
                WHERE vi.afiliado_id = ?
                  AND vi.comissao_afiliado > 0

                UNION ALL

                SELECT
                    CONCAT('ajuste-', mf.id) AS id,
                    mf.tipo,
                    mf.descricao,
                    mf.categoria,
                    mf.data_movimentacao,
                    mf.valor,
                    mf.status_movimentacao AS status
                FROM movimentacoes_financeiras mf
                WHERE mf.usuario_id = ?
                  AND mf.categoria = 'Ajuste'

                UNION ALL

                SELECT
                    CONCAT('saque-', s.id) AS id,
                    'Saida' AS tipo,
                    'Solicitação de saque' AS descricao,
                    'Saque' AS categoria,
                    s.solicitado_em AS data_movimentacao,
                    s.valor,
                    CASE
                        WHEN s.status_saque = 'Concluido'
                            THEN 'Confirmada'
                        WHEN s.status_saque IN (
                            'Rejeitado',
                            'Cancelado'
                        )
                            THEN 'Cancelada'
                        ELSE 'Pendente'
                    END AS status
                FROM saques s
                WHERE s.usuario_id = ?
            ) AS historico
            ORDER BY data_movimentacao DESC`,
            [
                usuario_id,
                usuario_id,
                usuario_id,
                usuario_id
            ]
        )

        const transacoesFormatadas =
            transacoes.map(transacao => ({
                ...transacao,
                valor: Number(transacao.valor || 0)
            }))

        return res.json(transacoesFormatadas)
    } catch (erro) {
        console.error(
            'Erro ao listar transações:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao listar transações'
        })
    }
}

const criarTransacao = async (req, res) => {
    const usuario_id = req.usuario.id

    const {
        tipo,
        descricao,
        valor
    } = req.body

    const tiposPermitidos = [
        'Entrada',
        'Saida'
    ]

    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            erro: 'Tipo de transação inválido'
        })
    }

    if (
        !descricao ||
        !descricao.trim()
    ) {
        return res.status(400).json({
            erro: 'Informe uma descrição'
        })
    }

    const valorNumerico = Number(valor)

    if (
        !Number.isFinite(valorNumerico) ||
        valorNumerico <= 0
    ) {
        return res.status(400).json({
            erro: 'Informe um valor válido'
        })
    }

    try {
        if (tipo === 'Saida') {
            const [[vendas]] = await db.query(
                `SELECT
                    COALESCE(
                        SUM(
                            (vi.preco_unitario * vi.quantidade)
                            - vi.comissao_afiliado
                        ),
                        0
                    ) AS total
                FROM venda_itens vi
                INNER JOIN vendas v
                    ON v.id = vi.venda_id
                WHERE vi.vendedor_id = ?
                  AND v.status_venda = 'pago'`,
                [usuario_id]
            )

            const [[comissoes]] = await db.query(
                `SELECT
                    COALESCE(
                        SUM(vi.comissao_afiliado),
                        0
                    ) AS total
                FROM venda_itens vi
                INNER JOIN vendas v
                    ON v.id = vi.venda_id
                WHERE vi.afiliado_id = ?
                  AND v.status_venda = 'pago'`,
                [usuario_id]
            )

            const [[movimentacoes]] = await db.query(
                `SELECT
                    COALESCE(
                        SUM(
                            CASE
                                WHEN tipo = 'Entrada'
                                    THEN valor
                                ELSE -valor
                            END
                        ),
                        0
                    ) AS saldo
                FROM movimentacoes_financeiras
                WHERE usuario_id = ?
                  AND categoria = 'Ajuste'
                  AND status_movimentacao = 'Confirmada'`,
                [usuario_id]
            )

            const [[saques]] = await db.query(
                `SELECT
                    COALESCE(SUM(valor), 0) AS total
                FROM saques
                WHERE usuario_id = ?
                  AND status_saque IN (
                      'Pendente',
                      'Aprovado',
                      'Concluido'
                  )`,
                [usuario_id]
            )

            const saldo =
                Number(vendas.total || 0) +
                Number(comissoes.total || 0) +
                Number(movimentacoes.saldo || 0) -
                Number(saques.total || 0)

            if (valorNumerico > saldo) {
                return res.status(400).json({
                    erro: 'Saldo insuficiente para esta saída'
                })
            }
        }

        const [resultado] = await db.query(
            `INSERT INTO movimentacoes_financeiras (
                usuario_id,
                tipo,
                categoria,
                descricao,
                valor,
                status_movimentacao
            ) VALUES (
                ?,
                ?,
                'Ajuste',
                ?,
                ?,
                'Confirmada'
            )`,
            [
                usuario_id,
                tipo,
                descricao.trim(),
                valorNumerico
            ]
        )

        return res.status(201).json({
            mensagem: 'Transação registrada com sucesso!',
            id: resultado.insertId
        })
    } catch (erro) {
        console.error(
            'Erro ao criar transação:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao registrar transação'
        })
    }
}

const resumoComissoes = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [[resultado]] = await db.query(
            `SELECT
                COALESCE(
                    SUM(
                        CASE
                            WHEN v.status_venda = 'pago'
                            THEN vi.comissao_afiliado
                            ELSE 0
                        END
                    ),
                    0
                ) AS liberadas,

                COALESCE(
                    SUM(
                        CASE
                            WHEN v.status_venda = 'pendente'
                            THEN vi.comissao_afiliado
                            ELSE 0
                        END
                    ),
                    0
                ) AS pendentes,

                COALESCE(
                    SUM(
                        CASE
                            WHEN v.status_venda IN (
                                'pago',
                                'pendente'
                            )
                            THEN vi.comissao_afiliado
                            ELSE 0
                        END
                    ),
                    0
                ) AS total
            FROM venda_itens vi
            INNER JOIN vendas v
                ON v.id = vi.venda_id
            WHERE vi.afiliado_id = ?
              AND vi.comissao_afiliado > 0`,
            [usuario_id]
        )

        return res.json({
            liberadas:
                Number(resultado.liberadas || 0),

            pendentes:
                Number(resultado.pendentes || 0),

            total_acumulado:
                Number(resultado.total || 0)
        })
    } catch (erro) {
        console.error(
            'Erro ao carregar resumo de comissões:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao carregar resumo de comissões'
        })
    }
}

const listarComissoes = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [comissoes] = await db.query(
            `SELECT *
            FROM (
                SELECT
                    CONCAT(
                        'produtor-',
                        vi.id
                    ) AS id,

                    vi.titulo_produto AS produto,

                    'Produtor' AS papel,

                    v.data_venda,

                    CASE
                        WHEN v.status_venda = 'pago'
                            THEN 'Liberado'
                        WHEN v.status_venda = 'pendente'
                            THEN 'Pendente'
                        ELSE 'Cancelado'
                    END AS status,

                    (
                        (vi.preco_unitario * vi.quantidade)
                        - vi.comissao_afiliado
                    ) AS valor

                FROM venda_itens vi
                INNER JOIN vendas v
                    ON v.id = vi.venda_id

                WHERE vi.vendedor_id = ?

                UNION ALL

                SELECT
                    CONCAT(
                        'afiliado-',
                        vi.id
                    ) AS id,

                    vi.titulo_produto AS produto,

                    'Afiliado' AS papel,

                    v.data_venda,

                    CASE
                        WHEN v.status_venda = 'pago'
                            THEN 'Liberado'
                        WHEN v.status_venda = 'pendente'
                            THEN 'Pendente'
                        ELSE 'Cancelado'
                    END AS status,

                    vi.comissao_afiliado AS valor

                FROM venda_itens vi
                INNER JOIN vendas v
                    ON v.id = vi.venda_id

                WHERE vi.afiliado_id = ?
                  AND vi.comissao_afiliado > 0
            ) AS historico
            ORDER BY data_venda DESC`,
            [
                usuario_id,
                usuario_id
            ]
        )

        const comissoesFormatadas =
            comissoes.map(comissao => ({
                ...comissao,
                valor: Number(comissao.valor || 0)
            }))

        return res.json(comissoesFormatadas)
    } catch (erro) {
        console.error(
            'Erro ao listar comissões:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao listar comissões'
        })
    }
}

module.exports = {
    resumo,
    listarTransacoes,
    criarTransacao,
    resumoComissoes,
    listarComissoes
}