// Apenas consultas fixas; identidade vem exclusivamente do JWT.
function criarConsultaContexto(obterDb = () => require('../../config/db')) {
    return async function consultar(usuarioId, mensagem = '') {
        const id = Number(usuarioId)
        if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Identidade inválida')
        const db = obterDb()
        const referencia = mensagem.match(/\b(produto|compra)\s*#?\s*(\d{1,15})\b/i)
        const tipo = referencia?.[1].toLowerCase()
        const numero = referencia ? Number(referencia[2]) : null
        const produtoId = tipo === 'produto' ? numero : null
        const compraId = tipo === 'compra' ? numero : null
        const resultados = await Promise.allSettled([
            db.execute({ sql: `SELECT id, LEFT(titulo, 180) AS titulo,
                status_produto, categoria, preco,
                (NULLIF(TRIM(produto_arquivo), '') IS NOT NULL) AS arquivo_cadastrado
                FROM produtos WHERE usuario_id = ? AND excluido_em IS NULL
                ${produtoId ? 'AND id = ?' : ''}
                ORDER BY id DESC LIMIT 21`, timeout: 5000 },
                produtoId ? [id, produtoId] : [id]),
            db.execute({ sql: `SELECT v.id AS compra_id, vi.produto_id,
                LEFT(vi.titulo_produto, 180) AS produto, v.status_venda,
                v.forma_pagamento, v.data_venda,
                (vi.preco_unitario * vi.quantidade) AS valor,
                (NULLIF(TRIM(p.produto_arquivo), '') IS NOT NULL) AS arquivo_cadastrado
                FROM vendas v JOIN venda_itens vi ON vi.venda_id = v.id
                LEFT JOIN produtos p ON p.id = vi.produto_id
                WHERE v.comprador_id = ?
                ${compraId ? 'AND v.id = ?' : produtoId ? 'AND vi.produto_id = ?' : ''}
                ORDER BY v.id DESC, vi.id DESC LIMIT 21`, timeout: 5000 },
                compraId ? [id, compraId] : produtoId ? [id, produtoId] : [id])
        ])
        const formatar = resultado => resultado.status === 'fulfilled'
            ? { consultado: true, registros: resultado.value[0].slice(0, 20),
                ha_mais: resultado.value[0].length > 20 }
            : { consultado: false, motivo: 'Consulta temporariamente indisponível' }
        return {
            consultado_em: new Date().toISOString(),
            escopo: referencia ? `${tipo} ${numero}, somente nesta conta` : 'Até 20 produtos e 20 itens de compras mais recentes desta conta',
            produtos: formatar(resultados[0]), compras: formatar(resultados[1])
        }
    }
}
module.exports = { criarConsultaContexto }
