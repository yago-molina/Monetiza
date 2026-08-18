document.addEventListener('DOMContentLoaded', () => {
    // Elementos do Modal
    const modal = document.getElementById('modalContrato');
    const formContrato = document.querySelector('.modal-form');
    const btnUpload = document.querySelector('.btn-upload');
    const inputArquivo = document.getElementById('arquivo');
    const btnNovoContrato = document.getElementById('btnNovoContrato'); // ID opcional do botão da página principal

    // Criar um input do tipo file oculto para permitir o upload real de arquivos PDF
    const hiddenFileInput = document.createElement('input');
    hiddenFileInput.type = 'file';
    hiddenFileInput.accept = '.pdf,application/pdf';
    hiddenFileInput.style.display = 'none';
    document.body.appendChild(hiddenFileInput);

    /* ================= FUNÇÕES DE ABERTURA E FECHAMENTO ================= */

    // Função para abrir o modal
    window.openModal = function () {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Trava o scroll de fundo
        }
    };

    // Função para fechar o modal
    window.closeModal = function () {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Destrava o scroll de fundo
            if (formContrato) formContrato.reset(); // Limpa os campos ao fechar
        }
    };

    /* ================= EVENT LISTENERS ================= */

    // Botão de abrir modal (caso exista no DOM)
    if (btnNovoContrato) {
        btnNovoContrato.addEventListener('click', window.openModal);
    }

    // Fechar ao clicar fora da caixa branca (no fundo escuro)
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                window.closeModal();
            }
        });
    }

    // Fechar ao pressionar a tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
            window.closeModal();
        }
    });

    /* ================= LÓGICA DE UPLOAD DE ARQUIVO ================= */

    // Clique no botão do ícone aciona o seletor de arquivos do sistema
    if (btnUpload) {
        btnUpload.addEventListener('click', () => {
            hiddenFileInput.click();
        });
    }

    // Escreve o nome do arquivo selecionado dentro do campo de texto
    hiddenFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            inputArquivo.value = file.name;
        }
    });

    /* ================= SUBMISSÃO DO FORMULÁRIO ================= */

    if (formContrato) {
        formContrato.addEventListener('submit', (e) => {
            e.preventDefault();

            // Captura dos dados do formulário
            const dadosContrato = {
                titulo: document.getElementById('titulo').value,
                arquivo: inputArquivo.value,
                dataInicio: document.getElementById('dataInicio').value,
                dataFim: document.getElementById('dataFim').value,
                status: document.getElementById('status').value,
                observacoes: document.getElementById('observacoes').value,
            };

            console.log('Contrato cadastrado com sucesso:', dadosContrato);

            // Substitua este alert pela sua integração/requisição API (fetch/axios)
            alert('Contrato salvo com sucesso!');

            // Fecha o modal e limpa os campos
            window.closeModal();
        });
    }
});