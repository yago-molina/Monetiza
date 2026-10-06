document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const t = chave => window.i18n?.t(chave) ?? chave

    if (!token) {
        window.location.href = '/login'
        return
    }

    const listaCompras =
        document.getElementById('lista-compras')

    const comprasVazio =
        document.getElementById('compras-vazio')

    function escaparHtml(valor) {
        return String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }

    function formatarDinheiro(valor) {
        return Number(valor || 0).toLocaleString(window.i18n.locale(),
            {
                style: 'currency',
                currency: 'BRL'
            }
        )
    }

    function formatarData(data) {
        if (!data) return '-'

        return new Date(data).toLocaleDateString(window.i18n.locale()
        )
    }

    function classeStatus(status) {
        const valor =
            String(status || '')
                .toLowerCase()

        if (valor === 'pago') {
            return 'status-pago'
        }

        if (
            valor === 'cancelado' ||
            valor === 'reembolsado'
        ) {
            return 'status-cancelado'
        }

        return 'status-pendente'
    }

    function traduzirStatus(status) {
        const valor =
            String(status || '')
                .toLowerCase()

        if (valor === 'pago') {
            return t('minhasCompras.status.pago')
        }

        if (valor === 'pendente') {
            return t('minhasCompras.status.pendente')
        }

        if (valor === 'cancelado') {
            return t('minhasCompras.status.cancelado')
        }

        if (valor === 'reembolsado') {
            return t('minhasCompras.status.reembolsado')
        }

        return status || '-'
    }

    function traduzirPagamento(forma) {
        const valor =
            String(forma || '')
                .toLowerCase()

        const chave =
            `minhasCompras.formaPagamento.${valor}`

        const traducao = t(chave)

        return traducao === chave
            ? forma || '-'
            : traducao
    }

    function nomePdfProduto(titulo, id) {
        let nome = String(titulo || '').normalize('NFC')
            .replace(/[<>:"/\\|?*\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ')
            .replace(/\s+/g, ' ').trim()
            .replace(/(?:\.pdf)+$/i, '').replace(/^[. ]+|[. ]+$/g, '')
        nome = Array.from(nome).slice(0, 100).join('').replace(/[. ]+$/g, '')
        if (!nome) nome = `produto-${id}`
        if (/^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/i.test(nome)) nome = `Produto ${nome}`
        return `${nome}.pdf`
    }

    async function acessarProduto(compra, botao) {
        if (botao.dataset.ocupado === '1') return
        botao.dataset.ocupado = '1'
        botao.setAttribute('aria-busy', 'true')
        try {
            const resposta = await fetch(`/arquivos-produtos/${compra.produto_id}`, {
                cache: 'no-store',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if (!resposta.ok) {
                const dados = await resposta.json().catch(() => ({}))
                throw new Error(resposta.status === 401
                    ? window.i18n.t('complementos.suaSessaoExpirouEntreNovamente')
                    : dados.erro || window.i18n.t('complementos.naoFoiPossivelAcessarOProduto'))
            }
            if (resposta.headers.get('content-type')?.includes('application/json')) {
                const dados = await resposta.json()
                const url = new URL(dados.url)
                if (!['http:', 'https:'].includes(url.protocol)) {
                    throw new Error(window.i18n.t('complementos.enderecoInvalido'))
                }
                window.location.assign(url.href)
                return
            }
            const blob = await resposta.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = nomePdfProduto(compra.produto, compra.produto_id)
            document.body.appendChild(link)
            link.click()
            link.remove()
            setTimeout(() => URL.revokeObjectURL(url), 60000)
        } catch (erro) {
            await MonetizaUI.aviso(erro.message)
        } finally {
            delete botao.dataset.ocupado
            botao.removeAttribute('aria-busy')
        }
    }

    function criarCard(compra) {
        const card =
            document.createElement('div')

        card.className = 'compra-card'

        const podeAcessar =
            compra.status_venda === 'pago' &&
            compra.produto_arquivo

        card.innerHTML = `
            <div class="compra-capa">
                <img
                    src="${escaparHtml(compra.capa)}"
                    alt="${escaparHtml(compra.produto)}"
                >
            </div>

            <div class="compra-conteudo">
                <div class="compra-topo">
                    <div>
                        <span class="compra-categoria">
                            ${escaparHtml(compra.categoria)}
                        </span>

                        <h2 class="compra-titulo">
                            ${escaparHtml(compra.produto)}
                        </h2>
                    </div>

                    <span class="compra-status ${classeStatus(compra.status_venda)}">
                        ${traduzirStatus(compra.status_venda)}
                    </span>
                </div>

                <div class="compra-info">
                    <span>
                        ${t('minhasCompras.produtor')}:
                        <strong>
                            ${escaparHtml(compra.produtor)}
                        </strong>
                    </span>

                    <span>
                        ${t('minhasCompras.dataCompra')}:
                        <strong>
                            ${formatarData(compra.data_venda)}
                        </strong>
                    </span>

                    <span>
                        ${t('minhasCompras.pagamento')}:
                        <strong>
                            ${escaparHtml(traduzirPagamento(compra.forma_pagamento))}
                        </strong>
                    </span>
                </div>

                <div class="compra-rodape">
                    <div class="compra-valor">
                        <span>
                            ${t('minhasCompras.totalPago')}
                        </span>

                        <strong>
                            ${formatarDinheiro(compra.valor)}
                        </strong>
                    </div>

                    ${
                        podeAcessar
                            ? `
                                <a
                                    href="#"
                                    class="btn-acessar-produto"
                                >
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    ${t('minhasCompras.acessarProduto')}
                                </a>
                            `
                            : ''
                    }
                </div>
            </div>
        `

        const acessar = card.querySelector('.btn-acessar-produto')
        acessar?.addEventListener('click', evento => {
            evento.preventDefault()
            acessarProduto(compra, acessar)
        })

        return card
    }

    async function carregarCompras() {
        try {
            const resposta = await fetch(
                '/vendas/compras',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (resposta.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('usuarioLogado')
                window.location.href = '/login'
                return
            }

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    dados.erro ||
                    t('minhasCompras.erroCarregar')
                )
            }

            listaCompras.innerHTML = ''

            if (!dados.length) {
                comprasVazio.classList.remove('hidden')
                return
            }

            comprasVazio.classList.add('hidden')

            dados.forEach(compra => {
                listaCompras.appendChild(
                    criarCard(compra)
                )
            })
        } catch (erro) {
            console.error(
                'Erro ao carregar compras:',
                erro
            )

            await MonetizaUI.aviso(erro.message)
        }
    }

    await carregarCompras()
})