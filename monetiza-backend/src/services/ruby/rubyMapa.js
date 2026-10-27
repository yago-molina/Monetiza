// Base editorial conferida no commit 36635b5. Atualize junto com telas/ações.
// fontes e marcadores permitem testar se a orientação ainda existe no código.
const paginas = [
    { id: 'inicio', nomes: ['Início', 'Home', 'Inicio'], rota: '/', arquivo: 'inicio.html', termos: ['inicio', 'home', 'começar', 'start'],
        fatos: 'Apresentação pública. Criar conta/Começar agora abre /cadastro; Entrar abre /login; Ver vitrine abre /vitrine. Números promocionais não são métricas consultadas da conta. Termos, Privacidade e Suporte no rodapé são links #, sem página implementada.' },
    { id: 'login', nomes: ['Entrar', 'Sign in', 'Iniciar sesión'], rota: '/login', arquivo: 'login.html', termos: ['login', 'entrar', 'sign in', 'log in', 'acesso', 'sesion', 'session', 'esqueci', 'forgot', 'olvide', 'recuperar'],
        fatos: 'Login por e-mail e senha; sessão expirada exige entrar novamente. Esqueceu a senha? não implementa recuperação por e-mail. Não há 2FA/Resend ativo. Não prometer e-mail, reset ou recuperação pela Ruby.',
        fontes: ['js/login.js', '../controllers/authController.js'], marcadores: ['login-email', 'login-senha', 'link-esqueci-senha'] },
    { id: 'cadastro', nomes: ['Criar conta', 'Create account', 'Crear cuenta'], rota: '/cadastro', arquivo: 'cadastro.html', termos: ['cadastro', 'registrar', 'register', 'sign up', 'cuenta', 'account'],
        fatos: 'Nome, e-mail, senha, repetir senha e aceite dos termos. Cadastro exige senha de pelo menos 8 caracteres e confirmação igual; depois entrar em /login.', fontes: ['js/cadastro.js', '../controllers/authController.js'] },
    { id: 'landing', nomes: ['Página inicial', 'Home page', 'Página de inicio'], rota: '/landing', arquivo: 'landing.html', termos: ['novidades', 'news', 'novedades', 'carrossel', 'carousel', 'ranking'],
        fatos: 'Área inicial com atalhos e dois carrosséis. Novidades da Monetiza contém dicas editoriais e atalhos para IA, Produtos e Afiliados; não é feed de Instagram/notícias ao vivo. Mais vendidos mostra até 5 produtos ativos por vendas pagas; tem setas e passagem automática.', fontes: ['js/landing-novidades.js', 'js/landing-ranking.js'] },
    { id: 'dashboard', nomes: ['Dashboard', 'Dashboard', 'Dashboard'], rota: '/dashboard', arquivo: 'dashboard.html', termos: ['dashboard', 'painel', 'resumo', 'summary', 'resumen', 'metricas'],
        fatos: 'Resumo da conta: vendas, comissões, produtos ativos, vendas recentes e saldo/entradas/saídas. Ações rápidas Novo Produto, Gerar Link, Novo Contrato, Mensagens apenas levam às respectivas telas. Ruby não consulta os números deste painel.', fontes: ['js/dashboard.js'] },
    { id: 'produtos', nomes: ['Produtos', 'Products', 'Productos'], rota: '/produto', arquivo: 'produto.html', termos: ['produto', 'product', 'producto', 'capa', 'cover', 'portada', 'upload', 'manual', 'editar', 'edit', 'excluir', 'delete'],
        fatos: 'Meus Produtos > Novo Produto (ou Criar Produto se vazio) > Criar Manualmente / Criar com IA. Manual: título, descrições, preço > 0, categoria, comissão 0–100%, status e capa. Categorias Curso, E-book, Software / SaaS, Mentoria. Capa no NOVO produto aceita URL OU arquivo PNG/JPG/WebP até 5 MB; arquivo selecionado tem prioridade. Demais categorias usam Link do Produto HTTP/HTTPS. Curso não exige link externo: cria rascunho e abre editor de curso. Cards permitem Editar/Excluir; editar Curso abre /cursos/id. Edição comum de produto oferece URL da capa, não prometer upload nesse modal. Só Ativo não excluído aparece na vitrine.',
        fontes: ['js/produto.js', '../controllers/produtoController.js'], marcadores: ['prod-imagem-arquivo', 'prod-categoria', 'prod-status'] },
    { id: 'ia', nomes: ['IA de Produtos', 'Product AI', 'IA de Productos'], rota: '/ia-produtos', arquivo: 'ia-produtos.html', termos: ['ia', 'ai', 'ebook', 'e-book', 'pdf', 'prompt', 'gerar', 'generate', 'generar', 'rascunho', 'draft', 'borrador', 'capitulo', 'chapter', 'publicar', 'publish'],
        fatos: 'Produtos > Criar com IA. Modos Consultor (ideias), Prompt Builder (estruturar ideia) e Gerar produto. Após prévia: Editar, Gerar PDF, Publicar. Editor desta tela pede URL da imagem de capa (não upload). Para publicar exige PDF salvo, capa, categoria, preço e descrições válidos. Não cria SaaS executável nem videoaulas por escolher categoria. Meus rascunhos salva por conta; Abrir, Novo produto, Salvar agora, Salvar cópia. Só indicador Salvo confirma persistência. Cada capítulo concluído é salvo; sair interrompe geração e retomar reaproveita capítulos salvos. Alterar título exige atualizar PDF; mudar capa/preço não exige refazer capítulos. Rascunho publicado é somente leitura, edite em Produtos. Conflito: Salvar cópia antes de reabrir. Em erro preserve rascunho e peça texto do erro; não fixe espera de 60s para todo erro JSON nem atribua tudo a créditos.',
        fontes: ['js/ia-produtos.js', 'js/ia-rascunhos.js', '../services/ia/produtoIaService.js'] },
    { id: 'cursos', nomes: ['Meus produtos — cursos', 'My products — courses', 'Mis productos — cursos'], rota: '/produto', arquivo: 'curso.html', termos: ['curso', 'course', 'aula', 'lesson', 'clase', 'video', 'modulo', 'module', 'previa', 'preview', 'estudiante', 'aluno'],
        fatos: 'Aluno: Minhas Compras > Acessar Produto abre /cursos/id quando curso interno. Escolher uma aula da lista de módulos; vídeo, material PDF quando enviado, Marcar como concluída. Só produtor ou comprador pago tem acesso. Produtor: Produtos > Editar no curso > Editar curso; muda título, apresentação, capa, preço, comissão, cor e publicação; Adicionar módulo, Adicionar aula e Mover para cima. Envio vídeo MP4 H.264/AAC até 250 MB e PDF até 20 MB, total 2 GB/curso. Salvar curso vincula uploads às aulas. O produtor vê o editor e a área de estudo na mesma página; não existem botões Ver como aluno ou Voltar ao editor. Para publicar, selecionar Publicado e Salvar curso; precisa módulos/aulas com vídeos. Não há certificados, quiz, live ou upload de capa própria por módulo. A capa identifica o curso. Esta página não tem seletor próprio de idioma ou tema.',
        fontes: [
            'js/curso.js',
            'js/curso-i18n.js',
            '../routes/cursoRoutes.js'
        ],
        marcadores: [
            'editor',
            'area-aluno',
            'salvar',
            'adicionar-modulo'
        ]
    },
    { id: 'vitrine', nomes: ['Vitrine', 'Storefront', 'Tienda'], rota: '/vitrine', arquivo: 'vitrine.html', termos: ['vitrine', 'storefront', 'store', 'tienda', 'pesquisa', 'search', 'buscar', 'busca', 'filtro', 'filter'],
        fatos: 'Catálogo público de produtos ativos. Pesquisa de produtos no campo principal busca-produtos, filtros por categoria e ordenação por vendas, recentes, menor/maior preço; clicar em card abre detalhes. No commit auditado, busca-topo da vitrine não tem handler ligado; não recomendar essa barra para achar abas. searchBar.js em outras telas redireciona a /vitrine?q=termo; não afirmar que é busca global de funcionalidades. Categoria Templates aparece no filtro, mas não no cadastro manual: não prometer criação de categoria Template.', fontes: ['js/vitrine.js', 'js/searchBar.js'], marcadores: ['busca-produtos', 'busca-topo'] },
    { id: 'detalhes', nomes: ['Ver produtos na vitrine', 'Browse products', 'Ver productos'], rota: '/vitrine', arquivo: 'paginaDoProduto.html', termos: ['comprar', 'buy', 'comprar', 'checkout', 'pagamento', 'payment', 'pago', 'vendedor', 'seller', 'slug', 'url', 'link', 'garantia', 'refund'],
        fatos: 'Página pública /produto/slug (nome permanente na URL) mostra descrição, capa, preço, categoria e produtor. Comprar Agora abre checkout; login necessário; Confirmar Pagamento registra COMPRA SIMULADA paga. Pix/Cartão na tela não são integração bancária real. Produto próprio não pode ser comprado. Compra repetida não duplica acesso. Falar com o vendedor abre conversa autenticada em Mensagens. Texto Garantia de 7 Dias é apenas texto de interface, sem fluxo de reembolso implementado: não prometer estorno/política. Links antigos por ID redirecionam para o nome permanente, preservando ref de afiliado. Alterar o título não muda o endereço já gerado.',         fontes: [
            'js/paginaDoProduto.js',
            '../controllers/vitrineController.js',
            '../routes/produtoPaginaRoutes.js'
        ]
    },
    { id: 'compras', nomes: ['Minhas Compras', 'My Purchases', 'Mis Compras'], rota: '/minhasCompras', arquivo: 'minhasCompras.html', termos: ['compras', 'purchases', 'orders', 'comprei', 'bought', 'compre', 'baixar', 'download', 'descargar', 'acessar'],
        fatos: 'Abrir pelo menu do perfil no topo > Minhas Compras ou /minhasCompras. Exibe compras desta conta. Acessar Produto consulta autorização; PDF interno baixa, curso interno abre área do curso, produto com URL externa abre o endereço cadastrado. Só compra paga libera conteúdo. Ruby não baixa arquivo nem verifica seu conteúdo.', fontes: ['js/minhasCompras.js', 'js/perfil-global.js', '../routes/arquivoProdutoRoutes.js'] },
    { id: 'vendas', nomes: ['Minhas Vendas', 'My Sales', 'Mis Ventas'], rota: '/minhasVendas', arquivo: 'minhasVendas.html', termos: ['vendas', 'sales', 'ventas', 'vendi', 'sold', 'comissoes', 'commissions', 'comisiones'],
        fatos: 'Menu lateral > Minhas Vendas. Resumo e abas Minhas Vendas / Comissões, produto, comprador, data, status e valor. Não confundir vendas com compras da própria conta. Ruby não consulta essas vendas ou comissões.', fontes: ['js/minhasVendas.js'] },
    { id: 'afiliados', nomes: ['Afiliados', 'Affiliates', 'Afiliados'], rota: '/afiliados', arquivo: 'afiliados.html', termos: ['afiliado', 'affiliate', 'afiliacion', 'afiliacao', 'divulgar', 'ref'],
        fatos: 'Menu lateral > Afiliados > Nova Afiliação > selecionar produto > Solicitar Afiliação; depende de aprovação do produtor. Meus Links exibe métricas/status e Copiar Link quando ativo. Solicitações Recebidas permite Aprovar/Rejeitar e Encerrar quando cabível. Código ref válido na compra simulada pode gerar comissão; não gera comissão por comprar pelo próprio código. Não prometer aprovação/repasse automático real.', fontes: ['js/afiliados.js', '../controllers/afiliadosController.js'] },
    { id: 'financeiro', nomes: ['Financeiro', 'Finance', 'Finanzas'], rota: '/financeiro', arquivo: 'financeiro.html', termos: ['financeiro', 'finance', 'finanzas', 'saldo', 'balance', 'saque', 'withdraw', 'retirar', 'pix', 'transacao', 'transaction', 'transaccion'],
        fatos: 'Menu lateral > Financeiro. Abas Visão Geral e Comissões; filtros tipo/período e status/papel. Nova Transação pede tipo Entrada/Saída, descrição e valor positivo em popups e salva ajuste SIMULADO. Não transfere dinheiro, não faz Pix nem saque bancário. Saldo da tela não é dinheiro sacável confirmado; Ruby não consulta saldo.', fontes: ['js/financeiro.js', '../controllers/financeiroController.js'] },
    { id: 'contratos', nomes: ['Contratos', 'Contracts', 'Contratos'], rota: '/contratos', arquivo: 'contratos.html', termos: ['contrato', 'contract', 'aceitar', 'accept', 'assinatura', 'signature', 'firma'],
        fatos: 'Menu lateral > Contratos > Adicionar Contrato. Selecionar afiliação relacionada, título, PDF, datas e observações > Salvar. Lista permite baixar PDF autenticado e, conforme papel/status, Editar, Aceitar ou Cancelar. Ativo após aceite de ambas as partes. Não é assinatura certificada nem parecer jurídico. Ruby não lê PDF nem confirma aceite de contrato específico.', fontes: ['js/contratos.js', '../controllers/contratosController.js'] },
    { id: 'mensagens', nomes: ['Mensagens', 'Messages', 'Mensajes'], rota: '/mensagens', arquivo: 'mensagens.html', termos: ['mensagem', 'message', 'mensaje', 'conversa', 'conversation', 'chat', 'contato', 'contact'],
        fatos: 'Menu lateral > Mensagens; selecionar conversa, escrever e enviar. Nova Conversa lista contatos autorizados (relações de compra/afiliação/contrato), não todo usuário arbitrário. Falar com o vendedor nos detalhes do produto inicia conversa. Busca de contatos/conversas é local. Ruby não lê nem envia mensagens particulares.', fontes: ['js/mensagens.js', '../controllers/mensagensController.js'] },
    { id: 'configuracoes', nomes: ['Configurações', 'Settings', 'Configuración'], rota: '/configuracoes', arquivo: 'configuracoes.html', termos: ['configuracoes', 'settings', 'configuracion', 'preferencias'],
        fatos: 'Menu lateral > Configurações. Abas separadas: Meu Perfil, Notificações, Segurança, Pagamento, Tema, Idioma. Não são opções do menu do avatar. Perfil do topo só oferece Minhas Compras e Sair.', fontes: ['js/configuracoes.js', 'js/perfil-global.js'] },
    { id: 'perfil', nomes: ['Meu Perfil', 'My Profile', 'Mi Perfil'], rota: '/configuracoes?aba=perfil', arquivo: 'configuracoes.html', termos: ['foto', 'photo', 'avatar', 'perfil', 'profile', 'bio', 'telefone', 'phone', 'email'],
        fatos: 'Configurações > Meu Perfil. Nome, bio e telefone > Salvar Alterações. E-mail não pode ser alterado nesta tela. Alterar foto seleciona JPEG/PNG/WebP até 5 MB e envia a foto. Menu do avatar não contém editor nem idioma.', marcadores: ['data-tab="perfil"', 'form-perfil', 'btn-alterar-foto'], fontes: ['js/configuracoes.js'] },
    { id: 'notificacoes', nomes: ['Notificações', 'Notifications', 'Notificaciones'], rota: '/configuracoes?aba=notificacoes', arquivo: 'configuracoes.html', termos: ['notificacao', 'notification', 'notificacion', 'sino', 'bell', 'aviso', 'email'],
        fatos: 'Sino do topo mostra notificações internas e Marcar todas. Preferências ficam em Configurações > Notificações: Vendas, Comissões, Mensagens, Email, Contratos, Afiliações > Salvar Preferências. Opção Email salva preferência, não comprova envio de e-mails: Resend não está integrado nesta versão.', marcadores: ['data-tab="notificacoes"', 'btn-salvar-preferencias'], fontes: ['js/notificacoes.js', 'js/configuracoes.js'] },
    { id: 'seguranca', nomes: ['Segurança', 'Security', 'Seguridad'], rota: '/configuracoes?aba=seguranca', arquivo: 'configuracoes.html', termos: ['senha', 'password', 'contrasena', 'seguranca', 'security', 'seguridad', '2fa'],
        fatos: 'Logado: Configurações > Segurança > Senha Atual, Nova Senha, Confirmar Nova Senha > Alterar Senha. Esta troca valida mínimo de 6, diferente do cadastro que exige 8; recomendar 8+ sem fingir que validação é uniforme. Sem senha atual não é recuperação. Não há ativação de 2FA.', marcadores: ['data-tab="seguranca"', 'senha-atual', 'nova-senha', 'confirmar-senha'], fontes: ['../controllers/configuracoesController.js'] },
    { id: 'pagamento', nomes: ['Pagamento', 'Payment', 'Pago'], rota: '/configuracoes?aba=pagamento', arquivo: 'configuracoes.html', termos: ['chave', 'key', 'clave', 'pix', 'titular'],
        fatos: 'Configurações > Pagamento > Adicionar chave PIX > titular, tipo e chave > Salvar. Editar/excluir chaves também é possível. Isso só cadastra dados, não envia nem recebe Pix real.', marcadores: ['data-tab="pagamento"', 'btn-adicionar-pagamento'], fontes: ['js/configuracoes.js'] },
    { id: 'tema', nomes: ['Tema', 'Theme', 'Tema'], rota: '/configuracoes?aba=tema', arquivo: 'configuracoes.html', termos: ['tema', 'theme', 'dark', 'light', 'escuro', 'claro', 'oscuro', 'aparencia', 'appearance'],
        fatos: 'Configurações > Tema > Claro ou Escuro. Aplica imediatamente neste navegador, sem botão Salvar Tema. Curso também tem Claro/Escuro no topo.', marcadores: ['data-tab="tema"', 'data-tema-select="light"', 'data-tema-select="dark"'], fontes: ['js/theme.js'] },
    { id: 'idioma', nomes: ['Idioma', 'Language', 'Idioma'], rota: '/configuracoes?aba=idioma', arquivo: 'configuracoes.html', termos: ['idioma', 'language', 'linguagem', 'lingua', 'lenguaje', 'lengua', 'ingles', 'english', 'espanol', 'spanish', 'portugues', 'portuguese'],
        fatos: 'Caminho exato: menu lateral Configurações > aba Idioma > Português/English/Español > Salvar Idioma. NÃO clicar em Meu Perfil nem avatar. Curso tem seletor próprio no topo. Mudar interface traduz controles, não produtos, videoaulas ou mensagens antigas. Ruby acompanha mensagem clara em PT/EN/ES; para mensagem ambígua usa idioma atual do site.', marcadores: ['data-tab="idioma"', 'btn-salvar-idioma'], fontes: ['js/configuracoes.js', 'js/i18n.js'] },
    { id: 'ruby', nomes: ['Ruby', 'Ruby', 'Ruby'], rota: '/ruby.html', arquivo: 'ruby.html', termos: ['ruby', 'ajuda', 'help', 'ayuda', 'suporte', 'support'],
        fatos: 'Botão flutuante abre Ruby em janela de conversa; exige login. Nova conversa apaga histórico de conversa, não dados/limites da conta. Ruby orienta e consulta apenas produtos próprios/compras retornados pelo servidor; não executa alterações. Não é pessoa nem suporte humano. Responde naturalmente em PT/EN/ES. Não traduz retroativamente mensagens antigas.', fontes: ['js/ruby.js', 'js/ia-btn.js'] },
    { id: 'loading', nomes: ['Carregamento', 'Loading', 'Carga'], rota: null, arquivo: 'loading/index.html', termos: ['carregamento', 'loading', 'carregando', 'travou', 'stuck'],
        fatos: 'Tela auxiliar de animação de carregamento. Não é gerenciador de produto nem confirmação de publicação. Na IA de Produtos há indicador de geração; preserve rascunho e capítulos salvos antes de sair.', fontes: ['js/ia-produtos.js'] }
]

