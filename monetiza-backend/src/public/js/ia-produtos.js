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

if (!token) {
    window.location.href = '/'
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

let produtoGerado = '';


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
                Você
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
                    📋 Copiar
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
                    '✓ Copiado';


                setTimeout(
                    function () {

                        botaoCopiar.innerText =
                            '📋 Copiar';

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
                    'Erro ao copiar';


                setTimeout(
                    function () {

                        botaoCopiar.innerText =
                            '📋 Copiar';

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
                Pensando...
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
            'Consultor de produtos digitais';


        prompt.placeholder =
            'Ex: Quero criar um produto digital, mas ainda não sei o que vender.';

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
            'Ex: Quero criar um ebook para iniciantes em academia.';

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
            'Gerador de produtos digitais';


        prompt.placeholder =
            'Cole aqui o prompt detalhado do produto...';

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
        'Modo atual: Consultor';


    adicionarMensagemIA(`
## 💡 Consultor

Conte um pouco sobre o que você gostaria de criar.

Você pode informar, por exemplo:

- um nicho que você conhece;
- algo que gosta;
- um público que gostaria de atingir;
- um problema que gostaria de ajudar a resolver.

Se ainda não tiver nenhuma ideia, também pode simplesmente dizer:

> Não sei o que criar.
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
        'Modo atual: Prompt Builder';


    adicionarMensagemIA(`
## ✨ Prompt Builder

Envie uma ideia de produto, mesmo que ainda esteja simples.

Eu vou transformá-la em um **prompt detalhado e profissional** para ser usado pelo Gerador de Produtos.

Exemplo:

> Quero criar um ebook para pessoas que começaram academia recentemente.
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
        'Modo atual: Gerador de Produto';


    adicionarMensagemIA(`
## 📦 Gerador de Produto

Envie um prompt detalhado contendo as especificações do produto.

A Monetiza IA irá transformar esse prompt em uma estrutura completa de produto digital.
`);

}


// ==================================================
// CARREGA MODELOS DISPONÍVEIS NA GROQ
// ==================================================

async function carregarModelos() {
    try {
        status.innerText =
            'Verificando conexão com a IA...'

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
            window.location.href = '/'
            return
        }

        if (!requisicao.ok) {
            throw new Error(
                dados.erro ||
                'A IA está indisponível.'
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
            'Groq conectada com sucesso.'
    } catch (erro) {
        console.error(erro)

        modelo.innerHTML = `
            <option value="">
                IA indisponível
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
            'O servidor retornou uma resposta inválida.'
        )
    }

    if (requisicao.status === 401) {
        localStorage.removeItem('token')

        window.location.href = '/'

        throw new Error(
            'Sua sessão expirou.'
        )
    }

    if (!requisicao.ok) {
        throw new Error(
            dados.erro ||
            'Erro ao acessar a IA.'
        )
    }

    if (!dados.resposta) {
        throw new Error(
            'A IA não retornou conteúdo.'
        )
    }

    historico.push(
        {
            role: 'user',
            content: mensagem
        },
        {
            role: 'assistant',
            content: dados.resposta
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
        'Consultor analisando sua mensagem...';


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
        'Prompt Builder estruturando sua ideia...';


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
        'Gerando produto digital...';


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
            'A IA ainda não está disponível.'
        )

        return
    }

    if (!mensagem) {
        alert(
            'Digite uma mensagem.'
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
                'Etapa da IA inválida.'
            )
        }

        removerCarregamento(carregamento)

        adicionarMensagemIA(resultado)

        const fim =
            performance.now()

        const tempo =
            ((fim - inicio) / 1000)
                .toFixed(2)

        status.innerText =
            `Modelo: ${modelo.value} • Tempo: ${tempo}s`
    } catch (erro) {
        removerCarregamento(carregamento)

        console.error(
            'Erro ao enviar mensagem:',
            erro
        )

        adicionarMensagemIA(`
## ❌ Não foi possível gerar a resposta

${erro.message}
        `)

        status.innerText =
            'Erro ao conversar com a IA.'
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


        // ==========================================
        // PROMPT BUILDER
        // ==========================================

        etapaAtual =
            'promptBuilder';


        atualizarVisualEtapa();


        status.innerText =
            'Criando prompt profissional...';


        const promptFinal =
            await usarPromptBuilder(
                ideia
            );


        adicionarMensagemIA(`
## ✨ Prompt criado

${promptFinal}
`);


        // ==========================================
        // GERADOR DE PRODUTO
        // ==========================================

        etapaAtual =
            'produto';


        atualizarVisualEtapa();


        status.innerText =
            'Prompt criado. Gerando produto...';


        const produto =
            await usarGeradorProduto(
                promptFinal
            );


        adicionarMensagemIA(`
# 📦 Produto criado

${produto}
`);


        const fim =
            performance.now();


        const tempo =
            (
                (fim - inicio) /
                1000
            ).toFixed(2);


        status.innerText =
            `Produto criado em ${tempo}s`;


        return produto;

    }
    catch (erro) {

        console.error(erro);


        adicionarMensagemIA(`
## ❌ Erro

${erro.message}
`);


        status.innerText =
            'Erro ao gerar produto.';

    }
    finally {

        botao.disabled =
            false;

    }

}


// ==================================================
// BOTÃO EDITAR PRODUTO
// ==================================================

if (botaoEditarProduto) {

    botaoEditarProduto.addEventListener(
        'click',
        function () {

            alert(
                'A edição do produto será implementada na próxima etapa.'
            );

        }
    );

}


// ==================================================
// BOTÃO GERAR PDF
// ==================================================

if (botaoGerarPdf) {

    botaoGerarPdf.addEventListener(
        'click',
        function () {

            alert(
                'A geração de PDF será implementada depois do produto em JSON.'
            );

        }
    );

}


// ==================================================
// BOTÃO PUBLICAR
// ==================================================

if (botaoPublicarProduto) {

    botaoPublicarProduto.addEventListener(
        'click',
        function () {

            alert(
                'Protótipo: produto publicado com sucesso!'
            );

        }
    );

}


// ==================================================
// BOTÃO ENVIAR
// ==================================================

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

atualizarVisualEtapa()
carregarModelos()


// ==================================================
// INICIALIZAÇÃO
// ==================================================

atualizarVisualEtapa();

carregarModelos();