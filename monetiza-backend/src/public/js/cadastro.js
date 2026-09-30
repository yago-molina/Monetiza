const t = chave => window.i18n?.t(chave) ?? chave

const botaoCadastrar = document.getElementById('btn-cadastrar')

botaoCadastrar.addEventListener('click', async function (evento) {
    evento.preventDefault()

    if (botaoCadastrar.disabled) return

    const nome = document.getElementById('cadastro-nome').value.trim()
    const email = document.getElementById('cadastro-email').value.trim()
    const senha = document.getElementById('cadastro-senha').value.trim()
    const repSenha = document.getElementById('cadastro-rep-senha').value.trim()
    const termos = document.getElementById('termos')

    if (!nome || !email || !senha || !repSenha) {
        await MonetizaUI.aviso(t('cadastro.js.camposObrigatorios'))
        return
    }

    if (senha.length < 8) {
        await MonetizaUI.aviso(t('cadastro.js.senhaMinima'))
        return
    }

    if (senha !== repSenha) {
        await MonetizaUI.aviso(t('cadastro.js.senhasDiferentes'))
        return
    }

    if (!termos.checked) {
        await MonetizaUI.aviso(t('cadastro.js.aceitarTermos'))
        return
    }

    try {
        botaoCadastrar.disabled = true
        botaoCadastrar.textContent = t('cadastro.js.criandoConta')

        const resposta = await fetch('/auth/cadastro', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                nome,
                email,
                senha
            })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            await MonetizaUI.aviso(
                dados.erro || t('cadastro.js.erroCriarConta')
            )
            return
        }

        MonetizaUI.abrirLoading()

        // Exibe a animação após a conta ser criada.
        await new Promise(resolve => setTimeout(resolve, 3200))

        window.location.href = '/login'
    } catch (erro) {
        MonetizaUI.fecharLoading()

        console.error('Erro no cadastro:', erro)

        await MonetizaUI.aviso(t('cadastro.js.erroServidor'))
    } finally {
        botaoCadastrar.disabled = false
        botaoCadastrar.textContent = t('cadastro.criarConta')
    }
});