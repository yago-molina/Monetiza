const modelo = document.querySelector('#modelo');
const prompt = document.querySelector('#prompt');

const botao = document.querySelector('#enviar');

const resposta = document.querySelector('#resposta');
const status = document.querySelector('#status');

const chatConteudo = document.querySelector('#chat-conteudo');

const modoAtualTexto = document.querySelector('#modo-atual');
const menuConsultor =
    document.querySelector('#menu-consultor');

const menuPromptBuilder =
    document.querySelector('#menu-prompt-builder');

const menuProduto =
    document.querySelector('#menu-produto');

const fluxoConsultor =
    document.querySelector('#fluxo-consultor');

const fluxoPromptBuilder =
    document.querySelector('#fluxo-prompt-builder');

const fluxoProduto =
    document.querySelector('#fluxo-produto');

const produtoPreview =
    document.querySelector('#produto-preview');

const produtoPreviewNome =
    document.querySelector('#produto-preview-nome');

const produtoPreviewConteudo =
    document.querySelector('#produto-preview-conteudo');

const botaoEditarProduto =
    document.querySelector('#editar-produto');

const botaoGerarPdf =
    document.querySelector('#gerar-pdf');

const botaoPublicarProduto =
    document.querySelector('#publicar-produto');

const token =
    localStorage.getItem('token')

const t = chave => window.i18n?.t(chave) ?? chave

if (!token) {
    window.location.href = '/login'
}

const historicos = {
    consultor: [],
    promptBuilder: [],
    produto: []
}


// ==================================================
// ESTADO DA MONETIZA IA
// ==================================================

let etapaAtual = 'consultor';

let ideiaEscolhida = '';

let promptGerado = '';

let produtoGerado = null;


// ==================================================
// CONFIGURAÇÃO DO MARKDOWN
// ==================================================

if (typeof marked !== 'undefined') {

    marked.setOptions({

        breaks: true,

        gfm: true

    });

}


// ==================================================
// TRANSFORMA MARKDOWN EM HTML
// ==================================================

function renderizarMarkdown(texto) {
    if (!texto) {
        return ''
    }

    if (
        typeof marked === 'undefined' ||
        typeof DOMPurify === 'undefined'
    ) {
        return texto
    }

    const html =
        marked.parse(texto)

    return DOMPurify.sanitize(html)
}


// ==================================================
// FORMATA O PRODUTO ESTRUTURADO PARA O PROTÓTIPO
// ==================================================

function formatarProdutoMarkdown(produto) {
    const cadastro = produto.cadastro
    const detalhes = produto.produto

    const preco = new Intl.NumberFormat(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    ).format(cadastro.preco)

    const beneficios = detalhes.beneficios
        .map((item) => `- ${item}`)
        .join('\n')

    const diferenciais = detalhes.diferenciais
        .map((item) => `- ${item}`)
        .join('\n')

    const capitulos = detalhes.capitulos
        .map((capitulo) => {
            return `### ${capitulo.numero}. ${capitulo.titulo}\n\n**${t('iaProdutos.js.objetivo')}:** ${capitulo.objetivo}\n\n${capitulo.resumo}`
        })
        .join('\n\n')

    const criativos = produto.criativos
        .map((criativo, indice) => {
            return `### ${t('iaProdutos.js.criativo')} ${indice + 1} — ${criativo.canal}\n\n**${t('iaProdutos.js.formato')}:** ${criativo.formato}\n\n**Headline:** ${criativo.headline}\n\n**Copy:** ${criativo.copy}\n\n**CTA:** ${criativo.cta}\n\n**${t('iaProdutos.js.promptImagem')}:** ${criativo.prompt_imagem}`
        })
        .join('\n\n')

    return `# 📦 ${cadastro.titulo}

${detalhes.subtitulo}

- **${t('iaProdutos.js.categoria')}:** ${cadastro.categoria}
- **${t('iaProdutos.js.formatoOriginal')}:** ${detalhes.tipo_original}
- **${t('iaProdutos.js.precoSugerido')}:** ${preco}
- **${t('iaProdutos.js.comissaoSugerida')}:** ${cadastro.comissao}%

## ${t('iaProdutos.js.publicoAlvo')}

${detalhes.publico_alvo}

## ${t('iaProdutos.js.problemaPrincipal')}

${detalhes.problema_principal}

## ${t('iaProdutos.js.propostaValor')}

${detalhes.proposta_valor}

## ${t('iaProdutos.js.beneficios')}

${beneficios}

## ${t('iaProdutos.js.diferenciais')}

${diferenciais}

## ${t('iaProdutos.js.estruturaProduto')}

${capitulos}

## ${t('iaProdutos.js.ideiasCriativos')}

${criativos}`
}


