const { test } = require('node:test')
const assert = require('node:assert/strict')
const { validarEstrutura } = require('../src/services/cursoValidacao')
const aula = '11111111-1111-4111-8111-111111111111'
const video = '22222222-2222-4222-8222-222222222222'
const modulos = id => [{ titulo: 'Módulo', aulas: [{ id: aula, titulo: 'Aula', video: id }] }]
test('não publica curso sem aulas ou sem vídeo', () => {
    assert.throws(() => validarEstrutura([], [], true))
    assert.throws(() => validarEstrutura(modulos(null), [], true))
})
test('aceita rascunho e rejeita arquivo de outro curso', () => {
    assert.equal(validarEstrutura(modulos(null), [], false).length, 1)
    assert.throws(() => validarEstrutura(modulos(video), [], true))
})
test('material PDF não pode ocupar o lugar do vídeo', () => {
    assert.throws(() => validarEstrutura(modulos(video), [{ id: video, tipo: 'material' }], true))
    assert.equal(validarEstrutura(modulos(video), [{ id: video, tipo: 'video' }], true)[0].aulas[0].video, video)
})
test('rejeita IDs de aulas duplicados', () => {
    assert.throws(() => validarEstrutura([...modulos(null), ...modulos(null)], [], false))
})
