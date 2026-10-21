const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const express = require('express')
const jwt = require('jsonwebtoken')
process.env.JWT_SECRET = 'segredo-exclusivo-deste-teste'
const arquivo = '33333333-3333-4333-8333-333333333333'
let pago = true
const dbPath = require.resolve('../src/config/db')
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: {
    query: async (sql, params) => {
        if (sql.includes('FROM cursos c JOIN produtos')) return [[{
            produto_id: 1, usuario_id: 10, titulo: 'Curso', versao: 1,
            comprado: pago && Number(params[0]) === 20 ? 1 : 0,
            estrutura: [{ titulo: 'Módulo', aulas: [{ id: 'aula', video: arquivo }] }]
        }]]
        if (sql.includes('FROM curso_progresso')) return [[]]
        if (sql.includes('FROM curso_arquivos')) return params[0] === arquivo ? [[{ id: arquivo, tipo: 'video' }]] : [[]]
        throw new Error('SQL inesperado no teste')
    }
} }
test('rotas protegem dados, uploads e intervalos de vídeo', async t => {
    const app = express()
    app.use(express.json())
    app.use('/api/cursos', require('../src/routes/cursoRoutes'))
    const server = app.listen(0, '127.0.0.1')
    await new Promise(resolve => server.once('listening', resolve))
    const base = `http://127.0.0.1:${server.address().port}/api/cursos/1`
    const token = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5m' })
    const headers = id => ({ Authorization: `Bearer ${token(id)}` })
    const pasta = path.join(__dirname, '../src/private/uploads/cursos')
    await fs.mkdir(pasta, { recursive: true })
    await fs.writeFile(path.join(pasta, arquivo + '.mp4'), '0123456789')
    t.after(async () => {
        await fs.unlink(path.join(pasta, arquivo + '.mp4'))
        server.closeAllConnections()
        await new Promise(resolve => server.close(resolve))
    })
    assert.equal((await fetch(base)).status, 401)
    assert.equal((await fetch(base, { headers: headers(30) })).status, 404)
    assert.equal((await fetch(base, { headers: headers(20) })).status, 200)
    assert.equal((await fetch(base + '/arquivos/video', { method: 'POST', headers: headers(20) })).status, 403)
    assert.equal((await fetch(base + '/midia/' + arquivo)).status, 401)
    const sessao = await fetch(base + '/sessao', { method: 'POST', headers: headers(20) })
    assert.match(sessao.headers.get('set-cookie'), /HttpOnly/)
    const cookie = sessao.headers.get('set-cookie').split(';')[0]
    const video = await fetch(base + '/midia/' + arquivo, { headers: { Cookie: cookie, Range: 'bytes=2-5' } })
    assert.equal(video.status, 206)
    assert.equal(await video.text(), '2345')
    pago = false
    assert.equal((await fetch(base + '/midia/' + arquivo, { headers: { Cookie: cookie } })).status, 404)
    pago = true
})
