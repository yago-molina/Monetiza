document.addEventListener('DOMContentLoaded', () => {
    const campos = document.querySelectorAll(
        '.top-bar .search-bar-container .search-input'
    )

    if (!campos.length) return

    const normalizar = valor => String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

        const paginas = [
        ['Dashboard', '/dashboard',
            'Painel com os indicadores da conta.',
            'painel resumo estatisticas resultados'],

        ['Área do vendedor', '/landing',
            'Página inicial da área do vendedor.',
            'inicio ferramentas vendedor'],

        ['Produtos', '/produto',
            'Cadastro e gerenciamento dos seus produtos.',
            'meus produtos criar cadastrar editar vender'],

        ['Vitrine', '/vitrine',
            'Catálogo de produtos disponíveis.',
            'loja comprar cursos ebooks templates mentoria saas'],

        ['Minhas compras', '/minhasCompras',
            'Acesse seus produtos comprados.',
            'compras baixar download arquivos pdf'],

        ['Minhas vendas', '/minhasVendas?aba=vendas',
            'Consulte as vendas dos seus produtos.',
            'vendas pedidos compradores'],

        ['Minhas vendas · Comissões', '/minhasVendas?aba=comissoes',
            'Consulte suas comissões de vendas.',
            'vendas comissao comissoes afiliado'],

        ['Afiliados', '/afiliados',
            'Gerencie suas afiliações.',
            'afiliacao afiliacoes divulgar'],

        ['Afiliados · Meus links', '/afiliados#lista-afiliacoes',
            'Consulte seus links de afiliado.',
            'links link afiliados divulgacao'],

        ['Afiliados · Solicitações recebidas', '/afiliados#lista-solicitacoes',
            'Consulte as solicitações de afiliação.',
            'solicitacao solicitacoes recebidas afiliados'],

        ['Financeiro · Visão geral', '/financeiro?aba=geral',
            'Consulte o financeiro e o histórico de transações.',
            'financeiro dinheiro saldo receita despesas transacoes pagamentos'],

        ['Financeiro · Comissões', '/financeiro?aba=comissoes',
            'Consulte o histórico financeiro das comissões.',
            'financeiro comissao comissoes ganhos'],

        ['Contratos', '/contratos',
            'Acesse e gerencie seus contratos.',
            'contrato contratos documento documentos acordo'],

        ['Mensagens', '/mensagens',
            'Acesse suas conversas.',
            'mensagem mensagens conversa conversas chat contato'],

        ['Configurações', '/configuracoes',
            'Preferências e configurações da conta.',
            'configuracao configuracoes preferencias ajustes'],

        ['Configurações · Meu perfil', '/configuracoes?aba=perfil',
            'Edite suas informações pessoais.',
            'perfil nome email foto avatar conta dados pessoais'],

        ['Configurações · Notificações', '/configuracoes?aba=notificacoes',
            'Gerencie suas preferências de notificações.',
            'notificacao notificacoes avisos alertas'],

        ['Configurações · Segurança', '/configuracoes?aba=seguranca',
            'Altere a senha da sua conta.',
            'seguranca senha alterar trocar senha proteger conta'],

        ['Configurações · Pagamento', '/configuracoes?aba=pagamento',
            'Gerencie seus dados de pagamento.',
            'pagamento pagamentos dados bancarios banco pix'],

        ['Configurações · Tema', '/configuracoes?aba=tema',
            'Escolha entre tema claro e escuro.',
            'tema aparencia claro escuro dark light modo noturno'],

        ['Configurações · Idioma', '/configuracoes?aba=idioma',
            'Escolha o idioma da plataforma.',
            'idioma lingua linguagem portugues ingles espanhol language'],

        ['IA de produtos', '/ia-produtos',
            'Crie produtos com inteligência artificial.',
            'ia inteligencia artificial ebook pdf rascunho criar produto'],

        ['IA de produtos · Consultor', '/ia-produtos?etapa=consultor',
            'Converse sobre ideias para seu produto.',
            'consultor consultoria ideias planejamento'],

        ['IA de produtos · Estruturar ideia', '/ia-produtos?etapa=estrutura',
            'Organize a ideia e o planejamento do produto.',
            'estruturar estrutura ideia prompt builder planejamento'],

        ['IA de produtos · Gerador', '/ia-produtos?etapa=produto',
            'Acesse a etapa de geração do produto.',
            'gerador gerar produto ebook capitulos conteudo'],

        ['Ruby', '/ruby.html',
            'Converse com a assistente da Monetiza.',
            'ruby assistente ajuda suporte duvidas']
    ].map(([titulo, url, descricao, palavras]) => ({
        titulo,
        url,
        descricao,
        palavras
    }))

    const estilo = document.createElement('style')
    estilo.textContent = `
        #busca-global-dialog {
            width: min(680px, 92vw);
            max-height: 85vh;
            box-sizing: border-box;
            margin: auto;
            padding: 24px;
            overflow: auto;
            border: 1px solid #64748b;
            border-radius: 16px;
            background: #18181b;
            color: #f8fafc;
            font: inherit;
        }

        #busca-global-dialog::backdrop {
            background: #0009;
        }

        #busca-global-dialog .busca-cabecalho {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }

        #busca-global-dialog h2 {
            margin: 0;
            font-size: 20px;
        }

        #busca-global-dialog button {
            padding: 8px 12px;
            border: 1px solid #64748b;
            border-radius: 8px;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font: inherit;
        }

        #busca-global-dialog ul {
            padding: 0;
            list-style: none;
        }

        #busca-global-dialog a {
            display: block;
            margin: 10px 0;
            padding: 14px;
            border: 1px solid #64748b;
            border-radius: 10px;
            color: inherit;
            text-decoration: none;
            overflow-wrap: anywhere;
        }

        #busca-global-dialog a:hover,
        #busca-global-dialog a:focus-visible {
            border-color: #a78bfa;
            outline: 2px solid #a78bfa;
        }

        #busca-global-dialog small {
            display: block;
            margin-top: 6px;
        }

        html[data-theme="light"] #busca-global-dialog {
            background: #fff;
            color: #18181b;
        }
    `
    document.head.appendChild(estilo)

    const dialog = document.createElement('dialog')
    dialog.id = 'busca-global-dialog'
    dialog.setAttribute('aria-labelledby', 'busca-global-titulo')

    // Estrutura fixa. Os resultados entram somente com textContent.
    dialog.innerHTML = `
        <div class="busca-cabecalho">
            <h2 id="busca-global-titulo">Busca geral</h2>
            <button type="button" autofocus>Fechar</button>
        </div>
        <p role="status" aria-live="polite"></p>
        <ul aria-label="Resultados da busca"></ul>
    `

    document.body.appendChild(dialog)

    const titulo = dialog.querySelector('h2')
    const status = dialog.querySelector('[role="status"]')
    const lista = dialog.querySelector('ul')

    dialog.querySelector('button').addEventListener('click', () => {
        dialog.close()
    })

    function corresponde(item, termos) {
        const texto = normalizar([
            item.titulo,
            item.descricao,
            item.palavras
        ].join(' '))

        return termos.every(termo => texto.includes(termo))
    }

    function adicionarResultado(item, tipo) {
        const li = document.createElement('li')
        const link = document.createElement('a')
        const nome = document.createElement('strong')
        const descricao = document.createElement('small')

        link.href = item.url
        nome.textContent = `${tipo} · ${item.titulo}`
        descricao.textContent = item.descricao || ''

        link.append(nome, descricao)
        li.appendChild(link)
        lista.appendChild(li)
    }

        function pesquisar(campo) {
        const consulta = campo.value.trim()

        if (!consulta) {
            campo.focus()
            return
        }

        const busca = normalizar(consulta)
        const termos = busca.split(/\s+/).filter(Boolean)

        const resultados = paginas
            .filter(item => corresponde(item, termos))
            .sort((a, b) => {
                function pontuacao(item) {
                    const tituloNormalizado = normalizar(item.titulo)
                    const nomeAba = tituloNormalizado.split(' · ').pop()

                    if (nomeAba === busca) return 3
                    if (tituloNormalizado === busca) return 2
                    if (tituloNormalizado.includes(busca)) return 1

                    return 0
                }

                return pontuacao(b) - pontuacao(a)
            })

        // Quando existe só um destino, abre diretamente.
        if (resultados.length === 1) {
            window.location.assign(resultados[0].url)
            return
        }

        titulo.textContent = `Resultados para “${consulta}”`
        lista.replaceChildren()

        resultados.forEach(item => {
            adicionarResultado(item, 'Destino')
        })

        status.textContent = resultados.length
            ? `${resultados.length} destinos encontrados. Escolha onde deseja ir.`
            : 'Nenhuma página ou aba encontrada. Tente outro termo.'

        if (!dialog.open) dialog.showModal()
    }

    campos.forEach(campo => {
        campo.setAttribute('enterkeyhint', 'search')
        campo.setAttribute('aria-haspopup', 'dialog')
        campo.setAttribute('aria-controls', dialog.id)

        campo.addEventListener('keydown', evento => {
            if (evento.key !== 'Enter' || evento.isComposing) return

            evento.preventDefault()
            pesquisar(campo)
        })

        const lupa = campo.closest('.search-bar-container')
            ?.querySelector('.search-icon')

        if (!lupa) return

        lupa.style.cursor = 'pointer'
        lupa.style.pointerEvents = 'auto'
        lupa.setAttribute('role', 'button')
        lupa.setAttribute('tabindex', '0')
        lupa.setAttribute('aria-label', 'Pesquisar no site')

        lupa.addEventListener('click', evento => {
            evento.preventDefault()
            pesquisar(campo)
        })

        lupa.addEventListener('keydown', evento => {
            if (evento.key !== 'Enter' && evento.key !== ' ') return

            evento.preventDefault()
            pesquisar(campo)
        })
    })
})