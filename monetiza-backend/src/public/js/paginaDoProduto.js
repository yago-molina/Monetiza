document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(window.location.search);
    const codigoAfiliado = params.get('ref');

    // 1. Captura flexível do ID (aceita ?id=X e /produto/X)
    let idBruto = params.get('id');
    if (!idBruto) {
        const partesUrl = window.location.pathname.split('/');
        const indiceProduto = partesUrl.indexOf('produto');
        if (indiceProduto !== -1 && partesUrl[indiceProduto + 1]) {
            idBruto = partesUrl[indiceProduto + 1];
        }
    }

    const produtoId = Number(idBruto);
    let produtoAtual = null;

    if (!produtoId || Number.isNaN(produtoId)) {
        console.error('ID do produto não identificado na URL.');
        alert('Produto não especificado.');
        window.location.href = '/vitrine';
        return;
    }

    function formatarDinheiro(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    async function registrarCliqueAfiliado() {
        if (!codigoAfiliado) return;
        try {
            await fetch(`/afiliacoes/link/${encodeURIComponent(codigoAfiliado)}/clique`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ origem: 'pagina-produto' })
            });
        } catch (erro) {
            console.error('Erro ao registrar clique do afiliado:', erro);
        }
    }

    async function carregarProduto() {
    try {
        console.log(`Buscando produto ID: ${produtoId}...`);
        const resposta = await fetch(`/vitrine-api/produtos/${produtoId}`);
        const dados = await resposta.json();

        console.log('Resposta da API:', dados); // Abra o F12 e veja o que aparece aqui!

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao carregar dados do produto');
        }

        // Trata retorno caso venha em Array [ {...} ], Objeto { produto: {...} } ou Objeto Direto { ... }
        let produto = dados;
        if (Array.isArray(dados)) {
            produto = dados[0];
        } else if (dados.produto) {
            produto = dados.produto;
        }

        produtoAtual = produto;

        if (!produto) {
            throw new Error('Produto não encontrado.');
        }

        // Atualiza Título, Categoria, Produtor e Preço
        document.title = `${produto.titulo || 'Produto'} - Monetiza`;

        const elTitulo = document.getElementById('detalhe-titulo');
        const elCategoria = document.getElementById('detalhe-categoria');
        const elProdutor = document.getElementById('detalhe-produtor');
        const elPreco = document.getElementById('detalhe-preco');
        const elCapa = document.getElementById('detalhe-capa');
        const elDescricao = document.getElementById('detalhe-descricao');

        if (elTitulo) elTitulo.textContent = produto.titulo || 'Sem título';
        if (elCategoria) elCategoria.textContent = produto.categoria || 'Geral';
        if (elProdutor) elProdutor.textContent = produto.produtor || 'Monetiza';
        if (elPreco) elPreco.textContent = formatarDinheiro(produto.preco);

        // Imagem
        const urlCapa = produto.capa || produto.imagem || produto.foto || produto.url_imagem;
        if (elCapa && urlCapa) {
            elCapa.src = urlCapa;
        }

        // Leitura prioritária do campo descricao_completa do banco
        let textoDescricao = produto.descricao_completa;

        // Caso esteja nulo ou seja string vazia, usa fallbacks
        if (!textoDescricao || String(textoDescricao).trim() === '') {
            textoDescricao = produto.descricao || produto.descricao_curta || 'Nenhuma descrição detalhada informada.';
        }

        if (elDescricao) {
            elDescricao.innerHTML = String(textoDescricao).replace(/\n/g, '<br>');
        } else {
            console.error('Elemento HTML com id="detalhe-descricao" não foi encontrado na página.');
        }

    } catch (erro) {
        console.error('Erro ao carregar produto:', erro);
        const elDescricao = document.getElementById('detalhe-descricao');
        if (elDescricao) {
            elDescricao.textContent = 'Erro ao carregar informações do produto.';
        }
    }
}

    function abrirModalCheckout() {
        if (!token) {
            alert('Você precisa estar logado para realizar uma compra.');
            window.location.href = '/';
            return;
        }

        const modal = document.getElementById('modal-checkout');
        if (!modal) {
            alert('Erro: Modal de checkout não encontrado no HTML.');
            console.error('Certifique-se de colar a estrutura HTML do modal no final da página.');
            return;
        }

        if (!produtoAtual) {
            alert('Aguarde os dados do produto serem carregados.');
            return;
        }

        document.getElementById('modal-checkout-titulo').textContent = produtoAtual.titulo || 'Produto';
        document.getElementById('modal-checkout-preco').textContent = formatarDinheiro(produtoAtual.preco);

        const imgModal = document.getElementById('modal-checkout-img');
        const urlCapa = produtoAtual.capa || produtoAtual.imagem || produtoAtual.foto || produtoAtual.img;
        if (imgModal && urlCapa) {
            imgModal.src = urlCapa;
        }

        modal.classList.add('ativo');
    }

    function configurarEventosModal() {
        const modal = document.getElementById('modal-checkout');
        const btnFechar = document.getElementById('fechar-modal-checkout');
        const form = document.getElementById('form-checkout-modal');
        const btnComprar = document.getElementById('btn-ir-checkout');

        // Evento do Botão "Comprar Agora"
        if (btnComprar) {
            btnComprar.addEventListener('click', (e) => {
                e.preventDefault();
                abrirModalCheckout();
            });
        }

        const fecharModal = () => {
            if (modal) modal.classList.remove('ativo');
        };

        if (btnFechar) btnFechar.addEventListener('click', fecharModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) fecharModal();
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!produtoAtual) return;

                const btnSubmit = document.getElementById('btn-finalizar-modal');
                if (btnSubmit) {
                    btnSubmit.disabled = true;
                    btnSubmit.textContent = 'Processando...';
                }

                try {
                    const resposta = await fetch('/vitrine-api/comprar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            produto_id: Number(produtoAtual.id),
                            codigo_afiliado: codigoAfiliado || null
                        })
                    });

                    const dados = await resposta.json();

                    if (resposta.status === 401) {
                        localStorage.clear();
                        alert('Sua sessão expirou.');
                        window.location.href = '/';
                        return;
                    }

                    if (!resposta.ok) {
                        throw new Error(dados.erro || 'Falha ao processar o pagamento.');
                    }

                    alert(`Compra de "${dados.venda?.produto || produtoAtual.titulo}" realizada com sucesso!`);
                    fecharModal();

                    if (dados.acesso_produto) {
                        window.open(dados.acesso_produto, '_blank');
                    } else {
                        window.location.href = '/minhasVendas';
                    }

                } catch (erro) {
                    console.error('Erro no checkout:', erro);
                    alert(erro.message);
                } finally {
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.textContent = 'Confirmar Pagamento';
                    }
                }
            });
        }
    }

    // Inicialização
    configurarEventosModal();

    try {
        await registrarCliqueAfiliado();
        await carregarProduto();
    } catch (erro) {
        console.error('Erro geral na página:', erro);
        const elDescricao = document.getElementById('detalhe-descricao');
        if (elDescricao) {
            elDescricao.textContent = 'Erro ao carregar informações do produto.';
        }
    }
});