document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('usuarioLogado')

    const modalEscolha = document.getElementById('modal-escolha-criacao')
    const modalProduto = document.getElementById('modal-novo-produto')

    const btnNovoProduto = document.getElementById('btn-novo-produto')
    const btnCriarPrimeiro = document.getElementById(
        'btn-criar-primeiro-produto'
    )

    const btnOpcaoManual = document.getElementById('btn-opcao-manual')
    const btnOpcaoIA = document.getElementById('btn-opcao-ia')
    const btnFecharEscolha = document.getElementById('btn-fechar-escolha')
    const btnFecharModal = document.getElementById('btn-fechar-modal')
    const btnCancelar = document.getElementById('btn-cancelar')

    const formulario = document.getElementById('form-novo-produto')
    const listaProdutos = document.getElementById('lista-produtos')
    const estadoVazio = document.getElementById('estado-vazio')
    const campoBusca = document.getElementById('busca-produto')

    let produtos = []

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

    async function carregarUsuario() {
        try {
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

            const nomeUsuario = document.getElementById('nome-usuario')
            const emailUsuario = document.getElementById('email-usuario')

            if (nomeUsuario) {
                nomeUsuario.textContent = dados.usuario.nome
            }

            if (emailUsuario) {
                emailUsuario.textContent = email || ''
            }

            return true
        } catch (erro) {
            console.error('Erro ao carregar usuário:', erro)
            alert(erro.message)
            return false
        }
    }

    function abrirEscolha() {
        modalEscolha.classList.remove('hidden')
    }

    function abrirFormulario() {
        modalEscolha.classList.add('hidden')
        modalProduto.classList.remove('hidden')
    }

    function fecharModais() {
        modalEscolha.classList.add('hidden')
        modalProduto.classList.add('hidden')
    }

    function formatarPreco(preco) {
        return Number(preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    function escaparHTML(valor) {
        const elemento = document.createElement('div')
        elemento.textContent = valor ?? ''
        return elemento.innerHTML
    }

    function renderizarProdutos(lista) {
        listaProdutos.innerHTML = ''

        if (lista.length === 0) {
            estadoVazio.style.display = 'block'
            return
        }

        estadoVazio.style.display = 'none'

        lista.forEach(produto => {
            const card = document.createElement('article')
            card.className = 'produto-card'
            card.dataset.produtoId = produto.id

            card.innerHTML = `
                <div class="produto-card-conteudo">
                    ${
                        produto.capa
                            ? `<img
                                class="produto-card-capa"
                                src="${escaparHTML(produto.capa)}"
                                alt="Capa de ${escaparHTML(produto.titulo)}"
                            >`
                            : ''
                    }

                    <div class="produto-card-informacoes">
                        <span class="produto-status">
                            ${escaparHTML(produto.status_produto)}
                        </span>

                        <h3>${escaparHTML(produto.titulo)}</h3>

                        <p>
                            ${escaparHTML(
                                produto.descricao_curta ||
                                'Produto sem descrição curta'
                            )}
                        </p>

                        <span class="produto-categoria">
                            ${escaparHTML(produto.categoria)}
                        </span>

                        <strong>
                            ${formatarPreco(produto.preco)}
                        </strong>
                    </div>
                </div>
            `

            listaProdutos.appendChild(card)
        })
    }

    async function carregarProdutos() {
        try {
            const resposta = await fetch('/produtos', {
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
                    dados.erro || 'Não foi possível carregar os produtos'
                )
            }

            produtos = dados
            renderizarProdutos(produtos)
        } catch (erro) {
            console.error('Erro ao carregar produtos:', erro)
            alert(erro.message)
        }
    }

    async function cadastrarProduto(evento) {
        evento.preventDefault()

        const botaoSalvar = formulario.querySelector(
            'button[type="submit"]'
        )

        const produto = {
            titulo: document
                .getElementById('prod-titulo')
                .value
                .trim(),

            descricao_curta: document
                .getElementById('prod-desc-curta')
                .value
                .trim(),

            descricao_completa: document
                .getElementById('prod-desc-completa')
                .value
                .trim(),

            preco: document.getElementById('prod-preco').value,

            categoria: document.getElementById(
                'prod-categoria'
            ).value,

            comissao:
                document.getElementById('prod-comissao').value || 0,

            status_produto: document.getElementById(
                'prod-status'
            ).value,

            capa: document
                .getElementById('prod-imagem')
                .value
                .trim(),

            produto_arquivo: document
                .getElementById('prod-arquivo')
                .value
                .trim()
        }

        if (!produto.titulo || !produto.preco || !produto.capa || !produto.produto_arquivo) {
            alert('Preencha o título, o preço, a imagem e o link do produto.')
            return
        }

        try {
            botaoSalvar.disabled = true
            botaoSalvar.textContent = 'Salvando...'

            const resposta = await fetch('/produtos', {
                method: 'POST',
                headers: headersAutenticados(),
                body: JSON.stringify(produto)
            })

            if (resposta.status === 401) {
                encerrarSessao()
                return
            }

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || 'Não foi possível cadastrar o produto'
                )
            }

            alert(dados.mensagem)

            formulario.reset()
            fecharModais()

            await carregarProdutos()
        } catch (erro) {
            console.error('Erro ao cadastrar produto:', erro)
            alert(erro.message)
        } finally {
            botaoSalvar.disabled = false
            botaoSalvar.textContent = 'Salvar Produto'
        }
    }

    function buscarProdutos() {
        const termo = campoBusca.value.trim().toLowerCase()

        const produtosFiltrados = produtos.filter(produto => {
            return (
                produto.titulo.toLowerCase().includes(termo) ||
                produto.categoria.toLowerCase().includes(termo) ||
                (produto.descricao_curta || '')
                    .toLowerCase()
                    .includes(termo)
            )
        })

        renderizarProdutos(produtosFiltrados)
    }

    btnNovoProduto.addEventListener('click', abrirEscolha)
    btnCriarPrimeiro.addEventListener('click', abrirEscolha)
    btnOpcaoManual.addEventListener('click', abrirFormulario)

    btnOpcaoIA.addEventListener('click', () => {
        fecharModais()

        alert(
            'A criação com inteligência artificial ainda será desenvolvida.'
        )
    })

    btnFecharEscolha.addEventListener('click', fecharModais)
    btnFecharModal.addEventListener('click', fecharModais)
    btnCancelar.addEventListener('click', fecharModais)

    formulario.addEventListener('submit', cadastrarProduto)
    campoBusca.addEventListener('input', buscarProdutos)

    window.addEventListener('click', evento => {
        if (
            evento.target === modalEscolha ||
            evento.target === modalProduto
        ) {
            fecharModais()
        }
    })

    const usuarioCarregado = await carregarUsuario()

    if (usuarioCarregado) {
        await carregarProdutos()
    }
})