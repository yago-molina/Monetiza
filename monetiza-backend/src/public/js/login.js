const emailInput = document.getElementById('login-email');

const senhaInput = document.getElementById('login-senha');

const botaoEntrar = document.getElementById('btn-entrar');

const t = chave => window.i18n?.t(chave) ?? chave

botaoEntrar.addEventListener('click', fazerLogin);

// Também permite entrar pressionando Enter

document.addEventListener('keydown', function (evento) {

    if (evento.key === 'Enter') {

        fazerLogin(evento);

    }

});

async function fazerLogin(evento) {

    evento.preventDefault();

    const email = emailInput.value.trim();

    const senha = senhaInput.value;

    // Verifica campos vazios

    if (email === '' || senha === '') {

        alert(t('login.js.camposObrigatorios'));

        return;

    }

    try {

        botaoEntrar.disabled = true;

        botaoEntrar.textContent = t('login.js.entrando');

        const resposta = await fetch('/auth/login', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                email,

                senha

            })

        });

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro || t('login.js.credenciaisInvalidas'));

            return;

        }

        // Salva o token gerado

        localStorage.setItem('token', dados.token);

        // Mantém as páginas atuais funcionando temporariamente

        localStorage.setItem('usuarioLogado', email);

        alert(dados.mensagem || t('login.js.sucesso'));

        window.location.href = '/landing';

    } catch (erro) {

        console.error('Erro ao fazer login:', erro);

        alert(t('login.js.erroServidor'));

    } finally {

        botaoEntrar.disabled = false;

        botaoEntrar.textContent = t('login.entrar');

    }

}