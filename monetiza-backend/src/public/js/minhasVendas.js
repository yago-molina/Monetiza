document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Remove a classe 'active' de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // 2. Adiciona a classe 'active' no botão clicado
            button.classList.add('active');

            // 3. Obtém o nome da aba selecionada ('vendas' ou 'comissoes')
            const abaSelecionada = button.getAttribute('data-tab');

            // 4. Executa a troca de conteúdo/filtro
            alternarAba(abaSelecionada);
        });
    });
});

function alternarAba(aba) {
    const emptyStateText = document.querySelector('.empty-sales-state p');

    if (aba === 'comissoes') {
        // Lógica ou renderização para Comissões
        emptyStateText.textContent = 'Nenhuma comissão encontrada';
    } else {
        // Lógica ou renderização para Minhas Vendas
        emptyStateText.textContent = 'Nenhuma venda encontrada';
    }
}