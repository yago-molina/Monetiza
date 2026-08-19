document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('usuarioLogado')

    const modalEscolha = document.getElementById('modal-escolha-criacao')
    const modalProduto = document.getElementById('modal-novo-produto')
    const modalEditar = document.getElementById('modal-editar-produto')
    const modalExcluir = document.getElementById('modal-excluir-produto')

    const btnNovoProduto = document.getElementById('btn-novo-produto')
    const btnCriarPrimeiro = document.getElementById('btn-criar-primeiro-produto')

    const btnOpcaoManual = document.getElementById('btn-opcao-manual')
    const btnOpcaoIA = document.getElementById('btn-opcao-ia')

    const btnFecharEscolha = document.getElementById('btn-fechar-escolha')
    const btnFecharModal = document.getElementById('btn-fechar-modal')
    const btnCancelar = document.getElementById('btn-cancelar')

    const btnFecharEdicao = document.getElementById('btn-fechar-edicao')
    const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao')

    const btnFecharExclusao = document.getElementById('btn-fechar-exclusao')
    const btnCancelarExclusao = document.getElementById('btn-cancelar-exclusao')
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao')

    const formulario = document.getElementById('form-novo-produto')
    const formularioEdicao = document.getElementById('form-editar-produto')

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

    function abrirModal(modal) {
        modal.classList.remove('hidden')
    }

    function fecharModal(modal) {
        modal.classList.add('hidden')
    }

    function fecharTodosModais() {
        fecharModal(modalEscolha)
        fecharModal(modalProduto)
        fecharModal(modalEditar)
        fecharModal(modalExcluir)
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
                emailUsuario.textContent = email || dados.usuario.email || ''
            }

            return true
        } catch (erro) {
            console.error('Erro ao carregar usuário:', erro)
            alert(erro.message)
            return false
        }
    }

    function abrirEscolha() {
        abrirModal(modalEscolha)
    }

    function abrirFormulario() {
        fecharModal(modalEscolha)
        formulario.reset()
        abrirModal(modalProduto)
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
                            ? `
                            <img
                                class="produto-card-capa"
                                src="${escaparHTML(produto.capa)}"
                                alt="Capa de ${escaparHTML(produto.titulo)}"
                            >
                            `
                            : ''
                    }

                    <div class="produto-card-informacoes">

                        <span class="produto-status">
                            ${escaparHTML(produto.status_produto)}
                        </span>

                        <h3>
                            ${escaparHTML(produto.titulo)}
                        </h3>

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

                        <div class="produto-card-acoes">

                            <button
                                type="button"
                                class="btn-editar-produto"
                                data-id="${produto.id}"
                            >
                                <i class="fa-solid fa-pen"></i>
                                Editar
                            </button>

                            <button
                                type="button"
                                class="btn-excluir-produto"
                                data-id="${produto.id}"
                            >
                                <i class="fa-solid fa-trash"></i>
                                Excluir
                            </button>

                        </div>

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

            preco: document
                .getElementById('prod-preco')
                .value,

            categoria: document
                .getElementById('prod-categoria')
                .value,

            comissao:
                document.getElementById('prod-comissao').value || 0,

            status_produto: document
                .getElementById('prod-status')
                .value,

            capa: document
                .getElementById('prod-imagem')
                .value
                .trim(),

            produto_arquivo: document
                .getElementById('prod-arquivo')
                .value
                .trim()
        }

        if (
            !produto.titulo ||
            !produto.preco ||
            !produto.categoria ||
            !produto.capa ||
            !produto.produto_arquivo
        ) {
            alert(
                'Preencha o título, preço, categoria, imagem e link do produto.'
            )
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

            fecharModal(modalProduto)

            await carregarProdutos()
        } catch (erro) {
            console.error('Erro ao cadastrar produto:', erro)
            alert(erro.message)
        } finally {
            botaoSalvar.disabled = false
            botaoSalvar.textContent = 'Salvar Produto'
        }
    }

    async function abrirEdicao(id) {
        try {
            const resposta = await fetch(`/produtos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (resposta.status === 401) {
                encerrarSessao()
                return
            }

            const produto = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    produto.erro || 'Não foi possível carregar o produto'
                )
            }

            document.getElementById('edit-prod-id').value = produto.id

            document.getElementById('edit-prod-titulo').value =
                produto.titulo || ''

            document.getElementById('edit-prod-desc-curta').value =
                produto.descricao_curta || ''

            document.getElementById('edit-prod-desc-completa').value =
                produto.descricao_completa || ''

            document.getElementById('edit-prod-preco').value =
                produto.preco

            document.getElementById('edit-prod-categoria').value =
                produto.categoria

            document.getElementById('edit-prod-comissao').value =
                produto.comissao ?? 0

            document.getElementById('edit-prod-status').value =
                produto.status_produto

            document.getElementById('edit-prod-imagem').value =
                produto.capa || ''

            document.getElementById('edit-prod-arquivo').value =
                produto.produto_arquivo || ''

            abrirModal(modalEditar)
        } catch (erro) {
            console.error('Erro ao abrir edição:', erro)
            alert(erro.message)
        }
    }

    async function atualizarProduto(evento) {
        evento.preventDefault()

        const botaoSalvar = formularioEdicao.querySelector(
            'button[type="submit"]'
        )

        const id = document
            .getElementById('edit-prod-id')
            .value

        const produto = {
            titulo: document
                .getElementById('edit-prod-titulo')
                .value
                .trim(),

            descricao_curta: document
                .getElementById('edit-prod-desc-curta')
                .value
                .trim(),

            descricao_completa: document
                .getElementById('edit-prod-desc-completa')
                .value
                .trim(),

            preco: document
                .getElementById('edit-prod-preco')
                .value,

            categoria: document
                .getElementById('edit-prod-categoria')
                .value,

            comissao:
                document.getElementById('edit-prod-comissao').value || 0,

            status_produto: document
                .getElementById('edit-prod-status')
                .value,

            capa: document
                .getElementById('edit-prod-imagem')
                .value
                .trim(),

            produto_arquivo: document
                .getElementById('edit-prod-arquivo')
                .value
                .trim()
        }

        if (
            !produto.titulo ||
            !produto.preco ||
            !produto.categoria ||
            !produto.capa ||
            !produto.produto_arquivo
        ) {
            alert(
                'Preencha o título, preço, categoria, imagem e link do produto.'
            )
            return
        }

        try {
            botaoSalvar.disabled = true
            botaoSalvar.textContent = 'Salvando...'

            const resposta = await fetch(`/produtos/${id}`, {
                method: 'PUT',
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
                    dados.erro || 'Não foi possível atualizar o produto'
                )
            }

            alert(dados.mensagem)

            fecharModal(modalEditar)

            await carregarProdutos()
        } catch (erro) {
            console.error('Erro ao atualizar produto:', erro)
            alert(erro.message)
        } finally {
            botaoSalvar.disabled = false
            botaoSalvar.textContent = 'Salvar Alterações'
        }
    }

    function abrirExclusao(id) {
        const produto = produtos.find(
            item => Number(item.id) === Number(id)
        )

        if (!produto) {
            alert('Produto não encontrado.')
            return
        }

        document.getElementById('produto-id-excluir').value =
            produto.id

        document.getElementById('nome-produto-excluir').textContent =
            produto.titulo

        abrirModal(modalExcluir)
    }

    async function excluirProduto() {
        const id = document
            .getElementById('produto-id-excluir')
            .value

        if (!id) {
            return
        }

        try {
            btnConfirmarExclusao.disabled = true
            btnConfirmarExclusao.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Excluindo...
            `

            const resposta = await fetch(`/produtos/${id}`, {
                method: 'DELETE',
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
                    dados.erro || 'Não foi possível excluir o produto'
                )
            }

            alert(dados.mensagem)

            fecharModal(modalExcluir)

            await carregarProdutos()
        } catch (erro) {
            console.error('Erro ao excluir produto:', erro)
            alert(erro.message)
        } finally {
            btnConfirmarExclusao.disabled = false
            btnConfirmarExclusao.innerHTML = `
                <i class="fa-solid fa-trash"></i>
                Excluir Produto
            `
        }
    }

    function buscarProdutos() {
        const termo = campoBusca
            .value
            .trim()
            .toLowerCase()

        const produtosFiltrados = produtos.filter(produto => {
            const titulo = produto.titulo || ''
            const categoria = produto.categoria || ''
            const descricao = produto.descricao_curta || ''

            return (
                titulo.toLowerCase().includes(termo) ||
                categoria.toLowerCase().includes(termo) ||
                descricao.toLowerCase().includes(termo)
            )
        })

        renderizarProdutos(produtosFiltrados)
    }

    listaProdutos.addEventListener('click', evento => {
        const botaoEditar = evento.target.closest(
            '.btn-editar-produto'
        )

        const botaoExcluir = evento.target.closest(
            '.btn-excluir-produto'
        )

        if (botaoEditar) {
            abrirEdicao(botaoEditar.dataset.id)
        }

        if (botaoExcluir) {
            abrirExclusao(botaoExcluir.dataset.id)
        }
    })

    btnNovoProduto.addEventListener('click', abrirEscolha)

    btnCriarPrimeiro.addEventListener(
        'click',
        abrirEscolha
    )

    btnOpcaoManual.addEventListener(
        'click',
        abrirFormulario
    )

    btnOpcaoIA.addEventListener('click', () => {
        fecharTodosModais()

        alert(
            'A criação com inteligência artificial ainda será desenvolvida.'
        )
    })

    btnFecharEscolha.addEventListener(
        'click',
        () => fecharModal(modalEscolha)
    )

    btnFecharModal.addEventListener(
        'click',
        () => fecharModal(modalProduto)
    )

    btnCancelar.addEventListener(
        'click',
        () => fecharModal(modalProduto)
    )

    btnFecharEdicao.addEventListener(
        'click',
        () => fecharModal(modalEditar)
    )

    btnCancelarEdicao.addEventListener(
        'click',
        () => fecharModal(modalEditar)
    )

    btnFecharExclusao.addEventListener(
        'click',
        () => fecharModal(modalExcluir)
    )

    btnCancelarExclusao.addEventListener(
        'click',
        () => fecharModal(modalExcluir)
    )

    btnConfirmarExclusao.addEventListener(
        'click',
        excluirProduto
    )

    formulario.addEventListener(
        'submit',
        cadastrarProduto
    )

    formularioEdicao.addEventListener(
        'submit',
        atualizarProduto
    )

    campoBusca.addEventListener(
        'input',
        buscarProdutos
    )

    window.addEventListener('click', evento => {
        if (evento.target === modalEscolha) {
            fecharModal(modalEscolha)
        }

        if (evento.target === modalProduto) {
            fecharModal(modalProduto)
        }

        if (evento.target === modalEditar) {
            fecharModal(modalEditar)
        }

        if (evento.target === modalExcluir) {
            fecharModal(modalExcluir)
        }
    })

    const usuarioCarregado = await carregarUsuario()

    if (usuarioCarregado) {
        await carregarProdutos()
    }
})