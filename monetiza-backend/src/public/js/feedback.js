(() => {
    // Evita criar os componentes duas vezes.
    if (window.MonetizaUI) return

    const loading = document.createElement('dialog')

    loading.id = 'monetiza-loading'
    loading.setAttribute('aria-label', 'Carregando Monetiza')

    loading.innerHTML = `
        <iframe
            title="Carregando Monetiza"
            sandbox="allow-scripts"
            tabindex="-1"
            src="about:blank"
        ></iframe>
    `

    const modal = document.createElement('dialog')

    modal.id = 'monetiza-aviso'
    modal.setAttribute('aria-labelledby', 'monetiza-aviso-titulo')
    modal.setAttribute('aria-describedby', 'monetiza-aviso-texto')

    modal.innerHTML = `
        <form id="monetiza-feedback-form">
            <h2 id="monetiza-aviso-titulo">Monetiza</h2>

            <p id="monetiza-aviso-texto"></p>

            <input
                id="monetiza-feedback-entrada"
                type="text"
                aria-labelledby="monetiza-aviso-texto"
                autocomplete="off"
                hidden
            >

            <div id="monetiza-feedback-acoes"></div>
        </form>
    `

    document.body.append(loading, modal)

    const form = modal.querySelector('form')
    const titulo = modal.querySelector('h2')
    const texto = modal.querySelector('p')
    const entrada = modal.querySelector('input')
    const acoes = modal.querySelector('#monetiza-feedback-acoes')

    let fila = Promise.resolve()

    loading.addEventListener('cancel', evento => {
        evento.preventDefault()
    })

    function abrirLoading() {
        const iframe = loading.querySelector('iframe')

        if (!loading.open) {
            iframe.src = '/loading/index.html'
            loading.showModal()
        }
    }

    function fecharLoading() {
        if (loading.open) {
            loading.close()
        }

        loading.querySelector('iframe').src = 'about:blank'
    }

    function criarBotao(rotulo, tipo = 'button', secundario = false) {
        const botao = document.createElement('button')

        botao.type = tipo
        botao.textContent = rotulo

        if (secundario) {
            botao.classList.add('feedback-secundario')
        }

        acoes.appendChild(botao)

        return botao
    }

    function exibir(tipo, mensagem, opcoes = {}) {
        const tarefa = () => new Promise(resolve => {
            fecharLoading()

            const focoAnterior = document.activeElement

            let resultado = tipo === 'confirmar' ? false : null

            titulo.textContent = opcoes.titulo || 'Monetiza'
            texto.textContent = String(mensagem ?? '')

            entrada.hidden = tipo !== 'entrada'
            entrada.value = String(opcoes.valorInicial ?? '')
            entrada.readOnly = Boolean(opcoes.somenteLeitura)

            acoes.replaceChildren()

            let botaoInicial

            if (tipo === 'aviso') {
                // O acesso é aberto diretamente no clique do usuário.
                let urlAcesso = null

                if (opcoes.url) {
                    try {
                        const url = new URL(
                            opcoes.url,
                            window.location.origin
                        )

                        if (['http:', 'https:'].includes(url.protocol)) {
                            urlAcesso = url.href
                        }
                    } catch {
                        urlAcesso = null
                    }
                }

                if (urlAcesso) {
                    const acessar = criarBotao('Acessar produto')

                    acessar.addEventListener('click', () => {
                        window.open(
                            urlAcesso,
                            '_blank',
                            'noopener,noreferrer'
                        )

                        resultado = true
                        modal.close()
                    })

                    botaoInicial = acessar
                }

                const fechar = criarBotao(
                    urlAcesso ? 'Fechar' : 'Entendi',
                    'submit',
                    Boolean(urlAcesso)
                )

                botaoInicial ||= fechar
            } else {
                const cancelar = criarBotao(
                    'Cancelar',
                    'button',
                    true
                )

                cancelar.addEventListener('click', () => {
                    modal.close()
                })

                criarBotao(
                    opcoes.textoConfirmar || 'Confirmar',
                    'submit'
                )

                // Confirmações começam com foco em Cancelar.
                botaoInicial = cancelar
            }

            form.onsubmit = evento => {
                evento.preventDefault()

                resultado = tipo === 'entrada'
                    ? entrada.value
                    : true

                modal.close()
            }

            modal.oncancel = evento => {
                evento.preventDefault()
                modal.close()
            }

            modal.addEventListener('close', () => {
                form.onsubmit = null
                modal.oncancel = null

                if (focoAnterior?.isConnected) {
                    focoAnterior.focus()
                }

                resolve(resultado)
            }, { once: true })

            modal.showModal()

            if (tipo === 'entrada') {
                entrada.focus()
                entrada.select()
            } else {
                botaoInicial.focus()
            }
        })

        const resultado = fila.then(tarefa)

        // Uma falha não bloqueia os próximos pop-ups da fila.
        fila = resultado.catch(() => {})

        return resultado
    }

    window.MonetizaUI = {
        abrirLoading,
        fecharLoading,

        aviso(mensagem, opcoes = {}) {
            return exibir('aviso', mensagem, opcoes)
        },

        confirmar(mensagem, opcoes = {}) {
            return exibir('confirmar', mensagem, opcoes)
        },

        entrada(mensagem, valorInicial = '', opcoes = {}) {
            return exibir('entrada', mensagem, {
                ...opcoes,
                valorInicial
            })
        }
    }
})()