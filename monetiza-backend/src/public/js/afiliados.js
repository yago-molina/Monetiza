document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('usuarioLogado')

    const btnNovoLink = document.getElementById('btn-novo-link')
    const btnPrimeiroLink = document.getElementById('btn-primeiro-link')
    const btnFecharModal = document.getElementById('btn-fechar-modal')
    const btnCancelarModal = document.getElementById('btn-cancelar-modal')

    const modalNovoLink = document.getElementById('modal-novo-link')
    const formNovaAfiliacao = document.getElementById('form-nova-afiliacao')
    const selectProduto = document.getElementById('produto-afiliacao')

    const listaAfiliacoes = document.getElementById('lista-afiliacoes')
    const listaSolicitacoes = document.getElementById('lista-solicitacoes')

    if (!token) {
        alert('Acesso negado. Faça login primeiro.')
        window.location.href = '/'
        return
    }

    function headersAutenticados() {
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

    function formatarDinheiro(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    function alterarTexto(id, texto) {
        const elemento = document.getElementById(id)

        if (elemento) {
            elemento.textContent = texto
        }
    }

    async function verificarResposta(resposta) {
        if (resposta.status === 401) {
            encerrarSessao()
            throw new Error('Sessão encerrada')
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(
                dados.erro || 'Não foi possível completar a operação'
            )
        }

        return dados
    }

    async function carregarUsuario() {
        const resposta = await fetch('/usuario/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const dados = await verificarResposta(resposta)

        alterarTexto('nome-usuario', dados.usuario.nome)
        alterarTexto('email-usuario', email || '')
    }

    function criarEstadoVazioAfiliacoes() {
        listaAfiliacoes.innerHTML = `
            <div class="empty-state-container">
                <div class="link-icon-bg">
                    <i class="fa-solid fa-link"></i>
                </div>

                <p class="empty-text">
                    Você ainda não tem links de afiliado
                </p>

                <button type="button" class="btn-secondary" id="btn-vazio-link">
                    <i class="fa-solid fa-plus"></i> Criar Primeiro Link
                </button>
            </div>
        `

        document
            .getElementById('btn-vazio-link')
            .addEventListener('click', abrirModal)
    }

    function criarLinhaAfiliacao(afiliacao) {
        const linha = document.createElement('div')
        linha.className = 'afiliacao-row'

        const produto = document.createElement('span')
        produto.textContent = afiliacao.produto

        const cliques = document.createElement('span')
        cliques.textContent = afiliacao.cliques

        const conversoes = document.createElement('span')
        conversoes.textContent = afiliacao.conversoes

        const ganho = document.createElement('span')
        ganho.textContent = formatarDinheiro(afiliacao.total_ganho)

        const status = document.createElement('span')
        status.className =
            `status-afiliacao status-${afiliacao.status_afiliacao.toLowerCase()}`
        status.textContent = afiliacao.status_afiliacao

        const acoes = document.createElement('div')
        acoes.className = 'acoes-afiliacao'

        if (afiliacao.status_afiliacao === 'Ativa') {
            const btnCopiar = document.createElement('button')
            btnCopiar.type = 'button'
            btnCopiar.className = 'btn-acao'
            btnCopiar.innerHTML =
                '<i class="fa-regular fa-copy"></i> Copiar'

            btnCopiar.addEventListener('click', () => {
                copiarLink(afiliacao.codigo_link)
            })

            acoes.appendChild(btnCopiar)
        } else {
            const indisponivel = document.createElement('span')
            indisponivel.textContent = '—'
            acoes.appendChild(indisponivel)
        }

        linha.appendChild(produto)
        linha.appendChild(cliques)
        linha.appendChild(conversoes)
        linha.appendChild(ganho)
        linha.appendChild(status)
        linha.appendChild(acoes)

        return linha
    }

    async function copiarLink(codigo) {
        const link =
            `${window.location.origin}/vitrine?ref=${codigo}`

        try {
            await navigator.clipboard.writeText(link)
            alert('Link de afiliado copiado!')
        } catch {
            window.prompt('Copie seu link de afiliado:', link)
        }
    }

    async function carregarMinhasAfiliacoes() {
        const resposta = await fetch('/afiliacoes/minhas', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const dados = await verificarResposta(resposta)

        alterarTexto('total-cliques', dados.resumo.cliques)
        alterarTexto('total-conversoes', dados.resumo.conversoes)

        alterarTexto(
            'total-ganho',
            formatarDinheiro(dados.resumo.total_ganho)
        )

        listaAfiliacoes.innerHTML = ''

        if (dados.afiliacoes.length === 0) {
            criarEstadoVazioAfiliacoes()
            return
        }

        dados.afiliacoes.forEach(afiliacao => {
            listaAfiliacoes.appendChild(
                criarLinhaAfiliacao(afiliacao)
            )
        })
    }

    function criarLinhaSolicitacao(solicitacao) {
        const linha = document.createElement('div')
        linha.className = 'solicitacao-row'

        const produto = document.createElement('span')
        produto.textContent = solicitacao.produto

        const afiliado = document.createElement('span')
        afiliado.textContent = solicitacao.afiliado

        const comissao = document.createElement('span')
        comissao.textContent = `${Number(solicitacao.comissao)}%`

        const status = document.createElement('span')
        status.className =
            `status-afiliacao status-${solicitacao.status_afiliacao.toLowerCase()}`
        status.textContent = solicitacao.status_afiliacao

        const acoes = document.createElement('div')
        acoes.className = 'acoes-afiliacao'

        if (solicitacao.status_afiliacao === 'Pendente') {
            const btnAprovar = document.createElement('button')
            btnAprovar.type = 'button'
            btnAprovar.className = 'btn-acao'
            btnAprovar.textContent = 'Aprovar'

            btnAprovar.addEventListener('click', () => {
                atualizarStatus(solicitacao.id, 'Ativa')
            })

            const btnRejeitar = document.createElement('button')
            btnRejeitar.type = 'button'
            btnRejeitar.className = 'btn-acao'
            btnRejeitar.textContent = 'Rejeitar'

            btnRejeitar.addEventListener('click', () => {
                atualizarStatus(solicitacao.id, 'Rejeitada')
            })

            acoes.appendChild(btnAprovar)
            acoes.appendChild(btnRejeitar)
        } else if (solicitacao.status_afiliacao === 'Ativa') {
            const btnEncerrar = document.createElement('button')
            btnEncerrar.type = 'button'
            btnEncerrar.className = 'btn-acao'
            btnEncerrar.textContent = 'Encerrar'

            btnEncerrar.addEventListener('click', () => {
                atualizarStatus(solicitacao.id, 'Encerrada')
            })

            acoes.appendChild(btnEncerrar)
        } else {
            const indisponivel = document.createElement('span')
            indisponivel.textContent = '—'
            acoes.appendChild(indisponivel)
        }

        linha.appendChild(produto)
        linha.appendChild(afiliado)
        linha.appendChild(comissao)
        linha.appendChild(status)
        linha.appendChild(acoes)

        return linha
    }

    async function carregarSolicitacoesRecebidas() {
        const resposta = await fetch('/afiliacoes/recebidas', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const solicitacoes = await verificarResposta(resposta)

        listaSolicitacoes.innerHTML = ''

        if (solicitacoes.length === 0) {
            listaSolicitacoes.innerHTML = `
                <div class="empty-state-container">
                    <p class="empty-text">
                        Nenhuma solicitação recebida
                    </p>
                </div>
            `
            return
        }

        solicitacoes.forEach(solicitacao => {
            listaSolicitacoes.appendChild(
                criarLinhaSolicitacao(solicitacao)
            )
        })
    }

    async function carregarProdutosDisponiveis() {
        selectProduto.innerHTML =
            '<option value="">Carregando produtos...</option>'

        selectProduto.disabled = true

        const resposta = await fetch('/afiliacoes/disponiveis', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const produtos = await verificarResposta(resposta)

        selectProduto.innerHTML = ''

        if (produtos.length === 0) {
            const opcao = document.createElement('option')
            opcao.value = ''
            opcao.textContent = 'Nenhum produto disponível'

            selectProduto.appendChild(opcao)
            selectProduto.disabled = true
            return
        }

        const opcaoInicial = document.createElement('option')
        opcaoInicial.value = ''
        opcaoInicial.textContent = 'Selecione um produto'

        selectProduto.appendChild(opcaoInicial)

        produtos.forEach(produto => {
            const opcao = document.createElement('option')

            opcao.value = produto.id
            opcao.textContent =
                `${produto.titulo} — ${produto.produtor} — ` +
                `${Number(produto.comissao)}% de comissão`

            selectProduto.appendChild(opcao)
        })

        selectProduto.disabled = false
    }

    async function abrirModal() {
        modalNovoLink.classList.remove('hidden')

        try {
            await carregarProdutosDisponiveis()
        } catch (erro) {
            console.error('Erro ao carregar produtos:', erro)
            alert(erro.message)
            fecharModal()
        }
    }

    function fecharModal() {
        modalNovoLink.classList.add('hidden')
        formNovaAfiliacao.reset()
    }

    async function solicitarAfiliacao(evento) {
        evento.preventDefault()

        const produto_id = Number(selectProduto.value)

        if (!produto_id) {
            alert('Selecione um produto.')
            return
        }

        const botaoSalvar = formNovaAfiliacao.querySelector(
            'button[type="submit"]'
        )

        try {
            botaoSalvar.disabled = true
            botaoSalvar.textContent = 'Enviando...'

            const resposta = await fetch('/afiliacoes', {
                method: 'POST',
                headers: headersAutenticados(),
                body: JSON.stringify({ produto_id })
            })

            const dados = await verificarResposta(resposta)

            alert(dados.mensagem)
            fecharModal()

            await carregarMinhasAfiliacoes()
        } catch (erro) {
            console.error('Erro ao solicitar afiliação:', erro)
            alert(erro.message)
        } finally {
            botaoSalvar.disabled = false
            botaoSalvar.textContent = 'Solicitar Afiliação'
        }
    }

    async function atualizarStatus(id, status) {
        const confirmacoes = {
            Ativa: 'Deseja aprovar esta solicitação?',
            Rejeitada: 'Deseja rejeitar esta solicitação?',
            Encerrada: 'Deseja encerrar esta afiliação?'
        }

        if (!confirm(confirmacoes[status])) {
            return
        }

        try {
            const resposta = await fetch(
                `/afiliacoes/${id}/status`,
                {
                    method: 'PATCH',
                    headers: headersAutenticados(),
                    body: JSON.stringify({ status })
                }
            )

            const dados = await verificarResposta(resposta)

            alert(dados.mensagem)

            await Promise.all([
                carregarMinhasAfiliacoes(),
                carregarSolicitacoesRecebidas()
            ])
        } catch (erro) {
            console.error('Erro ao atualizar afiliação:', erro)
            alert(erro.message)
        }
    }

    btnNovoLink.addEventListener('click', abrirModal)

    if (btnPrimeiroLink) {
        btnPrimeiroLink.addEventListener('click', abrirModal)
    }

    btnFecharModal.addEventListener('click', fecharModal)
    btnCancelarModal.addEventListener('click', fecharModal)

    formNovaAfiliacao.addEventListener(
        'submit',
        solicitarAfiliacao
    )

    window.addEventListener('click', evento => {
        if (evento.target === modalNovoLink) {
            fecharModal()
        }
    })

    try {
        await carregarUsuario()

        await Promise.all([
            carregarMinhasAfiliacoes(),
            carregarSolicitacoesRecebidas()
        ])
    } catch (erro) {
        console.error('Erro ao carregar Afiliados:', erro)

        if (erro.message !== 'Sessão encerrada') {
            alert(erro.message)
        }
    }
})