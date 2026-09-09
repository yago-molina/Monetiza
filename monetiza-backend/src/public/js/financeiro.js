document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('usuarioLogado')
    const t = chave => window.i18n?.t(chave) ?? chave

    const tabButtons = document.querySelectorAll('.tab-btn')
    const tabContents = document.querySelectorAll('.tab-content')

    const filtroTipo = document.getElementById('filter-tipo')
    const filtroPeriodo = document.getElementById('filter-periodo')

    const filtroStatusComissao =
        document.getElementById('filter-status-comissao')

    const filtroPapel =
        document.getElementById('filter-papel')

    const btnNovaTransacao =
        document.getElementById('btn-nova-transacao')

    let transacoes = []
    let comissoes = []

    if (!token) {
        alert(t('financeiro.js.acessoNegado'))
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

        alert(t('financeiro.js.sessaoExpirada'))
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
                t('financeiro.js.erroOperacao')
            )
        }

        return dados
    }

    function formatarDinheiro(valor) {
        return Number(valor || 0).toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        )
    }

    function formatarData(data) {
        if (!data) {
            return '-'
        }

        return new Date(data).toLocaleDateString(
            'pt-BR'
        )
    }

    function traduzirTipo(tipo) {
        if (tipo === 'Entrada') {
            return t('financeiro.js.tipo.entrada')
        }

        if (tipo === 'Saida') {
            return t('financeiro.js.tipo.saida')
        }

        return tipo
    }

    function traduzirPapel(papel) {
        if (papel === 'Produtor') {
            return t('financeiro.js.papel.produtor')
        }

        if (papel === 'Afiliado') {
            return t('financeiro.js.papel.afiliado')
        }

        return papel
    }

    function traduzirStatus(status) {
        const statusMap = {
            Liberado: 'liberado',
            Pendente: 'pendente',
            Cancelado: 'cancelado'
        }

        const chave = statusMap[status]

        if (!chave) {
            return status
        }

        return t(`financeiro.js.status.${chave}`)
    }

    async function carregarPerfil() {
        const resposta = await fetch(
            '/usuario/perfil',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const dados =
            await verificarResposta(resposta)

        const nomeUsuario =
            document.getElementById('nome-usuario')

        const emailUsuario =
            document.getElementById('email-usuario')

        if (nomeUsuario) {
            nomeUsuario.textContent =
                dados.usuario.nome
        }

        if (emailUsuario) {
            emailUsuario.textContent =
                email ||
                dados.usuario.email ||
                ''
        }
    }

    async function carregarResumo() {
        const resposta = await fetch(
            '/financeiro-api/resumo',
            {
                headers: headersAutenticados()
            }
        )

        const resumo =
            await verificarResposta(resposta)

        const saldo =
            document.querySelector(
                '.card-balance h2'
            )

        const submetricas =
            document.querySelectorAll(
                '.balance-submetrics strong'
            )

        const metricasGerais =
            document.querySelectorAll(
                '#tab-geral .metric-value'
            )

        if (saldo) {
            saldo.textContent =
                formatarDinheiro(
                    resumo.saldo_disponivel
                )
        }

        if (submetricas.length >= 2) {
            submetricas[0].textContent =
                formatarDinheiro(
                    resumo.total_entradas
                )

            submetricas[1].textContent =
                formatarDinheiro(
                    resumo.total_saidas
                )
        }

        if (metricasGerais.length >= 2) {
            metricasGerais[0].textContent =
                formatarDinheiro(
                    resumo.total_entradas
                )

            metricasGerais[1].textContent =
                formatarDinheiro(
                    resumo.total_saidas
                )
        }
    }

    async function carregarResumoComissoes() {
        const resposta = await fetch(
            '/financeiro-api/comissoes/resumo',
            {
                headers: headersAutenticados()
            }
        )

        const resumo =
            await verificarResposta(resposta)

        const cards =
            document.querySelectorAll(
                '#tab-comissoes .metric-value'
            )

        if (cards.length >= 3) {
            cards[0].textContent =
                formatarDinheiro(
                    resumo.liberadas
                )

            cards[1].textContent =
                formatarDinheiro(
                    resumo.pendentes
                )

            cards[2].textContent =
                formatarDinheiro(
                    resumo.total_acumulado
                )
        }
    }

    function criarLinhaTransacao(transacao) {
        const linha =
            document.createElement('div')

        linha.className = 'transacao-row'

        const tipo =
            document.createElement('span')

        tipo.textContent =
            traduzirTipo(transacao.tipo)

        const descricao =
            document.createElement('span')

        descricao.textContent =
            transacao.descricao

        const categoria =
            document.createElement('span')

        categoria.textContent =
            transacao.categoria

        const data =
            document.createElement('span')

        data.textContent =
            formatarData(
                transacao.data_movimentacao
            )

        const valor =
            document.createElement('span')

        valor.className = 'text-right'

        valor.textContent =
            formatarDinheiro(
                transacao.valor
            )

        linha.appendChild(tipo)
        linha.appendChild(descricao)
        linha.appendChild(categoria)
        linha.appendChild(data)
        linha.appendChild(valor)

        return linha
    }

    function criarLinhaComissao(comissao) {
        const linha =
            document.createElement('div')

        linha.className = 'comissao-row'

        const produto =
            document.createElement('span')

        produto.textContent =
            comissao.produto

        const papel =
            document.createElement('span')

        papel.textContent =
            traduzirPapel(comissao.papel)

        const data =
            document.createElement('span')

        data.textContent =
            formatarData(
                comissao.data_venda
            )

        const status =
            document.createElement('span')

        status.textContent =
            traduzirStatus(comissao.status)

        const valor =
            document.createElement('span')

        valor.className = 'text-right'

        valor.textContent =
            formatarDinheiro(
                comissao.valor
            )

        linha.appendChild(produto)
        linha.appendChild(papel)
        linha.appendChild(data)
        linha.appendChild(status)
        linha.appendChild(valor)

        return linha
    }

    function renderizarTransacoes() {
        const card =
            document.querySelector(
                '#tab-geral .table-card'
            )

        const estadoVazio =
            card.querySelector(
                '.empty-state-container'
            )

        card.querySelectorAll(
            '.transacao-row'
        ).forEach(linha => {
            linha.remove()
        })

        let lista = [...transacoes]

        if (
            filtroTipo &&
            filtroTipo.value !== 'todos'
        ) {
            lista = lista.filter(transacao => {
                if (
                    filtroTipo.value ===
                    'entradas'
                ) {
                    return (
                        transacao.tipo ===
                        'Entrada'
                    )
                }

                return (
                    transacao.tipo ===
                    'Saida'
                )
            })
        }

        if (
            filtroPeriodo &&
            filtroPeriodo.value !==
            'todo-periodo'
        ) {
            const agora = new Date()

            lista = lista.filter(transacao => {
                const data =
                    new Date(
                        transacao.data_movimentacao
                    )

                const diferenca =
                    agora - data

                const dias =
                    diferenca /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )

                if (
                    filtroPeriodo.value ===
                    'hoje'
                ) {
                    return (
                        agora.toDateString() ===
                        data.toDateString()
                    )
                }

                if (
                    filtroPeriodo.value ===
                    '7dias'
                ) {
                    return dias <= 7
                }

                if (
                    filtroPeriodo.value ===
                    '30dias'
                ) {
                    return dias <= 30
                }

                return true
            })
        }

        if (lista.length === 0) {
            estadoVazio.style.display = 'flex'
            return
        }

        estadoVazio.style.display = 'none'

        lista.forEach(transacao => {
            card.appendChild(
                criarLinhaTransacao(
                    transacao
                )
            )
        })
    }

    function renderizarComissoes() {
        const card =
            document.querySelector(
                '#tab-comissoes .table-card'
            )

        const estadoVazio =
            card.querySelector(
                '.empty-state-container'
            )

        card.querySelectorAll(
            '.comissao-row'
        ).forEach(linha => {
            linha.remove()
        })

        let lista = [...comissoes]

        if (
            filtroStatusComissao &&
            filtroStatusComissao.value !==
            'todos'
        ) {
            lista = lista.filter(comissao => {
                return (
                    comissao.status
                        .toLowerCase() ===
                    filtroStatusComissao.value
                )
            })
        }

        if (
            filtroPapel &&
            filtroPapel.value !==
            'todos'
        ) {
            lista = lista.filter(comissao => {
                return (
                    comissao.papel
                        .toLowerCase() ===
                    filtroPapel.value
                )
            })
        }

        if (lista.length === 0) {
            estadoVazio.style.display = 'flex'
            return
        }

        estadoVazio.style.display = 'none'

        lista.forEach(comissao => {
            card.appendChild(
                criarLinhaComissao(
                    comissao
                )
            )
        })
    }

    async function carregarTransacoes() {
        const resposta = await fetch(
            '/financeiro-api/transacoes',
            {
                headers: headersAutenticados()
            }
        )

        transacoes =
            await verificarResposta(resposta)

        renderizarTransacoes()
    }

    async function carregarComissoes() {
        const resposta = await fetch(
            '/financeiro-api/comissoes',
            {
                headers: headersAutenticados()
            }
        )

        comissoes =
            await verificarResposta(resposta)

        renderizarComissoes()
    }

    async function novaTransacao() {
        const tipo = window.prompt(
            t('financeiro.js.promptTipo')
        )

        if (!tipo) {
            return
        }

        let tipoFormatado =
            tipo.trim().toLowerCase()

        if (
            tipoFormatado === 'entrada' ||
            tipoFormatado ===
                t('financeiro.js.tipo.entrada')
                    .toLowerCase()
        ) {
            tipoFormatado = 'Entrada'
        } else if (
            tipoFormatado === 'saida' ||
            tipoFormatado === 'saída' ||
            tipoFormatado ===
                t('financeiro.js.tipo.saida')
                    .toLowerCase()
        ) {
            tipoFormatado = 'Saida'
        } else {
            alert(
                t('financeiro.js.tipoInvalido')
            )
            return
        }

        const descricao =
            window.prompt(
                t('financeiro.js.promptDescricao')
            )

        if (!descricao) {
            return
        }

        const valor =
            Number(
                window.prompt(
                    t('financeiro.js.promptValor')
                )
            )

        if (
            !Number.isFinite(valor) ||
            valor <= 0
        ) {
            alert(t('financeiro.js.valorInvalido'))
            return
        }

        try {
            const resposta = await fetch(
                '/financeiro-api/transacoes',
                {
                    method: 'POST',
                    headers:
                        headersAutenticados(),
                    body: JSON.stringify({
                        tipo: tipoFormatado,
                        descricao,
                        valor
                    })
                }
            )

            const dados =
                await verificarResposta(resposta)

            alert(dados.mensagem)

            await Promise.all([
                carregarResumo(),
                carregarTransacoes()
            ])
        } catch (erro) {
            console.error(
                'Erro ao registrar transação:',
                erro
            )

            alert(erro.message)
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener(
            'click',
            async evento => {
                evento.preventDefault()

                const targetTab =
                    button.dataset.tab

                tabButtons.forEach(btn => {
                    btn.classList.remove(
                        'active'
                    )
                })

                tabContents.forEach(content => {
                    content.classList.remove(
                        'active'
                    )
                })

                button.classList.add('active')

                const aba =
                    document.getElementById(
                        `tab-${targetTab}`
                    )

                if (aba) {
                    aba.classList.add('active')
                }

                if (
                    targetTab ===
                    'comissoes'
                ) {
                    try {
                        await Promise.all([
                            carregarResumoComissoes(),
                            carregarComissoes()
                        ])
                    } catch (erro) {
                        console.error(
                            'Erro ao carregar comissões:',
                            erro
                        )

                        if (
                            erro.message !==
                            'Sessão encerrada'
                        ) {
                            alert(erro.message)
                        }
                    }
                }
            }
        )
    })

    if (filtroTipo) {
        filtroTipo.addEventListener(
            'change',
            renderizarTransacoes
        )
    }

    if (filtroPeriodo) {
        filtroPeriodo.addEventListener(
            'change',
            renderizarTransacoes
        )
    }

    if (filtroStatusComissao) {
        filtroStatusComissao.addEventListener(
            'change',
            renderizarComissoes
        )
    }

    if (filtroPapel) {
        filtroPapel.addEventListener(
            'change',
            renderizarComissoes
        )
    }

    if (btnNovaTransacao) {
        btnNovaTransacao.addEventListener(
            'click',
            novaTransacao
        )
    }

    try {
        await carregarPerfil()

        await Promise.all([
            carregarResumo(),
            carregarTransacoes(),
            carregarResumoComissoes(),
            carregarComissoes()
        ])
    } catch (erro) {
        console.error(
            'Erro ao carregar Financeiro:',
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