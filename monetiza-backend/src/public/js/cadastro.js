const t = chave => window.i18n?.t(chave) ?? chave

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

        alert(t('cadastro.js.camposObrigatorios'));

        return;
    }

    // Verifica o tamanho da senha
    if (senha.length < 8) {

        alert(t('cadastro.js.senhaMinima'));

        return;
    }

    // Verifica se as senhas são iguais
    if (senha !== repSenha) {

        alert(t('cadastro.js.senhasDiferentes'));

        return;
    }

    // Verifica os termos
    if (!termos.checked) {

        alert(t('cadastro.js.aceitarTermos'));

        return;
    }

    try {

        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = t('cadastro.js.criandoConta');

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

            alert(dados.erro || t('cadastro.js.erroCriarConta'));

            return;
        }

        alert(dados.mensagem);

        // Depois do cadastro, envia para o login
        window.location.href = '/login';

    } catch (erro) {

        console.error('Erro no cadastro:', erro);

        alert(t('cadastro.js.erroServidor'));

    } finally {

        botaoCadastrar.disabled = false;
        botaoCadastrar.textContent = t('cadastro.criarConta');

    }

});