document.addEventListener('DOMContentLoaded', function() {
    
    const usuario = localStorage.getItem('usuarioLogado');

    if (usuario) {
        const apenasNome = usuario.split('@')[0];
        
        const olaUsuario = document.getElementById('ola-usuario');
        if (olaUsuario) {
            olaUsuario.textContent = apenasNome;
        }

        const nomeUsuario = document.getElementById('nome-usuario');
        if (nomeUsuario) {
            nomeUsuario.textContent = apenasNome;
        }

        const emailUsuario = document.getElementById('email-usuario');
        if (emailUsuario) {
            emailUsuario.textContent = usuario; 
        }

    } else {
        alert("Acesso negado. Por favor, faça login primeiro.");
        window.location.href = "/login";
    }

    const itensMenu = document.querySelectorAll('.menu-nav ul li');

    itensMenu.forEach(item => {
        item.addEventListener('click', function(e) {
            
            // Se o item clicado tiver a classe 'disabled', bloqueia o clique
            if (this.classList.contains('disabled')) {
                e.preventDefault(); 
                return;
            }
            
            // Se não for disabled, gerencia as classes active
            itensMenu.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
        });
    });
});