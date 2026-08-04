document.addEventListener('DOMContentLoaded', function() {
    
    const usuario = localStorage.getItem('usuarioLogado');

    if (usuario) {
        const apenasNome = usuario.split('@')[0];
        
        const elementoNome = document.getElementById('nome-usuario');
        if (elementoNome) {
            elementoNome.textContent = apenasNome;
        }
    } else {
        alert("Acesso negado. Por favor, faça login primeiro.");
        window.location.href = "/login";
    }

    const itensMenu = document.querySelectorAll('.menu-nav ul li');

    itensMenu.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }

            itensMenu.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
        });
    });

document.getElementById('dashboard').addEventListener('click', function(e) {
    e.preventDefault();
    
    const usuario = localStorage.getItem('usuarioLogado');
    
    if (usuario) {
        window.location.href = "/dashboard";
    } else {
        alert("Por favor, faça login para acessar o painel.");
        window.location.href = "/login";
    }
});
});