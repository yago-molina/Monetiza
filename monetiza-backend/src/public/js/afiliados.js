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

    function normalizarStatus(status) {
        return String(status || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
    }

    async function verificarResposta(resposta) {
        if (resposta.status === 401) {
            encerrarSessao()
            throw new Error('Sessão encerrada')
        }

        let dados

        try {
            dados = await resposta.json()
        } catch {
            dados = {}
        }

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

        alterarTexto(
            'email-usuario',
            email || dados.usuario.email || ''
        )
    }

    function abrirModal() {
        modalNovoLink.classList.remove('hidden')

        carregarProdutosDisponiveis().catch(erro => {
            console.error('Erro ao carregar produtos:', erro)
            alert(erro.message)
            fecharModal()
        })
    }

    function fecharModal() {
        modalNovoLink.classList.add('hidden')
        formNovaAfiliacao.reset()
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

                <button
                    type="button"
                    class="btn-secondary"
                    id="btn-vazio-link"
                >
                    <i class="fa-solid fa-plus"></i>
                    Nova Conexão de Afiliado
                </button>
            </div>
        `

        const btnVazio = document.getElementById('btn-vazio-link')

        if (btnVazio) {
            btnVazio.addEventListener('click', abrirModal)
        }
    }

    function criarEstadoVazioSolicitacoes() {
        listaSolicitacoes.innerHTML = `
            <div class="empty-state-container">
                <p class="empty-text">
                    Nenhuma solicitação recebida
                </p>
            </div>
        `
    }

    function criarLinhaAfiliacao(afiliacao) {
        const linha = document.createElement('div')
        linha.className = 'afiliacao-row'

        const produto = document.createElement('span')
        produto.textContent = afiliacao.produto || 'Produto'

        const cliques = document.createElement('span')
        cliques.textContent = afiliacao.cliques ?? 0

        const conversoes = document.createElement('span')
        conversoes.textContent = afiliacao.conversoes ?? 0

        const ganho = document.createElement('span')
        ganho.textContent = formatarDinheiro(afiliacao.total_ganho)

        const status = document.createElement('span')

        status.className =
            `status-afiliacao status-${normalizarStatus(
                afiliacao.status_afiliacao
            )}`

        status.textContent = afiliacao.status_afiliacao

        const acoes = document.createElement('div')
        acoes.className = 'acoes-afiliacao'

        if (afiliacao.status_afiliacao === 'Ativa') {
            const btnCopiar = document.createElement('button')

            btnCopiar.type = 'button'
            btnCopiar.className = 'btn-acao'

            btnCopiar.innerHTML = `
                <i class="fa-regular fa-copy"></i>
                Copiar
            `

            btnCopiar.addEventListener('click', () => {
                copiarLink(afiliacao.codigo_link)
            })

            const btnEncerrar = document.createElement('button')

            btnEncerrar.type = 'button'
            btnEncerrar.className = 'btn-acao'

            btnEncerrar.innerHTML = `
                <i class="fa-solid fa-ban"></i>
                Encerrar
            `

            btnEncerrar.addEventListener('click', () => {
                atualizarStatus(
                    afiliacao.id,
                    'Encerrada'
                )
            })

            acoes.appendChild(btnCopiar)
            acoes.appendChild(btnEncerrar)
        } else if (
            afiliacao.status_afiliacao === 'Pendente'
        ) {
            const aguardando = document.createElement('span')
            aguardando.className = 'acao-indisponivel'
            aguardando.textContent = 'Aguardando aprovação'

            acoes.appendChild(aguardando)
        } else if (
            afiliacao.status_afiliacao === 'Rejeitada' ||
            afiliacao.status_afiliacao === 'Encerrada'
        ) {
            const btnSolicitarNovamente =
                document.createElement('button')

            btnSolicitarNovamente.type = 'button'
            btnSolicitarNovamente.className = 'btn-acao'

            btnSolicitarNovamente.innerHTML = `
                <i class="fa-solid fa-rotate-right"></i>
                Solicitar novamente
            `

            btnSolicitarNovamente.addEventListener(
                'click',
                () => solicitarNovamente(afiliacao.produto_id)
            )

            acoes.appendChild(btnSolicitarNovamente)
        }

        linha.appendChild(produto)
        linha.appendChild(cliques)
        linha.appendChild(conversoes)
        linha.appendChild(ganho)
        linha.appendChild(status)
        linha.appendChild(acoes)

        return linha
    }

    function criarLinhaSolicitacao(solicitacao) {
        const linha = document.createElement('div')
        linha.className = 'solicitacao-row'

        const produto = document.createElement('span')
        produto.textContent = solicitacao.produto || 'Produto'

        const afiliado = document.createElement('span')
        afiliado.textContent = solicitacao.afiliado || 'Afiliado'

        const comissao = document.createElement('span')

        comissao.textContent =
            `${Number(solicitacao.comissao || 0)}%`

        const status = document.createElement('span')

        status.className =
            `status-afiliacao status-${normalizarStatus(
                solicitacao.status_afiliacao
            )}`

        status.textContent = solicitacao.status_afiliacao

        const acoes = document.createElement('div')
        acoes.className = 'acoes-afiliacao'

        if (solicitacao.status_afiliacao === 'Pendente') {
            const btnAprovar = document.createElement('button')

            btnAprovar.type = 'button'
            btnAprovar.className = 'btn-acao'

            btnAprovar.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Aprovar
            `

            btnAprovar.addEventListener('click', () => {
                atualizarStatus(
                    solicitacao.id,
                    'Ativa'
                )
            })

            const btnRejeitar = document.createElement('button')

            btnRejeitar.type = 'button'
            btnRejeitar.className = 'btn-acao'

            btnRejeitar.innerHTML = `
                <i class="fa-solid fa-xmark"></i>
                Rejeitar
            `

            btnRejeitar.addEventListener('click', () => {
                atualizarStatus(
                    solicitacao.id,
                    'Rejeitada'
                )
            })

            acoes.appendChild(btnAprovar)
            acoes.appendChild(btnRejeitar)
        } else if (
            solicitacao.status_afiliacao === 'Ativa'
        ) {
            const btnEncerrar = document.createElement('button')

            btnEncerrar.type = 'button'
            btnEncerrar.className = 'btn-acao'

            btnEncerrar.innerHTML = `
                <i class="fa-solid fa-ban"></i>
                Encerrar
            `

            btnEncerrar.addEventListener('click', () => {
                atualizarStatus(
                    solicitacao.id,
                    'Encerrada'
                )
            })

            acoes.appendChild(btnEncerrar)
        } else {
            const indisponivel = document.createElement('span')

            indisponivel.className = 'acao-indisponivel'
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

    async function copiarLink(codigo) {
        if (!codigo) {
            alert('Este link de afiliado não está disponível.')
            return
        }

        const link =
            `${window.location.origin}/vitrine?ref=${codigo}`

        try {
            await navigator.clipboard.writeText(link)

            alert('Link de afiliado copiado!')
        } catch {
            window.prompt(
                'Copie seu link de afiliado:',
                link
            )
        }
    }

    async function carregarMinhasAfiliacoes() {
        const resposta = await fetch(
            '/afiliacoes/minhas',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const dados = await verificarResposta(resposta)

        alterarTexto(
            'total-cliques',
            dados.resumo?.cliques ?? 0
        )

        alterarTexto(
            'total-conversoes',
            dados.resumo?.conversoes ?? 0
        )

        alterarTexto(
            'total-ganho',
            formatarDinheiro(
                dados.resumo?.total_ganho ?? 0
            )
        )

        listaAfiliacoes.innerHTML = ''

        if (
            !dados.afiliacoes ||
            dados.afiliacoes.length === 0
        ) {
            criarEstadoVazioAfiliacoes()
            return
        }

        dados.afiliacoes.forEach(afiliacao => {
            listaAfiliacoes.appendChild(
                criarLinhaAfiliacao(afiliacao)
            )
        })
    }

    async function carregarSolicitacoesRecebidas() {
        const resposta = await fetch(
            '/afiliacoes/recebidas',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const solicitacoes =
            await verificarResposta(resposta)

        listaSolicitacoes.innerHTML = ''

        if (
            !solicitacoes ||
            solicitacoes.length === 0
        ) {
            criarEstadoVazioSolicitacoes()
            return
        }

        solicitacoes.forEach(solicitacao => {
            listaSolicitacoes.appendChild(
                criarLinhaSolicitacao(solicitacao)
            )
        })
    }

    async function carregarProdutosDisponiveis() {
        selectProduto.innerHTML = `
            <option value="">
                Carregando produtos...
            </option>
        `

        selectProduto.disabled = true

        const resposta = await fetch(
            '/afiliacoes/disponiveis',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const produtos =
            await verificarResposta(resposta)

        selectProduto.innerHTML = ''

        if (!produtos || produtos.length === 0) {
            const opcao = document.createElement('option')

            opcao.value = ''
            opcao.textContent =
                'Nenhum produto disponível'

            selectProduto.appendChild(opcao)
            selectProduto.disabled = true

            return
        }

        const opcaoInicial =
            document.createElement('option')

        opcaoInicial.value = ''
        opcaoInicial.textContent =
            'Selecione um produto'

        selectProduto.appendChild(opcaoInicial)

        produtos.forEach(produto => {
            const opcao =
                document.createElement('option')

            opcao.value = produto.id

            opcao.textContent =
                `${produto.titulo} — ` +
                `${produto.produtor} — ` +
                `${Number(produto.comissao || 0)}% de comissão`

            selectProduto.appendChild(opcao)
        })

        selectProduto.disabled = false
    }

    async function solicitarAfiliacao(evento) {
        evento.preventDefault()

        const produto_id = Number(selectProduto.value)

        if (!produto_id) {
            alert('Selecione um produto.')
            return
        }

        const botaoSalvar =
            formNovaAfiliacao.querySelector(
                'button[type="submit"]'
            )

        try {
            botaoSalvar.disabled = true
            botaoSalvar.textContent = 'Enviando...'

            const resposta = await fetch(
                '/afiliacoes',
                {
                    method: 'POST',
                    headers: headersAutenticados(),
                    body: JSON.stringify({
                        produto_id
                    })
                }
            )

            const dados =
                await verificarResposta(resposta)

            alert(dados.mensagem)

            fecharModal()

            await Promise.all([
                carregarMinhasAfiliacoes(),
                carregarProdutosDisponiveis()
            ])
        } catch (erro) {
            console.error(
                'Erro ao solicitar afiliação:',
                erro
            )

            alert(erro.message)
        } finally {
            botaoSalvar.disabled = false
            botaoSalvar.textContent =
                'Solicitar Afiliação'
        }
    }

    async function solicitarNovamente(produto_id) {
        const confirmar = confirm(
            'Deseja solicitar afiliação novamente para este produto?'
        )

        if (!confirmar) {
            return
        }

        try {
            const resposta = await fetch(
                '/afiliacoes',
                {
                    method: 'POST',
                    headers: headersAutenticados(),
                    body: JSON.stringify({
                        produto_id
                    })
                }
            )

            const dados =
                await verificarResposta(resposta)

            alert(dados.mensagem)

            await Promise.all([
                carregarMinhasAfiliacoes(),
                carregarSolicitacoesRecebidas()
            ])
        } catch (erro) {
            console.error(
                'Erro ao solicitar novamente:',
                erro
            )

            alert(erro.message)
        }
    }

    async function atualizarStatus(id, status) {
        const confirmacoes = {
            Ativa:
                'Deseja aprovar esta solicitação?',

            Rejeitada:
                'Deseja rejeitar esta solicitação?',

            Encerrada:
                'Deseja encerrar esta afiliação?'
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
                    body: JSON.stringify({
                        status
                    })
                }
            )

            const dados =
                await verificarResposta(resposta)

            alert(dados.mensagem)

            await Promise.all([
                carregarMinhasAfiliacoes(),
                carregarSolicitacoesRecebidas()
            ])
        } catch (erro) {
            console.error(
                'Erro ao atualizar afiliação:',
                erro
            )

            alert(erro.message)
        }
    }

    btnNovoLink.addEventListener(
        'click',
        abrirModal
    )

    if (btnPrimeiroLink) {
        btnPrimeiroLink.addEventListener(
            'click',
            abrirModal
        )
    }

    btnFecharModal.addEventListener(
        'click',
        fecharModal
    )

    btnCancelarModal.addEventListener(
        'click',
        fecharModal
    )

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
        console.error(
            'Erro ao carregar página de Afiliados:',
            erro
        )

        if (erro.message !== 'Sessão encerrada') {
            alert(erro.message)
        }
    }
})