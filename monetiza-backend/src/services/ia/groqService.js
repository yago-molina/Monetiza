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

    const resposta =
        await cliente.chat.completions.create(
            parametros
        )

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
