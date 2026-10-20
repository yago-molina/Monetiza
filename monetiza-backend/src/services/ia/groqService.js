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
    formatoResposta = null,
    onProgress = () => {}
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

    const ehCapitulo =
        parametros.response_format?.json_schema?.name ===
        'capitulo_monetiza_v1'

    const maxTentativas = ehCapitulo ? 3 : 1

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
        const recuperando = tentativa > 1

        const parametrosTentativa = {
            ...parametros,

            // Mantém json_schema e strict: true em todas as tentativas.
            temperature: ehCapitulo ? 0.2 : parametros.temperature,

            messages: recuperando
                ? [
                    {
                        role: 'system',
                        content: [
                            systemPrompt,
                            'A tentativa anterior falhou na formatação do JSON.',
                            'Gere novamente somente o capítulo solicitado.',
                            'Respeite exatamente o JSON Schema da resposta.',
                            'Use aspas duplas ASCII como delimitadores JSON.',
                            'Escape aspas duplas que aparecerem dentro dos textos.',
                            'Não acrescente chaves extras, Markdown ou comentários.',
                            'Mantenha a política de idioma e todas as regras de conteúdo.'
                        ].join('\n\n')
                    },
                    ...parametros.messages.slice(1)
                ]
                : parametros.messages
        }

        try {
            resposta = await cliente.chat.completions.create(
                parametrosTentativa,
                ehCapitulo ? { maxRetries: 0 } : {}
            )

            break
        } catch (erro) {
            const detalhe =
                erro.error?.error ||
                erro.error ||
                {}

            const falhaJson =
                erro.status === 400 &&
                detalhe.code === 'json_validate_failed'

            // Não trata autenticação, limite de uso ou outros erros
            // como se fossem uma falha de formatação.
            if (!ehCapitulo || !falhaJson) {
                throw erro
            }

            console.warn('Falha de JSON na geração do capítulo:', {
                tentativa,
                maxTentativas,
                modelo: parametrosTentativa.model,
                formato: parametrosTentativa.response_format?.type,
                strict:
                    parametrosTentativa.response_format?.json_schema?.strict
            })

            if (tentativa === maxTentativas) {
                const falha = new Error(
                    'Não foi possível gerar um capítulo válido após três tentativas. ' +
                    'Os capítulos concluídos foram mantidos. ' +
                    'Clique novamente em Gerar PDF para continuar.'
                )

                falha.codigo = 'CAPITULO_IA_INVALIDO'
                throw falha
            }

            onProgress('recuperando')

            // Pequena pausa entre tentativas, sem esperar um minuto.
            await new Promise(resolve => {
                setTimeout(resolve, tentativa * 1000)
            })

            onProgress('retomando')
        }
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
