// O slug é permanente: alterar o título não quebra links já compartilhados.
function criarSlug(titulo) {
    const texto = String(titulo || '').normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        .slice(0, 120).replace(/-+$/g, '')
    // Nomes somente numéricos não podem ser confundidos com IDs antigos.
    return !texto ? 'produto' : /^\d+$/.test(texto) ? `produto-${texto}` : texto
}

async function garantirSlug(produto, banco = require('../config/db')) {
    if (produto.slug) return produto.slug
    const base = criarSlug(produto.titulo)
    for (let tentativa = 0; tentativa < 100; tentativa++) {
        const slug = tentativa === 0 ? base
            : `${base}-${produto.id}${tentativa === 1 ? '' : `-${tentativa}`}`
        try {
            // UNIQUE resolve colisões; IS NULL evita sobrescrever outra requisição.
            await banco.query('UPDATE produtos SET slug = ? WHERE id = ? AND slug IS NULL', [slug, produto.id])
        } catch (erro) {
            if (erro.code !== 'ER_DUP_ENTRY') throw erro
            continue
        }
        const [[atual]] = await banco.query('SELECT slug FROM produtos WHERE id = ?', [produto.id])
        if (!atual?.slug) throw new Error('Produto indisponível ao gerar endereço')
        produto.slug = atual.slug
        return atual.slug
    }
    throw new Error('Não foi possível reservar um endereço para o produto')
}

async function buscarPublico(referencia, banco = require('../config/db')) {
    const valor = String(referencia || '')
    if (!/^[a-z0-9-]{1,180}$/.test(valor)) return null
    const numerico = /^\d+$/.test(valor)
    if (numerico && (!Number.isSafeInteger(Number(valor)) || Number(valor) <= 0)) return null
    const [[produto]] = await banco.query(
        `SELECT id, titulo, slug FROM produtos
         WHERE ${numerico ? 'id' : 'slug'} = ?
         AND status_produto = 'Ativo' AND excluido_em IS NULL LIMIT 1`, [valor])
    if (!produto) return null
    await garantirSlug(produto, banco)
    return produto
}

module.exports = { criarSlug, garantirSlug, buscarPublico }