// ==================================================
// MOSTRA A PRÉVIA SEM DEFINIR O DESIGN FINAL
// ==================================================

function mostrarProdutoPreview(produto) {
    if (
        !produtoPreview ||
        !produtoPreviewNome ||
        !produtoPreviewConteudo
    ) {
        return
    }

    produtoPreviewNome.innerText =
        produto.cadastro.titulo

    produtoPreviewConteudo.innerHTML =
        renderizarMarkdown(
            formatarProdutoMarkdown(produto)
        )

    produtoPreview.classList.remove('oculto')
}


// ==================================================
// SCROLL AUTOMÁTICO DO CHAT
// ==================================================

function rolarChatParaBaixo() {

    chatConteudo.scrollTo({

        top: chatConteudo.scrollHeight,

        behavior: 'smooth'

    });

}


// ==================================================
// CRIA MENSAGEM DO USUÁRIO
// ==================================================

function adicionarMensagemUsuario(texto) {

    const mensagem =
        document.createElement('div');


    mensagem.classList.add(
        'mensagem',
        'usuario'
    );


    mensagem.innerHTML = `
        <div class="mensagem-corpo">

            <span class="autor">
                ${t('iaProdutos.js.voce')}
            </span>

            <div class="mensagem-balao">
            </div>

        </div>
    `;


    const balao =
        mensagem.querySelector(
            '.mensagem-balao'
        );


    balao.innerText =
        texto;


    chatConteudo.appendChild(
        mensagem
    );


    rolarChatParaBaixo();

}


// ==================================================
// CRIA MENSAGEM DA MONETIZA IA
// ==================================================

function adicionarMensagemIA(texto) {

    const mensagem =
        document.createElement('div');


    mensagem.classList.add(
        'mensagem',
        'ia'
    );


    mensagem.innerHTML = `
        <div class="mini-avatar">
            M
        </div>

        <div class="mensagem-corpo">

            <div class="mensagem-topo">

                <span class="autor">
                    Monetiza IA
                </span>

                <button class="btn-copiar">
                    📋 ${t('iaProdutos.js.copiar')}
                </button>

            </div>

            <div class="mensagem-balao markdown-content">
            </div>

        </div>
    `;


    const balao =
        mensagem.querySelector(
            '.mensagem-balao'
        );


    const botaoCopiar =
        mensagem.querySelector(
            '.btn-copiar'
        );


    balao.innerHTML =
        renderizarMarkdown(texto);


    // ==============================================
    // BOTÃO COPIAR
    // ==============================================

    botaoCopiar.addEventListener(
        'click',
        async function () {

            try {

                await navigator.clipboard.writeText(
                    texto
                );


                botaoCopiar.innerText =
                    `✓ ${t('iaProdutos.js.copiado')}`;


                setTimeout(
                    function () {

                        botaoCopiar.innerText =
                            `📋 ${t('iaProdutos.js.copiar')}`;

                    },
                    2000
                );

            }
            catch (erro) {

                console.error(
                    'Erro ao copiar:',
                    erro
                );


                botaoCopiar.innerText =
                    t('iaProdutos.js.erroCopiar');


                setTimeout(
                    function () {

                        botaoCopiar.innerText =
                            `📋 ${t('iaProdutos.js.copiar')}`;

                    },
                    2000
                );

            }

        }
    );


    chatConteudo.appendChild(
        mensagem
    );


    rolarChatParaBaixo();


    return balao;

}


// ==================================================
// MENSAGEM DE CARREGAMENTO
// ==================================================

function adicionarCarregamento() {

    const mensagem =
        document.createElement('div');


    mensagem.classList.add(
        'mensagem',
        'ia',
        'mensagem-carregando'
    );


    mensagem.innerHTML = `
        <div class="mini-avatar">
            M
        </div>

        <div class="mensagem-corpo">

            <span class="autor">
                Monetiza IA
            </span>

            <div class="mensagem-balao">
                ${t('iaProdutos.js.pensando')}
            </div>

        </div>
    `;


    chatConteudo.appendChild(
        mensagem
    );


    rolarChatParaBaixo();


    return mensagem;

}


// ==================================================
// REMOVE CARREGAMENTO
// ==================================================

