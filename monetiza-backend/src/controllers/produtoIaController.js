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

const {
    validarProdutoGerado
} = require(
    '../validators/produtoIaValidator'
)

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
                mensagem: mensagem.trim(),
                historico,
                idioma: req.body?.idioma
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
                erro: erro.codigo === 'PRODUTO_IA_INVALIDO'
                    ? erro.message
                    : 'A IA retornou um produto com JSON inválido. Tente novamente.',
                codigo: erro.codigo
            })
        }

        if (erro.codigo === 'GROQ_CONTEUDO_RECUSADO') {
            return res.status(422).json({
                erro:
                    'A IA não pode gerar um produto com esse conteúdo.'
            })
        }


        const detalheGroq =
            erro.error?.error ||
            erro.error ||
            {}

        if (
            erro.status === 413 &&
            detalheGroq.code ===
                'rate_limit_exceeded'
        ) {
            return res.status(429).json({
                erro:
                    'A solicitação ultrapassou o limite de tokens da Groq. Reduza o conteúdo ou tente novamente em alguns instantes.',
                codigo:
                    'GROQ_LIMITE_TPM'
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

const gerarCapitulo = async (req, res) => {
    const comProgresso = req.body?.progresso === true

    function emitir(evento) {
        if (res.destroyed || res.writableEnded) return

        if (!res.headersSent) {
            res.set(
                'Content-Type',
                'application/x-ndjson; charset=utf-8'
            )
            res.set('Cache-Control', 'no-store')
            res.set('X-Accel-Buffering', 'no')
        }

        res.write(JSON.stringify(evento) + '\n')
    }

    function responder(status, dados) {
        if (!comProgresso) {
            return res.status(status).json(dados)
        }

        emitir({
            tipo: 'resultado',
            status,
            dados
        })

        if (!res.destroyed && !res.writableEnded) {
            res.end()
        }
    }

    const {
        produto,
        numero_capitulo
    } = req.body || {}

    if (
        !Number.isInteger(numero_capitulo) ||
        numero_capitulo <= 0
    ) {
        return responder(400, {
            erro: 'Número do capítulo inválido.'
        })
    }

    let produtoValido

    try {
        produtoValido = validarProdutoGerado(produto)
    } catch {
        return responder(400, {
            erro: 'O produto enviado é inválido.'
        })
    }

    const capitulo = produtoValido.produto.capitulos.find(
        item => item.numero === numero_capitulo
    )

    if (!capitulo) {
        return responder(404, {
            erro: 'Capítulo não encontrado no produto.'
        })
    }

    try {
        const resultado = await produtoIaService.gerarCapitulo({
            produto: produtoValido,
            capitulo,
            idioma: req.body?.idioma,

            onProgress: comProgresso
                ? etapa => emitir({
                    tipo: 'progresso',
                    etapa
                })
                : undefined
        })

        return responder(200, {
            etapa: 'capitulo',
            formato: resultado.formato,
            resposta: resultado.conteudo,
            modelo: resultado.modelo,
            uso: resultado.uso,
            motivo_finalizacao: resultado.motivoFinalizacao
        })
    } catch (erro) {
        console.error('Erro ao gerar capítulo:', erro)

        const detalhe = erro.error?.error || erro.error || {}

        if (
            erro.status === 429 ||
            (
                erro.status === 413 &&
                detalhe.code === 'rate_limit_exceeded'
            )
        ) {
            return responder(429, {
                erro: 'Limite da IA atingido. Aguarde e tente novamente.'
            })
        }

        if (erro.codigo === 'GROQ_MODELO_SEM_JSON_ESTRITO') {
            return responder(503, {
                erro: 'O modelo configurado não suporta a geração estruturada de capítulos.'
            })
        }

        if (erro.codigo === 'GROQ_LIMITE_TOKENS') {
            return responder(502, {
                erro: 'O capítulo atingiu o limite de conteúdo. Tente novamente.',
                motivo_finalizacao: 'length'
            })
        }

        if (
            [
                'CAPITULO_IA_INVALIDO',
                'CAPITULO_IA_JSON_INVALIDO'
            ].includes(erro.codigo)
        ) {
            return responder(502, {
                erro: erro.codigo === 'CAPITULO_IA_INVALIDO'
                    ? erro.message
                    : 'A IA retornou um capítulo com JSON inválido. Tente novamente.',

                codigo: erro.codigo
            })
        }

        if (erro.codigo === 'GROQ_CONTEUDO_RECUSADO') {
            return responder(422, {
                erro: 'A IA não pode gerar esse conteúdo.'
            })
        }

        return responder(503, {
            erro: 'Não foi possível gerar o capítulo neste momento.'
        })
    }
}

module.exports = {
    status,
    gerar,
    gerarCapitulo
}