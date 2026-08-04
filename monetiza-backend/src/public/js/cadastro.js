document.getElementById('btn-cadastrar').addEventListener('click', function(e) {
    e.preventDefault();

    const email = document.getElementById('cadastro-email').value.trim();
    const senha = document.getElementById('cadastro-senha').value.trim();
    const repSenha = document.getElementById('cadastro-rep-senha').value.trim();
    const termos = document.getElementById('termos');

    if (email === "" || senha === "" || repSenha === "") {
        alert("Por favor, preencha todos os campos do cadastro.");
        return;
    }

    if (senha !== repSenha) {
        alert("As senhas digitadas não coincidem!");
        return;
    }

    if (!termos.checked) {
        alert("Você precisa aceitar os termos para criar sua conta.");
        return;
    }

    alert("Conta criada com sucesso!");
    window.location.href = "../landing/landing.html";
});