function removerCarregamento(elemento) {

    if (elemento) {

        elemento.remove();

    }

}


// ==================================================
// DESATIVA TODOS OS MENUS
// ==================================================

function limparMenuAtivo() {

    menuConsultor.classList.remove(
        'ativo'
    );

    menuPromptBuilder.classList.remove(
        'ativo'
    );

    menuProduto.classList.remove(
        'ativo'
    );

}


// ==================================================
// DESATIVA TODAS AS ETAPAS DO FLUXO
// ==================================================

function limparFluxoAtivo() {

    fluxoConsultor.classList.remove(
        'ativo'
    );

    fluxoPromptBuilder.classList.remove(
        'ativo'
    );

    fluxoProduto.classList.remove(
        'ativo'
    );

}


// ==================================================
// ATUALIZA VISUAL DO MODO
// ==================================================

function atualizarVisualEtapa() {

    limparMenuAtivo();

    limparFluxoAtivo();


    // ==============================================
    // CONSULTOR
    // ==============================================

    if (etapaAtual === 'consultor') {

        menuConsultor.classList.add(
            'ativo'
        );


        fluxoConsultor.classList.add(
            'ativo'
        );


        modoAtualTexto.innerText =
            t('iaProdutos.js.modoConsultor');


        prompt.placeholder =
            t('iaProdutos.js.placeholderConsultor');

    }


    // ==============================================
    // PROMPT BUILDER
    // ==============================================

    else if (
        etapaAtual === 'promptBuilder'
    ) {

        menuPromptBuilder.classList.add(
            'ativo'
        );


        fluxoPromptBuilder.classList.add(
            'ativo'
        );


        modoAtualTexto.innerText =
            'Prompt Builder';


        prompt.placeholder =
            t('iaProdutos.js.placeholderPromptBuilder');

    }


    // ==============================================
    // GERADOR DE PRODUTO
    // ==============================================

    else if (
        etapaAtual === 'produto'
    ) {

        menuProduto.classList.add(
            'ativo'
        );


        fluxoProduto.classList.add(
            'ativo'
        );


        modoAtualTexto.innerText =
            t('iaProdutos.js.modoGeradorProduto');


        prompt.placeholder =
            t('iaProdutos.js.placeholderProduto');

    }

}


// ==================================================
// MUDA PARA CONSULTOR
// ==================================================

function mudarParaConsultor() {

    etapaAtual =
        'consultor';


    atualizarVisualEtapa();


    status.innerText =
        t('iaProdutos.js.statusConsultor');


    adicionarMensagemIA(`
## 💡 ${t('iaProdutos.js.consultorTitulo')}

${t('iaProdutos.js.consultorTexto1')}

${t('iaProdutos.js.consultorTexto2')}

- ${t('iaProdutos.js.consultorItem1')}
- ${t('iaProdutos.js.consultorItem2')}
- ${t('iaProdutos.js.consultorItem3')}
- ${t('iaProdutos.js.consultorItem4')}

${t('iaProdutos.js.consultorTexto3')}

> ${t('iaProdutos.js.consultorExemplo')}
`);

}


// ==================================================
// MUDA PARA PROMPT BUILDER
// ==================================================

function mudarParaPromptBuilder() {

    etapaAtual =
        'promptBuilder';


    atualizarVisualEtapa();


    status.innerText =
        t('iaProdutos.js.statusPromptBuilder');


    adicionarMensagemIA(`
## ✨ Prompt Builder

${t('iaProdutos.js.promptBuilderTexto1')}

${t('iaProdutos.js.promptBuilderTexto2')}

${t('iaProdutos.js.exemplo')}:

> ${t('iaProdutos.js.promptBuilderExemplo')}
`);

}


// ==================================================
// MUDA PARA GERADOR DE PRODUTO
// ==================================================

function mudarParaGeradorProduto() {

    etapaAtual =
        'produto';


    atualizarVisualEtapa();


    status.innerText =
        t('iaProdutos.js.statusGeradorProduto');


    adicionarMensagemIA(`
## 📦 ${t('iaProdutos.js.geradorTitulo')}

${t('iaProdutos.js.geradorTexto1')}

${t('iaProdutos.js.geradorTexto2')}
`);

}


// ==================================================
// CARREGA MODELOS DISPONÍVEIS NA GROQ
// ==================================================

