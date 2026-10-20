(() => {
    const CHAVE = 'monetiza_theme'
    const ID_CSS = 'light-theme-css'

    function lerTema() {
        try {
            return localStorage.getItem(CHAVE) === 'light'
                ? 'light'
                : 'dark'
        } catch {
            return 'dark'
        }
    }

    function atualizarBotoes(tema) {
        document.querySelectorAll('[data-tema-select]').forEach(botao => {
            const selecionado = botao.dataset.temaSelect === tema

            botao.classList.toggle('active', selecionado)
            botao.setAttribute('aria-pressed', String(selecionado))
        })
    }

    function aplicarTema(valor, salvar = false) {
        const tema = valor === 'light' ? 'light' : 'dark'

        document.documentElement.dataset.theme = tema
        document.documentElement.style.colorScheme = tema

        let folha = document.getElementById(ID_CSS)

        if (tema === 'light' && !folha) {
            folha = document.createElement('link')
            folha.id = ID_CSS
            folha.rel = 'stylesheet'
            folha.href = '/css/lightTheme.css'
            document.head.appendChild(folha)
        }

        if (folha) {
            folha.disabled = tema !== 'light'
        }

        if (salvar) {
            try {
                localStorage.setItem(CHAVE, tema)
            } catch {
                // O tema continua funcionando nesta página.
            }
        }

        atualizarBotoes(tema)
    }

    aplicarTema(lerTema())

    document.addEventListener('DOMContentLoaded', () => {
        // Mantém as regras claras depois dos estilos da página.
        const folha = document.getElementById(ID_CSS)

        if (folha) document.head.appendChild(folha)

        atualizarBotoes(document.documentElement.dataset.theme)
    })

    document.addEventListener('click', evento => {
        const botao = evento.target.closest('[data-tema-select]')

        if (!botao) return

        evento.preventDefault()
        aplicarTema(botao.dataset.temaSelect, true)
    })

    // Sincroniza o tema quando ele é alterado em outra aba.
    window.addEventListener('storage', evento => {
        if (evento.key === CHAVE || evento.key === null) {
            aplicarTema(lerTema())
        }
    })
})()