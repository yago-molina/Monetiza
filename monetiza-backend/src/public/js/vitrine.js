document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token')
    const t = chave => window.i18n?.t(chave) ?? chave

    const buscaTopo = document.getElementById('busca-topo')

    const buscaProdutos = document.getElementById('busca-produtos')

    const ordenacao = document.getElementById('ordenacao')

    const botoesCategoria = document.querySelectorAll('.pill-btn')

    const listaProdutos = document.getElementById('lista-produtos')

    const listaMaisVendidos = document.getElementById('mais-vendidos')

    const nenhumProduto = document.getElementById('nenhum-produto')

    const parametros = new URLSearchParams(window.location.search)

    const codigoAfiliado = parametros.get('ref')

    let produtos = []

    let categoriaAtual = 'Todas'

    let textoBusca = ''

    function formatarDinheiro(valor) {

        return Number(valor || 0).toLocaleString('pt-BR', {

            style: 'currency',

            currency: 'BRL'

        })

    }

    function escaparHTML(valor) {

        const div = document.createElement('div')

        div.textContent = valor === null || valor === undefined ? '' : String(valor)

        return div.innerHTML

    }

    async function carregarPerfil() {

        if (!token) return

        try {

            const resposta = await fetch('/usuario/perfil', {

                headers: { Authorization: `Bearer ${token}` }

            })

            if (!resposta.ok) return

            const dados = await resposta.json()

            const usuario = dados.usuario

            const nome = document.getElementById('nome-usuario')

            const email = document.getElementById('email-usuario')

            if (nome) nome.textContent = usuario.nome || t('vitrine.js.usuario')

            if (email) email.textContent = usuario.email || ''

        } catch (erro) {

            console.error('Erro ao carregar perfil:', erro)

        }

    }

    async function registrarCliqueAfiliado() {

        if (!codigoAfiliado) return

        try {

            await fetch(`/afiliacoes/link/${encodeURIComponent(codigoAfiliado)}/clique`, {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({ origem: 'vitrine' })

            })

        } catch (erro) {

            console.error('Erro ao registrar clique de afiliado:', erro)

        }

    }

    async function carregarProdutos() {

        const resposta = await fetch('/vitrine-api/produtos')

        let dados = {}

        try {

            dados = await resposta.json()

        } catch {

            dados = {}

        }

        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                t('vitrine.js.erroCarregarProdutos')
            )

        }

        produtos = Array.isArray(dados) ? dados : []

        renderizarMaisVendidos()

        aplicarFiltros()

    }

    function criarCardProduto(produto, destaque = false) {

        const card = document.createElement('div')

        card.className = 'product-card'

        card.style.cursor = 'pointer' // Indica que o card é clicável

        const capa = escaparHTML(produto.capa)

        const titulo = escaparHTML(produto.titulo)

        const categoria = escaparHTML(produto.categoria)

        const produtor = escaparHTML(produto.produtor)

        const descricao = escaparHTML(
            produto.descricao_curta ||
            t('vitrine.js.descricaoPadrao')
        )

        const totalVendas = Number(produto.total_vendas || 0)

        // Monta a URL para a página de detalhes mantendo o parâmetro 'ref' se existir

        const paramRef = codigoAfiliado ? `?ref=${encodeURIComponent(codigoAfiliado)}` : ''

        const urlDetalhes = `/vitrine/produto/${produto.id}${paramRef}`

        card.innerHTML = `

            <div class="product-image-container">

                <img src="${capa}" alt="${titulo}" style="width:100%;height:100%;object-fit:cover;">

            </div>

            <div class="product-info" style="display:flex;flex-direction:column;align-items:stretch;text-align:left;gap:10px;">

                <span style="font-size:12px;color:#8080ff;font-weight:600;">${categoria}</span>

                <h3 class="product-title">${titulo}</h3>

                <p style="color:#a4a4a8;font-size:12px;line-height:1.5;">${descricao}</p>

                <span style="color:#7c7c8a;font-size:12px;">${t('vitrine.js.por')} ${produtor}</span>

                ${destaque ? `

                    <span style="font-size:12px;color:#22c55e;">

                        ${totalVendas} ${totalVendas === 1 ? t('vitrine.js.venda') : t('vitrine.js.vendas')}

                    </span>

                ` : ''}

                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:6px;">

                    <strong style="font-size:17px;color:#fff;">${formatarDinheiro(produto.preco)}</strong>

                </div>

            </div>

        `

        const imagem = card.querySelector('img')

        imagem.addEventListener('error', () => {

            imagem.style.display = 'none'

            imagem.parentElement.innerHTML = `<i class="fa-solid fa-image" style="font-size:32px;"></i>`

        }, { once: true })

        // Ao clicar no card ou no botão, redireciona para a tela de detalhes

        card.addEventListener('click', () => {

            window.location.href = urlDetalhes

        })

        return card

    }

    function renderizarMaisVendidos() {

        listaMaisVendidos.innerHTML = ''

        if (produtos.length === 0) {

            listaMaisVendidos.innerHTML =
                `<p style="color:#7c7c8a;">${t('vitrine.js.semProdutos')}</p>`

            return

        }

        const maisVendidos = [...produtos]

            .sort((a, b) => Number(b.total_vendas || 0) - Number(a.total_vendas || 0))

            .slice(0, 3)

        maisVendidos.forEach(produto => {

            listaMaisVendidos.appendChild(criarCardProduto(produto, true))

        })

    }

    function aplicarFiltros() {

        let resultado = [...produtos]

        if (categoriaAtual !== 'Todas') {

            resultado = resultado.filter(produto => produto.categoria === categoriaAtual)

        }

        if (textoBusca) {

            const busca = textoBusca.toLowerCase()

            resultado = resultado.filter(produto => {

                const titulo = String(produto.titulo || '').toLowerCase()

                const descricao = String(produto.descricao_curta || '').toLowerCase()

                const produtor = String(produto.produtor || '').toLowerCase()

                return titulo.includes(busca) || descricao.includes(busca) || produtor.includes(busca)

            })

        }

        const ordem = ordenacao.value

        if (ordem === 'mais-vendidos') {

            resultado.sort((a, b) => Number(b.total_vendas || 0) - Number(a.total_vendas || 0))

        }

        if (ordem === 'recentes') {

            resultado.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))

        }

        if (ordem === 'menor-preco') {

            resultado.sort((a, b) => Number(a.preco) - Number(b.preco))

        }

        if (ordem === 'maior-preco') {

            resultado.sort((a, b) => Number(b.preco) - Number(a.preco))

        }

        renderizarProdutos(resultado)

    }

    function renderizarProdutos(lista) {

        listaProdutos.innerHTML = ''

        if (lista.length === 0) {

            nenhumProduto.style.display = 'block'

            return

        }

        nenhumProduto.style.display = 'none'

        lista.forEach(produto => {

            listaProdutos.appendChild(criarCardProduto(produto))

        })

    }

    function atualizarBusca(valor) {

        textoBusca = valor.trim()

        if (buscaTopo.value !== valor) buscaTopo.value = valor

        if (buscaProdutos.value !== valor) buscaProdutos.value = valor

        aplicarFiltros()

    }

    buscaTopo.addEventListener('input', evento => {

        atualizarBusca(evento.target.value)

    })

    buscaProdutos.addEventListener('input', evento => {

        atualizarBusca(evento.target.value)

    })

    ordenacao.addEventListener('change', aplicarFiltros)

    botoesCategoria.forEach(botao => {

        botao.addEventListener('click', () => {

            botoesCategoria.forEach(outro => outro.classList.remove('active'))

            botao.classList.add('active')

            categoriaAtual = botao.dataset.categoria

            aplicarFiltros()

        })

    })

    try {

        await Promise.all([
            carregarPerfil(),
            registrarCliqueAfiliado()
        ])

        await carregarProdutos()

    } catch (erro) {

        console.error('Erro ao carregar vitrine:', erro)

        alert(erro.message)

    }

})