document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('usuarioLogado');

    if (email) {
        const nomeExibicao = username || email.split('@')[0];

        // 1. Atualiza a Sidebar (inferior esquerda)
        const nomeSidebar = document.getElementById('nome-usuario');
        const emailSidebar = document.getElementById('email-usuario');

        if (nomeSidebar) nomeSidebar.textContent = nomeExibicao;
        if (emailSidebar) emailSidebar.textContent = email;

        // 2. Atualiza a Top Bar (superior direita)
        const nomeTopBar = document.getElementById('topbar-username');
        if (nomeTopBar) nomeTopBar.textContent = nomeExibicao;

    } else {
        alert("Acesso negado. Por favor, faça login ou cadastre-se.");
        window.location.href = "/";
    }
});