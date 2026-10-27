document.addEventListener('DOMContentLoaded', async () => {
    const painel = document.getElementById('landing-ranking')
    if (!painel) return

    const elemento = id => document.getElementById(id)

    const idiomaAtual = String(
        window.i18n?.obterIdiomaAtual?.() ||
        document.documentElement.lang ||
        'pt-BR'
    ).toLowerCase()

    const idioma = idiomaAtual.startsWith('en')
        ? 'en'
        : idiomaAtual.startsWith('es')
            ? 'es'
            : 'pt-BR'

    const traducoes = {
        'pt-BR': {
            titulo: 'Mais vendidos',
            carregando: 'Carregando produtos...',
            vazio: 'Ainda não há produtos com vendas concluídas.',
            erro: 'Não foi possível carregar os produtos. Recarregue a página.',
            anterior: 'Produto anterior',
            proximo: 'Próximo produto',
            ver: 'Ver produto →',
            vendas: quantidade =>
                `${quantidade} ${quantidade === 1 ? 'venda' : 'vendas'}`
        },
        en: {
            titulo: 'Best sellers',
            carregando: 'Loading products...',
            vazio: 'There are no products with completed sales yet.',
            erro: 'Unable to load products. Reload the page.',
            anterior: 'Previous product',
            proximo: 'Next product',
            ver: 'View product →',
            vendas: quantidade =>
                `${quantidade} ${quantidade === 1 ? 'sale' : 'sales'}`
        },
        es: {
            titulo: 'Más vendidos',
            carregando: 'Cargando productos...',
            vazio: 'Todavía no hay productos con ventas completadas.',
            erro: 'No se pudieron cargar los productos. Recarga la página.',
            anterior: 'Producto anterior',
            proximo: 'Siguiente producto',
            ver: 'Ver producto →',
            vendas: quantidade =>
                `${quantidade} ${quantidade === 1 ? 'venta' : 'ventas'}`
        }
    }

    const textos = traducoes[idioma]
    const status = elemento('ranking-status')
    const link = elemento('ranking-produto')
    const imagem = elemento('ranking-imagem')
    const semImagem = elemento('ranking-sem-imagem')
    const controles = elemento('ranking-controles')
    const anterior = elemento('ranking-anterior')
    const proximo = elemento('ranking-proximo')

    elemento('ranking-titulo').textContent = textos.titulo
    elemento('ranking-ver').textContent = textos.ver
    status.textContent = textos.carregando
    anterior.setAttribute('aria-label', textos.anterior)
    proximo.setAttribute('aria-label', textos.proximo)

    let produtos = []
    let indice = 0

    let temporizador = null

    function pararRotacao() {
        clearInterval(temporizador)
        temporizador = null
    }

    function iniciarRotacao() {
        pararRotacao()

        if (
            produtos.length < 2 ||
            document.hidden ||
            painel.matches(':hover') ||
            painel.contains(document.activeElement)
        ) return

        temporizador = setInterval(() => {
            indice = (indice + 1) % produtos.length
            mostrarProduto()
        }, 5000)
    }

    painel.addEventListener('mouseenter', pararRotacao)
    painel.addEventListener('mouseleave', iniciarRotacao)

    painel.addEventListener('focusin', pararRotacao)

    painel.addEventListener('focusout', () => {
        // Aguarda o navegador atualizar qual elemento recebeu o foco.
        setTimeout(iniciarRotacao, 0)
    })

    document.addEventListener('visibilitychange', iniciarRotacao)
    window.addEventListener('pagehide', pararRotacao)
    window.addEventListener('pageshow', iniciarRotacao)

    function enderecoImagem(valor) {
        if (typeof valor !== 'string' || !valor.trim()) return null

        try {
            const url = new URL(valor, window.location.origin)

            return ['http:', 'https:'].includes(url.protocol)
                ? url.href
                : null
        } catch {
            return null
        }
    }

    imagem.addEventListener('error', () => {
        imagem.hidden = true
        semImagem.hidden = false
    })

    function mostrarProduto() {
        const produto = produtos[indice]

        link.href = `/vitrine/produto/${encodeURIComponent(produto.id)}`

        elemento('ranking-nome').textContent = produto.titulo
        elemento('ranking-categoria').textContent = produto.categoria || ''
        elemento('ranking-vendas').textContent = textos.vendas(
            Number(produto.total_vendas)
        )

        elemento('ranking-preco').textContent = new Intl.NumberFormat(
            idioma,
            {
                style: 'currency',
                currency: 'BRL'
            }
        ).format(Number(produto.preco) || 0)

        elemento('ranking-posicao').textContent =
            `${indice + 1} / ${produtos.length}`

        const capa = enderecoImagem(produto.capa)

        imagem.hidden = !capa
        semImagem.hidden = Boolean(capa)
        imagem.alt = produto.titulo || ''

        if (capa) {
            imagem.src = capa
        } else {
            imagem.removeAttribute('src')
        }

        status.hidden = true
        link.hidden = false
        controles.hidden = produtos.length < 2
    }

    anterior.addEventListener('click', () => {
        indice = (indice - 1 + produtos.length) % produtos.length
        mostrarProduto()
        iniciarRotacao()
    })

    proximo.addEventListener('click', () => {
        indice = (indice + 1) % produtos.length
        mostrarProduto()
        iniciarRotacao()
    })
 
    try {
        const resposta = await fetch('/vitrine-api/produtos')

        if (!resposta.ok) {
            throw new Error(`Erro ao consultar produtos: ${resposta.status}`)
        }

        const dados = await resposta.json()

        if (!Array.isArray(dados)) {
            throw new Error('Formato inesperado na resposta de produtos')
        }

        produtos = dados
            .filter(produto => Number(produto.total_vendas) > 0)
            .sort((a, b) => {
                const diferenca =
                    Number(b.total_vendas) - Number(a.total_vendas)

                // Empate em vendas: produto com maior ID primeiro.
                return diferenca || Number(b.id) - Number(a.id)
            })
            .slice(0, 5)

        if (!produtos.length) {
            status.textContent = textos.vazio
            return
        }

        mostrarProduto()
        iniciarRotacao()
    } catch (erro) {
        console.error('Erro no ranking da landing:', erro)
        status.textContent = textos.erro
    }
})