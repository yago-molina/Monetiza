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

    function contextoTela() {
        // O iframe lê a preferência atual, não a que existia quando foi aberto.
        try {
            const origem = window.parent !== window && window.parent.location.origin === window.location.origin
                ? window.parent : window
            return {
                idioma: origem.i18n?.obterIdiomaAtual?.() || window.i18n.obterIdiomaAtual(),
                pagina: origem.location.pathname // sem query, token ou conteúdo da página
            }
        } catch {
            return { idioma: window.i18n.obterIdiomaAtual(), pagina: '' }
        }
    }
    function sincronizarIdioma() {
        const { idioma } = contextoTela()
        if (idioma !== window.i18n.obterIdiomaAtual()) window.i18n.aplicarIdioma(idioma)
    }

    function mostrarAtalhos(itens) {
        if (!Array.isArray(itens)) return
        const grupo = document.createElement('div')
        grupo.className = 'ruby-atalhos'
        for (const item of itens.slice(0, 3)) {
            if (typeof item.url !== 'string' || typeof item.titulo !== 'string') continue
            // Apenas destinos internos conhecidos; nunca HTML/links enviados pelo modelo.
            if (!/^\/(?:$|login$|cadastro$|landing$|dashboard$|produto$|ia-produtos$|vitrine$|minhasCompras$|minhasVendas$|afiliados$|financeiro$|contratos$|mensagens$|ruby\.html$|configuracoes(?:\?aba=(?:perfil|notificacoes|seguranca|pagamento|tema|idioma))?$)/.test(item.url)) continue
            const link = document.createElement('a')
            link.href = item.url
            link.target = '_top'
            link.textContent = item.titulo
            grupo.appendChild(link)
        }
        if (grupo.children.length) corpo.appendChild(grupo)
        corpo.scrollTop = corpo.scrollHeight
    }


    function mensagem(texto, usuario = false) {
        const linha = document.createElement('div')

        linha.className = 'message-wrapper' + (
            usuario ? ' user-message' : ''
        )

        const balao = document.createElement('div')

        balao.className = 'message-bubble'

        // Nunca interpretar a resposta como HTML.
        if (!usuario && window.renderizarMensagemRuby) {
            window.renderizarMensagemRuby(balao, texto)
        } else {
            balao.textContent = texto
        }

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

        estado.textContent = window.i18n.t('complementos.entreParaConversar')

        aviso.textContent =
            window.i18n.t('complementos.suaSessaoNaoEstaDisponivelEntreNovamenteNaMonetiza')

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
                ? window.i18n.t('complementos.aguardeSegundosS', { segundos: faltam })
                : window.i18n.t('complementos.assistenteDaMonetiza')

            if (!faltam) {
                clearInterval(intervalo)
                intervalo = null
            }

            atualizarBotoes()
        }, 1000)
    }

    async function requisicao(method, texto) {
        sincronizarIdioma()
        const contexto = contextoTela()
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
                    'X-Ruby-Idioma': contexto.idioma,

                    ...(method === 'POST'
                        ? {
                            'Content-Type': 'application/json'
                        }
                        : {})
                },

                ...(method === 'POST'
                    ? {
                        body: JSON.stringify({
                            message: texto,
                            idioma: contexto.idioma,
                            pagina: contexto.pagina
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
                    window.i18n.t('complementos.naoFoiPossivelConversarComARuby')
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
                ? window.i18n.t('complementos.aRespostaDemorouSuaMensagemFoiMantidaParaTentarNovamente')
                : window.i18n.mensagem(erro.message) ||
                    window.i18n.t('complementos.naoFoiPossivelConectarTenteNovamente')

        estado.textContent = window.i18n.t('complementos.naoFoiPossivelConcluir')

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

        estado.textContent = window.i18n.t('complementos.carregandoConversa')

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
                    window.i18n.t('complementos.olaSouARubyComoPossoAjudarVoceComA')
                )
            }

            pronta = Boolean(dados.configured)

            estado.textContent = window.i18n.t('complementos.assistenteDaMonetiza')

            if (!pronta) {
                aviso.textContent =
                    window.i18n.t('complementos.aRubyAindaPrecisaSerConfiguradaNoServidor')
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
            aviso.textContent = window.i18n.t('complementos.useAte2000Caracteres')
            return
        }

        const atual = versao

        ocupada = true
        aviso.textContent = ''
        estado.textContent = window.i18n.t('complementos.rubyEstaRespondendo')

        atualizarBotoes()

        const minhaMensagem = mensagem(texto, true)

        const aguardando = mensagem(
            window.i18n.t('complementos.rubyEstaRespondendo')
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
                    window.i18n.t('complementos.respostaInvalidaDaRuby')
                )
            }

            mensagem(dados.reply)
            mostrarAtalhos(dados.atalhos)

            entrada.value = ''
            estado.textContent = window.i18n.t('complementos.assistenteDaMonetiza')
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
            window.i18n.t('complementos.apagarAConversaAtualComARuby'),
            {
                titulo: window.i18n.t('mensagens.chat.novaConversa')
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
                window.i18n.t('complementos.conversaReiniciadaComoPossoAjudar')
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

        if (['ruby:open', 'ruby:context'].includes(evento.data?.type)) sincronizarIdioma()

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

    sincronizarIdioma()
    carregar()
})()