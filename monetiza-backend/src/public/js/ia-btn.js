(function () {
    const t = chave => window.i18n?.t(chave) ?? chave;

    function criarBotaoIA() {
        if (document.getElementById('btn-ia-floating')) return;

        const style = document.createElement('style');
        style.textContent = `
            #btn-ia-floating {
                position: fixed !important;
                bottom: 24px !important;
                right: 24px !important;
                width: 60px !important;
                height: 60px !important;
                border-radius: 50% !important;
                border: 2px solid #ffffff !important;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3) !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 999999 !important;
                padding: 0 !important;
                overflow: hidden !important;
                background-color: #ffffff !important;
                transition: transform 0.2s ease !important;
            }

            #btn-ia-floating:hover {
                transform: scale(1.1) !important;
            }

            #btn-ia-floating img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                display: block !important;
            }

            /* Caixa flutuante pequena (Widget de Chat) */
            #ruby-chat-modal {
                position: fixed !important;
                bottom: 95px !important;
                right: 24px !important;
                width: 380px !important;
                height: 520px !important;
                max-width: 90vw !important;
                max-height: 75vh !important;
                border-radius: 16px !important;
                box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6) !important;
                z-index: 999999 !important;
                overflow: hidden !important;
                border: 1px solid rgba(204, 0, 0, 0.3) !important;
                background: #0b0d14 !important;
                display: none;
                flex-direction: column !important;
                box-sizing: border-box !important;
            }

            #ruby-chat-modal * {
                box-sizing: border-box !important;
            }
        `;

        document.head.appendChild(style);

        // Criar o Botão Flutuante
        const btnIA = document.createElement('button');
        btnIA.id = 'btn-ia-floating';
        btnIA.title = t('iaBtn.assistente');
        btnIA.innerHTML = `
            <img 
                src="/image/ruby-logo.png" 
                alt="Assistente IA"
                onerror="console.error('ERRO: não conseguiu carregar ruby-logo.png')"
                onload="console.log('Imagem carregada com sucesso!')"
            >
        `;

        // Criar a caixinha flutuante com o iframe do ruby.html dentro
        let modal = document.createElement('div');
        modal.id = 'ruby-chat-modal';
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #111522; padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); height: 45px;">
                <span style="color: #fff; font-size: 13px; font-weight: 600; font-family: 'Segoe UI', sans-serif;">Assistente Ruby</span>
                <button id="fechar-ruby-chat" style="background: none; border: none; color: #a0a0c0; font-size: 16px; cursor: pointer; padding: 2px 6px; border-radius: 4px;">✕</button>
            </div>
            <iframe src="ruby.html" style="width: 100%; height: calc(100% - 45px); border: none; background: #0b0d14;"></iframe>
        `;

        document.body.appendChild(btnIA);
        document.body.appendChild(modal);

        // Evento de Clique para abrir e fechar a caixinha com suavidade
        btnIA.addEventListener('click', () => {
            modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
        });

        // Ação do botão "✕" para fechar a janela
        document.getElementById('fechar-ruby-chat').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        criarBotaoIA();
    } else {
        document.addEventListener('DOMContentLoaded', criarBotaoIA);
    }
})();