const systemPrompt = require('../../prompts/rubyPrompt')
const { criarConsultaContexto } = require('./rubyContexto')

class ErroRuby extends Error {
    constructor(status, mensagem, retryAfter) {
        super(mensagem)

        this.status = status
        this.retryAfter = retryAfter
    }
}

function criarServicoRuby({
    fetchImpl = globalThis.fetch,
    env = process.env,
    agora = Date.now,
    timeoutMs = 45000,
    consultarContexto = criarConsultaContexto()
} = {}) {
    const usuarios = new Map()

    const MINUTO = 60000
    const DIA = 86400000
    const TTL = 1800000

    let simultaneas = 0
    let pausaAte = 0

    function registro(usuarioId) {
        const tempo = agora()

        for (const [id, item] of usuarios) {
            if (!item.ocupado && tempo >= item.diaAte) {
                usuarios.delete(id)
            }
        }

        const id = String(usuarioId)

        let item = usuarios.get(id)

        if (!item) {
            if (usuarios.size >= 2000) {
                throw new ErroRuby(
                    503,
                    'A Ruby está ocupada. Tente mais tarde.'
                )
            }

            item = {
                historico: [],
                ocupado: false,
                ultimoUso: tempo,
                minutoAte: tempo + MINUTO,
                minuto: 0,
                diaAte: tempo + DIA,
                dia: 0
            }

            usuarios.set(id, item)
        }

        if (!item.ocupado && tempo - item.ultimoUso >= TTL) {
            item.historico = []
        }

        item.ultimoUso = tempo

        return item
    }

    function configuracao() {
        return {
            apiKey: (
                env.RUBY_GROQ_API_KEY ||
                env.GROQ_API_KEY ||
                ''
            ).trim(),

            modelo: (
                env.RUBY_GROQ_MODEL ||
                env.GROQ_MODEL ||
                ''
            ).trim()
        }
    }

    function historico(id) {
        const item = registro(id)
        const config = configuracao()

        return {
            history: item.historico.map(mensagem => ({
                ...mensagem
            })),

            configured: Boolean(
                config.apiKey && config.modelo
            )
        }
    }

    function limpar(id) {
        const item = registro(id)

        if (item.ocupado) {
            throw new ErroRuby(
                409,
                'Aguarde a resposta antes de iniciar outra conversa.'
            )
        }

        // Limpar a conversa não renova a cota.
        item.historico = []
    }

    async function responder(id, mensagem, signal) {
        if (
            typeof mensagem !== 'string' ||
            !mensagem.trim() ||
            mensagem.length > 2000
        ) {
            throw new ErroRuby(
                400,
                'Escreva uma mensagem de 1 a 2.000 caracteres.'
            )
        }

        const { apiKey, modelo } = configuracao()

        if (!apiKey || !modelo) {
            throw new ErroRuby(
                503,
                'A Ruby ainda não foi configurada no servidor.'
            )
        }

        const item = registro(id)
        const tempo = agora()

        if (tempo < pausaAte) {
            throw new ErroRuby(
                429,
                'A IA atingiu um limite de uso. Aguarde para tentar novamente.',
                Math.max(
                    1,
                    Math.ceil((pausaAte - tempo) / 1000)
                )
            )
        }

        if (item.ocupado || simultaneas >= 4) {
            throw new ErroRuby(
                429,
                'Há uma resposta em andamento. Aguarde alguns segundos.',
                5
            )
        }

        if (tempo >= item.minutoAte) {
            item.minuto = 0
            item.minutoAte = tempo + MINUTO
        }

        if (item.minuto >= 10 || item.dia >= 100) {
            const fim = item.dia >= 100
                ? item.diaAte
                : item.minutoAte

            throw new ErroRuby(
                429,
                item.dia >= 100
                    ? 'Você atingiu o limite de mensagens da Ruby nesta janela de 24 horas.'
                    : 'Muitas mensagens. Aguarde um minuto para continuar.',
                Math.max(
                    1,
                    Math.ceil((fim - tempo) / 1000)
                )
            )
        }

        item.minuto++
        item.dia++
        item.ocupado = true
        simultaneas++

        const abort = new AbortController()
        const cancelar = () => abort.abort()

        if (signal?.aborted) {
            cancelar()
        }

        signal?.addEventListener(
            'abort',
            cancelar,
            { once: true }
        )

        const timer = setTimeout(
            cancelar,
            timeoutMs
        )

        try {
            let contexto
            try {
                contexto = await consultarContexto(id, mensagem)
            } catch {
                contexto = { consultado: false, motivo: 'Consulta indisponível' }
            }
            if (abort.signal.aborted) throw new Error('Requisição cancelada')
            const resposta = await fetchImpl(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    method: 'POST',

                    signal: abort.signal,

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`
                    },

                    body: JSON.stringify({
                        model: modelo,
                        temperature: 0.3,
                        max_completion_tokens: 1200,

                        messages: [
                            {
                                role: 'system',
                                content: systemPrompt + '\n\nCONSULTA ATUAL DO SERVIDOR (JSON):\n' +
                                    JSON.stringify(contexto)
                            },

                            ...item.historico,

                            {
                                role: 'user',
                                content: mensagem.trim()
                            }
                        ]
                    })
                }
            )

            if (!resposta.ok) {
                console.warn(
                    'Ruby: provedor retornou HTTP',
                    resposta.status
                )

                if (resposta.status === 429) {
                    const retry = Number(
                        resposta.headers.get('retry-after')
                    )

                    const espera =
                        Number.isFinite(retry) && retry > 0
                            ? Math.min(86400, Math.ceil(retry))
                            : 60

                    pausaAte = agora() + espera * 1000

                    throw new ErroRuby(
                        429,
                        'A IA atingiu um limite de uso. Aguarde antes de tentar novamente.',
                        espera
                    )
                }

                if (
                    [400, 401, 403, 404].includes(
                        resposta.status
                    )
                ) {
                    throw new ErroRuby(
                        503,
                        'A configuração da Ruby precisa ser revisada no servidor.'
                    )
                }

                throw new ErroRuby(
                    502,
                    'A IA está indisponível agora. Tente novamente mais tarde.'
                )
            }

            const dados = await resposta.json()

            const escolha = dados.choices?.[0]
            const conteudo = escolha?.message?.content

            if (
                typeof conteudo !== 'string' ||
                !conteudo.trim() ||
                conteudo.length > 12000
            ) {
                throw new ErroRuby(
                    502,
                    'A IA não retornou uma resposta válida. Tente novamente.'
                )
            }

            const reply = conteudo.trim() + (
                escolha.finish_reason === 'length'
                    ? '\n\nA resposta atingiu o limite de tamanho. Você pode pedir para continuar.'
                    : ''
            )

            item.historico.push(
                {
                    role: 'user',
                    content: mensagem.trim()
                },
                {
                    role: 'assistant',
                    content: reply
                }
            )

            // Mantém pares completos de pergunta e resposta.
            while (
                item.historico.length > 6 ||
                item.historico.reduce(
                    (total, mensagem) =>
                        total + mensagem.content.length,
                    0
                ) > 10000
            ) {
                item.historico.splice(0, 2)
            }

            return { reply }
        } catch (erro) {
            if (erro instanceof ErroRuby) {
                throw erro
            }

            throw new ErroRuby(
                abort.signal.aborted ? 504 : 502,
                abort.signal.aborted
                    ? 'A Ruby demorou para responder. Tente novamente.'
                    : 'Não foi possível conectar à IA. Tente novamente mais tarde.'
            )
        } finally {
            clearTimeout(timer)

            signal?.removeEventListener(
                'abort',
                cancelar
            )

            item.ocupado = false
            item.ultimoUso = agora()
            simultaneas--
        }
    }

    return {
        responder,
        historico,
        limpar
    }
}

module.exports = {
    criarServicoRuby,
    ErroRuby
}