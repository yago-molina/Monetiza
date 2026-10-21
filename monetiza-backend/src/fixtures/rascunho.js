function criarProdutoValido({
    titulo = 'Produto de teste',
    categoria = 'E-book',
    tipoOriginal = 'Guia digital'
} = {}) {
    return {
        versao_schema: '1.0',
        cadastro: {
            titulo,
            descricao_curta: 'Descrição curta do produto.',
            descricao_completa: 'Descrição completa e comercial do produto.',
            categoria,
            preco: 49.9,
            comissao: 40
        },
        produto: {
            tipo_original: tipoOriginal,
            subtitulo: 'Uma transformação clara e realista',
            nicho: 'Educação',
            subnicho: 'Aprendizado prático',
            publico_alvo: 'Pessoas iniciantes no assunto',
            problema_principal: 'Falta de um caminho organizado',
            proposta_valor: 'Ensino direto, organizado e aplicável',
            promessa_principal: 'Ajudar o aluno a avançar com clareza',
            beneficios: ['Conteúdo organizado', 'Aplicação prática'],
            diferenciais: ['Linguagem simples'],
            capitulos: [
                {
                    numero: 1,
                    titulo: 'Primeiros passos',
                    objetivo: 'Apresentar os fundamentos',
                    resumo: 'Visão geral dos conceitos essenciais.'
                }
            ],
            bonus: [],
            tags: ['educação', 'guia']
        },
        criativos: [
            {
                canal: 'Instagram',
                formato: 'Reels',
                headline: 'Comece do jeito certo',
                copy: 'Conheça um caminho mais organizado.',
                cta: 'Saiba mais',
                prompt_imagem: 'Pessoa estudando em uma mesa organizada'
            },
            {
                canal: 'TikTok',
                formato: 'Vídeo curto',
                headline: 'Você está começando agora?',
                copy: 'Veja como aprender seguindo uma estrutura simples.',
                cta: 'Conheça o produto',
                prompt_imagem: 'Pessoa aprendendo com um guia digital'
            },
            {
                canal: 'Instagram',
                formato: 'Carrossel',
                headline: 'Um caminho simples para começar',
                copy: 'Descubra os primeiros passos para avançar.',
                cta: 'Acesse agora',
                prompt_imagem: 'Mesa moderna com tablet exibindo produto digital'
            }
        ]
    }
}
function criarCapitulo() {
    return {
        versao_schema: '1.0',
        numero: 1,
        titulo: 'Primeiros passos',
        introducao:
            'Introdução completa do capítulo.',

        secoes: [
            {
                titulo: 'Preparação',
                conteudo:
                    'Conteúdo completo da preparação.'
            },
            {
                titulo: 'Aplicação',
                conteudo:
                    'Conteúdo completo da aplicação.'
            },
            {
                titulo: 'Evolução',
                conteudo:
                    'Conteúdo completo da evolução.'
            }
        ],

        atividade_pratica:
            'Realize a atividade apresentada.',

        pontos_chave: [
            'Primeiro ponto',
            'Segundo ponto',
            'Terceiro ponto'
        ],

        conclusao:
            'Conclusão completa do capítulo.'
    }
}
function estadoVazio() {
 return {schema:1,etapaAtual:'consultor',ideiaEscolhida:'',promptGerado:'',textoPrompt:'',produtoGerado:null,pdfPublicado:null,capitulosPdfProntos:[],historicos:{consultor:[],promptBuilder:[],produto:[]},camposEditorSalvos:null}
}
module.exports={criarProdutoValido,criarCapitulo,estadoVazio}
