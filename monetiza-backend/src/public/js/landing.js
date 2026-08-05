document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('usuarioLogado');

    // Verifica se existe um token
    if (!token) {
        alert('Acesso negado. Faça login primeiro.');
        window.location.href = '/login';
        return;
    }

    try {

        // Busca os dados do usuário usando o token
        const resposta = await fetch('/usuario/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const dados = await resposta.json();

        // Token inválido ou expirado
        if (!resposta.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');

            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = '/login';
            return;
        }

        const usuario = dados.usuario;

        // Mostra o nome verdadeiro
        const nomeUsuario = document.getElementById('nome-usuario');

        if (nomeUsuario) {
            nomeUsuario.textContent = usuario.nome;
        }

        // Mostra o e-mail
        const emailUsuario = document.getElementById('email-usuario');

        if (emailUsuario) {
            emailUsuario.textContent = email;
        }

    } catch (erro) {
        console.error('Erro ao carregar usuário:', erro);
        alert('Erro ao carregar os dados do usuário.');
    }


    // Controle do menu lateral
    const itensMenu = document.querySelectorAll('.menu-nav ul li');

    itensMenu.forEach(item => {
        item.addEventListener('click', function (e) {

            if (this.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }

            itensMenu.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Botão Dashboard
    const dashboard = document.getElementById('dashboard');

    if (dashboard) {
        dashboard.addEventListener('click', function (e) {
            e.preventDefault();

            const token = localStorage.getItem('token');

            if (token) {
                window.location.href = '/dashboard';
            } else {
                alert('Por favor, faça login para acessar o painel.');
                window.location.href = '/login';
            }
        });
    }

});