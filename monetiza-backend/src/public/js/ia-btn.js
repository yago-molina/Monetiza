(function () {
    function criarBotaoIA() {
        if (document.getElementById('btn-ia-floating')) return;

        // Estilos injetados diretamente para garantir que funcione em qualquer tela
        const style = document.createElement('style');
        style.textContent = `
            .btn-ia-floating {
                position: fixed !important;
                bottom: 24px !important;
                right: 24px !important;
                width: 56px !important;
                height: 56px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #6366f1, #a855f7) !important;
                color: #ffffff !important;
                border: none !important;
                box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4) !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 99999 !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }
            .btn-ia-floating:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6) !important;
            }
            .btn-ia-floating svg {
                width: 26px !important;
                height: 26px !important;
                fill: currentColor !important;
            }
        `;
        document.head.appendChild(style);

        // Criação do elemento do botão
        const btnIA = document.createElement('button');
        btnIA.id = 'btn-ia-floating';
        btnIA.className = 'btn-ia-floating';
        btnIA.title = 'Assistente IA';
        btnIA.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 2L9.91 8.09L3.82 10.18L9.91 12.27L12 18.36L14.09 12.27L20.18 10.18L14.09 8.09L12 2M4.5 17.5L3.38 20.12L0.75 21.25L3.38 22.38L4.5 25L5.63 22.38L8.25 21.25L5.63 20.12L4.5 17.5M19.5 3.5L18.38 6.12L15.75 7.25L18.38 8.38L19.5 11L20.63 8.38L23.25 7.25L20.63 6.12L19.5 3.5Z" />
            </svg>
        `;

        btnIA.addEventListener('click', () => {
            if (typeof abrirChatIA === 'function') {
                abrirChatIA();
            } else {
                alert('Assistente IA acionado!');
            }
        });

        document.body.appendChild(btnIA);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', criarBotaoIA);
    } else {
        criarBotaoIA();
    }
})();