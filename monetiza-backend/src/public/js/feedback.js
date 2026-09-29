(() => {
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

    const aviso = document.createElement('dialog')

    aviso.id = 'monetiza-aviso'
    aviso.setAttribute('aria-labelledby', 'monetiza-aviso-titulo')

    aviso.innerHTML = `
        <h2 id="monetiza-aviso-titulo">Monetiza</h2>
        <p></p>
        <div></div>
    `

    document.body.append(loading, aviso)

    loading.addEventListener('cancel', evento => {
        evento.preventDefault()
    })

    let fila = Promise.resolve()

    function fecharLoading() {
        if (loading.open) {
            loading.close()
        }

        loading.querySelector('iframe').src = 'about:blank'
    }

    window.MonetizaUI = {
        abrirLoading() {
            loading.querySelector('iframe').src =
                '/loading/index.html'

            if (!loading.open) {
                loading.showModal()
            }
        },

        fecharLoading,

        aviso(mensagem, opcoes = {}) {
            const tarefa = () => new Promise(resolve => {
                fecharLoading()

                aviso.querySelector('h2').textContent =
                    opcoes.titulo || 'Monetiza'

                aviso.querySelector('p').textContent =
                    mensagem || 'Operação concluída.'

                const acoes = aviso.querySelector('div')

                acoes.replaceChildren()

                if (opcoes.url) {
                    const acessar = document.createElement('button')

                    acessar.textContent = 'Acessar produto'

                    acessar.onclick = () => {
                        window.open(
                            opcoes.url,
                            '_blank',
                            'noopener,noreferrer'
                        )

                        aviso.close()
                    }

                    acoes.append(acessar)
                }

                const fechar = document.createElement('button')

                fechar.textContent = opcoes.url
                    ? 'Fechar'
                    : 'Entendi'

                fechar.onclick = () => aviso.close()

                acoes.append(fechar)

                aviso.addEventListener('close', resolve, {
                    once: true
                })

                aviso.showModal()
                acoes.querySelector('button').focus()
            })

            fila = fila.then(tarefa)

            return fila
        }
    }
})()