const { normalizarIdioma } = require('../ia/idiomaIa')
const { normalizar } = require('./rubyMapa')

// Detecção conservadora dos três idiomas suportados. Frases ambíguas usam a interface.
function escolherIdioma(mensagem, interfaceIdioma) {
    const texto = normalizar(mensagem)
    const pedido = texto.match(/\b(?:respond(?:a|e|er)?|answer|reply|speak|fale|contesta|escreva|escribe)\s+(?:(?:to me|comigo|me)\s+)?(?:em|in|en)\s+(english|ingles|spanish|espanol|espanhol|portuguese|portugues)\b/)
    if (pedido) return /english|ingles/.test(pedido[1]) ? 'en' : /spanish|espan/.test(pedido[1]) ? 'es' : 'pt-BR'
    if (/^(english|ingles|spanish|espanol|espanhol|portuguese|portugues)( please| por favor)?[.!]?$/.test(texto.trim())) return /english|ingles/.test(texto) ? 'en' : /spanish|espan/.test(texto) ? 'es' : 'pt-BR'
    // Ignora URLs e citações; não decide o idioma pelo nome de um produto citado.
    const palavras = texto.replace(/https?:\/\/\S+|"[^"]*"|“[^”]*”|`[^`]*`/g, ' ').match(/[a-z]+/g) || []
    const sinais = {
        en: new Set('i my me where how what which can could do does the is are to change find upload download please want need bought cannot help settings language password account'.split(' ')),
        es: new Set('donde cambiar cambio quiero necesito puedo puedes estan tengo tengo mis una un el la los las del por favor ayuda configurar contrasena espanol comprar compre subir descargar guardo guardas'.split(' ')),
        'pt-BR': new Set('onde mudar mudo quero preciso posso pode voce voces meu minha meus minhas uma um o os as nao esta estou tenho senha ajuda portugues comprei baixar enviar salvar consigo qual'.split(' '))
    }
    // Palavras compartilhadas não devem vencer um conjunto de sinais inequívocos.
    const fortes = new Set('where how which cambiar cambio donde contrasena necesito mudo mudar onde senha voce'.split(' '))
    const notas = Object.entries(sinais).map(([idioma, conjunto]) => ({ idioma, pontos: [...new Set(palavras.filter(p => conjunto.has(p)))].reduce((n, p) => n + (fortes.has(p) ? 2 : 1), 0) }))
        .sort((a, b) => b.pontos - a.pontos)
    if (notas[0].pontos >= 2 && notas[0].pontos > notas[1].pontos) return notas[0].idioma
    return normalizarIdioma(interfaceIdioma)
}

function politicaIdioma(idioma, interfaceIdioma) {
    const nomes = { 'pt-BR': 'português do Brasil', en: 'English', es: 'español' }
    return `IDIOMA DESTA RESPOSTA: ${nomes[idioma]}. Escreva a resposta inteira nesse idioma, mesmo se o histórico, mapa e dados estiverem em português. Não peça ao usuário que solicite tradução. Nomes dos controles devem corresponder à interface atual (${nomes[normalizarIdioma(interfaceIdioma)]}); não traduza títulos de produtos da conta. Não traduza mensagens antigas. Esta regra vale também para perguntas e erros explicados.`
}

function orientacaoDireta(mensagem, idioma, interfaceIdioma) {
    const texto = normalizar(mensagem).trim()
    // Apenas perguntas simples de navegação. Dúvidas de erro, IA/conteúdo ou múltiplas ações vão ao modelo.
    if (texto.length > 180 || /\b(ruby|ia|ai|pdf|produto|product|producto|curso|course|erro|error|falha|nao|not|cannot|no|responde|respondendo|responder|reply|senha|password|tema|theme)\b/.test(texto)) return null
    if (!/\b(idioma|linguagem|lingua|language|lenguaje|lengua)\b/.test(texto)) return null
    if (!/\b(onde|como|mudar|mudo|trocar|alterar|where|how|change|switch|donde|cambiar|cambio)\b/.test(texto)) return null
    const labels = {
        'pt-BR': ['Configurações', 'Idioma', 'Salvar Idioma'],
        en: ['Settings', 'Language', 'Save Language'],
        es: ['Configuración', 'Idioma', 'Guardar Idioma']
    }[normalizarIdioma(interfaceIdioma)]
    const [config, aba, salvar] = labels
    return {
        'pt-BR': `Você muda em **${config} → ${aba}**. Escolha **Português**, **English** ou **Español** e clique em **${salvar}**. Essa opção fica em Configurações, não no menu do perfil.`,
        en: `Open **${config} → ${aba}**. Choose **Português**, **English** or **Español**, then click **${salvar}**. The language option is in Settings, not in the profile menu.`,
        es: `Abre **${config} → ${aba}**. Elige **Português**, **English** o **Español** y pulsa **${salvar}**. La opción de idioma está en Configuración, no en el menú del perfil.`
    }[idioma]
}

// Erros operacionais também acompanham o idioma; detalhes internos não são exibidos.
function traduzirErro(status, idioma) {
    const mensagens = {
        400: ['Confira a mensagem e tente novamente (até 2.000 caracteres).', 'Check your message and try again (up to 2,000 characters).', 'Revisa el mensaje e inténtalo de nuevo (hasta 2.000 caracteres).'],
        401: ['Sua sessão expirou. Entre novamente.', 'Your session expired. Sign in again.', 'Tu sesión caducó. Inicia sesión de nuevo.'],
        409: ['Aguarde a resposta antes de iniciar outra conversa.', 'Wait for the reply before starting another conversation.', 'Espera la respuesta antes de iniciar otra conversación.'],
        413: ['A mensagem enviada é muito grande.', 'The message is too large.', 'El mensaje es demasiado grande.'],
        415: ['Formato de mensagem inválido.', 'Invalid message format.', 'Formato de mensaje no válido.'],
        429: ['O limite de mensagens foi atingido ou há uma resposta em andamento. Aguarde o tempo indicado.', 'The message limit was reached or a reply is in progress. Wait for the indicated time.', 'Se alcanzó el límite de mensajes o hay una respuesta en curso. Espera el tiempo indicado.'],
        503: ['A Ruby está indisponível ou precisa de configuração no servidor. Tente mais tarde.', 'Ruby is unavailable or needs server configuration. Please try later.', 'Ruby no está disponible o necesita configuración en el servidor. Inténtalo más tarde.'],
        504: ['A Ruby demorou para responder. Tente novamente.', 'Ruby took too long to reply. Please try again.', 'Ruby tardó demasiado en responder. Inténtalo de nuevo.'],
        502: ['Não foi possível obter a resposta agora. Tente novamente.', 'Could not get a reply right now. Please try again.', 'No se pudo obtener la respuesta ahora. Inténtalo de nuevo.']
    }
    return (mensagens[status] || mensagens[502])[idioma === 'en' ? 1 : idioma === 'es' ? 2 : 0]
}
module.exports = { escolherIdioma, politicaIdioma, orientacaoDireta, traduzirErro }
