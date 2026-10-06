const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const path = require('node:path')
const express = require('express')
const draftId = '11111111-1111-1111-1111-111111111111'
let state, failCommit, loseCommitReply, tail = Promise.resolve()
function reset() {
    state = { ops: {}, products: [], sales: [], items: [], transactions: [],
        draft: { id: draftId, usuario_id: 1, versao: 2, produto_publicado_id: null } }
    failCommit = false; loseCommitReply = false
}
const database = { getConnection: async () => {
    let before, unlock, committed = false
    return {
        async beginTransaction() {
            const previous = tail; tail = new Promise(resolve => { unlock = resolve }); await previous
            before = structuredClone(state)
        },
        async query(sql, args) {
            if (sql.includes('INSERT INTO operacoes_idempotentes')) {
                const key = args.slice(0, 3).join(':')
                state.ops[key] ||= { corpo_hash: args[3], resposta_status: null, resposta_json: null }
                return [{ affectedRows: 1 }]
            }
            if (sql.includes('SELECT corpo_hash')) return [[state.ops[args.join(':')]]]
            if (sql.includes('UPDATE operacoes_idempotentes')) {
                Object.assign(state.ops[args.slice(2).join(':')], { resposta_status: args[0], resposta_json: args[1] })
                return [{ affectedRows: 1 }]
            }
            if (sql.includes('SELECT * FROM ia_rascunhos')) return [[...(args[0] === draftId && args[1] === state.draft.usuario_id ? [{ ...state.draft }] : [])]]
            if (sql.includes('UPDATE ia_rascunhos')) { state.draft.produto_publicado_id = args[0]; state.draft.versao++; return [{}] }
            if (sql.includes('INSERT INTO produtos')) { state.products.push(args); return [{ insertId: state.products.length + 50 }] }
            if (sql.includes('FROM produtos')) { assert.match(sql, /FOR UPDATE/); return [[{ id: 8, usuario_id: 9, preco: 10, titulo: 'Produto', comissao: 0, produto_arquivo: 'https://example.test/file' }]] }
            if (sql.includes('FROM vendas v INNER JOIN venda_itens')) {
                assert.match(sql, /FOR UPDATE/)
                const sale = state.sales.find(s => s.comprador_id === args[0])
                return [[...(sale ? [{ id: sale.id, codigo_venda: sale.codigo_venda, item_id: sale.id,
                    produto_id: 8, produto: 'Produto', valor: 10, forma_pagamento: 'simulado', comissao_afiliado: 0 }] : [])]]
            }
            if (sql.includes('INSERT INTO vendas')) { const id = state.sales.length + 1; state.sales.push({ id, codigo_venda: args[0], comprador_id: args[1] }); return [{ insertId: id }] }
            if (sql.includes('INSERT INTO venda_itens')) { state.items.push(args); return [{ insertId: state.items.length }] }
            if (sql.includes('FROM usuarios')) return [[{ id: args[0] }]]
            if (sql.includes('INSERT INTO movimentacoes_financeiras')) { state.transactions.push(args); return [{ insertId: state.transactions.length }] }
            throw Error('Unexpected SQL: ' + sql)
        },
        async commit() {
            if (failCommit) throw Error('Simulated commit failure')
            committed = true
            if (loseCommitReply) { loseCommitReply = false; throw Error('Connection lost after commit') }
        },
        async rollback() { if (before && !committed) state = before },
        release() { unlock?.() }
    }
} }
for (const [file, exports] of [
    ['../src/config/db.js', database],
    ['../src/services/financeiroService.js', { calcularResumoFinanceiro: async () => ({ saldo_disponivel: 100 }) }]
]) {
    const filename = path.resolve(__dirname, file)
    require.cache[filename] = { id: filename, filename, loaded: true, exports }
}
const product = require('../src/controllers/produtoController').criar
const purchase = require('../src/controllers/vitrineController').comprar
const finance = require('../src/controllers/financeiroController').criarTransacao
const bodies = {
    '/produto': { titulo: 'Teste', preco: 10, categoria: 'E-book', comissao: 0, capa: 'https://example.test/image', produto_arquivo: 'https://example.test/file' },
    '/compra': { produto_id: 8 },
    '/transacao': { tipo: 'Entrada', descricao: 'Teste', valor: 10 }
}
async function setup(t) {
    reset()
    const app = express(); app.use(express.json())
    app.use((req, res, next) => { req.usuario = { id: Number(req.get('X-User') || 1) }; next() })
    app.post('/produto', product); app.post('/compra', purchase); app.post('/transacao', finance)
    const server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r))
    t.after(() => { server.closeAllConnections(); server.close() })
    return async (route, key = randomUUID(), changes = {}, user = 1) => {
        const headers = { 'Content-Type': 'application/json', 'X-User': String(user) }
        if (key) headers['Idempotency-Key'] = key
        const res = await fetch('http://127.0.0.1:' + server.address().port + route,
            { method: 'POST', headers, body: JSON.stringify({ ...bodies[route], ...changes }) })
        return { status: res.status, body: await res.json() }
    }
}
for (const [route, collection] of [['/produto', 'products'], ['/compra', 'sales'], ['/transacao', 'transactions']]) {
    test(route + ': concurrent requests and retries return one result', async t => {
        const post = await setup(t), key = randomUUID()
        const responses = await Promise.all(Array.from({ length: 8 }, () => post(route, key)))
        for (const response of responses) { assert.equal(response.status, 201); assert.deepEqual(response, responses[0]) }
        assert.equal(state[collection].length, 1)
        assert.deepEqual(await post(route, key), responses[0])
    })
    test(route + ': rollback and lost commit reply never duplicate', async t => {
        const post = await setup(t), key = randomUUID()
        failCommit = true; assert.equal((await post(route, key)).status, 500)
        assert.equal(state[collection].length, 0); assert.equal(Object.keys(state.ops).length, 0)
        failCommit = false; loseCommitReply = true
        assert.equal((await post(route, key)).status, 500); assert.equal(state[collection].length, 1)
        assert.equal((await post(route, key)).status, 201); assert.equal(state[collection].length, 1)
    })
}
test('Missing key, changed payload, and user isolation', async t => {
    const post = await setup(t), key = randomUUID()
    assert.equal((await post('/transacao', null)).status, 400)
    assert.equal(state.transactions.length, 0)
    assert.equal((await post('/transacao', key)).status, 201)
    assert.equal((await post('/transacao', key, { valor: 20 })).status, 409)
    assert.equal(state.transactions.length, 1)
    assert.equal((await post('/transacao', key, {}, 2)).status, 201)
    assert.equal(state.transactions.length, 2)
})
test('Buying owned digital product with distinct keys creates one sale', async t => {
    const post = await setup(t)
    const results = await Promise.all([post('/compra'), post('/compra'), post('/compra')])
    assert.deepEqual(results.map(r => r.status).sort(), [200, 200, 201]); assert.equal(state.sales.length, 1)
    assert.equal(state.items.length, 1)
})
test('Draft publication checks owner/version and records exactly one product', async t => {
    const post = await setup(t), draft = { rascunho_id: draftId, rascunho_versao: 2 }
    assert.equal((await post('/produto', randomUUID(), draft, 2)).status, 404)
    assert.equal((await post('/produto', randomUUID(), { ...draft, rascunho_versao: 1 })).status, 409)
    const first = await post('/produto', randomUUID(), draft)
    const second = await post('/produto', randomUUID(), draft)
    assert.equal(first.status, 201); assert.equal(second.status, 200)
    assert.equal(first.body.id, second.body.id); assert.equal(state.products.length, 1)
    assert.equal(state.draft.produto_publicado_id, first.body.id)
})
