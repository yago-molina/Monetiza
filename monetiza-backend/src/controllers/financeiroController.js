const db = require('../config/db')

const {
    calcularResumoFinanceiro
} = require('../services/financeiroService')

const resumo = async (req, res) => {
    try {
        const dados = await calcularResumoFinanceiro(
            req.usuario.id
        )

        return res.json(dados)
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
    const usuarioId = req.usuario.id
    const { tipo, descricao, valor } = req.body

    if (!['Entrada', 'Saida'].includes(tipo)) {
        return res.status(400).json({
            erro: 'Tipo de transação inválido'
        })
    }

    if (
        typeof descricao !== 'string' ||
        !descricao.trim()
    ) {
        return res.status(400).json({
            erro: 'Informe uma descrição'
        })
    }

    if (
        !['number', 'string'].includes(typeof valor) ||
        String(valor).trim() === ''
    ) {
        return res.status(400).json({
            erro: 'Informe um valor válido'
        })
    }

    const valorNumerico = Number(valor)
    const centavos = Math.round(valorNumerico * 100)

    if (
        !Number.isFinite(valorNumerico) ||
        !Number.isSafeInteger(centavos) ||
        centavos <= 0 ||
        Math.abs(valorNumerico * 100 - centavos) > 0.000001
    ) {
        return res.status(400).json({
            erro: 'Informe um valor positivo com até duas casas decimais'
        })
    }

    let conexao

    try {
        conexao = await db.getConnection()

        await conexao.beginTransaction()

        // Serializa as movimentações deste usuário.
        const [usuarios] = await conexao.query(
            `SELECT id
             FROM usuarios
             WHERE id = ?
             FOR UPDATE`,
            [usuarioId]
        )

        if (!usuarios.length) {
            await conexao.rollback()

            return res.status(404).json({
                erro: 'Usuário não encontrado'
            })
        }

        const resumo = await calcularResumoFinanceiro(
            usuarioId,
            conexao
        )

        const saldoCentavos = Math.round(
            resumo.saldo_disponivel * 100
        )

        if (
            tipo === 'Saida' &&
            centavos > saldoCentavos
        ) {
            await conexao.rollback()

            return res.status(400).json({
                erro: 'Saldo simulado insuficiente para esta saída'
            })
        }

        const [resultado] = await conexao.query(
            `INSERT INTO movimentacoes_financeiras (
                usuario_id,
                tipo,
                categoria,
                descricao,
                valor,
                status_movimentacao
            ) VALUES (?, ?, 'Ajuste', ?, ?, 'Confirmada')`,
            [
                usuarioId,
                tipo,
                descricao.trim(),
                (centavos / 100).toFixed(2)
            ]
        )

        await conexao.commit()

        return res.status(201).json({
            mensagem: 'Transação simulada registrada com sucesso!',
            id: resultado.insertId
        })
    } catch (erro) {
        if (conexao) {
            try {
                await conexao.rollback()
            } catch (erroRollback) {
                console.error(
                    'Erro ao desfazer transação:',
                    erroRollback
                )
            }
        }

        console.error('Erro ao criar transação:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao registrar transação'
        })
    } finally {
        if (conexao) {
            conexao.release()
        }
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