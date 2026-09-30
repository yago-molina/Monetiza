const emailInput = document.getElementById('login-email')
const senhaInput = document.getElementById('login-senha')
const botaoEntrar = document.getElementById('btn-entrar')

const avisoLogin = document.getElementById('aviso-login')
const textoAvisoLogin = document.getElementById('aviso-login-texto')
const loadingLogin = document.getElementById('loading-login')

const t = chave => window.i18n?.t(chave) ?? chave

let loginEmAndamento = false

function mostrarAvisoLogin(mensagem) {
    textoAvisoLogin.textContent = mensagem

    if (!avisoLogin.open) {
        avisoLogin.showModal()
    }
}

loadingLogin.addEventListener('cancel', evento => {
    evento.preventDefault()
})

botaoEntrar.addEventListener('click', fazerLogin)

// Enter funciona nos campos, sem disparar outro login dentro do pop-up.
for (const input of [emailInput, senhaInput]) {
    input.addEventListener('keydown', evento => {
        if (evento.key === 'Enter' && !avisoLogin.open) {
            fazerLogin(evento)
        }
    })
}

function destinoAposLogin() {
    const retorno = sessionStorage.getItem('retornoCompra')

    if (retorno) {
        try {
            const url = new URL(retorno, window.location.origin)

            if (url.origin === window.location.origin) {
                sessionStorage.removeItem('retornoCompra')
                return url.pathname + url.search + url.hash
            }
        } catch {
            // Um endereço inválido usa o dashboard.
        }

        sessionStorage.removeItem('retornoCompra')
    }

    return '/landing'
}

async function fazerLogin(evento) {
    evento?.preventDefault()

    if (loginEmAndamento || avisoLogin.open) return

    const email = emailInput.value.trim()
    const senha = senhaInput.value

    if (!email || !senha) {
        mostrarAvisoLogin(t('login.js.camposObrigatorios'))
        return
    }

    loginEmAndamento = true
    botaoEntrar.disabled = true
    botaoEntrar.textContent = t('login.js.entrando')

    let redirecionando = false

    try {
        const resposta = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            mostrarAvisoLogin(
                dados.erro || t('login.js.credenciaisInvalidas')
            )
            return
        }

        if (typeof dados.token !== 'string' || !dados.token.trim()) {
            throw new Error('O servidor não retornou o token de login.')
        }

        localStorage.setItem('token', dados.token)
        localStorage.setItem('usuarioLogado', email)

        const destino = destinoAposLogin()
        const animacao = loadingLogin.querySelector('iframe')

        document.getElementById('loading-login-texto').textContent =
            dados.mensagem || t('login.js.sucesso')

        animacao.src = animacao.dataset.src
        loadingLogin.showModal()

        // Tempo para exibir uma sequência da logo após autenticar.
        await new Promise(resolve => setTimeout(resolve, 3200))

        window.location.assign(destino)
        redirecionando = true
    } catch (erro) {
        console.error('Erro ao fazer login:', erro)

        if (loadingLogin.open) {
            loadingLogin.close()
        }

        loadingLogin.querySelector('iframe').src = 'about:blank'

        mostrarAvisoLogin(t('login.js.erroServidor'))
    } finally {
        if (!redirecionando) {
            loginEmAndamento = false
            botaoEntrar.disabled = false
            botaoEntrar.textContent = t('login.entrar')
        }
    }
}