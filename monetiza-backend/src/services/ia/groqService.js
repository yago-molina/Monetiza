const Groq = require('groq-sdk')

let clienteGroq = null

const modelosComJsonEstrito = [
    'openai/gpt-oss-20b',
    'openai/gpt-oss-120b'
]

function suportaFormatoEstrito(modelo) {
    return modelosComJsonEstrito.includes(modelo)
}

function obterConfiguracao() {
    const apiKey = process.env.GROQ_API_KEY
    const modelo =
        process.env.GROQ_MODEL ||
        'openai/gpt-oss-20b'
    const timeout =
        Number(process.env.GROQ_TIMEOUT_MS) ||
        120000
    if (!apiKey) {
        const erro = new Error(
            'A API da Groq não foi configurada.'
        )

        erro.codigo = 'GROQ_NAO_CONFIGURADA'

        throw erro
    }
    return {
        apiKey,
        modelo,
        timeout
    }
}

function obterCliente() {
    if (clienteGroq) {
        return clienteGroq
    }

    const configuracao =
        obterConfiguracao()

    clienteGroq = new Groq({
        apiKey: configuracao.apiKey,
        timeout: configuracao.timeout,
        maxRetries: 2
    })

    return clienteGroq
}

function prepararHistorico(historico) {
    if (!Array.isArray(historico)) {
        return []
    }

    return historico
        .filter((mensagem) => {
            return (
                mensagem &&
                ['user', 'assistant'].includes(
                    mensagem.role
                ) &&
                typeof mensagem.content === 'string'
            )
        })
        .slice(-10)
        .map((mensagem) => ({
            role: mensagem.role,
            content: mensagem.content.slice(0, 12000)
        }))
}

async function gerarTexto({
    systemPrompt,
    mensagem,
    historico = [],
    temperatura = 0.7,
    limiteTokens = 4000,
    formatoResposta = null
}) {
    const cliente = obterCliente()
    const configuracao = obterConfiguracao()

    if (
        formatoResposta?.json_schema?.strict === true &&
        !suportaFormatoEstrito(configuracao.modelo)
    ) {
        const erro = new Error(
            'O modelo configurado não suporta JSON estruturado estrito.'
        )

        erro.codigo = 'GROQ_MODELO_SEM_JSON_ESTRITO'
        throw erro
    }

    const parametros = {
        model: configuracao.modelo,

        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            ...prepararHistorico(historico),
            {
                role: 'user',
                content: mensagem
            }
        ],
        temperature: temperatura,
        max_completion_tokens:
            limiteTokens
    }

    if (formatoResposta) {
        parametros.response_format = formatoResposta
    }

    console.log('Configuração da geração:', {
        modelo: parametros.model,
        limiteTokens: parametros.max_completion_tokens,
        formato: parametros.response_format?.type,
        strict: parametros.response_format?.json_schema?.strict,
        schema: parametros.response_format?.json_schema?.name
    })

    let resposta

        try {
            resposta = await cliente.chat.completions.create(parametros)
        } catch (erro) {
            const detalhe = erro.error?.error || erro.error || {}

            const falhaJson =
                erro.status === 400 &&
                detalhe.code === 'json_validate_failed'

            const ehCapitulo =
                parametros.response_format?.json_schema?.name ===
                'capitulo_monetiza_v1'

            if (!falhaJson || !ehCapitulo) {
                throw erro
            }

            console.warn(
                'Falha no JSON do capítulo. ' +
                'Aguardando 60 segundos antes de uma tentativa alternativa.'
            )

            // Evita repetir imediatamente com a cota de tokens quase esgotada.
            await new Promise(resolve => setTimeout(resolve, 60000))

            const schema =
                parametros.response_format.json_schema.schema

            resposta = await cliente.chat.completions.create({
                ...parametros,

                temperature: 0.2,

                response_format: {
                    type: 'json_object'
                },

                messages: [
                    {
                        role: 'system',
                        content: [
                            systemPrompt,
                            'Retorne exclusivamente um objeto JSON válido.',
                            'Não use blocos de código.',
                            'Preencha os campos seguindo este JSON Schema:',
                            JSON.stringify(schema)
                        ].join('\n\n')
                    },
                    ...parametros.messages.slice(1)
                ]
            })
        }

    const escolha =
    resposta.choices?.[0]

    const mensagemResposta =
        escolha?.message

    const motivoFinalizacao =
        escolha?.finish_reason || null

    if (mensagemResposta?.refusal) {
        const erro = new Error(
            'A IA recusou a geração deste conteúdo.'
        )

        erro.codigo = 'GROQ_CONTEUDO_RECUSADO'
        throw erro
    }

    const conteudo = mensagemResposta?.content

    if (!conteudo) {
        throw new Error(
            'A Groq não retornou uma resposta válida.'
        )
    }

    return {
        conteudo,
        modelo: resposta.model,
        uso: resposta.usage || null,
        motivoFinalizacao
    }
}

async function verificarConexao() {
    const cliente = obterCliente()
    const configuracao = obterConfiguracao()

    const resposta =
        await cliente.models.list()

    const modelos = resposta.data || []

    return {
        disponivel: modelos.some(
            (modelo) =>
                modelo.id === configuracao.modelo
        ),
        modelo: configuracao.modelo,
        suportaProdutosEstruturados:
            suportaFormatoEstrito(
                configuracao.modelo
            )
    }
}

module.exports = {
    gerarTexto,
    verificarConexao,
    suportaFormatoEstrito
}
