document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.loader-container')

    if (!container) return

    // O progresso real já aparece na página da IA.
    document.querySelector('.loading-info')?.remove()
    document.getElementById('mainContent')?.remove()

    container.classList.remove('fade-out')

    let logo = container.querySelector('svg')
    if (!logo) return

    // Reinicia toda a sequência, preservando os tempos de cada parte.
    const intervalo = setInterval(() => {
        const novaLogo = logo.cloneNode(true)
        logo.replaceWith(novaLogo)
        logo = novaLogo
    }, 4000)

    window.addEventListener('pagehide', () => {
        clearInterval(intervalo)
    }, { once: true })
})