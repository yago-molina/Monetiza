document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const t = chave => window.i18n?.t(chave) ?? chave
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
    let compraEmAndamento = false;

    if (!produtoId || Number.isNaN(produtoId)) {
        console.error('ID do produto não identificado na URL.');
        await MonetizaUI.aviso(t('paginaProduto.js.produtoNaoEspecificado'));
        window.location.href = '/vitrine';
        return;
    }

    function formatarDinheiro(valor) {
        return Number(valor || 0).toLocaleString(window.i18n.locale(), {
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

        console.log('Resposta da API:', dados);

        if (!resposta.ok) {
            throw new Error(
                dados.erro ||
                t('paginaProduto.js.erroCarregarDados')
            );
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
            throw new Error(
                t('paginaProduto.js.produtoNaoEncontrado')
            );
        }

        // Atualiza Título, Categoria, Produtor e Preço
        document.title = `${produto.titulo || t('paginaProduto.js.produto')} - Monetiza`;

        const elTitulo = document.getElementById('detalhe-titulo');
        const elCategoria = document.getElementById('detalhe-categoria');
        const elProdutor = document.getElementById('detalhe-produtor');
        const elPreco = document.getElementById('detalhe-preco');
        const elCapa = document.getElementById('detalhe-capa');
        const elDescricao = document.getElementById('detalhe-descricao');

        if (elTitulo) elTitulo.textContent = produto.titulo || t('paginaProduto.js.semTitulo');
        if (elCategoria) elCategoria.textContent = produto.categoria || t('paginaProduto.js.geral');
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
            textoDescricao =
                produto.descricao ||
                produto.descricao_curta ||
                t('paginaProduto.js.semDescricao');
        }

        if (elDescricao) {
            elDescricao.textContent = String(textoDescricao ?? '');
        } else {
            console.error('Elemento HTML com id="detalhe-descricao" não foi encontrado na página.');
        }

    } catch (erro) {
        console.error('Erro ao carregar produto:', erro);
        const elDescricao = document.getElementById('detalhe-descricao');
        if (elDescricao) {
            elDescricao.textContent =
                t('paginaProduto.js.erroCarregarInformacoes');
        }
    }
}

    async function abrirModalCheckout() {
        if (!token) {
            await MonetizaUI.aviso(t('paginaProduto.js.loginCompra'));
            sessionStorage.setItem('retornoCompra', window.location.href);
            window.location.href = '/login';
            return;
        }

        const modal = document.getElementById('modal-checkout');
        if (!modal) {
            await MonetizaUI.aviso(t('paginaProduto.js.modalNaoEncontrado'));
            console.error('Certifique-se de colar a estrutura HTML do modal no final da página.');
            return;
        }

        if (!produtoAtual) {
            await MonetizaUI.aviso(t('paginaProduto.js.aguardeProduto'));
            return;
        }

        document.getElementById('modal-checkout-titulo').textContent =
            produtoAtual.titulo || t('paginaProduto.js.produto');

        document.getElementById('modal-checkout-preco').textContent =
            formatarDinheiro(produtoAtual.preco);

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

        const btnFalarVendedor = document.getElementById('btn-falar-vendedor');

        // Evento do Botão "Comprar Agora"
        if (btnComprar) {
            btnComprar.addEventListener('click', (e) => {
                e.preventDefault();
                abrirModalCheckout();
            });
        }

        if (btnFalarVendedor) {
            btnFalarVendedor.addEventListener('click', event => {
                event.preventDefault()
                falarComVendedor()
            })
        }

        const fecharModal = () => {
            if (compraEmAndamento) return;
            if (modal) {
                modal.classList.remove('ativo');
            }
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

                if (!produtoAtual || compraEmAndamento) return;

                compraEmAndamento = true;

                const btnSubmit =
                    document.getElementById('btn-finalizar-modal');

                if (btnSubmit) {
                    btnSubmit.disabled = true;
                    btnSubmit.textContent =
                        t('paginaProduto.js.processando');
                }

                try {
                    MonetizaUI.abrirLoading();

                    const resposta = await MonetizaOperacoes.enviar('/vitrine-api/comprar', {
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

                        await MonetizaUI.aviso(
                            t('paginaProduto.js.sessaoExpiradaCurta')
                        );

                        window.location.href = '/login';
                        return;
                    }

                    if (!resposta.ok) {
                        throw new Error(
                            dados.erro ||
                            t('paginaProduto.js.falhaPagamento')
                        );
                    }

                    compraEmAndamento = false;

                    fecharModal();
                    MonetizaUI.fecharLoading();

                    const acesso = '/minhasCompras';

                    await MonetizaUI.aviso(
                        resposta.status === 200 ? window.i18n.mensagem(dados.mensagem) :
                        `${t('paginaProduto.js.compraDe')} ` +
                        `"${dados.venda?.produto || produtoAtual.titulo}" ` +
                        `${t('paginaProduto.js.compraSucesso')}`,
                        {
                            titulo: window.i18n.t('complementos.compraRealizada'),
                            url: acesso
                        }
                    );
                } catch (erro) {
                    console.error('Erro no checkout:', erro);

                    await MonetizaUI.aviso(erro.message);
                } finally {
                    MonetizaUI.fecharLoading();

                    compraEmAndamento = false;

                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.textContent =
                            t('paginaProduto.js.confirmarPagamento');
                    }
                }
            });
        }
    }

    async function falarComVendedor() {
        if (!token) {
            await MonetizaUI.aviso(t('paginaProduto.js.loginVendedor'))
            window.location.href = '/login'
            return
        }

        if (!produtoAtual) {
            await MonetizaUI.aviso(t('paginaProduto.js.aguardeProdutoCarregado'))
            return
        }

        const btnFalar = document.getElementById('btn-falar-vendedor')

        if (btnFalar) {
            btnFalar.disabled = true
            btnFalar.innerHTML =
                `<i class="fa-solid fa-spinner fa-spin"></i> ${t('paginaProduto.js.abrindoConversa')}`
        }

        try {
            const resposta = await fetch('/mensagens-api/produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    produto_id: Number(produtoAtual.id)
                })
            })

            if (resposta.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('usuarioLogado')

                await MonetizaUI.aviso(t('paginaProduto.js.sessaoExpirada'))
                window.location.href = '/login'
                return
            }

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    dados.erro ||
                    t('paginaProduto.js.erroIniciarConversa')
                )
            }

            if (!dados.conversa_id) {
                throw new Error(
                    t('paginaProduto.js.conversaNaoIdentificada')
                )
            }

            window.location.href =
                `/mensagens?conversa=${dados.conversa_id}`
        } catch (erro) {
            console.error(
                'Erro ao falar com vendedor:',
                erro
            )

            await MonetizaUI.aviso(erro.message)
        } finally {
            if (btnFalar) {
                btnFalar.disabled = false
                btnFalar.innerHTML =
                    `<i class="fa-solid fa-comment-dots"></i> ${t('paginaProduto.js.falarVendedor')}`
            }
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
            elDescricao.textContent =
                t('paginaProduto.js.erroCarregarInformacoes');
        }
    }
});