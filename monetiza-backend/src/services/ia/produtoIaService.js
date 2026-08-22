const {
    PROMPT_CONSULTOR,
    PROMPT_BUILDER,
    PROMPT_PRODUTO
} = require('../../prompts/produtoPrompt')

const {
    gerarTexto
} = require('./groqService')

const configuracoes = {
    consultor: {
        prompt: PROMPT_CONSULTOR,
        temperatura: 0.7,
        limiteTokens: 1800
    },

    promptBuilder: {
        prompt: PROMPT_BUILDER,
        temperatura: 0.6,
        limiteTokens: 4000
    },

    produto: {
        prompt: PROMPT_PRODUTO,
        temperatura: 0.6,
        limiteTokens:
            Number(process.env.GROQ_MAX_TOKENS) ||
            8000
    }
}

async function gerar({
    etapa,
    mensagem,
    historico
}) {
    const configuracao =
        configuracoes[etapa]

    if (!configuracao) {
        throw new Error(
            'Etapa da IA inválida.'
        )
    }

    return gerarTexto({
        systemPrompt: configuracao.prompt,
        mensagem,
        historico:
            etapa === 'consultor'
                ? historico
                : [],
        temperatura:
            configuracao.temperatura,
        limiteTokens:
            configuracao.limiteTokens
    })
}
module.exports = {
    gerar
}