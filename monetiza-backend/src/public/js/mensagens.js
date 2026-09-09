document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token')
    const t = chave => window.i18n?.t(chave) ?? chave
    let usuarioLogado = {}
    const emailLogado = localStorage.getItem('usuarioLogado')

    if (!token) {
        window.location.href = '/login'
        return
    }

    const nomeUsuario = document.getElementById('nome-usuario')
    const emailUsuario = document.getElementById('email-usuario')
    const btnNovaConversa = document.getElementById('btn-nova-conversa')
    const modalNovaConversa = document.getElementById('modal-nova-conversa')
    const btnFecharModal = document.getElementById('btn-fechar-modal-conversa')
    const buscaConversas = document.getElementById('busca-conversas')
    const buscaUsuarios = document.getElementById('busca-usuarios')
    const listaConversas = document.getElementById('lista-conversas')
    const listaUsuarios = document.getElementById('lista-usuarios')
    const listaMensagens = document.getElementById('lista-mensagens')
    const estadoChatVazio = document.getElementById('estado-chat-vazio')
    const chatAtivo = document.getElementById('chat-ativo')
    const chatUsuarioNome = document.getElementById('chat-usuario-nome')
    const chatAvatar = document.getElementById('chat-avatar')
    const formMensagem = document.getElementById('form-mensagem')
    const inputMensagem = document.getElementById('input-mensagem')
    const btnEnviar = document.getElementById('btn-enviar-mensagem')

    let contatos = []
    let conversas = []
    let conversaAtualId = null

    function headersAuth() {
        return {
            Authorization: `Bearer ${token}`
        }
    }

    function headersJson() {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    function verificarSessao(response) {
        if (response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('usuarioLogado')
            alert(t('mensagens.js.sessaoExpirada'))
            window.location.href = '/login'
            return false
        }

        return true
    }

    function escaparHtml(texto) {
        const div = document.createElement('div')
        div.textContent = texto ?? ''
        return div.innerHTML
    }

    function avatarHtml(foto) {
        if (foto) {
            return `
                <img
                    src="${escaparHtml(foto)}"
                    class="avatar-conversa-img"
                    alt="${t('mensagens.js.fotoPerfil')}"
                >
            `
        }

        return '<i class="fa-solid fa-circle-user"></i>'
    }

    function formatarHora(data) {
        if (!data) return ''

        const horario = new Date(data)

        return horario.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    function formatarDataConversa(data) {
        if (!data) return ''

        const dataMensagem = new Date(data)
        const hoje = new Date()

        const mesmoDia =
            dataMensagem.getDate() === hoje.getDate() &&
            dataMensagem.getMonth() === hoje.getMonth() &&
            dataMensagem.getFullYear() === hoje.getFullYear()

        if (mesmoDia) {
            return formatarHora(data)
        }

        return dataMensagem.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        })
    }

    function abrirModalNovaConversa() {
        if (!modalNovaConversa) return

        modalNovaConversa.classList.add('active')
        document.body.style.overflow = 'hidden'

        if (buscaUsuarios) {
            buscaUsuarios.value = ''
        }

        renderizarContatos(contatos)
    }

    function fecharModalNovaConversa() {
        if (!modalNovaConversa) return

        modalNovaConversa.classList.remove('active')
        document.body.style.overflow = ''
    }

    async function carregarUsuario() {
        try {
            const response = await fetch('/usuario/perfil', {
                headers: headersAuth()
            })

            if (!verificarSessao(response)) return false

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro ||
                    t('mensagens.js.erroCarregarUsuario')
                )
            }

            usuarioLogado = dados.usuario

            if (nomeUsuario) {
                nomeUsuario.textContent =
                    usuarioLogado.nome ||
                    t('mensagens.js.usuario')
            }

            if (emailUsuario) {
                emailUsuario.textContent =
                    usuarioLogado.email || emailLogado || ''
            }

            return true
        } catch (erro) {
            console.error('Erro ao carregar usuário:', erro)
            return false
        }
    }

    async function carregarContatos() {
        try {
            const response = await fetch('/mensagens-api/contatos', {
                headers: headersAuth()
            })

            if (!verificarSessao(response)) return

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro ||
                    t('mensagens.js.erroCarregarContatos')
                )
            }

            contatos = Array.isArray(dados) ? dados : []
            renderizarContatos(contatos)
        } catch (erro) {
            console.error('Erro ao carregar contatos:', erro)

            if (listaUsuarios) {
                listaUsuarios.innerHTML = `
                    <p class="usuarios-vazio">
                        ${t('mensagens.js.erroCarregarContatos')}
                    </p>
                `
            }
        }
    }

    function renderizarContatos(lista) {
        if (!listaUsuarios) return

        listaUsuarios.innerHTML = ''

        if (!lista.length) {
            listaUsuarios.innerHTML = `
                <p class="usuarios-vazio">
                    ${t('mensagens.js.nenhumContato')}
                </p>
            `
            return
        }

        lista.forEach(contato => {
            const item = document.createElement('button')

            item.type = 'button'
            item.className = 'usuario-item'

            item.innerHTML = `
                <div class="usuario-item-avatar">
                    ${avatarHtml(contato.foto_perfil)}
                </div>

                <div class="usuario-item-info">
                    <strong>${escaparHtml(contato.nome)}</strong>
                    <span>${escaparHtml(contato.email)}</span>
                    <small>
                        ${escaparHtml(contato.relacoes || '')}
                    </small>
                </div>
            `

            item.addEventListener('click', () => {
                criarConversa(contato.id)
            })

            listaUsuarios.appendChild(item)
        })
    }

    async function criarConversa(usuarioId) {
        try {
            const response = await fetch(
                '/mensagens-api/conversas',
                {
                    method: 'POST',
                    headers: headersJson(),
                    body: JSON.stringify({
                        usuario_id: usuarioId
                    })
                }
            )

            if (!verificarSessao(response)) return

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    t('mensagens.js.erroCriarConversa')
                )
            }

            fecharModalNovaConversa()
            await carregarConversas()

            if (resultado.conversa_id) {
                await abrirConversa(resultado.conversa_id)
            }
        } catch (erro) {
            console.error('Erro ao criar conversa:', erro)
            alert(erro.message)
        }
    }

    async function carregarConversas() {
        try {
            const response = await fetch(
                '/mensagens-api/conversas',
                {
                    headers: headersAuth()
                }
            )

            if (!verificarSessao(response)) return

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro ||
                    t('mensagens.js.erroCarregarConversas')
                )
            }

            conversas = Array.isArray(dados) ? dados : []
            renderizarConversas(conversas)
        } catch (erro) {
            console.error('Erro ao carregar conversas:', erro)

            if (listaConversas) {
                listaConversas.innerHTML = `
                    <div class="conversa-vazia">
                        ${t('mensagens.js.erroCarregarConversas')}
                    </div>
                `
            }
        }
    }

    function renderizarConversas(lista) {
        if (!listaConversas) return

        listaConversas.innerHTML = ''

        if (!lista.length) {
            listaConversas.innerHTML = `
                <div class="conversa-vazia">
                    ${t('mensagens.js.nenhumaConversa')}
                </div>
            `
            return
        }

        lista.forEach(conversa => {
            const item = document.createElement('button')

            item.type = 'button'
            item.className = 'conversa-item'

            if (
                Number(conversa.id) ===
                Number(conversaAtualId)
            ) {
                item.classList.add('active')
            }

            const ultimaMensagem =
                conversa.ultima_mensagem ||
                t('mensagens.js.conversaIniciada')

            const naoLidas =
                Number(conversa.nao_lidas || 0)

            item.innerHTML = `
                <div class="conversa-avatar">
                    ${avatarHtml(
                        conversa.outro_usuario_foto
                    )}
                </div>

                <div class="conversa-conteudo">
                    <div class="conversa-topo">
                        <strong>
                            ${escaparHtml(
                                conversa.outro_usuario_nome
                            )}
                        </strong>

                        <span>
                            ${formatarDataConversa(
                                conversa.ultima_mensagem_em ||
                                conversa.atualizado_em
                            )}
                        </span>
                    </div>

                    <div class="conversa-baixo">
                        <p>
                            ${escaparHtml(ultimaMensagem)}
                        </p>

                        ${
                            naoLidas > 0
                                ? `
                                    <span class="badge-nao-lidas">
                                        ${naoLidas}
                                    </span>
                                `
                                : ''
                        }
                    </div>
                </div>
            `

            item.addEventListener('click', () => {
                abrirConversa(conversa.id)
            })

            listaConversas.appendChild(item)
        })
    }

    async function abrirConversa(id) {
        try {
            conversaAtualId = Number(id)

            const url = new URL(window.location.href)
            url.searchParams.set(
                'conversa',
                conversaAtualId
            )

            window.history.replaceState(
                {},
                '',
                url
            )

            renderizarConversas(conversas)

            const response = await fetch(
                `/mensagens-api/conversas/${id}/mensagens`,
                {
                    headers: headersAuth()
                }
            )

            if (!verificarSessao(response)) return

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro ||
                    t('mensagens.js.erroCarregarMensagens')
                )
            }

            if (estadoChatVazio) {
                estadoChatVazio.classList.add('hidden')
            }

            if (chatAtivo) {
                chatAtivo.classList.remove('hidden')
            }

            if (chatUsuarioNome) {
                chatUsuarioNome.textContent =
                    dados.conversa.outro_usuario_nome
            }

            if (chatAvatar) {
                chatAvatar.innerHTML =
                    avatarHtml(
                        dados.conversa.outro_usuario_foto
                    )
            }

            renderizarMensagens(dados.mensagens)

            await marcarComoLidas(id)
            await carregarConversas()

            if (inputMensagem) {
                inputMensagem.focus()
            }
        } catch (erro) {
            console.error(
                'Erro ao abrir conversa:',
                erro
            )
            alert(erro.message)
        }
    }

    function renderizarMensagens(mensagens) {
        if (!listaMensagens) return

        listaMensagens.innerHTML = ''

        if (!mensagens.length) {
            listaMensagens.innerHTML = `
                <div class="mensagens-vazio">
                    ${t('mensagens.js.nenhumaMensagem')}
                    ${t('mensagens.js.enviePrimeiraMensagem')}
                </div>
            `
            return
        }

        mensagens.forEach(mensagem => {
            const minhaMensagem =
                Number(mensagem.remetente_id) ===
                Number(usuarioLogado.id)

            const item =
                document.createElement('div')

            item.className =
                minhaMensagem
                    ? 'mensagem mensagem-enviada'
                    : 'mensagem mensagem-recebida'

            item.innerHTML = `
                <div class="mensagem-balao">
                    <p>
                        ${escaparHtml(
                            mensagem.conteudo
                        )}
                    </p>

                    <span class="mensagem-hora">
                        ${formatarHora(
                            mensagem.enviado_em
                        )}
                    </span>
                </div>
            `

            listaMensagens.appendChild(item)
        })

        listaMensagens.scrollTop =
            listaMensagens.scrollHeight
    }

    async function enviarMensagem(event) {
        event.preventDefault()

        if (!conversaAtualId) {
            alert(t('mensagens.js.selecioneConversa'))
            return
        }

        if (!inputMensagem) return

        const conteudo =
            inputMensagem.value.trim()

        if (!conteudo) return

        if (btnEnviar) {
            btnEnviar.disabled = true
        }

        try {
            const response = await fetch(
                `/mensagens-api/conversas/${conversaAtualId}/mensagens`,
                {
                    method: 'POST',
                    headers: headersJson(),
                    body: JSON.stringify({
                        conteudo
                    })
                }
            )

            if (!verificarSessao(response)) return

            const resultado =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    t('mensagens.js.erroEnviarMensagem')
                )
            }

            inputMensagem.value = ''

            await abrirConversa(
                conversaAtualId
            )
        } catch (erro) {
            console.error(
                'Erro ao enviar mensagem:',
                erro
            )
            alert(erro.message)
        } finally {
            if (btnEnviar) {
                btnEnviar.disabled = false
            }

            if (inputMensagem) {
                inputMensagem.focus()
            }
        }
    }

    async function marcarComoLidas(id) {
        try {
            const response = await fetch(
                `/mensagens-api/conversas/${id}/lidas`,
                {
                    method: 'PATCH',
                    headers: headersJson(),
                    body: JSON.stringify({})
                }
            )

            if (!verificarSessao(response)) return

            if (!response.ok) {
                const resultado =
                    await response.json()

                throw new Error(
                    resultado.erro ||
                    t('mensagens.js.erroMarcarLidas')
                )
            }
        } catch (erro) {
            console.error(
                'Erro ao marcar mensagens como lidas:',
                erro
            )
        }
    }

    if (btnNovaConversa) {
        btnNovaConversa.addEventListener(
            'click',
            abrirModalNovaConversa
        )
    }

    if (btnFecharModal) {
        btnFecharModal.addEventListener(
            'click',
            fecharModalNovaConversa
        )
    }

    if (modalNovaConversa) {
        modalNovaConversa.addEventListener(
            'click',
            event => {
                if (
                    event.target ===
                    modalNovaConversa
                ) {
                    fecharModalNovaConversa()
                }
            }
        )
    }

    document.addEventListener(
        'keydown',
        event => {
            if (
                event.key === 'Escape' &&
                modalNovaConversa
                    ?.classList
                    .contains('active')
            ) {
                fecharModalNovaConversa()
            }
        }
    )

    if (formMensagem) {
        formMensagem.addEventListener(
            'submit',
            enviarMensagem
        )
    }

    if (inputMensagem) {
        inputMensagem.addEventListener(
            'keydown',
            event => {
                if (
                    event.key === 'Enter' &&
                    !event.shiftKey
                ) {
                    event.preventDefault()

                    if (formMensagem) {
                        formMensagem.requestSubmit()
                    }
                }
            }
        )
    }

    if (buscaUsuarios) {
        buscaUsuarios.addEventListener(
            'input',
            () => {
                const termo =
                    buscaUsuarios.value
                        .trim()
                        .toLowerCase()

                const filtrados =
                    contatos.filter(contato => {
                        return (
                            contato.nome
                                ?.toLowerCase()
                                .includes(termo) ||
                            contato.email
                                ?.toLowerCase()
                                .includes(termo) ||
                            contato.relacoes
                                ?.toLowerCase()
                                .includes(termo)
                        )
                    })

                renderizarContatos(
                    filtrados
                )
            }
        )
    }

    if (buscaConversas) {
        buscaConversas.addEventListener(
            'input',
            () => {
                const termo =
                    buscaConversas.value
                        .trim()
                        .toLowerCase()

                if (!termo) {
                    renderizarConversas(
                        conversas
                    )
                    return
                }

                const filtradas =
                    conversas.filter(
                        conversa => {
                            return (
                                conversa
                                    .outro_usuario_nome
                                    ?.toLowerCase()
                                    .includes(termo) ||
                                conversa
                                    .outro_usuario_email
                                    ?.toLowerCase()
                                    .includes(termo) ||
                                conversa
                                    .ultima_mensagem
                                    ?.toLowerCase()
                                    .includes(termo)
                            )
                        }
                    )

                renderizarConversas(
                    filtradas
                )
            }
        )
    }

    async function iniciarPagina() {
        const usuarioCarregado =
            await carregarUsuario()

        if (!usuarioCarregado) return

        await Promise.all([
            carregarContatos(),
            carregarConversas()
        ])

        const parametros =
            new URLSearchParams(
                window.location.search
            )

        const conversaId =
            Number(
                parametros.get('conversa')
            )

        if (!conversaId) return

        const conversaExiste =
            conversas.some(
                conversa =>
                    Number(conversa.id) ===
                    conversaId
            )

        if (conversaExiste) {
            await abrirConversa(
                conversaId
            )
        } else {
            const url =
                new URL(
                    window.location.href
                )

            url.searchParams.delete(
                'conversa'
            )

            window.history.replaceState(
                {},
                '',
                url
            )
        }
    }

    iniciarPagina()
})