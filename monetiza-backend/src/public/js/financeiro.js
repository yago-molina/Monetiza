document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. CONTROLE DE ABAS =================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const targetTab = button.getAttribute('data-tab');

            // Remove a classe active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Ativa o botão e a aba selecionada
            button.classList.add('active');
            const activeContent = document.getElementById(`tab-${targetTab}`);
            
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // ================= 2. CONTROLE DO MENU LATERAL =================
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

    // ================= 3. CARREGAMENTO DO USUÁRIO =================
    carregarPerfil();
});

async function carregarPerfil() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('usuarioLogado');

    if (!token) return;

    try {
        const resposta = await fetch('/usuario/perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');
            return;
        }

        const dados = await resposta.json();
        const usuario = dados.usuario;

        const olaUsuario = document.getElementById('ola-usuario');
        const nomeUsuario = document.getElementById('nome-usuario');
        const emailUsuario = document.getElementById('email-usuario');

        if (olaUsuario) olaUsuario.textContent = usuario.nome;
        if (nomeUsuario) nomeUsuario.textContent = usuario.nome;
        if (emailUsuario) emailUsuario.textContent = email;

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
    }
}