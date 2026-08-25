const test = require('node:test')
const assert = require('node:assert/strict')

const {
    validarCapituloGerado
} = require(
    '../src/validators/capituloIaValidator'
)

function criarCapitulo() {
    return {
        versao_schema: '1.0',
        numero: 1,
        titulo: 'Primeiros passos',
        introducao:
            'Introdução completa do capítulo.',

        secoes: [
            {
                titulo: 'Preparação',
                conteudo:
                    'Conteúdo completo da preparação.'
            },
            {
                titulo: 'Aplicação',
                conteudo:
                    'Conteúdo completo da aplicação.'
            },
            {
                titulo: 'Evolução',
                conteudo:
                    'Conteúdo completo da evolução.'
            }
        ],

        atividade_pratica:
            'Realize a atividade apresentada.',

        pontos_chave: [
            'Primeiro ponto',
            'Segundo ponto',
            'Terceiro ponto'
        ],

        conclusao:
            'Conclusão completa do capítulo.'
    }
}

const capituloEsperado = {
    numero: 1,
    titulo: 'Primeiros passos',
    objetivo: 'Apresentar os fundamentos',
    resumo: 'Resumo do capítulo'
}

test('aceita capítulo válido', () => {
    const capitulo = criarCapitulo()

    assert.equal(
        validarCapituloGerado(
            capitulo,
            capituloEsperado
        ),
        capitulo
    )
})

test('rejeita número de capítulo incorreto', () => {
    const capitulo = criarCapitulo()
    capitulo.numero = 2

    assert.throws(
        () => validarCapituloGerado(
            capitulo,
            capituloEsperado
        ),
        /número do capítulo/i
    )
})

test('rejeita capítulo com menos de 3 seções', () => {
    const capitulo = criarCapitulo()

    capitulo.secoes =
        capitulo.secoes.slice(0, 2)

    assert.throws(
        () => validarCapituloGerado(
            capitulo,
            capituloEsperado
        ),
        /entre 3 e 6 seções/i
    )
})

test('rejeita capítulo com poucos pontos-chave', () => {
    const capitulo = criarCapitulo()

    capitulo.pontos_chave = [
        'Primeiro ponto'
    ]

    assert.throws(
        () => validarCapituloGerado(
            capitulo,
            capituloEsperado
        ),
        /entre 3 e 8 pontos-chave/i
    )
})