const test = require('node:test')
const assert = require('node:assert/strict')

const {
    suportaFormatoEstrito
} = require('../src/services/ia/groqService')

test('aceita os modelos Groq compatíveis com JSON estrito', () => {
    assert.equal(
        suportaFormatoEstrito('openai/gpt-oss-20b'),
        true
    )
    assert.equal(
        suportaFormatoEstrito('openai/gpt-oss-120b'),
        true
    )
})

test('rejeita modelo sem suporte ao JSON estrito', () => {
    assert.equal(
        suportaFormatoEstrito('llama-3.3-70b-versatile'),
        false
    )
})
