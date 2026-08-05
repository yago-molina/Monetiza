const botaoCadastrar = document.getElementById('btn-cadastrar');

botaoCadastrar.addEventListener('click', async function (evento) {
    evento.preventDefault();

    // Pega os dados digitados
    const nome = document.getElementById('cadastro-nome').value.trim();
    const email = document.getElementById('cadastro-email').value.trim();
    const senha = document.getElementById('cadastro-senha').value.trim();
    const repSenha = document.getElementById('cadastro-rep-senha').value.trim();
    const termos = document.getElementById('termos');

    // Verifica campos vazios
    if (nome === '' || email === '' || senha === '' || repSenha === '') {
        alert('Por favor, preencha todos os campos do cadastro.');
        return;
    }

    // Verifica o tamanho da senha
    if (senha.length < 8) {
        alert('A senha precisa ter pelo menos 8 caracteres.');
        return;
    }

    // Verifica se as senhas são iguais
    if (senha !== repSenha) {
        alert('As senhas digitadas não coincidem!');
        return;
    }

    // Verifica os termos
    if (!termos.checked) {
        alert('Você precisa aceitar os termos para criar sua conta.');
        return;
    }

    try {
        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = 'Criando conta...';

        const resposta = await fetch('/auth/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || 'Não foi possível criar a conta.');
            return;
        }

        alert(dados.mensagem);

        // Depois do cadastro, envia para o login
        window.location.href = '/';
    } catch (erro) {
        console.error('Erro no cadastro:', erro);
        alert('Não foi possível conectar ao servidor.');
    } finally {
        botaoCadastrar.disabled = false;
        botaoCadastrar.textContent = 'Criar Conta';
    }
});