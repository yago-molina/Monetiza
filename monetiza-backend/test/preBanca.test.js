const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const { migrar } = require('../scripts/migrar-pdfs')
const { notificar, notificarSemBloquear } = require('../src/services/notificacaoService')

test('migração de PDFs preserva bytes, é repetível e recusa sobrescrever divergência', async t => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), 'monetiza-pdf-'))
    t.after(() => fs.rm(base, { recursive: true, force: true }))
    const origem = path.join(base, 'publico'), destino = path.join(base, 'privado')
    await fs.mkdir(origem)
    const nome = '1-11111111-1111-4111-8111-111111111111.pdf'
    await fs.writeFile(path.join(origem, nome), '%PDF-1.4 teste')
    await migrar({ origem, destino })
    assert.equal(await fs.readFile(path.join(destino, nome), 'utf8'), '%PDF-1.4 teste')
    await assert.rejects(fs.stat(path.join(origem, nome)), { code: 'ENOENT' })
    await migrar({ origem, destino })
    await fs.writeFile(path.join(origem, nome), '%PDF-1.4 diferente')
    await assert.rejects(migrar({ origem, destino }), /divergente/)
    assert.equal(await fs.readFile(path.join(origem, nome), 'utf8'), '%PDF-1.4 diferente')
    assert.equal(await fs.readFile(path.join(destino, nome), 'utf8'), '%PDF-1.4 teste')
})

test('capa enviada como arquivo pode ser publicada e reaberta no editor', async () => {
    const codigo = await fs.readFile(path.join(__dirname, '../src/public/js/ia-produtos.js'), 'utf8')
    const inicio = codigo.indexOf('async function enviarCapaIa(')
    const fim = codigo.indexOf('\n\nfunction exigirProduto', inicio)
    const executar = new Function('fetch', 'localStorage', 'FormData', 'window', 'respostaAutenticada',
        codigo.slice(inicio, fim) + '; return enviarCapaIa;')
    const relativo = '/uploads/capas/11111111-1111-4111-8111-111111111111.webp'
    const window = { location: { origin: 'http://localhost:3000' }, i18n: { t: x => x } }
    const enviar = executar(async () => ({ ok: true, json: async () => ({ capa: relativo }) }),
        { getItem: () => 'token' }, class { append() {} }, window, r => { assert(r.ok) })
    const capa = await enviar({ type: 'image/png', size: 100 })
    assert.equal(capa, window.location.origin + relativo)
    const a = codigo.indexOf('        for (const endereco of [capa, pdfPublicado])')
    const b = codigo.indexOf('        botaoPublicarProduto.disabled = true', a)
    const validar = new Function('capa', 'pdfPublicado', 'window', codigo.slice(a, b))
    const pdf = 'http://localhost:3000/uploads/produtos/teste.pdf'
    assert.doesNotThrow(() => validar(capa, pdf, window))
    assert.doesNotThrow(() => validar(relativo, pdf, window))
    assert.throws(() => validar('javascript:alert(1)', pdf, window))
    await assert.rejects(enviar({ type: 'text/html', size: 1 }), /PNG/)
    await assert.rejects(enviar({ type: 'image/png', size: 6 * 1024 ** 2 }), /5 MB/)
})

test('notificações usam preferências por tipo e não aceitam links externos', async () => {
    const colunas = { Venda: 'vendas', Comissao: 'comissoes', Mensagem: 'mensagens', Contrato: 'contratos', Afiliacao: 'afiliacoes' }
    for (const [tipo, coluna] of Object.entries(colunas)) {
        let chamadas = 0
        const db = { query: async (sql, args) => {
            chamadas++
            assert(sql.includes(`COALESCE(pn.notificar_${coluna}, 1) = 1`))
            assert(sql.includes('LEFT JOIN preferencias_notificacao'))
            assert.deepEqual(args, [7, tipo, 'Aviso', 'Texto', '/contratos', 7])
            return [{ affectedRows: 0 }]
        } }
        assert.equal(await notificar(db, { usuarioId: 7, tipo, titulo: 'Aviso', mensagem: 'Texto', link: '/contratos' }), false)
        assert.equal(chamadas, 1)
        await assert.rejects(notificar(db, { usuarioId: 7, tipo, link: '//externo.test' }), /Link/)
        assert.equal(chamadas, 1)
    }
    const indisponivel = { query: async () => { throw Object.assign(new Error('Falha de teste'), { code: 'TESTE' }) } }
    const dados = { usuarioId: 7, tipo: 'Mensagem', titulo: 'Aviso', mensagem: 'Texto', link: '/mensagens' }
    await assert.rejects(notificar(indisponivel, dados), /Falha de teste/)
    assert.equal(await notificarSemBloquear(indisponivel, dados), false)
})
