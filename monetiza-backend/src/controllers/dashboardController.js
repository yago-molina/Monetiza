const db = require('../config/db')

const resumo = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [
            resultadoVendas,
            resultadoComissoes,
            resultadoProdutos,
            resultadoVendasAfiliado,
            resultadoVendasRecentes
        ] = await Promise.all([
            db.query(
                `SELECT
                    COALESCE(
                        SUM(
                            (vi.preco_unitario * vi.quantidade)
                            - vi.comissao_afiliado
                        ),
                        0
                    ) AS vendas_totais,
                    COUNT(DISTINCT vi.venda_id) AS total_vendas
                FROM venda_itens vi
                INNER JOIN vendas v ON v.id = vi.venda_id
                WHERE vi.vendedor_id = ?
                AND v.status_venda = 'pago'`,
                [usuario_id]
            ),

            db.query(
                `SELECT
                    COALESCE(SUM(vi.comissao_afiliado), 0) AS comissoes_recebidas
                FROM venda_itens vi
                INNER JOIN vendas v ON v.id = vi.venda_id
                WHERE vi.afiliado_id = ?
                AND v.status_venda = 'pago'`,
                [usuario_id]
            ),

            db.query(
                `SELECT COUNT(*) AS produtos_ativos
                FROM produtos
                WHERE usuario_id = ?
                AND status_produto = 'Ativo'
                AND excluido_em IS NULL`,
                [usuario_id]
            ),

            db.query(
                `SELECT
                    COUNT(DISTINCT vi.venda_id) AS total_vendas_afiliado
                FROM venda_itens vi
                INNER JOIN vendas v ON v.id = vi.venda_id
                WHERE vi.afiliado_id = ?
                AND v.status_venda = 'pago'`,
                [usuario_id]
            ),

            db.query(
                `SELECT
                    v.id AS venda_id,
                    p.titulo AS produto,
                    u.nome AS comprador,
                    (
                        (vi.preco_unitario * vi.quantidade)
                        - vi.comissao_afiliado
                    ) AS valor,
                    vi.comissao_afiliado,
                    v.status_venda,
                    v.forma_pagamento,
                    v.data_venda
                FROM venda_itens vi
                INNER JOIN vendas v ON v.id = vi.venda_id
                INNER JOIN produtos p ON p.id = vi.produto_id
                INNER JOIN usuarios u ON u.id = v.comprador_id
                WHERE vi.vendedor_id = ?
                ORDER BY v.data_venda DESC
                LIMIT 5`,
                [usuario_id]
            )
        ])

        const dadosVendas = resultadoVendas[0][0]
        const dadosComissoes = resultadoComissoes[0][0]
        const dadosProdutos = resultadoProdutos[0][0]
        const dadosVendasAfiliado = resultadoVendasAfiliado[0][0]
        const vendasRecentes = resultadoVendasRecentes[0]

        const vendasTotais = Number(dadosVendas.vendas_totais || 0)
        const comissoesRecebidas = Number(
            dadosComissoes.comissoes_recebidas || 0
        )

        const totalVendasVendedor = Number(
            dadosVendas.total_vendas || 0
        )

        const totalVendasAfiliado = Number(
            dadosVendasAfiliado.total_vendas_afiliado || 0
        )

        const totalVendas =
            totalVendasVendedor + totalVendasAfiliado

        const totalEntradas =
            vendasTotais + comissoesRecebidas

        const totalSaidas = 0
        const saldoDisponivel = totalEntradas

        const vendasFormatadas = vendasRecentes.map(venda => ({
            ...venda,
            valor: Number(venda.valor || 0),
            comissao_afiliado: Number(venda.comissao_afiliado || 0)
        }))

        return res.json({
            vendas_totais: vendasTotais,
            comissoes: comissoesRecebidas,
            produtos_ativos: Number(dadosProdutos.produtos_ativos || 0),
            total_vendas: totalVendas,
            total_entradas: totalEntradas,
            total_saidas: totalSaidas,
            saldo_disponivel: saldoDisponivel,
            vendas_recentes: vendasFormatadas
        })
    } catch (erro) {
        console.error('Erro ao carregar resumo do Dashboard:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao carregar o Dashboard'
        })
    }
}

module.exports = { resumo }