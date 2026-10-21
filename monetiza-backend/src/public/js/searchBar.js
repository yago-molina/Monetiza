document.addEventListener('DOMContentLoaded', () => {
    const campos = document.querySelectorAll(
        '.top-bar .search-bar-container .search-input'
    )

    campos.forEach(campo => {
        // A vitrine controla sua própria pesquisa.
        if (campo.id === 'busca-topo') return

        const container = campo.closest('.search-bar-container')
        const lupa = container.querySelector('.search-icon')

        campo.setAttribute('enterkeyhint', 'search')

        function pesquisar() {
            const termo = campo.value.trim()

            if (!termo) {
                campo.focus()
                return
            }

            const destino = new URL('/vitrine', window.location.origin)
            destino.searchParams.set('q', termo)

            const parametros = new URLSearchParams(window.location.search)
            const referencia = parametros.get('ref')

            if (referencia) {
                destino.searchParams.set('ref', referencia)
            }

            window.location.assign(destino.href)
        }

        campo.addEventListener('keydown', evento => {
            if (evento.key !== 'Enter' || evento.isComposing) return

            evento.preventDefault()
            pesquisar()
        })

        if (!lupa) return

        lupa.style.cursor = 'pointer'
        lupa.style.pointerEvents = 'auto'
        lupa.setAttribute('role', 'button')
        lupa.setAttribute('tabindex', '0')
        lupa.setAttribute('aria-label', 'Pesquisar produtos')

        lupa.addEventListener('click', pesquisar)

        lupa.addEventListener('keydown', evento => {
            if (evento.key !== 'Enter' && evento.key !== ' ') return

            evento.preventDefault()
            pesquisar()
        })
    })
})