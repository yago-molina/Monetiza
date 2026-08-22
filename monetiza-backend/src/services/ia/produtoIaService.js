const {
    PROMPT_CONSULTOR,
    PROMPT_BUILDER,
    PROMPT_PRODUTO
} = require('../../prompts/produtoPrompt')

const {
    gerarTexto
} = require('./groqService')

const {
    formatoRespostaProduto
} = require('../../schemas/produtoIaSchema')

const {
    validarProdutoGerado
} = require('../../validators/produtoIaValidator')

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
        temperatura: 0.4,
        limiteTokens:
            Number(process.env.GROQ_MAX_TOKENS) ||
            8000,
        formatoResposta:
            formatoRespostaProduto
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

    const resultado = await gerarTexto({
        systemPrompt: configuracao.prompt,
        mensagem,
        historico,
        temperatura:
            configuracao.temperatura,
        limiteTokens:
            configuracao.limiteTokens,
        formatoResposta:
            configuracao.formatoResposta
    })

    if (
        etapa === 'produto' &&
        resultado.motivoFinalizacao === 'length'
    ) {
        const erro = new Error(
            'A geração atingiu o limite de tokens.'
        )

        erro.codigo = 'GROQ_LIMITE_TOKENS'
        throw erro
    }

    if (etapa !== 'produto') {
        return {
            ...resultado,
            formato: 'markdown'
        }
    }

    let produtoGerado

    try {
        produtoGerado = JSON.parse(
            resultado.conteudo
        )
    } catch {
        const erro = new Error(
            'A IA retornou um produto em formato inválido.'
        )

        erro.codigo = 'PRODUTO_IA_JSON_INVALIDO'
        throw erro
    }

    return {
        ...resultado,
        conteudo:
            validarProdutoGerado(produtoGerado),
        formato: 'produto_json'
    }
}
module.exports = {
    gerar
}
