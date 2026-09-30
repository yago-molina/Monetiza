document.addEventListener('DOMContentLoaded', () => {
    // Procura por qualquer input que tenha a classe 'search-input' ou o atributo 'data-search'
    const searchInputs = document.querySelectorAll('.search-input, [data-search]');

    searchInputs.forEach(input => {
        // Define o seletor dos elementos que serão filtrados (lido do atributo data-target ou usa um padrão .search-item)
        const targetSelector = input.getAttribute('data-target') || '.search-item';

        input.addEventListener('input', (e) => {
            const query = normalizeString(e.target.value);
            const items = document.querySelectorAll(targetSelector);

            items.forEach(item => {
                const text = normalizeString(item.textContent);

                // Mostra ou esconde o item dependendo se corresponde à pesquisa
                if (text.includes(query)) {
                    // Restaura o display original (funciona bem com flex, block, etc.)
                    item.style.display = ''; 
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Função auxiliar para remover acentos e converter para minúsculas (pesquisa inteligente)
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}