function normalizar(texto) {
    return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
function paginaAtual(caminho) {
    if (typeof caminho !== 'string' || caminho.length > 200) return null
    const url = caminho.split('?')[0].replace(/\.html$/, '')
    if (/^\/cursos\/\d+$/.test(url)) return 'cursos'
    if (/^\/(?:vitrine\/)?produto\/[^/]+$/.test(url)) return 'detalhes'
    return paginas.find(p => p.rota?.split('?')[0] === url)?.id || null
}
function selecionarPaginas(mensagem, caminho, historico = []) {
    const texto = normalizar(mensagem)
    const pontuar = valor => paginas.map(p => ({ p, pontos: p.termos.reduce((n, termo) => n + (new RegExp(`(?:^|[^a-z0-9])${normalizar(termo)}(?:s|es)?(?:$|[^a-z0-9])`).test(valor) ? 1 : 0), 0) }))
    let notas = pontuar(texto)
    if (!notas.some(n => n.pontos)) {
        const anterior = [...historico].reverse().find(m => m.role === 'user')
        if (anterior) notas = pontuar(normalizar(anterior.content))
    }
    const atual = paginaAtual(caminho)
    notas.forEach(n => { if (n.p.id === atual) n.pontos += 0.5 })
    return notas.filter(n => n.pontos > 0).sort((a, b) => b.pontos - a.pontos).slice(0, 4).map(n => n.p)
}
function contextoMapa(selecionadas, idiomaInterface = 'pt-BR') {
    const indice = idiomaInterface === 'en' ? 1 : idiomaInterface === 'es' ? 2 : 0
    return [
        'MAPA VERIFICADO DA INTERFACE. Use apenas procedimentos descritos, não complete lacunas com suposições.',
        'O menu do perfil contém somente Minhas Compras e Sair. Idioma e Tema ficam em Configurações, em abas separadas.',
        'Não há cobrança, saque, reembolso, recuperação por e-mail ou 2FA reais implementados. Textos promocionais não comprovam essas funções.',
        'Diretório (a existência da página NÃO comprova botões ou ações adicionais):',
        paginas.map(p => `${p.nomes[indice]}: ${p.rota || 'tela auxiliar'}`).join('; '),
        'Procedimentos relevantes. Se a dúvida não estiver coberta, diga que não consegue confirmar e peça tela/ação, sem inventar:',
        ...selecionadas.map(p => `${p.nomes[indice]} — ${p.rota || p.arquivo}\n${p.fatos}`)
    ].join('\n\n')
}
function atalhos(selecionadas, idioma) {
    const indice = idioma === 'en' ? 1 : idioma === 'es' ? 2 : 0
    const urls = new Set()
    return selecionadas.filter(p => p.rota && !urls.has(p.rota) && urls.add(p.rota)).slice(0, 3)
        .map(p => ({ titulo: p.nomes[indice], url: p.rota }))
}
module.exports = { paginas, normalizar, paginaAtual, selecionarPaginas, contextoMapa, atalhos }