async function carregarModelos() {
    try {
        status.innerText =
            t('iaProdutos.js.verificandoConexao')

        const requisicao = await fetch(
            '/ia/produtos/status',
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

        const dados =
            await requisicao.json()

        if (requisicao.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
            return
        }

        if (!requisicao.ok) {
            throw new Error(
                dados.erro ||
                t('iaProdutos.js.iaIndisponivel')
            )
        }

        modelo.innerHTML = ''

        const option =
            document.createElement('option')

        option.value = dados.modelo
        option.innerText = dados.modelo

        modelo.appendChild(option)
        modelo.disabled = true

        status.innerText =
            t('iaProdutos.js.groqConectada')
    } catch (erro) {
        console.error(erro)

        modelo.innerHTML = `
            <option value="">
                ${t('iaProdutos.js.iaIndisponivelCurto')}
            </option>
        `

        status.innerText =
            erro.message
    }
}


// ==================================================
// FUNÇÃO CENTRAL DA GROQ
// ==================================================

async function chamarGroq(
    etapa,
    mensagem
) {
    const historico =
        historicos[etapa] || []

    const requisicao = await fetch(
        '/ia/produtos/gerar',
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json',

                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                etapa,
                mensagem,
                historico:
                    historico.slice(-10)
            })
        }
    )

    let dados = {}

    try {
        dados = await requisicao.json()
    } catch {
        throw new Error(
            t('iaProdutos.js.respostaInvalida')
        )
    }

    if (requisicao.status === 401) {
        localStorage.removeItem('token')

        window.location.href = '/login'

        throw new Error(
            t('iaProdutos.js.sessaoExpirada')
        )
    }

    if (!requisicao.ok) {
        throw new Error(
            dados.erro ||
            t('iaProdutos.js.erroAcessarIA')
        )
    }

    if (!dados.resposta) {
        throw new Error(
            t('iaProdutos.js.semConteudo')
        )
    }

    const respostaHistorico =
        typeof dados.resposta === 'string'
            ? dados.resposta
            : JSON.stringify(dados.resposta)

    historico.push(
        {
            role: 'user',
            content: mensagem
        },
        {
            role: 'assistant',
            content: respostaHistorico
        }
    )

    return dados.resposta
}


// ==================================================
// USA O CONSULTOR
// ==================================================

async function usarConsultor(
    mensagem
) {

    status.innerText =
        t('iaProdutos.js.consultorAnalisando');


    const resultado =
    await chamarGroq(
        'consultor',
        mensagem
    )


    return resultado;

}


// ==================================================
// USA O PROMPT BUILDER
// ==================================================

async function usarPromptBuilder(
    ideia
) {

    status.innerText =
        t('iaProdutos.js.promptBuilderEstruturando');


    ideiaEscolhida =
        ideia;


    const resultado =
    await chamarGroq(
        'promptBuilder',
        ideia
    )


    promptGerado =
        resultado;


    return resultado;

}


// ==================================================
// USA O GERADOR DE PRODUTO
// ==================================================

async function usarGeradorProduto(
    promptFinal
) {

    status.innerText =
        t('iaProdutos.js.gerandoProduto');


    const resultado =
    await chamarGroq(
        'produto',
        promptFinal
    )


    produtoGerado =
        resultado;


    return resultado;

}


// ==================================================
// ENVIA MENSAGEM
// ==================================================

async function enviarMensagem() {
    const mensagem =
        prompt.value.trim()

    if (!modelo.value) {
        alert(
            t('iaProdutos.js.iaAindaIndisponivel')
        )

        return
    }

    if (!mensagem) {
        alert(
            t('iaProdutos.js.digiteMensagem')
        )

        prompt.focus()

        return
    }

    adicionarMensagemUsuario(mensagem)

    prompt.value = ''
    botao.disabled = true

    const carregamento =
        adicionarCarregamento()

    const inicio =
        performance.now()

    try {
        let resultado

        if (etapaAtual === 'consultor') {
            resultado =
                await usarConsultor(mensagem)
        } else if (
            etapaAtual === 'promptBuilder'
        ) {
            resultado =
                await usarPromptBuilder(mensagem)
        } else if (
            etapaAtual === 'produto'
        ) {
            resultado =
                await usarGeradorProduto(mensagem)
        } else {
            throw new Error(
                t('iaProdutos.js.etapaInvalida')
            )
        }

        removerCarregamento(carregamento)

        if (
            etapaAtual === 'produto' &&
            typeof resultado === 'object'
        ) {
            mostrarProdutoPreview(resultado)
            adicionarMensagemIA(
                formatarProdutoMarkdown(resultado)
            )
        } else {
            adicionarMensagemIA(resultado)
        }

        const fim =
            performance.now()

        const tempo =
            ((fim - inicio) / 1000)
                .toFixed(2)

        status.innerText =
            `${t('iaProdutos.js.modelo')}: ${modelo.value} • ${t('iaProdutos.js.tempo')}: ${tempo}s`
    } catch (erro) {
        removerCarregamento(carregamento)

        console.error(
            'Erro ao enviar mensagem:',
            erro
        )

        adicionarMensagemIA(`
## ❌ ${t('iaProdutos.js.naoFoiPossivelGerar')}

${erro.message}
        `)

        status.innerText =
            t('iaProdutos.js.erroConversarIA')
    } finally {
        botao.disabled = false
        prompt.focus()
    }
}


