const db = require('../config/db')

const resumo = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [[vendasComoVendedor]] = await db.query(
            `SELECT
                COUNT(*) AS quantidade,
                COALESCE(
                    SUM(vi.preco_unitario * vi.quantidade),
                    0
                ) AS total_vendido
            FROM venda_itens vi
            INNER JOIN vendas v ON v.id = vi.venda_id
            WHERE vi.vendedor_id = ?
              AND v.status_venda = 'pago'`,
            [usuario_id]
        )

        const [[vendasComoAfiliado]] = await db.query(
            `SELECT
                COUNT(*) AS quantidade,
                COALESCE(
                    SUM(vi.comissao_afiliado),
                    0
                ) AS total_comissoes
            FROM venda_itens vi
            INNER JOIN vendas v ON v.id = vi.venda_id
            WHERE vi.afiliado_id = ?
              AND v.status_venda = 'pago'`,
            [usuario_id]
        )

        return res.json({
            total_vendas: Number(
                vendasComoVendedor.total_vendido || 0
            ),
            total_comissoes: Number(
                vendasComoAfiliado.total_comissoes || 0
            ),
            vendas_vendedor: Number(
                vendasComoVendedor.quantidade || 0
            ),
            vendas_afiliado: Number(
                vendasComoAfiliado.quantidade || 0
            )
        })
    } catch (erro) {
        console.error('Erro ao carregar resumo de vendas:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao carregar resumo de vendas'
        })
    }
}

const listarVendas = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [vendas] = await db.query(
            `SELECT
                vi.id,
                vi.titulo_produto AS produto,
                comprador.nome AS comprador,
                v.data_venda,
                v.status_venda,
                vi.preco_unitario,
                vi.quantidade,
                (
                    vi.preco_unitario * vi.quantidade
                ) AS valor
            FROM venda_itens vi
            INNER JOIN vendas v
                ON v.id = vi.venda_id
            INNER JOIN usuarios comprador
                ON comprador.id = v.comprador_id
            WHERE vi.vendedor_id = ?
            ORDER BY v.data_venda DESC`,
            [usuario_id]
        )

        const vendasFormatadas = vendas.map(venda => ({
            ...venda,
            preco_unitario: Number(
                venda.preco_unitario
            ),
            quantidade: Number(
                venda.quantidade
            ),
            valor: Number(
                venda.valor
            )
        }))

        return res.json(vendasFormatadas)
    } catch (erro) {
        console.error('Erro ao listar vendas:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao listar vendas'
        })
    }
}

const listarComissoes = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [comissoes] = await db.query(
            `SELECT
                vi.id,
                vi.titulo_produto AS produto,
                comprador.nome AS comprador,
                vendedor.nome AS produtor,
                v.data_venda,
                v.status_venda,
                vi.comissao_afiliado AS valor
            FROM venda_itens vi
            INNER JOIN vendas v
                ON v.id = vi.venda_id
            INNER JOIN usuarios comprador
                ON comprador.id = v.comprador_id
            INNER JOIN usuarios vendedor
                ON vendedor.id = vi.vendedor_id
            WHERE vi.afiliado_id = ?
            ORDER BY v.data_venda DESC`,
            [usuario_id]
        )

        const comissoesFormatadas =
            comissoes.map(comissao => ({
                ...comissao,
                valor: Number(
                    comissao.valor || 0
                )
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
    listarVendas,
    listarComissoes
}