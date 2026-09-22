(function () {

    const STORAGE_KEY = 'monetiza_theme'
    const LIGHT_THEME_ID = 'light-theme-css'

    // Pega o tema salvo imediatamente
    let tema = localStorage.getItem(STORAGE_KEY)

    if (tema !== 'light' && tema !== 'dark') {
        tema = 'dark'
    }

    // Aplica o atributo ANTES do restante da página carregar
    document.documentElement.setAttribute('data-theme', tema)

    function carregarLightTheme() {

        let link = document.getElementById(LIGHT_THEME_ID)

        if (!link) {

            link = document.createElement('link')

            link.id = LIGHT_THEME_ID
            link.rel = 'stylesheet'
            link.href = 'css/lightTheme.css'

            document.head.appendChild(link)
        }

        link.disabled = false
    }

    function removerLightTheme() {

        const link =
            document.getElementById(LIGHT_THEME_ID)

        if (link) {
            link.disabled = true
        }
    }

    function atualizarBotoes() {

        const temaAtual =
            document.documentElement.getAttribute('data-theme') || 'dark'

        document
            .querySelectorAll('[data-tema-select]')
            .forEach(botao => {

                const temaBotao =
                    botao.getAttribute('data-tema-select')

                botao.classList.toggle(
                    'active',
                    temaBotao === temaAtual
                )

            })
    }

    function aplicarTema(novoTema) {

        if (
            novoTema !== 'light' &&
            novoTema !== 'dark'
        ) {
            novoTema = 'dark'
        }

        document.documentElement.setAttribute(
            'data-theme',
            novoTema
        )

        localStorage.setItem(
            STORAGE_KEY,
            novoTema
        )

        if (novoTema === 'light') {
            carregarLightTheme()
        } else {
            removerLightTheme()
        }

        atualizarBotoes()
    }

    // Ativa o light CSS o mais cedo possível
    if (tema === 'light') {
        carregarLightTheme()
    }

    // Botões de tema
    document.addEventListener('click', event => {

        const botao =
            event.target.closest('[data-tema-select]')

        if (!botao) return

        const novoTema =
            botao.getAttribute('data-tema-select')

        aplicarTema(novoTema)

    })

    // Atualiza os botões depois que o HTML existir
    document.addEventListener(
        'DOMContentLoaded',
        () => {
            atualizarBotoes()
        }
    )

})()