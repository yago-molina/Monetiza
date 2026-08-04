document.getElementById('btn-cadastrar').addEventListener('click', function(e) {
    e.preventDefault();

    // Leitura dos campos
    const username = document.getElementById('cadastro-username').value.trim();
    const email = document.getElementById('cadastro-email').value.trim();
    const senha = document.getElementById('cadastro-senha').value.trim();
    const repSenha = document.getElementById('cadastro-rep-senha').value.trim();
    const termos = document.getElementById('termos');

    // Validação de campos vazios
    if (username === "" || email === "" || senha === "" || repSenha === "") {
        alert("Por favor, preencha todos os campos do cadastro.");
        return;
    }

    // Validação de confirmação de senha
    if (senha !== repSenha) {
        alert("As senhas digitadas não coincidem!");
        return;
    }

    if (!termos.checked) {
        alert("Você precisa aceitar os termos para criar sua conta.");
        return;
    }

    localStorage.setItem('usuarioLogado', email);
    localStorage.setItem('usernameLogado', username);

    alert("Conta criada com sucesso!");
    window.location.href = "/landing";
});
