const produtoIaService =
    require('../services/ia/produtoIaService')

const {
    verificarConexao
} = require('../services/ia/groqService')

const etapasPermitidas = [
    'consultor',
    'promptBuilder',
    'produto'
]

const status = async (req, res) => {
    try {
        const resultado =
            await verificarConexao()

        if (!resultado.disponivel) {
            return res.status(503).json({
                erro:
                    'O modelo configurado não está disponível.',
                modelo: resultado.modelo
            })
        }

        if (!resultado.suportaProdutosEstruturados) {
            return res.status(503).json({
                erro:
                    'O modelo configurado não suporta a geração estruturada de produtos.',
                modelo: resultado.modelo
            })
        }

        res.json({
            mensagem:
                'Groq conectada com sucesso.',
            ...resultado
        })
    } catch (erro) {
        console.error(
            'Erro ao verificar Groq:',
            erro.message
        )

        res.status(503).json({
            erro:
                'Não foi possível conectar à Groq.'
        })
    }
}

const gerar = async (req, res) => {
    const {
        etapa,
        mensagem,
        historico = []
    } = req.body

    if (!etapasPermitidas.includes(etapa)) {
        return res.status(400).json({
            erro: 'Etapa da IA inválida.'
        })
    }

    if (
        typeof mensagem !== 'string' ||
        mensagem.trim() === ''
    ) {
        return res.status(400).json({
            erro: 'Digite uma mensagem.'
        })
    }

    if (mensagem.length > 20000) {
        return res.status(400).json({
            erro:
                'A mensagem ultrapassou o limite permitido.'
        })
    }

    if (
        !Array.isArray(historico) ||
        historico.length > 20
    ) {
        return res.status(400).json({
            erro:
                'O histórico enviado é inválido.'
        })
    }

    try {
        const resultado =
            await produtoIaService.gerar({
                etapa,
                mensagem:
                    mensagem.trim(),
                historico
            })

        res.json({
        etapa,
        formato: resultado.formato,
        resposta: resultado.conteudo,
        modelo: resultado.modelo,
        uso: resultado.uso,
        motivo_finalizacao:
        resultado.motivoFinalizacao
        })
    } catch (erro) {
        console.error(
            'Erro na IA de produtos:',
            erro
        )

        if (erro.status === 429) {
            return res.status(429).json({
                erro:
                    'Limite da Groq atingido. Aguarde um pouco e tente novamente.'
            })
        }

        if (
            erro.codigo === 'PRODUTO_IA_INVALIDO' ||
            erro.codigo === 'PRODUTO_IA_JSON_INVALIDO'
        ) {
            return res.status(502).json({
                erro:
                    'A IA não conseguiu montar um produto válido. Tente gerar novamente.'
            })
        }

        if (erro.codigo === 'GROQ_CONTEUDO_RECUSADO') {
            return res.status(422).json({
                erro:
                    'A IA não pode gerar um produto com esse conteúdo.'
            })
        }

        if (
            erro.codigo ===
            'GROQ_MODELO_SEM_JSON_ESTRITO'
        ) {
            return res.status(503).json({
                erro:
                    'O modelo configurado não suporta produtos estruturados.'
            })
        }

        if (erro.codigo === 'GROQ_LIMITE_TOKENS') {
            return res.status(502).json({
                erro:
                'A geração atingiu o limite de conteúdo. Tente novamente.',
            motivo_finalizacao: 'length'
            })
        }
        res.status(503).json({
            erro:
                'Não foi possível gerar o conteúdo neste momento.'
        })
    }
}
module.exports = {
    status,
    gerar
}
