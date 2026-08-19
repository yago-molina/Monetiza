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
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        #btn-ia-floating:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
        }
        #btn-ia-floating img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 50% !important;
          display: block !important;
        }
      `;
      document.head.appendChild(style);

      const btnIA = document.createElement('button');
      btnIA.id = 'btn-ia-floating';
      btnIA.title = 'Assistente IA';

      // Atualizado com a imagem do arquivo ruby-logo
      btnIA.innerHTML = `<img src="image/ruby-logo.png" alt="Assistente IA">`;

      btnIA.addEventListener('click', () => {
        if (typeof abrirChatIA === 'function') {
          abrirChatIA();
        } else {
          alert('Assistente IA acionado!');
        }
      });

      document.body.appendChild(btnIA);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      criarBotaoIA();
    } else {
      document.addEventListener('DOMContentLoaded', criarBotaoIA);
    }