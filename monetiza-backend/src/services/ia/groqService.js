const Groq = require('groq-sdk')

let clienteGroq = null

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
    limiteTokens = 4000
}) {
    const cliente = obterCliente()
    const configuracao = obterConfiguracao()

    const resposta =
        await cliente.chat.completions.create({
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
        })

    const conteudo =
        resposta.choices?.[0]?.message?.content

    if (!conteudo) {
        throw new Error(
            'A Groq não retornou uma resposta válida.'
        )
    }

    return {
        conteudo,
        modelo: resposta.model,
        uso: resposta.usage || null
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
        modelo: configuracao.modelo
    }
}

module.exports = {
    gerarTexto,
    verificarConexao
}