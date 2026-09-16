document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token')

    if (!token) return

    const botao = document.getElementById('btn-notificacoes')
    const menu = document.getElementById('menu-notificacoes')
    const contador = document.getElementById('contador-notificacoes')
    const lista = document.getElementById('lista-notificacoes')
    const marcarTodas = document.getElementById('marcar-todas-notificacoes')

    if (!botao || !menu || !contador || !lista) return

    const t = chave => window.i18n?.t(chave) ?? chave

    function obterIcone(tipo) {
        const icones = {
            venda: 'fa-cart-shopping',
            comissao: 'fa-dollar-sign',
            mensagem: 'fa-comment-dots',
            email: 'fa-envelope',
            contrato: 'fa-file-contract',
            afiliacao: 'fa-handshake'
        }

        return icones[tipo] || 'fa-bell'
    }

    async function carregarContador() {
        try {
            const resposta = await fetch('/notificacoes-api/nao-lidas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!resposta.ok) return

            const dados = await resposta.json()
            const total = Number(dados.total || 0)

            contador.textContent = total > 99 ? '99+' : total

            if (total > 0) {
                contador.classList.add('visivel')
            } else {
                contador.classList.remove('visivel')
            }
        } catch (erro) {
            console.error('Erro ao carregar contador de notificações:', erro)
        }
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    function renderizarNotificacoes(notificacoes) {
        lista.innerHTML = ''

        if (!notificacoes || notificacoes.length === 0) {
            lista.innerHTML = `
                <div class="notificacoes-vazio">
                    <i class="fa-regular fa-bell-slash"></i>
                    <span>${t('notificacoes.vazio')}</span>
                </div>
            `
            return
        }

        notificacoes.forEach(notificacao => {
            const item = document.createElement('div')
            item.className = 'notificacao-item'

            if (!notificacao.lida) {
                item.classList.add('nao-lida')
            }

            item.innerHTML = `
                <div class="notificacao-icone">
                    <i class="fa-solid ${obterIcone(notificacao.tipo)}"></i>
                </div>

                <div class="notificacao-conteudo">
                    <span class="notificacao-titulo">
                        ${notificacao.titulo}
                    </span>

                    <span class="notificacao-mensagem">
                        ${notificacao.mensagem}
                    </span>

                    <span class="notificacao-data">
                        ${formatarData(notificacao.criado_em)}
                    </span>
                </div>
            `

            item.addEventListener('click', async () => {
                if (!notificacao.lida) {
                    await fetch(
                        `/notificacoes-api/${notificacao.id}/lida`,
                        {
                            method: 'PUT',
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    )
                }

                if (notificacao.link) {
                    window.location.href = notificacao.link
                    return
                }

                item.classList.remove('nao-lida')
                carregarContador()
            })

            lista.appendChild(item)
        })
    }

    async function carregarNotificacoes() {
        try {
            const resposta = await fetch('/notificacoes-api', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!resposta.ok) return

            const notificacoes = await resposta.json()
            renderizarNotificacoes(notificacoes)
        } catch (erro) {
            console.error('Erro ao carregar notificações:', erro)
        }
    }

    botao.addEventListener('click', async evento => {
        evento.preventDefault()
        evento.stopPropagation()

        const aberto = menu.classList.toggle('aberto')

        if (aberto) {
            await carregarNotificacoes()
        }
    })

    marcarTodas?.addEventListener('click', async evento => {
        evento.stopPropagation()

        try {
            const resposta = await fetch(
                '/notificacoes-api/marcar-todas/lidas',
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!resposta.ok) return

            await carregarNotificacoes()
            await carregarContador()
        } catch (erro) {
            console.error(
                'Erro ao marcar notificações:',
                erro
            )
        }
    })

    document.addEventListener('click', evento => {
        if (!menu.contains(evento.target) && !botao.contains(evento.target)) {
            menu.classList.remove('aberto')
        }
    })

    carregarContador()
})