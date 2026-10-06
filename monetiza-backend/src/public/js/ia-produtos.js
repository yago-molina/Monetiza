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
let rascunhos = null;
let camposEditorSalvos = null;


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
        const seguro = document.createElement('div')
        seguro.textContent = String(texto)
        return seguro.innerHTML
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

    const preco = new Intl.NumberFormat(window.i18n.locale(),
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
                    ${window.i18n.t('iaProdutos.tituloDocumento')}
                </span>

                <button class="btn-copiar">
                    <i class="fa-solid fa-copy"></i>
                    <span class="btn-copiar-texto">${t('iaProdutos.js.copiar')}</span>
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

    botaoCopiar.addEventListener('click', async function () {
        try {
            await navigator.clipboard.writeText(texto);
            // Feedback de sucesso com ícone do Font Awesome
            botaoCopiar.innerHTML = `<i class="fa-solid fa-check"></i> <span class="btn-copiar-texto">${t('iaProdutos.js.copiado')}</span>`;
            
            setTimeout(() => {
                // Retorna ao estado original com o fa-copy
                botaoCopiar.innerHTML = `<i class="fa-solid fa-copy"></i> <span class="btn-copiar-texto">${t('iaProdutos.js.copiar')}</span>`;
            }, 2000);
        } catch (erro) {
            console.error('Erro ao copiar:', erro);
            // Feedback de erro com ícone do Font Awesome
            botaoCopiar.innerHTML = `<i class="fa-solid fa-xmark"></i> <span class="btn-copiar-texto">${t('iaProdutos.js.erroCopiar')}</span>`;
            
            setTimeout(() => {
                // Retorna ao estado original com o fa-copy
                botaoCopiar.innerHTML = `<i class="fa-solid fa-copy"></i> <span class="btn-copiar-texto">${t('iaProdutos.js.copiar')}</span>`;
            }, 2000);
        }
    });


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
                ${window.i18n.t('iaProdutos.tituloDocumento')}
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
            window.i18n.t('complementos.promptBuilder');


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
    if (!rascunhos?.podeMudar()) return
    rascunhos.agendar()

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
    if (!rascunhos?.podeMudar()) return
    rascunhos.agendar()

    etapaAtual =
        'promptBuilder';


    atualizarVisualEtapa();


    status.innerText =
        t('iaProdutos.js.statusPromptBuilder');


    adicionarMensagemIA(`
## ✨ ${window.i18n.t('complementos.promptBuilder')}

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
    if (!rascunhos?.podeMudar()) return
    rascunhos.agendar()

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


    await rascunhos.salvar()
    return resultado;

}


// ==================================================
// USA O GERADOR DE PRODUTO
// ==================================================

async function usarGeradorProduto(
    promptFinal
) {
    if (produtoGerado) {
        await rascunhos.novo(true)
        etapaAtual = 'produto'
        atualizarVisualEtapa()
    }
    promptGerado = promptFinal
    await rascunhos.salvar()


    status.innerText =
        t('iaProdutos.js.gerandoProduto');


    const resultado =
    await chamarGroq(
        'produto',
        promptFinal
    )


    produtoGerado =
    resultado;

    pdfPublicado = null
    arquivoPdfPronto = null
    capitulosPdfProntos = []
    camposEditorSalvos = null
    mostrarProdutoPreview(produtoGerado)
    await rascunhos.salvar()

    return resultado;

}


// ==================================================
// ENVIA MENSAGEM
// ==================================================

async function enviarMensagem() {
    const mensagem =
        prompt.value.trim()

    if (!modelo.value) {
        await MonetizaUI.aviso(
            t('iaProdutos.js.iaAindaIndisponivel')
        )

        return
    }

    if (!mensagem) {
        await MonetizaUI.aviso(
            t('iaProdutos.js.digiteMensagem')
        )

        prompt.focus()

        return
    }

    adicionarMensagemUsuario(mensagem)

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

        prompt.value = ''
        await rascunhos.salvar()
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

// Estado do arquivo correspondente à versão atual do produto.
let pdfPublicado = null

const editor = document.getElementById('editor-produto')
const formEditor = document.getElementById('form-editor-produto')
const campo = id => document.getElementById(id)

function exigirProduto() {
    if (!produtoGerado?.cadastro || !produtoGerado?.produto) {
        throw new Error(window.i18n.t('complementos.gereUmProdutoAntesDeContinuar'))
    }
}

function respostaAutenticada(resposta, dados) {
    if (resposta.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        throw new Error(window.i18n.t('iaProdutos.js.sessaoExpirada'))
    }

    if (!resposta.ok) {
        throw new Error(dados.erro || window.i18n.t('complementos.naoFoiPossivelConcluirAOperacao'))
    }

    return dados
}

async function abrirEditorProduto() {
    try {
        exigirProduto()

        const cadastro = produtoGerado.cadastro

        campo('ia-titulo').value = cadastro.titulo
        campo('ia-descricao-curta').value = cadastro.descricao_curta
        campo('ia-descricao-completa').value = cadastro.descricao_completa
        campo('ia-categoria').value = cadastro.categoria
        campo('ia-preco').value = cadastro.preco
        campo('ia-comissao').value = cadastro.comissao
        campo('ia-capa').value = produtoGerado.capa || ''

        if (camposEditorSalvos) {
            for (const [id, valor] of Object.entries(camposEditorSalvos)) {
                if (IDS_EDITOR.includes(id)) campo(id).value = String(valor)
            }
        }
        editor.showModal()
    } catch (erro) {
        await MonetizaUI.aviso(erro.message)
    }
}

async function salvarEdicaoProduto(evento) {
    evento.preventDefault()

    if (!formEditor.reportValidity()) return

    const cadastro = produtoGerado.cadastro

    const tituloAlterado =
        cadastro.titulo !== campo('ia-titulo').value.trim()

    cadastro.titulo = campo('ia-titulo').value.trim()
    cadastro.descricao_curta = campo('ia-descricao-curta').value.trim()
    cadastro.descricao_completa = campo('ia-descricao-completa').value.trim()
    cadastro.categoria = campo('ia-categoria').value
    cadastro.preco = Number(campo('ia-preco').value)
    cadastro.comissao = Number(campo('ia-comissao').value)

    produtoGerado.capa = campo('ia-capa').value.trim()

    // Os outros campos pertencem ao anúncio.
    // O título também aparece dentro do PDF.
    if (tituloAlterado) {
        pdfPublicado = null
        arquivoPdfPronto = null
    }

    camposEditorSalvos = null
    mostrarProdutoPreview(produtoGerado)
    editor.close()
    try { await rascunhos.salvar() } catch (erro) {
        await MonetizaUI.aviso(window.i18n.t('complementos.aEdicaoEstaNestaPaginaMasAindaNaoFoiSalva')); return
    }

    status.innerText = pdfPublicado
        ? window.i18n.t('complementos.alteracoesSalvasSeuPdfEstaProntoParaPublicar')
        : tituloAlterado && capitulosPdfProntos.length
            ? window.i18n.t('complementos.tituloAtualizadoCliqueEmGerarPdfParaAtualizarOArquivo')
            : window.i18n.t('complementos.alteracoesSalvasGereOPdfAntesDePublicar')
}

async function desenvolverCapitulo(numero) {
    const resposta = await fetch('/ia/produtos/gerar-capitulo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            produto: {
                versao_schema: produtoGerado.versao_schema,
                cadastro: produtoGerado.cadastro,
                produto: produtoGerado.produto,
                criativos: produtoGerado.criativos
            },
            numero_capitulo: numero
        })
    })

    const dados = await resposta.json()
    return respostaAutenticada(resposta, dados).resposta
}

function limparTextoPdf(texto) {
    return String(texto ?? '')
        .normalize('NFC')
        .replace(/\r\n?/g, '\n')
        .replace(/[\u00A0\u2007\u202F]/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
        .replace(/…/g, '...')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .trim()
}

function nomeArquivoProduto(titulo) {
    const nome = limparTextoPdf(titulo)
        // Usa a parte principal antes do subtítulo.
        .split(/[:|]|\s+-\s+/)[0]
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .slice(0, 7)
        .join(' ')
        .slice(0, 80)
        .replace(/[. ]+$/g, '')

    const seguro = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(nome)
        ? `Produto ${nome}`
        : nome

    return `${seguro || window.i18n.t('complementos.meuProduto')}.pdf`
}

function escreverParagrafo(
    pdf,
    texto,
    estado,
    tamanho = 11,
    negrito = false,
    cor = [45, 45, 55]
) {
    const conteudo = limparTextoPdf(texto)
    if (!conteudo) return

    const margem = 22
    const largura = pdf.internal.pageSize.getWidth() - margem * 2
    const limite = pdf.internal.pageSize.getHeight() - 25

    pdf.setFont('helvetica', negrito ? 'bold' : 'normal')
    pdf.setFontSize(tamanho)
    pdf.setTextColor(...cor)
    pdf.setCharSpace(0)

    const alturaLinha = tamanho / pdf.internal.scaleFactor * 1.45

    const paragrafos = conteudo.split(/\n\s*\n/)

    for (const paragrafo of paragrafos) {
        const linhas = pdf.splitTextToSize(
            paragrafo.replace(/[ \t]+/g, ' '),
            largura
        )

        const espacoNecessario = negrito
            ? linhas.length * alturaLinha + 12
            : Math.min(linhas.length, 2) * alturaLinha

        if (
            estado.y + espacoNecessario > limite &&
            estado.y > 24
        ) {
            pdf.addPage()
            estado.y = 24
        }

        for (const linha of linhas) {
            if (estado.y + alturaLinha > limite) {
                pdf.addPage()
                estado.y = 24
            }

            pdf.text(linha, margem, estado.y)
            estado.y += alturaLinha
        }

        estado.y += 4
    }

    if (negrito) estado.y += 1
}

function montarPdf(capitulos) {
    const { jsPDF } = window.jspdf

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    const estado = { y: 50 }
    const roxo = [77, 77, 255]

    pdf.setProperties({
        title: limparTextoPdf(produtoGerado.cadastro.titulo),
        subject: limparTextoPdf(produtoGerado.produto.subtitulo),
        creator: 'Monetiza'
    })

    pdf.setFillColor(...roxo)
    pdf.rect(22, 30, 28, 2, 'F')

    escreverParagrafo(
        pdf,
        produtoGerado.cadastro.titulo,
        estado,
        26,
        true,
        [25, 25, 35]
    )

    estado.y += 5

    escreverParagrafo(
        pdf,
        produtoGerado.produto.subtitulo,
        estado,
        14,
        false,
        [95, 95, 110]
    )

    for (const capitulo of capitulos) {
        pdf.addPage()
        estado.y = 28

        escreverParagrafo(
            pdf,
            `CAPÍTULO ${capitulo.numero}`,
            estado,
            10,
            true,
            roxo
        )

        escreverParagrafo(
            pdf,
            capitulo.titulo,
            estado,
            21,
            true,
            [25, 25, 35]
        )

        escreverParagrafo(pdf, capitulo.introducao, estado)

        for (const secao of capitulo.secoes) {
            estado.y += 3

            escreverParagrafo(
                pdf,
                secao.titulo,
                estado,
                14,
                true,
                roxo
            )

            escreverParagrafo(pdf, secao.conteudo, estado)
        }

        escreverParagrafo(
            pdf, 'Atividade prática', estado, 14, true, roxo
        )

        escreverParagrafo(
            pdf, capitulo.atividade_pratica, estado
        )

        escreverParagrafo(
            pdf, 'Pontos-chave', estado, 14, true, roxo
        )

        for (const ponto of capitulo.pontos_chave) {
            escreverParagrafo(pdf, `- ${ponto}`, estado)
        }

        escreverParagrafo(
            pdf, 'Conclusão', estado, 14, true, roxo
        )

        escreverParagrafo(pdf, capitulo.conclusao, estado)
    }

    const total = pdf.getNumberOfPages()

    for (let pagina = 1; pagina <= total; pagina++) {
        pdf.setPage(pagina)

        const largura = pdf.internal.pageSize.getWidth()
        const altura = pdf.internal.pageSize.getHeight()

        pdf.setDrawColor(225, 225, 235)
        pdf.setLineWidth(0.2)
        pdf.line(22, altura - 19, largura - 22, altura - 19)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor(120, 120, 135)

        pdf.text('Monetiza', 22, altura - 12)

        pdf.text(
            `${pagina} / ${total}`,
            largura - 22,
            altura - 12,
            { align: 'right' }
        )
    }

    return pdf
}

async function enviarPdf(pdf) {
    const formulario = new FormData()
    formulario.append(
        'arquivo',
        pdf.output('blob'),
        nomeArquivoProduto(produtoGerado.cadastro.titulo)
    )

    const resposta = await fetch('/ia/produtos/arquivo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formulario
    })

    const dados = await resposta.json()
    return respostaAutenticada(resposta, dados).url
}

const modalLoadingPdf = document.getElementById('loading-pdf')
const modalSucessoPdf = document.getElementById('sucesso-pdf')
const textoEtapaPdf = document.getElementById('loading-pdf-etapa')
const progressoPdf = document.getElementById('loading-pdf-progresso')
const nomePdfPronto = document.getElementById('sucesso-pdf-nome')
const botaoBaixarPdf = document.getElementById('baixar-pdf-pronto')

let geracaoPdfEmAndamento = false
let arquivoPdfPronto = null
let capitulosPdfProntos = []

// Impede que Esc esconda o progresso durante a geração.
modalLoadingPdf.addEventListener('cancel', evento => {
    evento.preventDefault()
})

document.getElementById('fechar-sucesso-pdf')
    .addEventListener('click', () => {
        modalSucessoPdf.close()
    })

botaoBaixarPdf.addEventListener('click', () => {
    if (!arquivoPdfPronto) return

    const url = URL.createObjectURL(arquivoPdfPronto.blob)
    const link = document.createElement('a')

    link.href = url
    link.download = arquivoPdfPronto.nome

    document.body.appendChild(link)
    link.click()
    link.remove()

    // Libera a URL temporária após o navegador iniciar o download.
    setTimeout(() => URL.revokeObjectURL(url), 60000)
})

function atualizarProgressoPdf(mensagem, concluido, total) {
    textoEtapaPdf.textContent = mensagem
    status.innerText = mensagem

    progressoPdf.max = total
    progressoPdf.value = concluido
}

async function gerarPdfProduto() {
    if (geracaoPdfEmAndamento) return

    const textoOriginal = botaoGerarPdf.textContent

    try {
        exigirProduto()

        if (pdfPublicado && !arquivoPdfPronto) {
            try {
                arquivoPdfPronto = { blob: await rascunhos.baixarPdf(), nome: nomeArquivoProduto(produtoGerado.cadastro.titulo) }
            } catch (erro) {
                if (erro.status !== 404) throw erro
                pdfPublicado = null
                await rascunhos.salvar()
            }
        }
        if (pdfPublicado && arquivoPdfPronto) {
            nomePdfPronto.textContent = arquivoPdfPronto.nome
            botaoBaixarPdf.disabled = false

            if (!modalSucessoPdf.open) {
                modalSucessoPdf.showModal()
            }

            botaoBaixarPdf.focus()
            return
        }

        if (typeof window.jspdf?.jsPDF !== 'function') {
            throw new Error(
                window.i18n.t('complementos.aBibliotecaDePdfNaoCarregouAtualizeComCtrlF5')
            )
        }

        const estruturas = produtoGerado.produto.capitulos

        if (!Array.isArray(estruturas) || estruturas.length === 0) {
            throw new Error(window.i18n.t('complementos.oProdutoNaoPossuiCapitulosParaGerar'))
        }

        geracaoPdfEmAndamento = true
        botaoGerarPdf.disabled = true
        botaoGerarPdf.textContent = window.i18n.t('complementos.gerandoPdf')

        arquivoPdfPronto = null
        pdfPublicado = null
        botaoBaixarPdf.disabled = true

        if (modalSucessoPdf.open) {
            modalSucessoPdf.close()
        }

        const animacao = modalLoadingPdf.querySelector('iframe')
        animacao.src = animacao.dataset.src

        const totalEtapas = estruturas.length + 2

        atualizarProgressoPdf(
            window.i18n.t('complementos.preparandoAGeracaoDosCapitulos'),
            0,
            totalEtapas
        )

        modalLoadingPdf.showModal()

        // Permite ao navegador exibir a sobreposição.
        await new Promise(resolve => requestAnimationFrame(resolve))

        const capitulos = []

        for (let indice = 0; indice < estruturas.length; indice++) {
            const estrutura = estruturas[indice]

            atualizarProgressoPdf(
                window.i18n.t('complementos.gerandoCapituloNumeroDeTotalTitulo', { numero: indice + 1, total: estruturas.length, titulo: estrutura.titulo }),
                indice,
                totalEtapas
            )

            const capitulo = capitulosPdfProntos[indice] || await desenvolverCapitulo(estrutura.numero)

            capitulosPdfProntos[indice] = capitulo
            capitulos.push(capitulo)
            await rascunhos.salvar()

            progressoPdf.value = indice + 1
        }

        atualizarProgressoPdf(
            window.i18n.t('complementos.organizandoOTextoEMontandoOPdf'),
            estruturas.length,
            totalEtapas
        )

        await new Promise(resolve => requestAnimationFrame(resolve))

        const pdf = montarPdf(capitulos)

        atualizarProgressoPdf(
            window.i18n.t('complementos.salvandoOPdfParaPublicacao'),
            estruturas.length + 1,
            totalEtapas
        )

        const url = await enviarPdf(pdf)

        if (!url) {
            throw new Error(window.i18n.t('complementos.oServidorNaoRetornouOEnderecoDoPdf'))
        }

        pdfPublicado = url
        await rascunhos.salvar()

        arquivoPdfPronto = {
            blob: pdf.output('blob'),
            nome: nomeArquivoProduto(produtoGerado.cadastro.titulo)
        }

        atualizarProgressoPdf(
            window.i18n.t('complementos.pdfGeradoESalvoComSucesso'),
            totalEtapas,
            totalEtapas
        )

        modalLoadingPdf.close()

        nomePdfPronto.textContent = arquivoPdfPronto.nome
        botaoBaixarPdf.disabled = false

        modalSucessoPdf.showModal()
        botaoBaixarPdf.focus()
    } catch (erro) {
        console.error('Erro ao gerar PDF:', erro)

        if (modalLoadingPdf.open) {
            modalLoadingPdf.close()
        }

        status.innerText = erro.message
        await MonetizaUI.aviso(erro.message)
    } finally {
        if (modalLoadingPdf.open) {
            modalLoadingPdf.close()
        }

        // Interrompe a animação quando a sobreposição fecha.
        modalLoadingPdf.querySelector('iframe').src = 'about:blank'

        geracaoPdfEmAndamento = false
        botaoGerarPdf.disabled = false
        botaoGerarPdf.textContent = textoOriginal
    }
}

async function publicarProdutoIa() {
    const textoOriginal = botaoPublicarProduto.textContent

    try {
        exigirProduto()

        const cadastro = produtoGerado.cadastro
        const capa = produtoGerado.capa?.trim()

        if (!capa) {
            await MonetizaUI.aviso(
                window.i18n.t('complementos.adicioneUmaImagemDeCapaParaConcluirAPublicacao'),
                { titulo: window.i18n.t('complementos.faltaACapaDoProduto') }
            )

            await abrirEditorProduto()
            campo('ia-capa').focus()
            return
        }


        if (!pdfPublicado) {
            await MonetizaUI.aviso(window.i18n.t('complementos.gereOPdfAntesDePublicar'))
            return
        }

        const categorias = [
            'Curso',
            'E-book',
            'Software / SaaS',
            'Mentoria'
        ]

        if (!categorias.includes(cadastro.categoria)) {
            await MonetizaUI.aviso(
                window.i18n.t('complementos.selecioneACategoriaDoSeuProdutoNoEditor'),
                { titulo: window.i18n.t('complementos.escolhaUmaCategoria') }
            )

            await abrirEditorProduto()
            campo('ia-categoria').focus()
            return
        }

        const titulo = cadastro.titulo?.trim()
        const preco = Number(cadastro.preco)
        const comissao = Number(cadastro.comissao ?? 0)

        if (!titulo || titulo.length > 100) {
            throw new Error(window.i18n.t('complementos.oTituloDeveTerEntre1E100Caracteres'))
        }

        if (!Number.isFinite(preco) || preco <= 0) {
            throw new Error(window.i18n.t('complementos.informeUmPrecoMaiorQueZero'))
        }

        if (
            !Number.isFinite(comissao) ||
            comissao < 0 ||
            comissao > 100
        ) {
            throw new Error(window.i18n.t('complementos.aComissaoDeveEstarEntre0E100'))
        }

        for (const endereco of [capa, pdfPublicado]) {
            let url

            try {
                url = new URL(endereco)
            } catch {
                throw new Error(window.i18n.t('complementos.aCapaOuOPdfEstaComUmEnderecoInvalido'))
            }

            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new Error(window.i18n.t('complementos.aCapaEOPdfPrecisamUsarHttpOuHttps'))
            }
        }

        botaoPublicarProduto.disabled = true
        botaoPublicarProduto.textContent = window.i18n.t('complementos.publicando')
        status.innerText = window.i18n.t('complementos.salvandoProdutoNaPlataforma')

        await rascunhos.salvar()
        const resposta = await MonetizaOperacoes.enviar('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                titulo,
                descricao_curta: cadastro.descricao_curta,
                descricao_completa: cadastro.descricao_completa,
                categoria: cadastro.categoria,
                preco,
                comissao,
                capa,
                produto_arquivo: pdfPublicado,
                status_produto: 'Ativo',
                ...rascunhos.referencia()
            })
        })

        const dados = await resposta.json().catch(() => ({
            erro: window.i18n.t('complementos.oServidorRetornouUmaRespostaInvalidaStatus', { status: resposta.status })
        }))

        respostaAutenticada(resposta, dados)

        if (!dados.id) {
            throw new Error(window.i18n.t('complementos.oServidorNaoConfirmouOCodigoDoProduto'))
        }

        rascunhos.publicado(dados.id)
        status.innerText = window.i18n.t('complementos.produtoPublicadoComSucesso')

        await MonetizaUI.aviso(window.i18n.t('complementos.produtoPublicadoEleJaEstaDisponivelNaVitrine'))

        window.location.href = '/produto'
    } catch (erro) {
        console.error('Erro ao publicar produto:', erro)
        status.innerText = erro.message
        await MonetizaUI.aviso(erro.message)
    } finally {
        botaoPublicarProduto.disabled = false
        botaoPublicarProduto.textContent = textoOriginal
    }
}

botaoEditarProduto?.addEventListener('click', () => rascunhos.executar(abrirEditorProduto))
botaoGerarPdf?.addEventListener('click', () => rascunhos.executar(gerarPdfProduto))
botaoPublicarProduto?.addEventListener('click', () => rascunhos.executar(publicarProdutoIa))

formEditor.addEventListener('submit', evento => { evento.preventDefault(); rascunhos.executar(() => salvarEdicaoProduto(evento)) })

campo('cancelar-editor').addEventListener('click', () => {
    camposEditorSalvos = null
    editor.close()
    rascunhos.agendar()
})

// botão envar

botao.addEventListener(
    'click',
    function (evento) {
        evento.preventDefault()
        rascunhos.executar(enviarMensagem)
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
            rascunhos.executar(enviarMensagem)
        }
    }
)

const IDS_EDITOR = ['ia-titulo','ia-descricao-curta','ia-descricao-completa','ia-categoria','ia-preco','ia-comissao','ia-capa']
function estadoVazioRascunho() {
    return { schema:1, etapaAtual:'consultor', ideiaEscolhida:'', promptGerado:'',
        produtoGerado:null, pdfPublicado:null, capitulosPdfProntos:[], textoPrompt:'',
        historicos:{consultor:[],promptBuilder:[],produto:[]}, camposEditorSalvos:null }
}
function capturarRascunho() {
    return {schema:1,etapaAtual,ideiaEscolhida,promptGerado,produtoGerado,pdfPublicado,
        capitulosPdfProntos,textoPrompt:prompt.value,camposEditorSalvos,
        historicos:Object.fromEntries(Object.entries(historicos).map(([k,v])=>[k,v.slice(-20)]))}
}
function restaurarRascunho(estado) {
    etapaAtual=estado.etapaAtual;ideiaEscolhida=estado.ideiaEscolhida;promptGerado=estado.promptGerado
    produtoGerado=estado.produtoGerado;pdfPublicado=estado.pdfPublicado
    capitulosPdfProntos=estado.capitulosPdfProntos;arquivoPdfPronto=null
    camposEditorSalvos=estado.camposEditorSalvos || null;prompt.value=estado.textoPrompt
    for (const etapa of Object.keys(historicos)) historicos[etapa]=estado.historicos[etapa] || []
    chatConteudo.replaceChildren();produtoPreview.classList.add('oculto')
    atualizarVisualEtapa()
    // Histórico já vem validado do servidor; a renderização continua sanitizada.
    for (const mensagem of historicos[etapaAtual]) {
        if (mensagem.role==='user') adicionarMensagemUsuario(mensagem.content)
        else if (etapaAtual!=='produto') adicionarMensagemIA(mensagem.content)
    }
    if (produtoGerado) mostrarProdutoPreview(produtoGerado)
    status.innerText=produtoGerado ? window.i18n.t('complementos.quantidadeCapituloSRecuperadoS', { quantidade: capitulosPdfProntos.filter(Boolean).length }) : window.i18n.t('complementos.continueDeOndeParou')
}
rascunhos = window.criarGerenciadorRascunhos({token,capturar:capturarRascunho,restaurar:restaurarRascunho,vazio:estadoVazioRascunho,
    aoPublicar: id => {
        botaoEditarProduto.disabled=Boolean(id);botaoGerarPdf.disabled=Boolean(id);botaoPublicarProduto.disabled=Boolean(id)
    }})
prompt.addEventListener('input',()=>rascunhos.agendar())
formEditor.addEventListener('input',()=>{
    camposEditorSalvos=Object.fromEntries(IDS_EDITOR.map(id=>[id,campo(id).value]))
    rascunhos.agendar()
})
// inicialização
atualizarVisualEtapa()
carregarModelos()
rascunhos.iniciar()
