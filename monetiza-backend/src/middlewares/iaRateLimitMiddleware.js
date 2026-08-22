const usosPorUsuario = new Map()
const usuariosGerando = new Set()

function numeroConfigurado(nome, padrao) {
    const valor = Number(process.env[nome])

    if (
        !Number.isInteger(valor) ||
        valor <= 0
    ) {
        return padrao
    }

    return valor
}

function obterLimite(etapa) {
    const limites = {
        consultor: numeroConfigurado(
            'IA_LIMITE_CONSULTOR',
            20
        ),

        promptBuilder: numeroConfigurado(
            'IA_LIMITE_PROMPT_BUILDER',
            10
        ),

        produto: numeroConfigurado(
            'IA_LIMITE_PRODUTO',
            5
        )
    }

    return limites[etapa] || 5
}

function limparRegistrosExpirados(agora) {
    if (usosPorUsuario.size < 1000) {
        return
    }

    usosPorUsuario.forEach(
        (registro, chave) => {
            if (agora >= registro.expiraEm) {
                usosPorUsuario.delete(chave)
            }
        }
    )
}

function limitarUsoIa(req, res, next) {
    const usuarioId = req.usuario?.id
    const etapa = req.body?.etapa

    if (!usuarioId) {
        return res.status(401).json({
            erro: 'Usuário não autenticado.'
        })
    }

    const agora = Date.now()

    const janelaMs = numeroConfigurado(
        'IA_LIMITE_JANELA_MS',
        600000
    )

    const limite = obterLimite(etapa)

    const chave =
        `${usuarioId}:${etapa}`

    limparRegistrosExpirados(agora)

    let registro =
        usosPorUsuario.get(chave)

    if (
        !registro ||
        agora >= registro.expiraEm
    ) {
        registro = {
            quantidade: 0,
            expiraEm: agora + janelaMs
        }
    }

    const segundosRestantes = Math.max(
        1,
        Math.ceil(
            (registro.expiraEm - agora) /
            1000
        )
    )

    if (registro.quantidade >= limite) {
        res.set(
            'Retry-After',
            String(segundosRestantes)
        )

        res.set(
            'X-RateLimit-Limit',
            String(limite)
        )

        res.set(
            'X-RateLimit-Remaining',
            '0'
        )

        return res.status(429).json({
            erro:
                'Limite de uso da IA atingido. Aguarde antes de tentar novamente.',
            tentar_novamente_em:
                segundosRestantes
        })
    }

    registro.quantidade += 1

    usosPorUsuario.set(
        chave,
        registro
    )

    res.set(
        'X-RateLimit-Limit',
        String(limite)
    )

    res.set(
        'X-RateLimit-Remaining',
        String(
            limite - registro.quantidade
        )
    )

    next()
}

function impedirGeracoesSimultaneas(
    req,
    res,
    next
) {
    const usuarioId =
        String(req.usuario?.id)

    if (usuariosGerando.has(usuarioId)) {
        return res.status(429).json({
            erro:
                'Você já possui uma geração em andamento.'
        })
    }

    usuariosGerando.add(usuarioId)

    let liberado = false

    function liberarUsuario() {
        if (liberado) {
            return
        }

        liberado = true

        usuariosGerando.delete(usuarioId)
    }

    res.once('finish', liberarUsuario)
    res.once('close', liberarUsuario)

    next()
}

module.exports = {
    limitarUsoIa,
    impedirGeracoesSimultaneas
}