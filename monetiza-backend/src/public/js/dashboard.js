document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('usuarioLogado')

    if (!token) {
        alert('Acesso negado. Faça login primeiro.')
        window.location.href = '/'
        return
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

    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    function alterarTexto(id, texto) {
        const elemento = document.getElementById(id)

        if (elemento) {
            elemento.textContent = texto
        }
    }

    async function carregarUsuario() {
        const resposta = await fetch('/usuario/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (resposta.status === 401) {
            encerrarSessao()
            return false
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(
                dados.erro || 'Não foi possível carregar o usuário'
            )
        }

        alterarTexto('ola-usuario', dados.usuario.nome)
        alterarTexto('nome-usuario', dados.usuario.nome)
        alterarTexto('email-usuario', email || '')

        return true
    }

    function criarVendaRecente(venda) {
        const vendaElemento = document.createElement('div')
        vendaElemento.className = 'venda-recente'

        const informacoes = document.createElement('div')
        informacoes.className = 'venda-recente-informacoes'

        const titulo = document.createElement('strong')
        titulo.textContent = venda.produto

        const comprador = document.createElement('span')
        comprador.textContent = `Comprador: ${venda.comprador}`

        const detalhes = document.createElement('span')
        detalhes.textContent =
            `${formatarData(venda.data_venda)} • ` +
            `${venda.forma_pagamento} • ${venda.status_venda}`

        const valor = document.createElement('strong')
        valor.className = 'venda-recente-valor'
        valor.textContent = formatarDinheiro(venda.valor)

        informacoes.appendChild(titulo)
        informacoes.appendChild(comprador)
        informacoes.appendChild(detalhes)

        vendaElemento.appendChild(informacoes)
        vendaElemento.appendChild(valor)

        return vendaElemento
    }

    function renderizarVendasRecentes(vendas) {
        const lista = document.getElementById(
            'lista-vendas-recentes'
        )

        if (!lista) {
            return
        }

        lista.innerHTML = ''

        if (!vendas || vendas.length === 0) {
            const mensagem = document.createElement('div')
            mensagem.id = 'mensagem-sem-vendas'
            mensagem.className = 'no-sales-message'

            const texto = document.createElement('p')
            texto.textContent = 'Nenhuma venda ainda'

            mensagem.appendChild(texto)
            lista.appendChild(mensagem)

            return
        }

        vendas.forEach(venda => {
            lista.appendChild(criarVendaRecente(venda))
        })
    }

    async function carregarResumo() {
        const resposta = await fetch('/dashboard/resumo', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (resposta.status === 401) {
            encerrarSessao()
            return
        }

        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(
                dados.erro || 'Não foi possível carregar o Dashboard'
            )
        }

        alterarTexto(
            'vendas-totais',
            formatarDinheiro(dados.vendas_totais)
        )

        alterarTexto(
            'comissoes',
            formatarDinheiro(dados.comissoes)
        )

        alterarTexto(
            'produtos-ativos',
            dados.produtos_ativos
        )

        alterarTexto(
            'total-vendas',
            dados.total_vendas
        )

        alterarTexto(
            'saldo-disponivel',
            formatarDinheiro(dados.saldo_disponivel)
        )

        alterarTexto(
            'total-entradas',
            formatarDinheiro(dados.total_entradas)
        )

        alterarTexto(
            'total-saidas',
            formatarDinheiro(dados.total_saidas)
        )

        renderizarVendasRecentes(dados.vendas_recentes)
    }

    function configurarAcoesRapidas() {
        const acaoNovoProduto = document.getElementById(
            'acao-novo-produto'
        )

        const acaoGerarLink = document.getElementById(
            'acao-gerar-link'
        )

        const acaoNovoContrato = document.getElementById(
            'acao-novo-contrato'
        )

        const acaoMensagens = document.getElementById(
            'acao-mensagens'
        )

        if (acaoNovoProduto) {
            acaoNovoProduto.addEventListener('click', () => {
                window.location.href = '/produto'
            })
        }

        if (acaoGerarLink) {
            acaoGerarLink.addEventListener('click', () => {
                window.location.href = '/afiliados'
            })
        }

        if (acaoNovoContrato) {
            acaoNovoContrato.addEventListener('click', () => {
                window.location.href = '/contratos'
            })
        }

        if (acaoMensagens) {
            acaoMensagens.addEventListener('click', () => {
                window.location.href = '/mensagens'
            })
        }
    }

    try {
        configurarAcoesRapidas()

        const usuarioCarregado = await carregarUsuario()

        if (usuarioCarregado) {
            await carregarResumo()
        }
    } catch (erro) {
        console.error('Erro ao carregar o Dashboard:', erro)
        alert(erro.message)
    }
})