document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')

    const tabButtons = document.querySelectorAll('.tab-btn')
    const tabContents = document.querySelectorAll('.tab-content')

    const formPerfil = document.getElementById('form-perfil')
    const formPagamento = document.getElementById('form-pagamento')
    const btnPreferencias = document.getElementById('btn-salvar-preferencias')
    const formSeguranca = document.getElementById('form-seguranca')

    if (!token) {
        alert('Acesso negado. Faça login primeiro.')
        window.location.href = '/'
        return
    }

    function headers() {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    function encerrarSessao() {
        localStorage.removeItem('token')
        localStorage.removeItem('usuarioLogado')

        alert('Sua sessão expirou. Faça login novamente.')
        window.location.href = '/'
    }

    async function verificarResposta(resposta) {
        if (resposta.status === 401) {
            encerrarSessao()
            throw new Error('Sessão encerrada')
        }

        let dados = {}

        try {
            dados = await resposta.json()
        } catch {
            dados = {}
        }

        if (!resposta.ok) {
            throw new Error(
                dados.erro ||
                'Não foi possível completar a operação'
            )
        }

        return dados
    }

    async function carregarConfiguracoes() {
        const resposta = await fetch(
            '/configuracoes-api',
            {
                headers: headers()
            }
        )

        const dados = await verificarResposta(resposta)
        const usuario = dados.usuario

        document.getElementById('input-nome').value =
            usuario.nome || ''

        document.getElementById('input-email').value =
            usuario.email || ''

        document.getElementById('input-bio').value =
            usuario.bio || ''

        document.getElementById('input-telefone').value =
            usuario.telefone || ''

        const nomeMenu =
            document.getElementById('nome-usuario')

        const emailMenu =
            document.getElementById('email-usuario')

        if (nomeMenu) {
            nomeMenu.textContent = usuario.nome
        }

        if (emailMenu) {
            emailMenu.textContent = usuario.email
        }

        const preferencias = dados.preferencias

        document.getElementById('notif-vendas').checked =
            Boolean(preferencias.notificar_vendas)

        document.getElementById('notif-comissoes').checked =
            Boolean(preferencias.notificar_comissoes)

        document.getElementById('notif-mensagens').checked =
            Boolean(preferencias.notificar_mensagens)

        document.getElementById('notif-email').checked =
            Boolean(preferencias.notificar_email)

        const notifContratos =
            document.getElementById('notif-contratos')

        if (notifContratos) {
            notifContratos.checked =
                Boolean(preferencias.notificar_contratos)
        }

        const notifAfiliacoes =
            document.getElementById('notif-afiliacoes')

        if (notifAfiliacoes) {
            notifAfiliacoes.checked =
                Boolean(preferencias.notificar_afiliacoes)
        }

        if (dados.pagamento) {
            document.getElementById('nome-titular').value =
                dados.pagamento.nome_titular || ''

            document.getElementById('tipo-chave-pix').value =
                dados.pagamento.tipo_chave_pix || ''

            document.getElementById('chave-pix').value =
                dados.pagamento.chave_pix || ''
        }
    }

    async function salvarPerfil(evento) {
        evento.preventDefault()

        const nome =
            document.getElementById('input-nome').value

        const bio =
            document.getElementById('input-bio').value

        const telefone =
            document.getElementById('input-telefone').value

        try {
            const resposta = await fetch(
                '/configuracoes-api/perfil',
                {
                    method: 'PUT',
                    headers: headers(),
                    body: JSON.stringify({
                        nome,
                        bio,
                        telefone
                    })
                }
            )

            const dados = await verificarResposta(resposta)

            alert(dados.mensagem)

            await carregarConfiguracoes()
        } catch (erro) {
            alert(erro.message)
        }
    }

    async function salvarPreferencias() {
        const notifContratos =
            document.getElementById('notif-contratos')

        const notifAfiliacoes =
            document.getElementById('notif-afiliacoes')

        try {
            const resposta = await fetch(
                '/configuracoes-api/notificacoes',
                {
                    method: 'PUT',
                    headers: headers(),

                    body: JSON.stringify({
                        notificar_vendas:
                            document.getElementById(
                                'notif-vendas'
                            ).checked,

                        notificar_comissoes:
                            document.getElementById(
                                'notif-comissoes'
                            ).checked,

                        notificar_mensagens:
                            document.getElementById(
                                'notif-mensagens'
                            ).checked,

                        notificar_email:
                            document.getElementById(
                                'notif-email'
                            ).checked,

                        notificar_contratos:
                            notifContratos
                                ? notifContratos.checked
                                : true,

                        notificar_afiliacoes:
                            notifAfiliacoes
                                ? notifAfiliacoes.checked
                                : true
                    })
                }
            )

            const dados = await verificarResposta(resposta)

            alert(dados.mensagem)
        } catch (erro) {
            alert(erro.message)
        }
    }

    async function salvarPagamento(evento) {
        evento.preventDefault()

        const nome_titular =
            document.getElementById(
                'nome-titular'
            ).value

        const tipo_chave_pix =
            document.getElementById(
                'tipo-chave-pix'
            ).value

        const chave_pix =
            document.getElementById(
                'chave-pix'
            ).value

        try {
            const resposta = await fetch(
                '/configuracoes-api/pagamento',
                {
                    method: 'PUT',
                    headers: headers(),

                    body: JSON.stringify({
                        nome_titular,
                        tipo_chave_pix,
                        chave_pix
                    })
                }
            )

            const dados = await verificarResposta(resposta)

            alert(dados.mensagem)

            await carregarConfiguracoes()
        } catch (erro) {
            alert(erro.message)
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener(
            'click',
            () => {
                const aba = button.dataset.tab

                tabButtons.forEach(btn => {
                    btn.classList.remove('active')
                })

                tabContents.forEach(content => {
                    content.classList.remove('active')
                })

                button.classList.add('active')

                document.getElementById(
                    `tab-${aba}`
                )?.classList.add('active')
            }
        )
    })

    async function salvarSeguranca(evento) {
        evento.preventDefault()

        const senha_atual =
            document.getElementById('senha-atual').value

        const nova_senha =
            document.getElementById('nova-senha').value

        const confirmar_senha =
            document.getElementById('confirmar-senha').value

        if (nova_senha !== confirmar_senha) {
            alert('As novas senhas não coincidem.')
            return
        }

        try {
            const resposta = await fetch(
                '/configuracoes-api/seguranca',
                {
                    method: 'PUT',
                    headers: headers(),
                    body: JSON.stringify({
                        senha_atual,
                        nova_senha,
                        confirmar_senha
                    })
                }
            )

            const dados = await verificarResposta(resposta)

            alert(dados.mensagem)

            formSeguranca.reset()
        } catch (erro) {
            alert(erro.message)
        }
    }

    if (formPerfil) {
        formPerfil.addEventListener(
            'submit',
            salvarPerfil
        )
    }

    if (formPagamento) {
        formPagamento.addEventListener(
            'submit',
            salvarPagamento
        )
    }

    if (formSeguranca) {
        formSeguranca.addEventListener(
            'submit',
            salvarSeguranca
        )
    }

    if (btnPreferencias) {
        btnPreferencias.addEventListener(
            'click',
            salvarPreferencias
        )
    }

    try {
        await carregarConfiguracoes()
    } catch (erro) {
        console.error(
            'Erro ao carregar Configurações:',
            erro
        )

        if (
            erro.message !==
            'Sessão encerrada'
        ) {
            alert(erro.message)
        }
    }
})