// ======================================================
// MONETIZA - TEMA GLOBAL
// ======================================================

(function aplicarTemaInicial() {

    let tema = localStorage.getItem('monetiza_theme');

    if (tema !== 'light' && tema !== 'dark') {
        tema = 'light';
    }

    document.documentElement.setAttribute(
        'data-theme',
        tema
    );

})();


// ======================================================
// QUANDO A PÁGINA CARREGAR
// ======================================================

document.addEventListener('DOMContentLoaded', function () {

    const botoesTema = document.querySelectorAll(
        '[data-tema-select]'
    );

    console.log(
        'Botões de tema encontrados:',
        botoesTema.length
    );


    // ==================================================
    // MARCAR TEMA ATUAL
    // ==================================================

    function atualizarBotoes() {

        const temaAtual =
            document.documentElement.getAttribute(
                'data-theme'
            );

        botoesTema.forEach(function (botao) {

            const temaBotao =
                botao.getAttribute(
                    'data-tema-select'
                );

            botao.classList.toggle(
                'active',
                temaBotao === temaAtual
            );

        });

    }


    // ==================================================
    // CLICAR NO TEMA
    // ==================================================

    botoesTema.forEach(function (botao) {

        botao.addEventListener('click', function () {

            const tema =
                botao.getAttribute(
                    'data-tema-select'
                );

            console.log(
                'Botão de tema clicado:',
                tema
            );


            if (
                tema !== 'light' &&
                tema !== 'dark'
            ) {
                return;
            }


            // Aplica no HTML
            document.documentElement.setAttribute(
                'data-theme',
                tema
            );


            // Salva
            localStorage.setItem(
                'monetiza_theme',
                tema
            );


            // Atualiza botão
            atualizarBotoes();


            console.log(
                'Tema aplicado:',
                document.documentElement.getAttribute(
                    'data-theme'
                )
            );

        });

    });


    atualizarBotoes();

});