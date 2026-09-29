document.addEventListener("DOMContentLoaded", () => {
    const loaderContainer = document.querySelector('.loader-container');
    const mainContent = document.getElementById('mainContent');
    const progressBarFill = document.getElementById('progressBarFill');
    const percentageText = document.getElementById('percentageText');
    const statusText = document.getElementById('statusText');

    // Mensagens dinâmicas à medida que o carregamento avança
    const mensagens = [
        { limit: 25, text: "A carregar recursos gráficos..." },
        { limit: 55, text: "A sincronizar dados do sistema..." },
        { limit: 85, text: "A otimizar interface segura..." },
        { limit: 100, text: "Pronto!" }
    ];

    let progresso = 0;
    
    // 40ms por cada 1% = 4 segundos no total (mais lento que a animação da logo que leva ~2.8s)
    const velocidade = 40; 

    const intervalo = setInterval(() => {
        progresso += 1;
        
        if (progresso >= 100) {
            progresso = 100;
            clearInterval(intervalo);
            
            // Quando chega a 100%, aguarda um instante e faz a transição para o site
            setTimeout(() => {
                loaderContainer.classList.add('fade-out');
                setTimeout(() => {
                    mainContent.classList.add('visible');
                }, 500); // Tempo correspondente à transição em CSS
            }, 400);
        }

        // Atualiza a barra visual e a percentagem
        if (progressBarFill) progressBarFill.style.width = progresso + '%';
        if (percentageText) percentageText.innerText = progresso + '%';

        // Atualiza o texto de status de acordo com a percentagem
        for (let i = 0; i < mensagens.length; i++) {
            if (progresso <= mensagens[i].limit) {
                if (statusText) statusText.innerText = mensagens[i].text;
                break;
            }
        }
    }, velocidade);
});