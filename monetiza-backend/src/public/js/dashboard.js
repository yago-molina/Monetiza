document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('usuarioLogado');

    if (!token) {
        alert('Acesso negado. Faça login primeiro.');
        window.location.href = '/login';
        return;
    }

    try {
        // Consulta os dados do usuário usando o token
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

        // Nome do usuario
        const olaUsuario = document.getElementById('ola-usuario');

        if (olaUsuario) {
            olaUsuario.textContent = usuario.nome;
        }

        // Nome no menu lateral
        const nomeUsuario = document.getElementById('nome-usuario');

        if (nomeUsuario) {
            nomeUsuario.textContent = usuario.nome;
        }

        // Email no menu lateral
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

});