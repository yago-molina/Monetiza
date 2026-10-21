const db = require('../config/db')

async function calcularResumoFinanceiro(
    usuarioId,
    conexao = db
) {
    const [[totais]] = await conexao.query(
        `SELECT
            COALESCE(SUM(vendas), 0) AS vendas,
            COALESCE(SUM(comissoes), 0) AS comissoes,
            COALESCE(SUM(entradas), 0) AS entradas,
            COALESCE(SUM(saidas), 0) AS saidas
        FROM (
            SELECT
                SUM(
                    vi.preco_unitario * vi.quantidade
                    - COALESCE(vi.comissao_afiliado, 0)
                ) AS vendas,
                0 AS comissoes,
                0 AS entradas,
                0 AS saidas
            FROM venda_itens vi
            INNER JOIN vendas v ON v.id = vi.venda_id
            WHERE vi.vendedor_id = ?
              AND v.status_venda = 'pago'

            UNION ALL

            SELECT
                0,
                SUM(COALESCE(vi.comissao_afiliado, 0)),
                0,
                0
            FROM venda_itens vi
            INNER JOIN vendas v ON v.id = vi.venda_id
            WHERE vi.afiliado_id = ?
              AND v.status_venda = 'pago'

            UNION ALL

            SELECT
                0,
                0,
                SUM(CASE
                    WHEN tipo = 'Entrada' THEN valor
                    ELSE 0
                END),
                SUM(CASE
                    WHEN tipo = 'Saida' THEN valor
                    ELSE 0
                END)
            FROM movimentacoes_financeiras
            WHERE usuario_id = ?
              AND categoria = 'Ajuste'
              AND status_movimentacao = 'Confirmada'

            UNION ALL

            SELECT
                0,
                0,
                0,
                SUM(valor)
            FROM saques
            WHERE usuario_id = ?
              AND status_saque IN (
                  'Pendente',
                  'Aprovado',
                  'Concluido'
              )
        ) AS totais_financeiros`,
        [usuarioId, usuarioId, usuarioId, usuarioId]
    )

    const emCentavos = valor =>
        Math.round(Number(valor || 0) * 100)

    const vendas = emCentavos(totais.vendas)
    const comissoes = emCentavos(totais.comissoes)

    const entradas =
        vendas +
        comissoes +
        emCentavos(totais.entradas)

    const saidas = emCentavos(totais.saidas)

    return {
        saldo_disponivel: (entradas - saidas) / 100,
        total_entradas: entradas / 100,
        total_saidas: saidas / 100,
        vendas: vendas / 100,
        comissoes: comissoes / 100
    }
}

module.exports = { calcularResumoFinanceiro }