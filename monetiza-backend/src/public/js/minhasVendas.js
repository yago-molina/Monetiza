document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('usuarioLogado')
    const t = chave => window.i18n?.t(chave) ?? chave

    const botoesAba = document.querySelectorAll('.tab-btn')
    const tabela = document.getElementById('lista-vendas')
    const cabecalhoTabela = document.querySelector('.table-header')
    const estadoVazio = document.querySelector('.empty-sales-state')

    if (!token) {
        alert(t('minhasVendas.js.acessoNegado'))
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

        alert(t('minhasVendas.js.sessaoExpirada'))
        window.location.href = '/'
    }

    function formatarDinheiro(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    function formatarData(data) {
        if (!data) {
            return '-'
        }

        return new Date(data).toLocaleDateString('pt-BR')
    }

    function formatarStatus(status) {
        const mapa = {
            pago: t('minhasVendas.js.status.pago'),
            pendente: t('minhasVendas.js.status.pendente'),
            cancelado: t('minhasVendas.js.status.cancelado'),
            reembolsado: t('minhasVendas.js.status.reembolsado')
        }

        return mapa[status] || status
    }

    function classeStatus(status) {
        return `status-venda status-${status}`
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
                t('minhasVendas.js.erroOperacao')
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

        const nomeUsuario = document.getElementById('nome-usuario')
        const emailUsuario = document.getElementById('email-usuario')

        if (nomeUsuario) {
            nomeUsuario.textContent = dados.usuario.nome
        }

        if (emailUsuario) {
            emailUsuario.textContent =
                email || dados.usuario.email || ''
        }
    }

    async function carregarResumo() {
        const resposta = await fetch('/vendas/resumo', {
            headers: headersAutenticados()
        })

        const resumo = await verificarResposta(resposta)

        const cards = document.querySelectorAll('.metric-value')

        if (cards.length >= 4) {
            cards[0].textContent =
                formatarDinheiro(resumo.total_vendas)

            cards[1].textContent =
                formatarDinheiro(resumo.total_comissoes)

            cards[2].textContent =
                resumo.vendas_vendedor

            cards[3].textContent =
                resumo.vendas_afiliado
        }
    }

    function limparTabela() {
        const linhasExistentes =
            tabela.querySelectorAll('.venda-row, .comissao-row')

        linhasExistentes.forEach(linha => {
            linha.remove()
        })
    }

    function mostrarEstadoVazio(texto) {
        estadoVazio.innerHTML = `
            <p>${texto}</p>
        `

        estadoVazio.style.display = 'flex'
    }

    function esconderEstadoVazio() {
        estadoVazio.style.display = 'none'
    }

    function configurarCabecalhoVendas() {
        cabecalhoTabela.innerHTML = `
            <span>${t('minhasVendas.js.produto')}</span>
            <span>${t('minhasVendas.js.comprador')}</span>
            <span>${t('minhasVendas.js.data')}</span>
            <span>${t('minhasVendas.js.statusTitulo')}</span>
            <span class="text-right">${t('minhasVendas.js.valor')}</span>
        `
    }

    function configurarCabecalhoComissoes() {
        cabecalhoTabela.innerHTML = `
            <span>${t('minhasVendas.js.produto')}</span>
            <span>${t('minhasVendas.js.comprador')}</span>
            <span>${t('minhasVendas.js.data')}</span>
            <span>${t('minhasVendas.js.statusTitulo')}</span>
            <span class="text-right">${t('minhasVendas.js.comissao')}</span>
        `
    }

    function criarLinhaVenda(venda) {
        const linha = document.createElement('div')
        linha.className = 'venda-row'

        const produto = document.createElement('span')
        produto.textContent = venda.produto

        const comprador = document.createElement('span')
        comprador.textContent = venda.comprador

        const data = document.createElement('span')
        data.textContent = formatarData(venda.data_venda)

        const status = document.createElement('span')
        status.className = classeStatus(venda.status_venda)
        status.textContent = formatarStatus(venda.status_venda)

        const valor = document.createElement('span')
        valor.className = 'text-right'
        valor.textContent = formatarDinheiro(venda.valor)

        linha.appendChild(produto)
        linha.appendChild(comprador)
        linha.appendChild(data)
        linha.appendChild(status)
        linha.appendChild(valor)

        return linha
    }

    function criarLinhaComissao(comissao) {
        const linha = document.createElement('div')
        linha.className = 'comissao-row'

        const produto = document.createElement('span')
        produto.textContent = comissao.produto

        const comprador = document.createElement('span')
        comprador.textContent = comissao.comprador

        const data = document.createElement('span')
        data.textContent = formatarData(comissao.data_venda)

        const status = document.createElement('span')
        status.className =
            classeStatus(comissao.status_venda)

        status.textContent =
            formatarStatus(comissao.status_venda)

        const valor = document.createElement('span')
        valor.className = 'text-right'
        valor.textContent =
            formatarDinheiro(comissao.valor)

        linha.appendChild(produto)
        linha.appendChild(comprador)
        linha.appendChild(data)
        linha.appendChild(status)
        linha.appendChild(valor)

        return linha
    }

    async function carregarVendas() {
        configurarCabecalhoVendas()
        limparTabela()

        const resposta = await fetch('/vendas/minhas', {
            headers: headersAutenticados()
        })

        const vendas = await verificarResposta(resposta)

        const botaoVendas =
            document.querySelector('[data-tab="vendas"]')

        if (botaoVendas) {
            botaoVendas.textContent =
                `${t('minhasVendas.js.minhasVendas')} (${vendas.length})`
        }

        if (vendas.length === 0) {
            mostrarEstadoVazio(
                t('minhasVendas.js.nenhumaVenda')
            )

            return
        }

        esconderEstadoVazio()

        vendas.forEach(venda => {
            const linha = criarLinhaVenda(venda)

            tabela.appendChild(linha)
        })
    }

    async function carregarComissoes() {
        configurarCabecalhoComissoes()
        limparTabela()

        const resposta = await fetch(
            '/vendas/comissoes',
            {
                headers: headersAutenticados()
            }
        )

        const comissoes =
            await verificarResposta(resposta)

        const botaoComissoes =
            document.querySelector('[data-tab="comissoes"]')

        if (botaoComissoes) {
            botaoComissoes.textContent =
                `${t('minhasVendas.js.comissoes')} (${comissoes.length})`
        }

        if (comissoes.length === 0) {
            mostrarEstadoVazio(
                t('minhasVendas.js.nenhumaComissao')
            )

            return
        }

        esconderEstadoVazio()

        comissoes.forEach(comissao => {
            const linha =
                criarLinhaComissao(comissao)

            tabela.appendChild(linha)
        })
    }

    async function alternarAba(aba) {
        botoesAba.forEach(botao => {
            botao.classList.remove('active')
        })

        const botaoAtivo =
            document.querySelector(
                `[data-tab="${aba}"]`
            )

        if (botaoAtivo) {
            botaoAtivo.classList.add('active')
        }

        try {
            if (aba === 'comissoes') {
                await carregarComissoes()
            } else {
                await carregarVendas()
            }
        } catch (erro) {
            console.error(
                'Erro ao carregar aba:',
                erro
            )

            if (erro.message !== 'Sessão encerrada') {
                alert(erro.message)
            }
        }
    }

    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            const aba = botao.dataset.tab

            alternarAba(aba)
        })
    })

    try {
        await carregarUsuario()
        await carregarResumo()

        const [
            respostaVendas,
            respostaComissoes
        ] = await Promise.all([
            fetch('/vendas/minhas', {
                headers: headersAutenticados()
            }),
            fetch('/vendas/comissoes', {
                headers: headersAutenticados()
            })
        ])

        const vendas =
            await verificarResposta(respostaVendas)

        const comissoes =
            await verificarResposta(respostaComissoes)

        const botaoVendas =
            document.querySelector(
                '[data-tab="vendas"]'
            )

        const botaoComissoes =
            document.querySelector(
                '[data-tab="comissoes"]'
            )

        if (botaoVendas) {
            botaoVendas.textContent =
                `${t('minhasVendas.js.minhasVendas')} (${vendas.length})`
        }

        if (botaoComissoes) {
            botaoComissoes.textContent =
                `${t('minhasVendas.js.comissoes')} (${comissoes.length})`
        }

        configurarCabecalhoVendas()
        limparTabela()

        if (vendas.length === 0) {
            mostrarEstadoVazio(
                t('minhasVendas.js.nenhumaVenda')
            )
        } else {
            esconderEstadoVazio()

            vendas.forEach(venda => {
                tabela.appendChild(
                    criarLinhaVenda(venda)
                )
            })
        }
    } catch (erro) {
        console.error(
            'Erro ao carregar Minhas Vendas:',
            erro
        )

        if (erro.message !== 'Sessão encerrada') {
            alert(erro.message)
        }
    }
})