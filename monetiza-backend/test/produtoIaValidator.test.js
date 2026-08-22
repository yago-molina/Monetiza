const test = require('node:test')
const assert = require('node:assert/strict')

const {
    validarProdutoGerado
} = require('../src/validators/produtoIaValidator')

const {
    schemaProdutoIa
} = require('../src/schemas/produtoIaSchema')

function criarProdutoValido({
    titulo = 'Produto de teste',
    categoria = 'E-book',
    tipoOriginal = 'Guia digital'
} = {}) {
    return {
        versao_schema: '1.0',
        cadastro: {
            titulo,
            descricao_curta: 'Descrição curta do produto.',
            descricao_completa: 'Descrição completa e comercial do produto.',
            categoria,
            preco: 49.9,
            comissao: 40
        },
        produto: {
            tipo_original: tipoOriginal,
            subtitulo: 'Uma transformação clara e realista',
            nicho: 'Educação',
            subnicho: 'Aprendizado prático',
            publico_alvo: 'Pessoas iniciantes no assunto',
            problema_principal: 'Falta de um caminho organizado',
            proposta_valor: 'Ensino direto, organizado e aplicável',
            promessa_principal: 'Ajudar o aluno a avançar com clareza',
            beneficios: ['Conteúdo organizado', 'Aplicação prática'],
            diferenciais: ['Linguagem simples'],
            capitulos: [
                {
                    numero: 1,
                    titulo: 'Primeiros passos',
                    objetivo: 'Apresentar os fundamentos',
                    resumo: 'Visão geral dos conceitos essenciais.'
                }
            ],
            bonus: [],
            tags: ['educação', 'guia']
        },
        criativos: [
            {
                canal: 'Instagram',
                formato: 'Reels',
                headline: 'Comece do jeito certo',
                copy: 'Conheça um caminho mais organizado.',
                cta: 'Saiba mais',
                prompt_imagem: 'Pessoa estudando em uma mesa organizada'
            },
            {
                canal: 'TikTok',
                formato: 'Vídeo curto',
                headline: 'Você está começando agora?',
                copy: 'Veja como aprender seguindo uma estrutura simples.',
                cta: 'Conheça o produto',
                prompt_imagem: 'Pessoa aprendendo com um guia digital'
            },
            {
                canal: 'Instagram',
                formato: 'Carrossel',
                headline: 'Um caminho simples para começar',
                copy: 'Descubra os primeiros passos para avançar.',
                cta: 'Acesse agora',
                prompt_imagem: 'Mesa moderna com tablet exibindo produto digital'
            }
        ]
    }
}

const cenarios = [
    ['fitness', 'E-book', 'Guia digital'],
    ['finanças', 'Template', 'Planilha'],
    ['idiomas', 'Curso', 'Treinamento online'],
    ['produtividade', 'Software / SaaS', 'Aplicativo'],
    ['carreira', 'Mentoria', 'Acompanhamento individual']
]

cenarios.forEach(([nicho, categoria, tipoOriginal]) => {
    test(`aceita um produto válido de ${nicho}`, () => {
        const produto = criarProdutoValido({
            titulo: `Produto de ${nicho}`,
            categoria,
            tipoOriginal
        })

        assert.equal(
            validarProdutoGerado(produto),
            produto
        )
    })
})

test('rejeita produto com menos de 3 criativos', () => {
    const produto = criarProdutoValido()

    produto.criativos =
        produto.criativos.slice(0, 2)

    assert.throws(
        () => validarProdutoGerado(produto),
        /entre 3 e 5 ideias de criativos/i
    )
})

test('rejeita categoria incompatível com o banco', () => {
    const produto = criarProdutoValido({
        categoria: 'Planner'
    })

    assert.throws(
        () => validarProdutoGerado(produto),
        /categoria gerada não existe/i
    )
})

test('rejeita título maior que o limite do banco', () => {
    const produto = criarProdutoValido({
        titulo: 'A'.repeat(101)
    })

    assert.throws(
        () => validarProdutoGerado(produto),
        /titulo ultrapassou/i
    )
})

test('rejeita preço inválido', () => {
    const produto = criarProdutoValido()
    produto.cadastro.preco = 0

    assert.throws(
        () => validarProdutoGerado(produto),
        /preço sugerido/i
    )
})

test('rejeita comissão acima de 100', () => {
    const produto = criarProdutoValido()
    produto.cadastro.comissao = 120

    assert.throws(
        () => validarProdutoGerado(produto),
        /comissão sugerida/i
    )
})

test('rejeita capítulos fora de ordem', () => {
    const produto = criarProdutoValido()
    produto.produto.capitulos[0].numero = 2

    assert.throws(
        () => validarProdutoGerado(produto),
        /numeração dos capítulos/i
    )
})

test('todos os objetos do schema estrito são fechados e obrigatórios', () => {
    function conferirSchema(schema) {
        if (schema.type === 'object') {
            assert.equal(schema.additionalProperties, false)
            assert.deepEqual(
                [...schema.required].sort(),
                Object.keys(schema.properties).sort()
            )

            Object.values(schema.properties)
                .forEach(conferirSchema)
        }

        if (schema.type === 'array') {
            conferirSchema(schema.items)
        }
    }

    conferirSchema(schemaProdutoIa)
})
