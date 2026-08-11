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

// pop up provisório 
document.addEventListener('DOMContentLoaded', function() {
   
    // --- ELEMENTOS DOS MODAIS ---
    const modalEscolha = document.getElementById('modal-escolha-criacao');
    const modalManual = document.getElementById('modal-novo-produto');

    // --- BOTÕES DE AÇÃO ---
    const btnNovoProduto = document.getElementById('btn-novo-produto'); // Botão principal da página
    const btnFecharEscolha = document.getElementById('btn-fechar-escolha');
    const btnFecharManual = document.getElementById('btn-fechar-modal');
    const btnCancelarManual = document.getElementById('btn-cancelar');

    // --- BOTÕES DE OPÇÃO ---
    const btnOpcaoManual = document.getElementById('btn-opcao-manual');
    const btnOpcaoIA = document.getElementById('btn-opcao-ia');

    // --- FORMULÁRIO MANUAL ---
    const formProduto = document.getElementById('form-novo-produto');

    // 1. Clicar em "Novo Produto" abre a escolha
    if (btnNovoProduto) {
        btnNovoProduto.addEventListener('click', (e) => {
            e.preventDefault();
            modalEscolha.classList.remove('hidden');
        });
    }

    // 2. Escolher "Criar Manualmente" -> Fecha escolha e abre o formulário
    if (btnOpcaoManual) {
        btnOpcaoManual.addEventListener('click', () => {
            modalEscolha.classList.add('hidden');  // Sumir com a tela de escolha
            modalManual.classList.remove('hidden'); // Mostrar o pop-up com o formulário
        });
    }

    // 3. Escolher "Criar com IA"
    if (btnOpcaoIA) {
        btnOpcaoIA.addEventListener('click', () => {
            modalEscolha.classList.add('hidden');
            alert("Gerador com IA selecionado! Em breve você poderá criar seus produtos usando inteligência artificial.");
        });
    }

    // 4. Fechar Modais (Botões X e Cancelar)
    const fecharTudo = () => {
        if (modalEscolha) modalEscolha.classList.add('hidden');
        if (modalManual) modalManual.classList.add('hidden');
    };

    if (btnFecharEscolha) btnFecharEscolha.addEventListener('click', fecharTudo);
    if (btnFecharManual) btnFecharManual.addEventListener('click', fecharTudo);
    if (btnCancelarManual) btnCancelarManual.addEventListener('click', fecharTudo);

    // Fechar ao clicar fora de qualquer modal
    window.addEventListener('click', (e) => {
        if (e.target === modalEscolha || e.target === modalManual) {
            fecharTudo();
        }
    });

    // 5. Salvar o Produto Manual
    if (formProduto) {
        formProduto.addEventListener('submit', function(e) {
            e.preventDefault();

            const titulo = document.getElementById('prod-titulo').value;
            const preco = document.getElementById('prod-preco').value;

            alert(`Produto "${titulo}" (R$ ${preco}) cadastrado com sucesso!`);
            fecharTudo();
            formProduto.reset();
        });
    }
});