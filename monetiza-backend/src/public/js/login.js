const emailInput = document.getElementById('login-email');
const senhaInput = document.getElementById('login-senha');
const botaoEntrar = document.getElementById('btn-entrar');

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
        alert('Por favor, preencha o e-mail e a senha.');
        return;
    }

    try {
        botaoEntrar.disabled = true;
        botaoEntrar.textContent = 'Entrando...';

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
            alert(dados.erro || 'E-mail ou senha incorretos.');
            return;
        }

        // Salva o token gerado pelo back-end
        localStorage.setItem('token', dados.token);

        // Mantém as páginas atuais funcionando temporariamente
        localStorage.setItem('usuarioLogado', email);

        alert(dados.mensagem || 'Login realizado com sucesso!');

        window.location.href = '/landing';

    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        alert('Não foi possível conectar ao servidor.');

    } finally {
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = 'Entrar';
    }
}