// ==================================================
// TRANSFORMA IDEIA EM PROMPT
// ==================================================

async function transformarIdeiaEmPrompt(
    ideia
) {

    etapaAtual =
        'promptBuilder';


    atualizarVisualEtapa();


    const resultado =
        await usarPromptBuilder(
            ideia
        );


    promptGerado =
        resultado;


    return resultado;

}


// ==================================================
// TRANSFORMA PROMPT EM PRODUTO
// ==================================================

async function transformarPromptEmProduto(
    promptFinal
) {

    etapaAtual =
        'produto';


    atualizarVisualEtapa();


    const resultado =
        await usarGeradorProduto(
            promptFinal
        );


    produtoGerado =
        resultado;


    return resultado;

}


// ==================================================
// FLUXO AUTOMÁTICO DE TESTE
// ==================================================

async function gerarProdutoCompleto(
    ideia
) {

    if (!ideia) {

        console.error(
            'Informe uma ideia.'
        );


        return;

    }


    botao.disabled =
        true;


    const inicio =
        performance.now();


    try {

        adicionarMensagemUsuario(
            ideia
        );

        // PROMPT BUILDER

        etapaAtual =
            'promptBuilder';


        atualizarVisualEtapa();


        status.innerText =
            t('iaProdutos.js.criandoPrompt');


        const promptFinal =
            await usarPromptBuilder(
                ideia
            );


        adicionarMensagemIA(`
## ✨ ${t('iaProdutos.js.promptCriado')}

${promptFinal}
`);

        // GERADOR DE PRODUTO

        etapaAtual =
            'produto';


        atualizarVisualEtapa();


        status.innerText =
            t('iaProdutos.js.promptCriadoGerando');


        const produto =
            await usarGeradorProduto(
                promptFinal
            );


        mostrarProdutoPreview(produto)

        adicionarMensagemIA(
            formatarProdutoMarkdown(produto)
        );


        const fim =
            performance.now();


        const tempo =
            (
                (fim - inicio) /
                1000
            ).toFixed(2);


        status.innerText =
            `${t('iaProdutos.js.produtoCriadoEm')} ${tempo}s`;


        return produto;

    }
    catch (erro) {

        console.error(erro);


        adicionarMensagemIA(`
## ❌ ${t('iaProdutos.js.erro')}

${erro.message}
`);


        status.innerText =
            t('iaProdutos.js.erroGerarProduto');

    }
    finally {

        botao.disabled =
            false;

    }

}

// BOTÃO EDITAR PRODUTO

if (botaoEditarProduto) {

    botaoEditarProduto.addEventListener(
        'click',
        function () {

            alert(
                t('iaProdutos.js.edicaoFutura')
            );

        }
    );

}

// BOTÃO GERAR PDF

if (botaoGerarPdf) {

    botaoGerarPdf.addEventListener(
        'click',
        function () {

            alert(
                t('iaProdutos.js.pdfFuturo')
            );

        }
    );

}

// BOTÃO PUBLICAR

if (botaoPublicarProduto) {

    botaoPublicarProduto.addEventListener(
        'click',
        function () {

            alert(
                t('iaProdutos.js.publicacaoFutura')
            );

        }
    );

}

// botão envar

botao.addEventListener(
    'click',
    function (evento) {
        evento.preventDefault()
        enviarMensagem()
    }
)

prompt.addEventListener(
    'keydown',
    function (evento) {
        if (
            evento.ctrlKey &&
            evento.key === 'Enter'
        ) {
            evento.preventDefault()
            enviarMensagem()
        }
    }
)

// inicialização
atualizarVisualEtapa()
carregarModelos()