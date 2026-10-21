const categoriasProduto = [
    'Curso',
    'E-book',
    'Template',
    'Software / SaaS',
    'Mentoria'
]

const schemaProdutoIa = {
    type: 'object',
    additionalProperties: false,
    required: [
        'versao_schema',
        'cadastro',
        'produto',
        'criativos'
    ],
    properties: {
        versao_schema: {
            type: 'string',
            enum: ['1.0']
        },
        cadastro: {
            type: 'object',
            additionalProperties: false,
            required: [
                'titulo',
                'descricao_curta',
                'descricao_completa',
                'categoria',
                'preco',
                'comissao'
            ],
            properties: {
                titulo: {
                    type: 'string'
                },
                descricao_curta: {
                    type: 'string'
                },
                descricao_completa: {
                    type: 'string'
                },
                categoria: {
                    type: 'string',
                    enum: categoriasProduto
                },
                preco: {
                    type: 'number',
                    minimum: 0.01,
                    maximum: 99999999.99
                },
                comissao: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100
                }
            }
        },
        produto: {
            type: 'object',
            additionalProperties: false,
            required: [
                'tipo_original',
                'subtitulo',
                'nicho',
                'subnicho',
                'publico_alvo',
                'problema_principal',
                'proposta_valor',
                'promessa_principal',
                'beneficios',
                'diferenciais',
                'capitulos',
                'bonus',
                'tags'
            ],
            properties: {
                tipo_original: { type: 'string' },
                subtitulo: { type: 'string' },
                nicho: { type: 'string' },
                subnicho: { type: 'string' },
                publico_alvo: { type: 'string' },
                problema_principal: { type: 'string' },
                proposta_valor: { type: 'string' },
                promessa_principal: { type: 'string' },
                beneficios: {
                    type: 'array',
                    items: { type: 'string' }
                },
                diferenciais: {
                    type: 'array',
                    items: { type: 'string' }
                },
                capitulos: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        required: [
                            'numero',
                            'titulo',
                            'objetivo',
                            'resumo'
                        ],
                        properties: {
                            numero: { type: 'integer' },
                            titulo: { type: 'string' },
                            objetivo: { type: 'string' },
                            resumo: { type: 'string' }
                        }
                    }
                },
                bonus: {
                    type: 'array',
                    items: { type: 'string' }
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        },
        criativos: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: [
                    'canal',
                    'formato',
                    'headline',
                    'copy',
                    'cta',
                    'prompt_imagem'
                ],
                properties: {
                    canal: { type: 'string' },
                    formato: { type: 'string' },
                    headline: { type: 'string' },
                    copy: { type: 'string' },
                    cta: { type: 'string' },
                    prompt_imagem: { type: 'string' }
                }
            }
        }
    }
}

const formatoRespostaProduto = {
    type: 'json_schema',
    json_schema: {
        name: 'produto_monetiza_v1',
        strict: true,
        schema: schemaProdutoIa
    }
}

module.exports = {
    categoriasProduto,
    schemaProdutoIa,
    formatoRespostaProduto
}
