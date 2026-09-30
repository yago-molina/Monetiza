(() => {
    const corpo = document.getElementById('ruby-mensagens')
    const formulario = document.getElementById('ruby-form')
    const entrada = document.getElementById('ruby-mensagem')
    const enviar = document.getElementById('ruby-enviar')
    const novaConversa = document.getElementById('ruby-nova-conversa')
    const aviso = document.getElementById('ruby-aviso')
    const estado = document.getElementById('ruby-estado')
    const login = document.getElementById('ruby-login')

    let tokenAtual = null
    let versao = 0
    let ocupada = false
    let pronta = false
    let controller = null
    let pausaAte = 0
    let intervalo = null

    const token = () => localStorage.getItem('token')

    function mensagem(texto, usuario = false) {
        const linha = document.createElement('div')

        linha.className = 'message-wrapper' + (
            usuario ? ' user-message' : ''
        )

        const balao = document.createElement('div')

        balao.className = 'message-bubble'

        // Nunca interpretar a resposta como HTML.
        balao.textContent = texto

        linha.appendChild(balao)
        corpo.appendChild(linha)

        while (corpo.children.length > 40) {
            corpo.firstElementChild.remove()
        }

        corpo.scrollTop = corpo.scrollHeight

        return linha
    }

    function atualizarBotoes() {
        enviar.disabled =
            !pronta ||
            ocupada ||
            Date.now() < pausaAte

        novaConversa.disabled = !pronta || ocupada
        entrada.disabled = !pronta || ocupada

        formulario.setAttribute(
            'aria-busy',
            String(ocupada)
        )
    }

    function sessaoExpirada() {
        pronta = false

        estado.textContent = 'Entre para conversar'

        aviso.textContent =
            'Sua sessão não está disponível. Entre novamente na Monetiza.'

        login.hidden = false

        atualizarBotoes()
    }

    function esperar(segundos) {
        if (
            !Number.isFinite(segundos) ||
            segundos <= 0
        ) {
            return
        }

        pausaAte =
            Date.now() +
            Math.min(segundos, 86400) * 1000

        clearInterval(intervalo)

        intervalo = setInterval(() => {
            const faltam = Math.max(
                0,
                Math.ceil(
                    (pausaAte - Date.now()) / 1000
                )
            )

            estado.textContent = faltam
                ? `Aguarde ${faltam}s`
                : 'Assistente da Monetiza'

            if (!faltam) {
                clearInterval(intervalo)
                intervalo = null
            }

            atualizarBotoes()
        }, 1000)
    }

    async function requisicao(method, texto) {
        controller = new AbortController()

        const controle = controller

        const timer = setTimeout(() => {
            controle.abort()
        }, 55000)

        try {
            const resposta = await fetch('/api/ruby', {
                method,
                signal: controle.signal,
                cache: 'no-store',

                headers: {
                    Authorization: `Bearer ${tokenAtual}`,

                    ...(method === 'POST'
                        ? {
                            'Content-Type': 'application/json'
                        }
                        : {})
                },

                ...(method === 'POST'
                    ? {
                        body: JSON.stringify({
                            message: texto
                        })
                    }
                    : {})
            })

            const dados = await resposta
                .json()
                .catch(() => ({}))

            if (!resposta.ok) {
                const erro = new Error(
                    dados.error ||
                    dados.erro ||
                    'Não foi possível conversar com a Ruby.'
                )

                erro.status = resposta.status

                erro.retryAfter =
                    Number(
                        resposta.headers.get('Retry-After')
                    ) ||
                    dados.retryAfter

                throw erro
            }

            return dados
        } finally {
            clearTimeout(timer)

            if (controller === controle) {
                controller = null
            }
        }
    }

    function tratarErro(erro) {
        if (erro.status === 401) {
            return sessaoExpirada()
        }

        aviso.textContent =
            erro.name === 'AbortError'
                ? 'A resposta demorou. Sua mensagem foi mantida para tentar novamente.'
                : erro.message ||
                    'Não foi possível conectar. Tente novamente.'

        estado.textContent = 'Não foi possível concluir'

        if (erro.status === 429) {
            esperar(
                Number(erro.retryAfter) || 60
            )
        }
    }

    async function carregar() {
        const atual = ++versao

        controller?.abort()
        clearInterval(intervalo)

        pausaAte = 0
        ocupada = true
        pronta = false
        tokenAtual = token()

        corpo.replaceChildren()
        entrada.value = ''
        aviso.textContent = ''
        login.hidden = true

        estado.textContent = 'Carregando conversa…'

        atualizarBotoes()

        if (!tokenAtual) {
            ocupada = false
            sessaoExpirada()
            return
        }

        try {
            const dados = await requisicao('GET')

            if (
                atual !== versao ||
                tokenAtual !== token()
            ) {
                return
            }

            const historico = Array.isArray(dados.history)
                ? dados.history
                : []

            for (const item of historico) {
                if (
                    ['user', 'assistant'].includes(item.role) &&
                    typeof item.content === 'string'
                ) {
                    mensagem(
                        item.content,
                        item.role === 'user'
                    )
                }
            }

            if (!corpo.children.length) {
                mensagem(
                    'Olá! Sou a Ruby. Como posso ajudar você com a Monetiza?'
                )
            }

            pronta = Boolean(dados.configured)

            estado.textContent = 'Assistente da Monetiza'

            if (!pronta) {
                aviso.textContent =
                    'A Ruby ainda precisa ser configurada no servidor.'
            }
        } catch (erro) {
            if (
                atual === versao &&
                tokenAtual === token()
            ) {
                tratarErro(erro)
            }
        } finally {
            if (atual === versao) {
                ocupada = false
                atualizarBotoes()
            }
        }
    }

    formulario.addEventListener('submit', async evento => {
        evento.preventDefault()

        if (tokenAtual !== token()) {
            await carregar()
            return
        }

        const texto = entrada.value.trim()

        if (
            !texto ||
            !pronta ||
            ocupada ||
            Date.now() < pausaAte
        ) {
            return
        }

        if (texto.length > 2000) {
            aviso.textContent = 'Use até 2.000 caracteres.'
            return
        }

        const atual = versao

        ocupada = true
        aviso.textContent = ''
        estado.textContent = 'Ruby está respondendo…'

        atualizarBotoes()

        const minhaMensagem = mensagem(texto, true)

        const aguardando = mensagem(
            'Ruby está respondendo…'
        )

        aguardando.classList.add('ruby-digitando')

        try {
            const dados = await requisicao(
                'POST',
                texto
            )

            if (
                atual !== versao ||
                tokenAtual !== token()
            ) {
                return
            }

            if (
                typeof dados.reply !== 'string' ||
                !dados.reply.trim()
            ) {
                throw new Error(
                    'Resposta inválida da Ruby.'
                )
            }

            mensagem(dados.reply)

            entrada.value = ''
            estado.textContent = 'Assistente da Monetiza'
        } catch (erro) {
            if (
                atual === versao &&
                tokenAtual === token()
            ) {
                // Mantém a pergunta no campo para tentar novamente.
                minhaMensagem.remove()
                tratarErro(erro)
            }
        } finally {
            aguardando.remove()

            if (atual === versao) {
                ocupada = false
                atualizarBotoes()

                if (pronta) {
                    entrada.focus()
                }
            }
        }
    })

    novaConversa.addEventListener('click', async () => {
        if (ocupada || !pronta) {
            return
        }

        const atual = versao

        const confirmou = await MonetizaUI.confirmar(
            'Apagar a conversa atual com a Ruby?',
            {
                titulo: 'Nova conversa'
            }
        )

        if (
            !confirmou ||
            atual !== versao ||
            tokenAtual !== token()
        ) {
            return
        }

        ocupada = true
        atualizarBotoes()

        try {
            await requisicao('DELETE')

            if (
                atual !== versao ||
                tokenAtual !== token()
            ) {
                return
            }

            corpo.replaceChildren()
            entrada.value = ''
            aviso.textContent = ''

            mensagem(
                'Conversa reiniciada. Como posso ajudar?'
            )
        } catch (erro) {
            if (
                atual === versao &&
                tokenAtual === token()
            ) {
                tratarErro(erro)
            }
        } finally {
            if (atual === versao) {
                ocupada = false
                atualizarBotoes()
            }
        }
    })

    document
        .getElementById('ruby-fechar')
        .addEventListener('click', () => {
            if (window.parent !== window) {
                window.parent.postMessage(
                    {
                        type: 'ruby:close'
                    },
                    window.location.origin
                )
            }
        })

    window.addEventListener('message', evento => {
        if (
            evento.origin !== window.location.origin ||
            evento.source !== window.parent
        ) {
            return
        }

        if (evento.data?.type === 'ruby:open') {
            if (
                tokenAtual !== token() ||
                (!pronta && !ocupada)
            ) {
                carregar()
            } else {
                entrada.focus()
            }
        }
    })

    window.addEventListener('storage', evento => {
        if (
            evento.key === 'token' ||
            evento.key === null
        ) {
            carregar()
        }
    })

    document.addEventListener('keydown', evento => {
        if (
            evento.key === 'Escape' &&
            !document.querySelector('dialog[open]')
        ) {
            window.parent.postMessage(
                {
                    type: 'ruby:close'
                },
                window.location.origin
            )
        }
    })

    window.addEventListener('pagehide', () => {
        controller?.abort()
        clearInterval(intervalo)
    })

    carregar()
})()