const {
    PROMPT_CONSULTOR,
    PROMPT_BUILDER,
    PROMPT_PRODUTO,
    PROMPT_CAPITULO
} = require('../../prompts/produtoPrompt')

const {
    formatoRespostaCapitulo
} = require('../../schemas/capituloIaSchema')

const {
    validarCapituloGerado
} = require(
    '../../validators/capituloIaValidator'
)

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

async function gerarCapitulo({
    produto,
    capitulo
}) {
    const detalhes =
        produto.produto

    const contexto = {
        titulo:
            produto.cadastro.titulo,

        tipo:
            detalhes.tipo_original,

        subtitulo:
            detalhes.subtitulo,

        nicho:
            detalhes.nicho,

        subnicho:
            detalhes.subnicho,

        publico_alvo:
            detalhes.publico_alvo,

        problema_principal:
            detalhes.problema_principal,

        proposta_valor:
            detalhes.proposta_valor,

        promessa_principal:
            detalhes.promessa_principal,

        estrutura_completa:
            detalhes.capitulos,

        capitulo_solicitado:
            capitulo
    }

    const resultado =
        await gerarTexto({
            systemPrompt:
                PROMPT_CAPITULO,

            mensagem:
                JSON.stringify(contexto),

            historico: [],

            temperatura: 0.45,

            limiteTokens:
                Number(
                    process.env
                        .GROQ_MAX_TOKENS_CAPITULO
                ) || 6000,

            formatoResposta:
                formatoRespostaCapitulo
        })

    if (
        resultado.motivoFinalizacao ===
        'length'
    ) {
        const erro = new Error(
            'A geração do capítulo atingiu o limite de tokens.'
        )

        erro.codigo =
            'GROQ_LIMITE_TOKENS'

        throw erro
    }

    let capituloGerado

    try {
        capituloGerado =
            JSON.parse(resultado.conteudo)
    } catch {
        const erro = new Error(
            'A IA retornou um capítulo em formato inválido.'
        )

        erro.codigo =
            'CAPITULO_IA_JSON_INVALIDO'

        throw erro
    }

    return {
        ...resultado,

        conteudo:
            validarCapituloGerado(
                capituloGerado,
                capitulo
            ),

        formato:
            'capitulo_json'
    }
}

module.exports = {
    gerar,
    gerarCapitulo
}
