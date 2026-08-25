const schemaCapituloIa = {
    type: 'object',
    additionalProperties: false,
    required: [
        'versao_schema',
        'numero',
        'titulo',
        'introducao',
        'secoes',
        'atividade_pratica',
        'pontos_chave',
        'conclusao'
    ],
    properties: {
        versao_schema: {
            type: 'string',
            enum: ['1.0']
        },

        numero: {
            type: 'integer'
        },

        titulo: {
            type: 'string'
        },

        introducao: {
            type: 'string'
        },

        secoes: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: [
                    'titulo',
                    'conteudo'
                ],
                properties: {
                    titulo: {
                        type: 'string'
                    },

                    conteudo: {
                        type: 'string'
                    }
                }
            }
        },

        atividade_pratica: {
            type: 'string'
        },

        pontos_chave: {
            type: 'array',
            items: {
                type: 'string'
            }
        },

        conclusao: {
            type: 'string'
        }
    }
}

const formatoRespostaCapitulo = {
    type: 'json_schema',

    json_schema: {
        name: 'capitulo_monetiza_v1',
        strict: true,
        schema: schemaCapituloIa
    }
}

module.exports = {
    schemaCapituloIa,
    formatoRespostaCapitulo
}