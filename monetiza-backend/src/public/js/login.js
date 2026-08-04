const emailInput = document.getElementById('login-email'); 
const senhaInput = document.getElementById('login-senha'); 
const botaoEntrar = document.querySelector('.btn-primary');

botaoEntrar.addEventListener('click', function(event) {
    event.preventDefault();

    const emailValue = emailInput.value.trim();
    const senhaValue = senhaInput.value.trim();

    // 1. Validação de campos vazios
    if (emailValue === "" || senhaValue === "") {
        alert("Por favor, preencha todos os campos!");
        return; 
    }

    const emailCorreto = "admin@monetiza.com";
    const senhaCorreta = "123456";

    if (emailValue === emailCorreto && senhaValue === senhaCorreta) {
        alert("Login bem-sucedido! Seja bem-vindo à Monetiza.");
        localStorage.setItem('usuarioLogado', emailValue); 
        window.location.href = "/landing"; 
    } else {
        alert("E-mail ou senha incorretos. Tente novamente.");
    }
});