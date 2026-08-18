document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('usuarioLogado');

    if (!token) {
        alert('Acesso negado. Faça login primeiro.');
        window.location.href = '/';
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
            window.location.href = '/';
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

document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const btnSalvar = document.getElementById('btn-salvar-preferencias');

    // Alternar entre as abas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const activeContent = document.getElementById(`tab-${targetTab}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // Evento do Botão Salvar Preferências
    if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
            const preferencias = {
                vendas: document.getElementById('notif-vendas').checked,
                comissoes: document.getElementById('notif-comissoes').checked,
                mensagens: document.getElementById('notif-mensagens').checked,
                email: document.getElementById('notif-email').checked,
            };

            console.log('Preferências Salvas:', preferencias);
            alert('Preferências salvas com sucesso!');
        });
    }
});

const btnSalvarSeguranca = document.getElementById('btn-salvar-seguranca');

if (btnSalvarSeguranca) {
    btnSalvarSeguranca.addEventListener('click', () => {
        const segurancaConfig = {
            fa2Habilitado: document.getElementById('seg-2fa').checked
        };

        console.log('Configurações de Segurança Salvas:', segurancaConfig);
        alert('Configurações de segurança salvas com sucesso!');
    });
}

const formPagamento = document.getElementById('form-pagamento');

if (formPagamento) {
    formPagamento.addEventListener('submit', (e) => {
        e.preventDefault();
        const chavePix = document.getElementById('chave-pix').value;

        if (!chavePix.trim()) {
            alert('Por favor, informe uma chave PIX válida.');
            return;
        }

        console.log('Chave PIX cadastrada:', chavePix);
        alert('Dados de pagamento salvos com sucesso!');
    });
}