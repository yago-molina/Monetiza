const test = require('node:test')
const assert = require('node:assert/strict')
const { criarSlug, garantirSlug, buscarPublico } = require('../src/services/produtoSlugService')

function bancoFalso() {
    const rows = new Map()
    return { rows, async query(sql, args) {
        if (sql.startsWith('UPDATE')) {
            const [slug, id] = args, row = rows.get(Number(id))
            if (!row || row.slug) return [{ affectedRows: 0 }]
            if ([...rows.values()].some(r => r.slug === slug)) throw Object.assign(new Error(), { code: 'ER_DUP_ENTRY' })
            row.slug = slug; return [{ affectedRows: 1 }]
        }
        if (sql.startsWith('SELECT slug')) return [[rows.get(Number(args[0]))].filter(Boolean)]
        const publico = [...rows.values()].filter(r => r.status_produto === 'Ativo' && !r.excluido_em)
        if (sql.includes('SELECT id, titulo, slug')) {
            const r = publico.find(r => sql.includes('WHERE id') ? r.id === Number(args[0]) : r.slug === args[0])
            return [r ? [{ ...r }] : []]
        }
        if (sql.includes('INNER JOIN usuarios')) {
            const result = args ? publico.filter(r => r.id === Number(args[0])) : publico
            return [result.map(r => ({ ...r, preco: '49.90', comissao: '10', total_vendas: 0 }))]
        }
        throw new Error('SQL não previsto: ' + sql)
    } }
}

test('acentos, símbolos, vazio, nomes numéricos e limite', () => {
    assert.equal(criarSlug('  Fotografia: do Básico à Ação! '), 'fotografia-do-basico-a-acao')
    assert.equal(criarSlug('2026'), 'produto-2026')
    assert.equal(criarSlug('📷'), 'produto')
    assert.equal(criarSlug('x'.repeat(200)).length, 120)
})

test('colisões, concorrência e permanência após mudar título', async () => {
    const db = bancoFalso()
    for (const [id, titulo] of [[1,'Curso'],[2,'Curso'],[3,'Curso-2']]) db.rows.set(id,{id,titulo,slug:null})
    await garantirSlug({...db.rows.get(3)},db)
    const a = await Promise.all([1,1,2,2].map(id => garantirSlug({...db.rows.get(id)},db)))
    assert.deepEqual(a,['curso','curso','curso-2-2','curso-2-2'])
    db.rows.get(1).titulo='Outro nome'
    assert.equal(await garantirSlug({...db.rows.get(1)},db),'curso')
})

test('URLs públicas, links antigos, afiliado, API e produtos indisponíveis', async () => {
    const db = bancoFalso()
    db.rows.set(42,{id:42,titulo:'Guia de Fotografia',slug:null,status_produto:'Ativo'})
    db.rows.set(43,{id:43,titulo:'Rascunho',slug:'rascunho',status_produto:'Rascunho'})
    db.rows.set(44,{id:44,titulo:'Excluído',slug:'excluido',status_produto:'Ativo',excluido_em:'2026-01-01'})
    assert.equal(await buscarPublico('rascunho',db),null)
    assert.equal(await buscarPublico('excluido',db),null)
    assert.equal(await buscarPublico("' OR 1=1",db),null)
    const dbPath = require.resolve('../src/config/db')
    const anterior = require.cache[dbPath]
    require.cache[dbPath] = { id:dbPath, filename:dbPath, loaded:true, exports:db }
    const express = require('express'), app = express()
    app.use(require('../src/routes/produtoPaginaRoutes'))
    const controller = require('../src/controllers/vitrineController')
    app.get('/vitrine-api/produtos',controller.listarProdutos)
    app.get('/vitrine-api/produtos/:id',controller.buscarProdutoPorId)
    const server = app.listen(0)
    await new Promise(resolve=>server.once('listening',resolve))
    const base = `http://127.0.0.1:${server.address().port}`
    try {
        for (const prefix of ['/produto/42','/vitrine/produto/42']) {
            const response=await fetch(base+prefix+'?ref=abc%26xyz&utm_source=teste',{redirect:'manual'})
            assert.equal(response.status,301)
            assert.equal(response.headers.get('location'),'/produto/guia-de-fotografia?ref=abc%26xyz&utm_source=teste')
        }
        const response=await fetch(base+'/produto/guia-de-fotografia');assert.equal(response.status,200)
        assert.match(await response.text(),/paginaDoProduto.js/)
        for (const ref of ['42','guia-de-fotografia']) {
            const r=await fetch(base+'/vitrine-api/produtos/'+ref);assert.equal(r.status,200)
            const json=await r.json();assert.equal(json.id,42);assert.equal(json.slug,'guia-de-fotografia')
        }
        const list=await (await fetch(base+'/vitrine-api/produtos')).json();assert.equal(list.length,1);assert.equal(list[0].slug,'guia-de-fotografia')
        for(const ref of ['rascunho','excluido','nao-existe']) assert.equal((await fetch(base+'/produto/'+ref)).status,404)
    } finally {
        server.closeAllConnections();await new Promise(resolve=>server.close(resolve))
        if(anterior) require.cache[dbPath]=anterior;else delete require.cache[dbPath]
    }
})
