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

    // Dúvidas sobre conteúdo ou erros precisam de análise.
    if (texto.length > 350) return null

    if (
        /2fa|duas etapas|two.factor|dos pasos|reembolso|refund|saque|withdraw/
            .test(texto)
    ) return null

    if (
        /\b(pdf|produto|product|producto|curso|course|video|ruby|erro|error|falha|bug)\b/
            .test(texto)
    ) return null

    if (
        /nao funciona|nao muda|not working|no funciona|forgot|esqueci|olvide/
            .test(texto)
    ) return null

    if (
        !/\b(onde|como|qual|quero|preciso|mudar|mudo|trocar|alterar|abrir|acessar|where|how|change|switch|open|find|donde|cambiar|cambio|quiero)\b/
            .test(texto)
    ) return null

    const ui = normalizarIdioma(interfaceIdioma)
    const respostaIdioma = normalizarIdioma(idioma)

    const indice = ui === 'en' ? 1 : ui === 'es' ? 2 : 0

    const config = [
        'Configurações',
        'Settings',
        'Configuración'
    ][indice]

    // Os nomes dos botões acompanham o idioma da interface.
    const botoes = [
        ['Claro', 'Light', 'Claro'],
        ['Escuro', 'Dark', 'Oscuro'],
        ['Salvar Idioma', 'Save Language', 'Guardar Idioma'],
        ['Alterar Senha', 'Change Password', 'Cambiar Contraseña'],
        ['Alterar foto', 'Change photo', 'Cambiar foto'],
        ['Salvar Alterações', 'Save Changes', 'Guardar Cambios'],
        ['Salvar Preferências', 'Save Preferences', 'Guardar Preferencias'],
        ['Adicionar chave PIX', 'Add PIX key', 'Agregar clave PIX'],
        ['Salvar', 'Save', 'Guardar']
    ]

    function ajustarRotulos(detalhe) {
        return detalhe.replace(/\*\*([^*]+)\*\*/g, (_, nome) => {
            const botao = botoes.find(opcoes => opcoes.includes(nome))

            return `**${botao ? botao[indice] : nome}**`
        })
    }

    const secoes = [
        {
            id: 'tema',
            nomes: ['Tema', 'Theme', 'Tema'],
            teste: /\b(tema|theme|aparencia|appearance|escuro|oscuro|dark|claro|light)\b/,

            detalhe: {
                'pt-BR':
                    'Escolha **Claro** ou **Escuro**. A mudança é imediata; não existe botão Salvar Tema.',

                en:
                    'Choose **Light** or **Dark**. The change applies immediately; there is no Save Theme button.',

                es:
                    'Elige **Claro** u **Oscuro**. El cambio es inmediato; no hay botón Guardar Tema.'
            }
        },
        {
            id: 'idioma',
            nomes: ['Idioma', 'Language', 'Idioma'],
            teste: /\b(idioma|linguagem|lingua|language|lenguaje|lengua)\b/,

            detalhe: {
                'pt-BR':
                    'Escolha Português, English ou Español e clique em **Salvar Idioma**.',

                en:
                    'Choose Português, English or Español, then click **Save Language**.',

                es:
                    'Elige Português, English o Español y pulsa **Guardar Idioma**.'
            }
        },
        {
            id: 'seguranca',
            nomes: ['Segurança', 'Security', 'Seguridad'],
            teste: /\b(senha|password|contrasena|seguranca|security|seguridad)\b/,

            detalhe: {
                'pt-BR':
                    'Para trocar a senha, preencha a senha atual, a nova senha e sua confirmação; clique em **Alterar Senha**. Faça isso somente no formulário, sem enviar senhas aqui.',

                en:
                    'To change your password, enter the current password, the new password and its confirmation, then click **Change Password**. Use only the form; do not send passwords here.',

                es:
                    'Para cambiar la contraseña, introduce la actual, la nueva y su confirmación; pulsa **Cambiar Contraseña**. Usa solo el formulario; no envíes contraseñas aquí.'
            }
        },
        {
            id: 'perfil',
            nomes: ['Meu Perfil', 'My Profile', 'Mi Perfil'],
            teste: /\b(foto|photo|avatar|bio|telefone|phone|telefono)\b/,

            detalhe: {
                'pt-BR':
                    'Use **Alterar foto** para escolher uma imagem. Nome, bio e telefone ficam nessa aba e usam **Salvar Alterações**. O e-mail não pode ser alterado ali.',

                en:
                    'Use **Change photo** to choose an image. Name, bio and phone are on this tab and use **Save Changes**. Email cannot be changed there.',

                es:
                    'Usa **Cambiar foto** para elegir una imagen. El nombre, la biografía y el teléfono están en esta pestaña; usa **Guardar Cambios**. El correo no puede cambiarse allí.'
            }
        },
        {
            id: 'notificacoes',
            nomes: ['Notificações', 'Notifications', 'Notificaciones'],
            teste: /\b(notificacoes|notificacao|notifications|notification|notificaciones|notificacion)\b/,

            detalhe: {
                'pt-BR':
                    'Ajuste as opções e clique em **Salvar Preferências**. Para ler os avisos internos, use o sino do topo. A opção Email não confirma envio de e-mails nesta versão.',

                en:
                    'Adjust the options and click **Save Preferences**. To read in-app notifications, use the bell at the top. The Email option does not confirm email delivery in this version.',

                es:
                    'Ajusta las opciones y pulsa **Guardar Preferencias**. Para leer avisos internos, usa la campana superior. La opción Email no confirma envíos en esta versión.'
            }
        },
        {
            id: 'pagamento',
            nomes: ['Pagamento', 'Payment', 'Pago'],
            teste: /\b(chave|key|clave)\b.*\bpix\b|\bpix\b.*\b(chave|key|clave)\b/,

            detalhe: {
                'pt-BR':
                    'Use **Adicionar chave PIX**, preencha os dados e clique em **Salvar**. Isso cadastra a chave; não realiza pagamentos nem saques.',

                en:
                    'Use **Add PIX key**, fill in the details and click **Save**. This registers the key; it does not make payments or withdrawals.',

                es:
                    'Usa **Agregar clave PIX**, completa los datos y pulsa **Guardar**. Esto registra la clave; no realiza pagos ni retiros.'
            }
        }
    ]

    const encontradas = secoes.filter(secao => secao.teste.test(texto))

    if (!encontradas.length) return null

    const inicio = {
        'pt-BR':
            `Clique diretamente em **${config}**, no menu lateral.`,

        en:
            `Click **${config}** directly in the sidebar.`,

        es:
            `Haz clic directamente en **${config}**, en el menú lateral.`
    }[respostaIdioma]

    const passos = encontradas.map(secao => {
        const aba = secao.nomes[indice]

        const abrir = {
            'pt-BR': `Abra a aba **${aba}**.`,
            en: `Open the **${aba}** tab.`,
            es: `Abre la pestaña **${aba}**.`
        }[respostaIdioma]

        return `${abrir} ${ajustarRotulos(secao.detalhe[respostaIdioma])}`
    })

    return {
        ids: encontradas.map(secao => secao.id),
        reply: [inicio, ...passos].join('\n\n')
    }
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
