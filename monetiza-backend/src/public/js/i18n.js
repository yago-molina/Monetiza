const traducoes = {
    'pt-BR': {
        sidebar: {
            dashboard: 'Dashboard',
            produtos: 'Produtos',
            minhasVendas: 'Minhas Vendas',
            afiliados: 'Afiliados',
            financeiro: 'Financeiro',
            contratos: 'Contratos',
            mensagens: 'Mensagens',
            configuracoes: 'Configurações'
        },

        topo: {
            verVitrine: 'Ver Vitrine'
        },

        cadastro: {
            tituloDocumento: 'Monetiza - Cadastro',
            titulo: 'Criar uma nova conta',
            ou: 'ou',
            entrarConta: 'Entrar em uma conta existente',
            nome: 'Nome',
            nomePlaceholder: 'Digite seu nome',
            email: 'E-mail',
            emailPlaceholder: 'seu@email.com',
            senha: 'Senha',
            senhaPlaceholder: 'Mínimo 8 caracteres',
            repetirSenha: 'Repetir Senha',
            repetirSenhaPlaceholder: '••••••••',
            termos: 'Li e aceito os termos de uso, termos de licença de uso e software, política de conteúdo do Monetiza',
            criarConta: 'Criar Conta'
        },

        afiliados: {
            tituloDocumento: 'Afiliados - Monetiza',
            tituloPagina: 'Afiliados',

            cabecalho: {
                titulo: 'Meus Links de Afiliado',
                subtitulo: 'Gerencie seus links e acompanhe suas comissões',
                novaAfiliacao: 'Nova Afiliação'
            },

            metricas: {
                cliques: 'Total de Cliques',
                conversoes: 'Conversões',
                totalGanho: 'Total Ganho'
            },

            links: {
                titulo: 'Meus Links',
                vazio: 'Você ainda não tem links de afiliado',
                novaConexao: 'Nova Conexão de Afiliado'
            },

            tabela: {
                produto: 'Produto',
                cliques: 'Cliques',
                conversoes: 'Conversões',
                ganho: 'Ganho',
                status: 'Status',
                acoes: 'Ações'
            },

            solicitacoes: {
                titulo: 'Solicitações Recebidas',
                afiliado: 'Afiliado',
                comissao: 'Comissão',
                vazio: 'Nenhuma solicitação recebida'
            },

            modal: {
                titulo: 'Nova Afiliação',
                produto: 'Produto',
                carregando: 'Carregando produtos...',
                aviso: 'A solicitação será enviada ao produtor para aprovação.',
                cancelar: 'Cancelar',
                solicitar: 'Solicitar Afiliação'
            }
        },

        contratos: {
            tituloDocumento: 'Contratos - Monetiza',
            tituloPagina: 'Contratos',
            buscaPlaceholder: 'Buscar contratos...',

            cabecalho: {
                titulo: 'Meus Contratos',
                subtitulo: 'Gerencie seus contratos de afiliação',
                adicionarContrato: 'Adicionar Contrato'
            },

            vazio: {
                titulo: 'Nenhum Contrato Ainda',
                subtitulo: 'Adicione seu primeiro contrato',
                novoContrato: 'Novo Contrato'
            },

            modal: {
                novoContrato: 'Novo Contrato',
                afiliacaoRelacionada: 'Afiliação relacionada',
                selecioneAfiliacao: 'Selecione uma afiliação',
                titulo: 'Título',
                tituloPlaceholder: 'Nome do contrato',
                arquivoPdf: 'Arquivo PDF',
                dataInicio: 'Data Início',
                dataFim: 'Data Fim',
                observacoes: 'Observações',
                observacoesPlaceholder: 'Anotações sobre o contrato',
                cancelar: 'Cancelar',
                salvar: 'Salvar'
            }
        },

        dashboard: {
            tituloDocumento: 'Dashboard - Monetiza',
            tituloPagina: 'Dashboard',

            bemVindo: {
                ola: 'Olá,',
                subtitulo: 'Veja um resumo da sua atividade na plataforma'
            },

            metricas: {
                vendasTotais: 'Vendas Totais',
                comissoesRecebidas: 'Comissões Recebidas',
                produtosAtivos: 'Produtos Ativos',
                totalVendas: 'Total de Vendas'
            },

            vendasRecentes: {
                titulo: 'Vendas Recentes',
                vazio: 'Nenhuma venda ainda'
            },

            saldo: {
                titulo: 'Saldo Disponível',
                entradas: 'Entradas',
                saidas: 'Saídas'
            },

            acoesRapidas: {
                titulo: 'Ações rápidas',
                novoProduto: 'Novo Produto',
                novoProdutoDescricao: 'Cadastre um produto digital',
                gerarLink: 'Gerar Link',
                gerarLinkDescricao: 'Criar link de afiliado',
                novoContrato: 'Novo Contrato',
                novoContratoDescricao: 'Adicionar contrato',
                mensagens: 'Mensagens',
                mensagensDescricao: 'Ver conversas'
            }
        },

        financeiro: {
            tituloDocumento: 'Financeiro - Monetiza',
            tituloPagina: 'Financeiro',

            cabecalho: {
                titulo: 'Financeiro',
                subtitulo: 'Gerencie suas entradas, saídas e comissões',
                novaTransacao: 'Nova Transação'
            },

            abas: {
                visaoGeral: 'Visão Geral',
                comissoes: 'Comissões'
            },

            resumo: {
                saldoDisponivel: 'Saldo Disponível',
                entradas: 'Entradas',
                saidas: 'Saídas',
                totalEntradas: 'Total de Entradas',
                totalSaidas: 'Total de Saídas'
            },

            filtros: {
                todos: 'Todos',
                entradas: 'Entradas',
                saidas: 'Saídas',
                todoPeriodo: 'Todo Período',
                hoje: 'Hoje',
                ultimos7Dias: 'Últimos 7 dias',
                ultimos30Dias: 'Últimos 30 dias'
            },

            transacoes: {
                titulo: 'Histórico de Transações',
                tipo: 'Tipo',
                descricao: 'Descrição',
                categoria: 'Categoria',
                data: 'Data',
                valor: 'Valor',
                vazio: 'Nenhuma Transação Encontrada'
            },

            comissoes: {
                liberadas: 'Comissões Liberadas',
                pendentes: 'Comissões Pendentes',
                totalAcumulado: 'Total Acumulado',
                todosStatus: 'Todos os Status',
                liberado: 'Liberado',
                pendente: 'Pendente',
                cancelado: 'Cancelado',
                todosPapeis: 'Todos os Papéis',
                produtor: 'Produtor',
                afiliado: 'Afiliado',
                historico: 'Histórico de Comissões',
                produto: 'Produto',
                papel: 'Papel',
                dataVenda: 'Data da Venda',
                status: 'Status',
                comissao: 'Comissão',
                vazio: 'Nenhuma Comissão Registrada'
            }
        },

        iaProdutos: {
            tituloDocumento: 'Monetiza IA',
            buscaPlaceholder: 'O que você está buscando...',
            notificacoes: 'Notificações',
            perfil: 'Perfil',
            prototipo: 'Protótipo Monetiza IA',
            breadcrumb: 'Produtos / Criar com IA',
            modelo: 'Modelo',
            carregandoModelos: 'Carregando modelos...',

            menu: {
                consultor: 'Consultor',
                consultorDescricao: 'Descobrir uma ideia',
                promptDescricao: 'Estruturar sua ideia',
                gerarProduto: 'Gerar produto',
                gerarProdutoDescricao: 'Criar produto final'
            },

            hero: {
                titulo: 'Vamos criar seu próximo produto?',
                descricao: 'Use a Monetiza IA para descobrir uma ideia, criar um prompt profissional e gerar um produto digital completo.'
            },

            acoes: {
                naoSei: 'Não sei o que criar',
                naoSeiDescricao: 'Converse com o consultor para encontrar ideias de produtos digitais.',
                jaTenho: 'Já tenho uma ideia',
                jaTenhoDescricao: 'Transforme uma ideia simples em um prompt detalhado e profissional.',
                gerarProduto: 'Gerar produto',
                gerarProdutoDescricao: 'Use um prompt pronto para gerar um produto digital estruturado.'
            },

            chat: {
                modoConsultor: 'Consultor de produtos digitais',
                online: 'Online',
                mensagemInicial1: 'Olá! Posso ajudar você a encontrar uma ideia de produto, melhorar uma ideia que já possui ou gerar um produto completo.',
                mensagemInicial2: 'Escolha uma das opções acima para começar.',
                statusConsultor: 'Modo atual: Consultor',
                promptPlaceholder: 'Ex: Quero criar um produto digital sobre academia...',
                enviar: 'Enviar',
                dica: 'Ctrl + Enter para enviar'
            },

            fluxo: {
                titulo: 'Fluxo da criação',
                prototipo: 'Protótipo',
                descobrir: 'Descobrir',
                estruturar: 'Estruturar',
                criar: 'Criar',
                produto: 'Produto'
            },

            preview: {
                produtoCriado: 'Produto criado',
                nomeProduto: 'Nome do produto',
                editar: 'Editar',
                gerarPdf: 'Gerar PDF',
                publicar: 'Publicar'
            }
        },

        landing: {
            tituloDocumento: 'Dashboard - Monetiza',
            buscaPlaceholder: 'O que você está buscando...',

            hero: {
                produtosDigitais: 'Produtos Digitais',
                afiliados: 'Afiliados',
                financas: 'Finanças'
            },

            cards: {
                centralizacaoTitulo: 'Centralização',
                centralizacaoDescricao: 'Centralize suas vendas, afiliados e finanças em uma única plataforma simples, segura e organizada.',
                segurancaTitulo: 'Segurança',
                segurancaDescricao: 'Proteção de dados de alto nível e transações 100% criptografadas para você e seus clientes.',
                gestaoTitulo: 'Gestão',
                gestaoDescricao: 'Gerencie produtos digitais, acompanhe lucros e fortaleça parcerias com ferramentas integradas.',
                relatoriosTitulo: 'Relatórios',
                relatoriosDescricao: 'Acompanhe suas métricas de desempenho em tempo real com gráficos intuitivos.'
            }
        },

        login: {
            tituloDocumento: 'Monetiza - Login',
            titulo: 'Entrar na sua conta',
            ou: 'ou',
            criarConta: 'Criar uma nova conta',
            email: 'E-mail',
            emailPlaceholder: 'seu@email.com',
            senha: 'Senha',
            senhaPlaceholder: '••••••••',
            esqueceuSenha: 'Esqueceu a senha?',
            entrar: 'Entrar'
        },

        mensagens: {
            tituloDocumento: 'Mensagens - Monetiza',
            tituloPagina: 'Mensagens',

            chat: {
                titulo: 'Mensagens',
                novaConversa: 'Nova conversa',
                buscarConversas: 'Buscar conversas...',
                conversas: 'CONVERSAS',
                nenhumaConversa: 'Nenhuma conversa ainda',
                selecioneConversa: 'Selecione uma conversa',
                digiteMensagem: 'Digite uma mensagem...',
                enviarMensagem: 'Enviar mensagem'
            },

            modal: {
                titulo: 'Nova Conversa',
                buscarUsuario: 'Buscar usuário...',
                carregandoUsuarios: 'Carregando usuários...'
            }
        },

        minhasVendas: {
            tituloDocumento: 'Minhas Vendas - Monetiza',
            tituloPagina: 'Minhas Vendas',

            cabecalho: {
                titulo: 'Minhas Vendas',
                subtitulo: 'Acompanhe suas vendas e comissões'
            },

            metricas: {
                totalVendas: 'Total de Vendas',
                comissoesGanhas: 'Comissões Ganhas',
                vendasVendedor: 'Vendas como Vendedor',
                vendasAfiliado: 'Vendas como Afiliados'
            },

            abas: {
                vendas: 'Minhas Vendas',
                comissoes: 'Comissões'
            },

            tabela: {
                produto: 'Produto',
                comprador: 'Comprador',
                data: 'Data',
                status: 'Status',
                valor: 'Valor'
            },

            vazio: 'Nenhuma venda encontrada'
        },

        paginaProduto: {
            tituloDocumento: 'Detalhes do Produto - Monetiza',
            buscaPlaceholder: 'O que você está buscando...',
            carregando: 'Carregando informações do produto...',

            sobre: {
                titulo: 'Sobre este produto'
            },

            receber: {
                titulo: 'O que você vai receber',
                acessoImediato: 'Acesso imediato após a confirmação do pagamento',
                suporte: 'Suporte direto com o produtor',
                conteudoDigital: 'Conteúdo 100% digital e atualizado'
            },

            produto: {
                criadoPor: 'Criado por:',
                preco: 'Preço:',
                comprarAgora: 'Comprar Agora',
                falarVendedor: 'Falar com o vendedor'
            },

            garantias: {
                pagamentoSeguro: 'Pagamento 100% Seguro',
                garantia: 'Garantia de 7 Dias',
                acesso: 'Acesso Imediato'
            },

            checkout: {
                titulo: 'Finalizar Compra',
                nomeCompleto: 'Nome Completo',
                nomePlaceholder: 'Digite seu nome completo',
                emailEntrega: 'E-mail para entrega',
                emailPlaceholder: 'seu@email.com',
                formaPagamento: 'Forma de Pagamento',
                cartao: 'Cartão',
                confirmarPagamento: 'Confirmar Pagamento'
            }
        },

        produto: {
            tituloDocumento: 'Produtos - Monetiza',
            tituloPagina: 'Produtos',
            buscaPlaceholder: 'Buscar produtos...',

            cabecalho: {
                titulo: 'Meus Produtos',
                subtitulo: 'Gerencie seus produtos digitais',
                novoProduto: 'Novo Produto'
            },

            vazio: {
                titulo: 'Nenhum produto ainda',
                subtitulo: 'Crie seu primeiro produto digital',
                criarProduto: 'Criar Produto'
            },

            escolha: {
                titulo: 'Criar Novo Produto',
                subtitulo: 'Como você prefere cadastrar seu produto?',
                manualTitulo: 'Criar Manualmente',
                manualDescricao: 'Preencha os campos, preços e descrições do seu jeito.',
                iaTitulo: 'Criar com IA',
                novo: 'Novo',
                iaDescricao: 'Gere título, descrição e copys automaticamente em segundos.'
            },

            novo: {
                tituloModal: 'Novo Produto'
            },

            editar: {
                tituloModal: 'Editar Produto',
                salvarAlteracoes: 'Salvar Alterações'
            },

            excluir: {
                tituloModal: 'Excluir Produto',
                confirmacao: 'Tem certeza que deseja excluir',
                aviso: 'Essa ação não poderá ser desfeita.',
                excluirProduto: 'Excluir Produto'
            },

            form: {
                titulo: 'Título',
                tituloPlaceholder: 'Nome do produto',
                descricaoCurta: 'Descrição Curta',
                descricaoCurtaPlaceholder: 'Uma linha sobre o produto',
                descricaoCompleta: 'Descrição Completa',
                descricaoCompletaPlaceholder: 'Descreva seu produto em detalhes',
                preco: 'Preço (R$)',
                categoria: 'Categoria',
                comissao: 'Comissão de Afiliado (%)',
                status: 'Status',
                imagemCapa: 'Imagem de Capa',
                linkProduto: 'Link do Produto',
                cancelar: 'Cancelar',
                salvarProduto: 'Salvar Produto'
            },

            categorias: {
                curso: 'Curso',
                mentoria: 'Mentoria'
            },

            status: {
                ativo: 'Ativo',
                rascunho: 'Rascunho',
                inativo: 'Inativo'
            }
        },

        vitrine: {
            tituloDocumento: 'Vitrine - Monetiza',
            buscaTopo: 'O que você está buscando...',
            buscarProdutos: 'Buscar produtos...',
            areaVendedor: 'Área do Vendedor',
            maisVendidos: 'Mais Vendidos',
            nenhumProduto: 'Nenhum produto encontrado.',
            rodape: 'Plataforma de produtos digitais com sistema de afiliados',

            usuario: {
                visitante: 'Visitante',
                subtitulo: 'Vitrine Monetiza'
            },

            hero: {
                titulo: 'Produtos Digitais de Alta Qualidade',
                subtitulo: 'Encontre cursos, e-books, templates e muito mais. Comece a aprender ou vender hoje!'
            },

            filtros: {
                titulo: 'Filtros:',
                todas: 'Todas',
                cursos: 'Cursos',
                templates: 'Templates',
                mentorias: 'Mentorias'
            },

            ordenacao: {
                maisVendidos: 'Mais Vendidos',
                recentes: 'Mais Recentes',
                menorPreco: 'Menor Preço',
                maiorPreco: 'Maior Preço'
            }
        },

        configuracoes: {
            tituloDocumento: 'Configurações - Monetiza',
            tituloPagina: 'Configurações',
            subtituloPagina: 'Gerencie seu perfil e preferências',

            abas: {
                perfil: 'Meu Perfil',
                notificacoes: 'Notificações',
                seguranca: 'Segurança',
                pagamento: 'Pagamento',
                idioma: 'Idioma'
            },

            perfil: {
                titulo: 'Informações do Perfil',
                subtitulo: 'Atualize suas informações pessoais',
                alterarFoto: 'Alterar foto',
                nome: 'Nome Completo',
                nomePlaceholder: 'Nome',
                email: 'Email',
                emailBloqueado: 'O email não pode ser alterado',
                bio: 'Bio',
                bioPlaceholder: 'Conte um pouco sobre você...',
                telefone: 'Telefone',
                salvar: 'Salvar Alterações'
            },

            notificacoes: {
                titulo: 'Notificações',
                subtitulo: 'Configure como você deseja ser notificado',
                vendas: 'Vendas',
                vendasDescricao: 'Notificar quando uma venda for realizada',
                comissoes: 'Comissões',
                comissoesDescricao: 'Notificar quando ganhar uma comissão',
                mensagens: 'Mensagens',
                mensagensDescricao: 'Notificar ao receber novas mensagens',
                email: 'Email',
                emailDescricao: 'Receber notificações por email',
                contratos: 'Contratos',
                contratosDescricao: 'Notificar sobre atualizações em contratos',
                afiliacoes: 'Afiliações',
                afiliacoesDescricao: 'Notificar sobre solicitações e alterações de afiliação',
                salvar: 'Salvar Preferências'
            },

            seguranca: {
                titulo: 'Segurança',
                subtitulo: 'Altere sua senha para manter sua conta protegida',
                senhaAtual: 'Senha Atual',
                senhaAtualPlaceholder: 'Digite sua senha atual',
                novaSenha: 'Nova Senha',
                novaSenhaPlaceholder: 'Digite a nova senha',
                confirmarSenha: 'Confirmar Nova Senha',
                confirmarSenhaPlaceholder: 'Digite novamente a nova senha',
                dicaSenha: 'A senha deve ter pelo menos 6 caracteres',
                alterarSenha: 'Alterar Senha'
            },

            pagamento: {
                titulo: 'Dados de Pagamento',
                subtitulo: 'Gerencie as chaves PIX usadas para receber vendas e comissões',
                chavesCadastradas: 'Chaves cadastradas',
                adicionarPix: 'Adicionar chave PIX',
                nenhumaChave: 'Nenhuma chave PIX cadastrada',
                nomeTitular: 'Nome do Titular',
                nomeTitularPlaceholder: 'Nome completo do titular',
                tipoChave: 'Tipo da Chave PIX',
                selecione: 'Selecione',
                chaveAleatoria: 'Chave Aleatória',
                chavePix: 'Chave PIX',
                chavePixPlaceholder: 'Digite sua chave PIX',
                ajudaPix: 'Usado para receber pagamentos de vendas e comissões',
                cancelar: 'Cancelar',
                salvar: 'Salvar'
            },

            idioma: {
                titulo: 'Idioma da Plataforma',
                subtitulo: 'Escolha o idioma que deseja utilizar no Monetiza',
                portugues: 'Português',
                ingles: 'English',
                espanhol: 'Español',
                salvar: 'Salvar Idioma'
            }
        }
    },

    en: {
        sidebar: {
            dashboard: 'Dashboard',
            produtos: 'Products',
            minhasVendas: 'My Sales',
            afiliados: 'Affiliates',
            financeiro: 'Finance',
            contratos: 'Contracts',
            mensagens: 'Messages',
            configuracoes: 'Settings'
        },

        topo: {
            verVitrine: 'View Store'
        },

        cadastro: {
            tituloDocumento: 'Monetiza - Sign Up',
            titulo: 'Create a new account',
            ou: 'or',
            entrarConta: 'Sign in to an existing account',
            nome: 'Name',
            nomePlaceholder: 'Enter your name',
            email: 'Email',
            emailPlaceholder: 'your@email.com',
            senha: 'Password',
            senhaPlaceholder: 'Minimum 8 characters',
            repetirSenha: 'Repeat Password',
            repetirSenhaPlaceholder: '••••••••',
            termos: 'I have read and accept the terms of use, software license terms and Monetiza content policy',
            criarConta: 'Create Account'
        },

        afiliados: {
            tituloDocumento: 'Affiliates - Monetiza',
            tituloPagina: 'Affiliates',

            cabecalho: {
                titulo: 'My Affiliate Links',
                subtitulo: 'Manage your links and track your commissions',
                novaAfiliacao: 'New Affiliation'
            },

            metricas: {
                cliques: 'Total Clicks',
                conversoes: 'Conversions',
                totalGanho: 'Total Earnings'
            },

            links: {
                titulo: 'My Links',
                vazio: 'You do not have any affiliate links yet',
                novaConexao: 'New Affiliate Connection'
            },

            tabela: {
                produto: 'Product',
                cliques: 'Clicks',
                conversoes: 'Conversions',
                ganho: 'Earnings',
                status: 'Status',
                acoes: 'Actions'
            },

            solicitacoes: {
                titulo: 'Received Requests',
                afiliado: 'Affiliate',
                comissao: 'Commission',
                vazio: 'No requests received'
            },

            modal: {
                titulo: 'New Affiliation',
                produto: 'Product',
                carregando: 'Loading products...',
                aviso: 'The request will be sent to the producer for approval.',
                cancelar: 'Cancel',
                solicitar: 'Request Affiliation'
            }
        },

        contratos: {
            tituloDocumento: 'Contracts - Monetiza',
            tituloPagina: 'Contracts',
            buscaPlaceholder: 'Search contracts...',

            cabecalho: {
                titulo: 'My Contracts',
                subtitulo: 'Manage your affiliation contracts',
                adicionarContrato: 'Add Contract'
            },

            vazio: {
                titulo: 'No Contracts Yet',
                subtitulo: 'Add your first contract',
                novoContrato: 'New Contract'
            },

            modal: {
                novoContrato: 'New Contract',
                afiliacaoRelacionada: 'Related Affiliation',
                selecioneAfiliacao: 'Select an affiliation',
                titulo: 'Title',
                tituloPlaceholder: 'Contract name',
                arquivoPdf: 'PDF File',
                dataInicio: 'Start Date',
                dataFim: 'End Date',
                observacoes: 'Notes',
                observacoesPlaceholder: 'Notes about the contract',
                cancelar: 'Cancel',
                salvar: 'Save'
            }
        },

        dashboard: {
            tituloDocumento: 'Dashboard - Monetiza',
            tituloPagina: 'Dashboard',

            bemVindo: {
                ola: 'Hello,',
                subtitulo: 'See a summary of your activity on the platform'
            },

            metricas: {
                vendasTotais: 'Total Sales',
                comissoesRecebidas: 'Commissions Received',
                produtosAtivos: 'Active Products',
                totalVendas: 'Number of Sales'
            },

            vendasRecentes: {
                titulo: 'Recent Sales',
                vazio: 'No sales yet'
            },

            saldo: {
                titulo: 'Available Balance',
                entradas: 'Income',
                saidas: 'Expenses'
            },

            acoesRapidas: {
                titulo: 'Quick Actions',
                novoProduto: 'New Product',
                novoProdutoDescricao: 'Add a digital product',
                gerarLink: 'Generate Link',
                gerarLinkDescricao: 'Create an affiliate link',
                novoContrato: 'New Contract',
                novoContratoDescricao: 'Add a contract',
                mensagens: 'Messages',
                mensagensDescricao: 'View conversations'
            }
        },

        financeiro: {
            tituloDocumento: 'Finance - Monetiza',
            tituloPagina: 'Finance',

            cabecalho: {
                titulo: 'Finance',
                subtitulo: 'Manage your income, expenses and commissions',
                novaTransacao: 'New Transaction'
            },

            abas: {
                visaoGeral: 'Overview',
                comissoes: 'Commissions'
            },

            resumo: {
                saldoDisponivel: 'Available Balance',
                entradas: 'Income',
                saidas: 'Expenses',
                totalEntradas: 'Total Income',
                totalSaidas: 'Total Expenses'
            },

            filtros: {
                todos: 'All',
                entradas: 'Income',
                saidas: 'Expenses',
                todoPeriodo: 'All Time',
                hoje: 'Today',
                ultimos7Dias: 'Last 7 days',
                ultimos30Dias: 'Last 30 days'
            },

            transacoes: {
                titulo: 'Transaction History',
                tipo: 'Type',
                descricao: 'Description',
                categoria: 'Category',
                data: 'Date',
                valor: 'Amount',
                vazio: 'No Transactions Found'
            },

            comissoes: {
                liberadas: 'Released Commissions',
                pendentes: 'Pending Commissions',
                totalAcumulado: 'Total Accumulated',
                todosStatus: 'All Statuses',
                liberado: 'Released',
                pendente: 'Pending',
                cancelado: 'Canceled',
                todosPapeis: 'All Roles',
                produtor: 'Producer',
                afiliado: 'Affiliate',
                historico: 'Commission History',
                produto: 'Product',
                papel: 'Role',
                dataVenda: 'Sale Date',
                status: 'Status',
                comissao: 'Commission',
                vazio: 'No Commissions Registered'
            }
        },

        iaProdutos: {
            tituloDocumento: 'Monetiza AI',
            buscaPlaceholder: 'What are you looking for...',
            notificacoes: 'Notifications',
            perfil: 'Profile',
            prototipo: 'Monetiza AI Prototype',
            breadcrumb: 'Products / Create with AI',
            modelo: 'Model',
            carregandoModelos: 'Loading models...',

            menu: {
                consultor: 'Consultant',
                consultorDescricao: 'Discover an idea',
                promptDescricao: 'Structure your idea',
                gerarProduto: 'Generate product',
                gerarProdutoDescricao: 'Create final product'
            },

            hero: {
                titulo: 'Shall we create your next product?',
                descricao: 'Use Monetiza AI to discover an idea, create a professional prompt and generate a complete digital product.'
            },

            acoes: {
                naoSei: "I don't know what to create",
                naoSeiDescricao: 'Talk to the consultant to discover digital product ideas.',
                jaTenho: 'I already have an idea',
                jaTenhoDescricao: 'Turn a simple idea into a detailed and professional prompt.',
                gerarProduto: 'Generate product',
                gerarProdutoDescricao: 'Use a ready-made prompt to generate a structured digital product.'
            },

            chat: {
                modoConsultor: 'Digital product consultant',
                online: 'Online',
                mensagemInicial1: 'Hello! I can help you find a product idea, improve an idea you already have or generate a complete product.',
                mensagemInicial2: 'Choose one of the options above to get started.',
                statusConsultor: 'Current mode: Consultant',
                promptPlaceholder: 'Ex: I want to create a digital product about fitness...',
                enviar: 'Send',
                dica: 'Ctrl + Enter to send'
            },

            fluxo: {
                titulo: 'Creation flow',
                prototipo: 'Prototype',
                descobrir: 'Discover',
                estruturar: 'Structure',
                criar: 'Create',
                produto: 'Product'
            },

            preview: {
                produtoCriado: 'Product created',
                nomeProduto: 'Product name',
                editar: 'Edit',
                gerarPdf: 'Generate PDF',
                publicar: 'Publish'
            }
        },

        landing: {
            tituloDocumento: 'Dashboard - Monetiza',
            buscaPlaceholder: 'What are you looking for...',

            hero: {
                produtosDigitais: 'Digital Products',
                afiliados: 'Affiliates',
                financas: 'Finance'
            },

            cards: {
                centralizacaoTitulo: 'Centralization',
                centralizacaoDescricao: 'Centralize your sales, affiliates and finances in one simple, secure and organized platform.',
                segurancaTitulo: 'Security',
                segurancaDescricao: 'High-level data protection and 100% encrypted transactions for you and your customers.',
                gestaoTitulo: 'Management',
                gestaoDescricao: 'Manage digital products, track profits and strengthen partnerships with integrated tools.',
                relatoriosTitulo: 'Reports',
                relatoriosDescricao: 'Track your performance metrics in real time with intuitive charts.'
            }
        },

        login: {
            tituloDocumento: 'Monetiza - Login',
            titulo: 'Sign in to your account',
            ou: 'or',
            criarConta: 'Create a new account',
            email: 'Email',
            emailPlaceholder: 'your@email.com',
            senha: 'Password',
            senhaPlaceholder: '••••••••',
            esqueceuSenha: 'Forgot your password?',
            entrar: 'Sign In'
        },

        mensagens: {
            tituloDocumento: 'Messages - Monetiza',
            tituloPagina: 'Messages',

            chat: {
                titulo: 'Messages',
                novaConversa: 'New conversation',
                buscarConversas: 'Search conversations...',
                conversas: 'CONVERSATIONS',
                nenhumaConversa: 'No conversations yet',
                selecioneConversa: 'Select a conversation',
                digiteMensagem: 'Type a message...',
                enviarMensagem: 'Send message'
            },

            modal: {
                titulo: 'New Conversation',
                buscarUsuario: 'Search user...',
                carregandoUsuarios: 'Loading users...'
            }
        },

        minhasVendas: {
            tituloDocumento: 'My Sales - Monetiza',
            tituloPagina: 'My Sales',

            cabecalho: {
                titulo: 'My Sales',
                subtitulo: 'Track your sales and commissions'
            },

            metricas: {
                totalVendas: 'Total Sales',
                comissoesGanhas: 'Commissions Earned',
                vendasVendedor: 'Sales as Seller',
                vendasAfiliado: 'Sales as Affiliate'
            },

            abas: {
                vendas: 'My Sales',
                comissoes: 'Commissions'
            },

            tabela: {
                produto: 'Product',
                comprador: 'Buyer',
                data: 'Date',
                status: 'Status',
                valor: 'Amount'
            },

            vazio: 'No sales found'
        },

        paginaProduto: {
            tituloDocumento: 'Product Details - Monetiza',
            buscaPlaceholder: 'What are you looking for...',
            carregando: 'Loading product information...',

            sobre: {
                titulo: 'About this product'
            },

            receber: {
                titulo: 'What you will receive',
                acessoImediato: 'Immediate access after payment confirmation',
                suporte: 'Direct support from the producer',
                conteudoDigital: '100% digital and updated content'
            },

            produto: {
                criadoPor: 'Created by:',
                preco: 'Price:',
                comprarAgora: 'Buy Now',
                falarVendedor: 'Talk to the seller'
            },

            garantias: {
                pagamentoSeguro: '100% Secure Payment',
                garantia: '7-Day Guarantee',
                acesso: 'Immediate Access'
            },

            checkout: {
                titulo: 'Complete Purchase',
                nomeCompleto: 'Full Name',
                nomePlaceholder: 'Enter your full name',
                emailEntrega: 'Delivery Email',
                emailPlaceholder: 'your@email.com',
                formaPagamento: 'Payment Method',
                cartao: 'Card',
                confirmarPagamento: 'Confirm Payment'
            }
        },

        produto: {
            tituloDocumento: 'Products - Monetiza',
            tituloPagina: 'Products',
            buscaPlaceholder: 'Search products...',

            cabecalho: {
                titulo: 'My Products',
                subtitulo: 'Manage your digital products',
                novoProduto: 'New Product'
            },

            vazio: {
                titulo: 'No products yet',
                subtitulo: 'Create your first digital product',
                criarProduto: 'Create Product'
            },

            escolha: {
                titulo: 'Create New Product',
                subtitulo: 'How would you like to create your product?',
                manualTitulo: 'Create Manually',
                manualDescricao: 'Fill in the fields, prices and descriptions your way.',
                iaTitulo: 'Create with AI',
                novo: 'New',
                iaDescricao: 'Generate titles, descriptions and copy automatically in seconds.'
            },

            novo: {
                tituloModal: 'New Product'
            },

            editar: {
                tituloModal: 'Edit Product',
                salvarAlteracoes: 'Save Changes'
            },

            excluir: {
                tituloModal: 'Delete Product',
                confirmacao: 'Are you sure you want to delete',
                aviso: 'This action cannot be undone.',
                excluirProduto: 'Delete Product'
            },

            form: {
                titulo: 'Title',
                tituloPlaceholder: 'Product name',
                descricaoCurta: 'Short Description',
                descricaoCurtaPlaceholder: 'One line about the product',
                descricaoCompleta: 'Full Description',
                descricaoCompletaPlaceholder: 'Describe your product in detail',
                preco: 'Price (R$)',
                categoria: 'Category',
                comissao: 'Affiliate Commission (%)',
                status: 'Status',
                imagemCapa: 'Cover Image',
                linkProduto: 'Product Link',
                cancelar: 'Cancel',
                salvarProduto: 'Save Product'
            },

            categorias: {
                curso: 'Course',
                mentoria: 'Mentoring'
            },

            status: {
                ativo: 'Active',
                rascunho: 'Draft',
                inativo: 'Inactive'
            }
        },

        vitrine: {
            tituloDocumento: 'Marketplace - Monetiza',
            buscaTopo: 'What are you looking for...',
            buscarProdutos: 'Search products...',
            areaVendedor: 'Seller Area',
            maisVendidos: 'Best Sellers',
            nenhumProduto: 'No products found.',
            rodape: 'Digital products platform with an affiliate system',

            usuario: {
                visitante: 'Visitor',
                subtitulo: 'Monetiza Marketplace'
            },

            hero: {
                titulo: 'High-Quality Digital Products',
                subtitulo: 'Find courses, e-books, templates and much more. Start learning or selling today!'
            },

            filtros: {
                titulo: 'Filters:',
                todas: 'All',
                cursos: 'Courses',
                templates: 'Templates',
                mentorias: 'Mentoring'
            },

            ordenacao: {
                maisVendidos: 'Best Sellers',
                recentes: 'Most Recent',
                menorPreco: 'Lowest Price',
                maiorPreco: 'Highest Price'
            }
        },

        configuracoes: {
            tituloDocumento: 'Settings - Monetiza',
            tituloPagina: 'Settings',
            subtituloPagina: 'Manage your profile and preferences',

            abas: {
                perfil: 'My Profile',
                notificacoes: 'Notifications',
                seguranca: 'Security',
                pagamento: 'Payment',
                idioma: 'Language'
            },

            perfil: {
                titulo: 'Profile Information',
                subtitulo: 'Update your personal information',
                alterarFoto: 'Change photo',
                nome: 'Full Name',
                nomePlaceholder: 'Name',
                email: 'Email',
                emailBloqueado: 'Email cannot be changed',
                bio: 'Bio',
                bioPlaceholder: 'Tell us a little about yourself...',
                telefone: 'Phone',
                salvar: 'Save Changes'
            },

            notificacoes: {
                titulo: 'Notifications',
                subtitulo: 'Choose how you want to be notified',
                vendas: 'Sales',
                vendasDescricao: 'Notify me when a sale is completed',
                comissoes: 'Commissions',
                comissoesDescricao: 'Notify me when I earn a commission',
                mensagens: 'Messages',
                mensagensDescricao: 'Notify me when I receive new messages',
                email: 'Email',
                emailDescricao: 'Receive notifications by email',
                contratos: 'Contracts',
                contratosDescricao: 'Notify me about contract updates',
                afiliacoes: 'Affiliations',
                afiliacoesDescricao: 'Notify me about affiliation requests and changes',
                salvar: 'Save Preferences'
            },

            seguranca: {
                titulo: 'Security',
                subtitulo: 'Change your password to keep your account protected',
                senhaAtual: 'Current Password',
                senhaAtualPlaceholder: 'Enter your current password',
                novaSenha: 'New Password',
                novaSenhaPlaceholder: 'Enter the new password',
                confirmarSenha: 'Confirm New Password',
                confirmarSenhaPlaceholder: 'Enter the new password again',
                dicaSenha: 'Password must be at least 6 characters',
                alterarSenha: 'Change Password'
            },

            pagamento: {
                titulo: 'Payment Information',
                subtitulo: 'Manage the PIX keys used to receive sales and commissions',
                chavesCadastradas: 'Registered keys',
                adicionarPix: 'Add PIX key',
                nenhumaChave: 'No PIX keys registered',
                nomeTitular: 'Account Holder Name',
                nomeTitularPlaceholder: 'Full name of the account holder',
                tipoChave: 'PIX Key Type',
                selecione: 'Select',
                chaveAleatoria: 'Random Key',
                chavePix: 'PIX Key',
                chavePixPlaceholder: 'Enter your PIX key',
                ajudaPix: 'Used to receive sales and commission payments',
                cancelar: 'Cancel',
                salvar: 'Save'
            },

            idioma: {
                titulo: 'Platform Language',
                subtitulo: 'Choose the language you want to use on Monetiza',
                portugues: 'Português',
                ingles: 'English',
                espanhol: 'Español',
                salvar: 'Save Language'
            }
        }
    },

    es: {
        sidebar: {
            dashboard: 'Panel',
            produtos: 'Productos',
            minhasVendas: 'Mis Ventas',
            afiliados: 'Afiliados',
            financeiro: 'Finanzas',
            contratos: 'Contratos',
            mensagens: 'Mensajes',
            configuracoes: 'Configuración'
        },

        topo: {
            verVitrine: 'Ver Vitrina'
        },

        cadastro: {
            tituloDocumento: 'Monetiza - Registro',
            titulo: 'Crear una nueva cuenta',
            ou: 'o',
            entrarConta: 'Iniciar sesión en una cuenta existente',
            nome: 'Nombre',
            nomePlaceholder: 'Ingresa tu nombre',
            email: 'Correo electrónico',
            emailPlaceholder: 'tu@email.com',
            senha: 'Contraseña',
            senhaPlaceholder: 'Mínimo 8 caracteres',
            repetirSenha: 'Repetir Contraseña',
            repetirSenhaPlaceholder: '••••••••',
            termos: 'He leído y acepto los términos de uso, los términos de licencia de software y la política de contenido de Monetiza',
            criarConta: 'Crear Cuenta'
        },

        afiliados: {
            tituloDocumento: 'Afiliados - Monetiza',
            tituloPagina: 'Afiliados',

            cabecalho: {
                titulo: 'Mis Enlaces de Afiliado',
                subtitulo: 'Administra tus enlaces y sigue tus comisiones',
                novaAfiliacao: 'Nueva Afiliación'
            },

            metricas: {
                cliques: 'Total de Clics',
                conversoes: 'Conversiones',
                totalGanho: 'Total Ganado'
            },

            links: {
                titulo: 'Mis Enlaces',
                vazio: 'Todavía no tienes enlaces de afiliado',
                novaConexao: 'Nueva Conexión de Afiliado'
            },

            tabela: {
                produto: 'Producto',
                cliques: 'Clics',
                conversoes: 'Conversiones',
                ganho: 'Ganancia',
                status: 'Estado',
                acoes: 'Acciones'
            },

            solicitacoes: {
                titulo: 'Solicitudes Recibidas',
                afiliado: 'Afiliado',
                comissao: 'Comisión',
                vazio: 'No hay solicitudes recibidas'
            },

            modal: {
                titulo: 'Nueva Afiliación',
                produto: 'Producto',
                carregando: 'Cargando productos...',
                aviso: 'La solicitud será enviada al productor para su aprobación.',
                cancelar: 'Cancelar',
                solicitar: 'Solicitar Afiliación'
            }
        },

        contratos: {
            tituloDocumento: 'Contratos - Monetiza',
            tituloPagina: 'Contratos',
            buscaPlaceholder: 'Buscar contratos...',

            cabecalho: {
                titulo: 'Mis Contratos',
                subtitulo: 'Administra tus contratos de afiliación',
                adicionarContrato: 'Agregar Contrato'
            },

            vazio: {
                titulo: 'Aún No Hay Contratos',
                subtitulo: 'Agrega tu primer contrato',
                novoContrato: 'Nuevo Contrato'
            },

            modal: {
                novoContrato: 'Nuevo Contrato',
                afiliacaoRelacionada: 'Afiliación relacionada',
                selecioneAfiliacao: 'Selecciona una afiliación',
                titulo: 'Título',
                tituloPlaceholder: 'Nombre del contrato',
                arquivoPdf: 'Archivo PDF',
                dataInicio: 'Fecha de Inicio',
                dataFim: 'Fecha de Fin',
                observacoes: 'Observaciones',
                observacoesPlaceholder: 'Notas sobre el contrato',
                cancelar: 'Cancelar',
                salvar: 'Guardar'
            }
        },

        dashboard: {
            tituloDocumento: 'Panel - Monetiza',
            tituloPagina: 'Panel',

            bemVindo: {
                ola: 'Hola,',
                subtitulo: 'Consulta un resumen de tu actividad en la plataforma'
            },

            metricas: {
                vendasTotais: 'Ventas Totales',
                comissoesRecebidas: 'Comisiones Recibidas',
                produtosAtivos: 'Productos Activos',
                totalVendas: 'Total de Ventas'
            },

            vendasRecentes: {
                titulo: 'Ventas Recientes',
                vazio: 'Aún no hay ventas'
            },

            saldo: {
                titulo: 'Saldo Disponible',
                entradas: 'Entradas',
                saidas: 'Salidas'
            },

            acoesRapidas: {
                titulo: 'Acciones rápidas',
                novoProduto: 'Nuevo Producto',
                novoProdutoDescricao: 'Registra un producto digital',
                gerarLink: 'Generar Enlace',
                gerarLinkDescricao: 'Crear enlace de afiliado',
                novoContrato: 'Nuevo Contrato',
                novoContratoDescricao: 'Agregar contrato',
                mensagens: 'Mensajes',
                mensagensDescricao: 'Ver conversaciones'
            }
        },

        financeiro: {
            tituloDocumento: 'Finanzas - Monetiza',
            tituloPagina: 'Finanzas',

            cabecalho: {
                titulo: 'Finanzas',
                subtitulo: 'Administra tus ingresos, gastos y comisiones',
                novaTransacao: 'Nueva Transacción'
            },

            abas: {
                visaoGeral: 'Vista General',
                comissoes: 'Comisiones'
            },

            resumo: {
                saldoDisponivel: 'Saldo Disponible',
                entradas: 'Ingresos',
                saidas: 'Gastos',
                totalEntradas: 'Total de Ingresos',
                totalSaidas: 'Total de Gastos'
            },

            filtros: {
                todos: 'Todos',
                entradas: 'Ingresos',
                saidas: 'Gastos',
                todoPeriodo: 'Todo el Período',
                hoje: 'Hoy',
                ultimos7Dias: 'Últimos 7 días',
                ultimos30Dias: 'Últimos 30 días'
            },

            transacoes: {
                titulo: 'Historial de Transacciones',
                tipo: 'Tipo',
                descricao: 'Descripción',
                categoria: 'Categoría',
                data: 'Fecha',
                valor: 'Valor',
                vazio: 'No se Encontraron Transacciones'
            },

            comissoes: {
                liberadas: 'Comisiones Liberadas',
                pendentes: 'Comisiones Pendientes',
                totalAcumulado: 'Total Acumulado',
                todosStatus: 'Todos los Estados',
                liberado: 'Liberado',
                pendente: 'Pendiente',
                cancelado: 'Cancelado',
                todosPapeis: 'Todos los Roles',
                produtor: 'Productor',
                afiliado: 'Afiliado',
                historico: 'Historial de Comisiones',
                produto: 'Producto',
                papel: 'Rol',
                dataVenda: 'Fecha de Venta',
                status: 'Estado',
                comissao: 'Comisión',
                vazio: 'No Hay Comisiones Registradas'
            }
        },

        iaProdutos: {
            tituloDocumento: 'Monetiza IA',
            buscaPlaceholder: '¿Qué estás buscando...',
            notificacoes: 'Notificaciones',
            perfil: 'Perfil',
            prototipo: 'Prototipo Monetiza IA',
            breadcrumb: 'Productos / Crear con IA',
            modelo: 'Modelo',
            carregandoModelos: 'Cargando modelos...',

            menu: {
                consultor: 'Consultor',
                consultorDescricao: 'Descubrir una idea',
                promptDescricao: 'Estructurar tu idea',
                gerarProduto: 'Generar producto',
                gerarProdutoDescricao: 'Crear producto final'
            },

            hero: {
                titulo: '¿Creamos tu próximo producto?',
                descricao: 'Usa Monetiza IA para descubrir una idea, crear un prompt profesional y generar un producto digital completo.'
            },

            acoes: {
                naoSei: 'No sé qué crear',
                naoSeiDescricao: 'Habla con el consultor para encontrar ideas de productos digitales.',
                jaTenho: 'Ya tengo una idea',
                jaTenhoDescricao: 'Transforma una idea simple en un prompt detallado y profesional.',
                gerarProduto: 'Generar producto',
                gerarProdutoDescricao: 'Usa un prompt listo para generar un producto digital estructurado.'
            },

            chat: {
                modoConsultor: 'Consultor de productos digitales',
                online: 'En línea',
                mensagemInicial1: '¡Hola! Puedo ayudarte a encontrar una idea de producto, mejorar una idea que ya tienes o generar un producto completo.',
                mensagemInicial2: 'Elige una de las opciones de arriba para comenzar.',
                statusConsultor: 'Modo actual: Consultor',
                promptPlaceholder: 'Ej: Quiero crear un producto digital sobre gimnasio...',
                enviar: 'Enviar',
                dica: 'Ctrl + Enter para enviar'
            },

            fluxo: {
                titulo: 'Flujo de creación',
                prototipo: 'Prototipo',
                descobrir: 'Descubrir',
                estruturar: 'Estructurar',
                criar: 'Crear',
                produto: 'Producto'
            },

            preview: {
                produtoCriado: 'Producto creado',
                nomeProduto: 'Nombre del producto',
                editar: 'Editar',
                gerarPdf: 'Generar PDF',
                publicar: 'Publicar'
            }
        },

        landing: {
            tituloDocumento: 'Panel - Monetiza',
            buscaPlaceholder: '¿Qué estás buscando...',

            hero: {
                produtosDigitais: 'Productos Digitales',
                afiliados: 'Afiliados',
                financas: 'Finanzas'
            },

            cards: {
                centralizacaoTitulo: 'Centralización',
                centralizacaoDescricao: 'Centraliza tus ventas, afiliados y finanzas en una sola plataforma simple, segura y organizada.',
                segurancaTitulo: 'Seguridad',
                segurancaDescricao: 'Protección de datos de alto nivel y transacciones 100% cifradas para ti y tus clientes.',
                gestaoTitulo: 'Gestión',
                gestaoDescricao: 'Administra productos digitales, controla tus ganancias y fortalece alianzas con herramientas integradas.',
                relatoriosTitulo: 'Informes',
                relatoriosDescricao: 'Sigue tus métricas de rendimiento en tiempo real con gráficos intuitivos.'
            }
        },

        login: {
            tituloDocumento: 'Monetiza - Inicio de Sesión',
            titulo: 'Inicia sesión en tu cuenta',
            ou: 'o',
            criarConta: 'Crear una nueva cuenta',
            email: 'Correo electrónico',
            emailPlaceholder: 'tu@email.com',
            senha: 'Contraseña',
            senhaPlaceholder: '••••••••',
            esqueceuSenha: '¿Olvidaste tu contraseña?',
            entrar: 'Entrar'
        },

        mensagens: {
            tituloDocumento: 'Mensajes - Monetiza',
            tituloPagina: 'Mensajes',

            chat: {
                titulo: 'Mensajes',
                novaConversa: 'Nueva conversación',
                buscarConversas: 'Buscar conversaciones...',
                conversas: 'CONVERSACIONES',
                nenhumaConversa: 'Aún no hay conversaciones',
                selecioneConversa: 'Selecciona una conversación',
                digiteMensagem: 'Escribe un mensaje...',
                enviarMensagem: 'Enviar mensaje'
            },

            modal: {
                titulo: 'Nueva Conversación',
                buscarUsuario: 'Buscar usuario...',
                carregandoUsuarios: 'Cargando usuarios...'
            }
        },

        minhasVendas: {
            tituloDocumento: 'Mis Ventas - Monetiza',
            tituloPagina: 'Mis Ventas',

            cabecalho: {
                titulo: 'Mis Ventas',
                subtitulo: 'Acompaña tus ventas y comisiones'
            },

            metricas: {
                totalVendas: 'Total de Ventas',
                comissoesGanhas: 'Comisiones Ganadas',
                vendasVendedor: 'Ventas como Vendedor',
                vendasAfiliado: 'Ventas como Afiliado'
            },

            abas: {
                vendas: 'Mis Ventas',
                comissoes: 'Comisiones'
            },

            tabela: {
                produto: 'Producto',
                comprador: 'Comprador',
                data: 'Fecha',
                status: 'Estado',
                valor: 'Valor'
            },

            vazio: 'No se encontraron ventas'
        },

        paginaProduto: {
            tituloDocumento: 'Detalles del Producto - Monetiza',
            buscaPlaceholder: '¿Qué estás buscando...',
            carregando: 'Cargando información del producto...',

            sobre: {
                titulo: 'Sobre este producto'
            },

            receber: {
                titulo: 'Lo que recibirás',
                acessoImediato: 'Acceso inmediato después de la confirmación del pago',
                suporte: 'Soporte directo con el productor',
                conteudoDigital: 'Contenido 100% digital y actualizado'
            },

            produto: {
                criadoPor: 'Creado por:',
                preco: 'Precio:',
                comprarAgora: 'Comprar Ahora',
                falarVendedor: 'Hablar con el vendedor'
            },

            garantias: {
                pagamentoSeguro: 'Pago 100% Seguro',
                garantia: 'Garantía de 7 Días',
                acesso: 'Acceso Inmediato'
            },

            checkout: {
                titulo: 'Finalizar Compra',
                nomeCompleto: 'Nombre Completo',
                nomePlaceholder: 'Ingresa tu nombre completo',
                emailEntrega: 'Correo para entrega',
                emailPlaceholder: 'tu@email.com',
                formaPagamento: 'Forma de Pago',
                cartao: 'Tarjeta',
                confirmarPagamento: 'Confirmar Pago'
            }
        },

        produto: {
            tituloDocumento: 'Productos - Monetiza',
            tituloPagina: 'Productos',
            buscaPlaceholder: 'Buscar productos...',

            cabecalho: {
                titulo: 'Mis Productos',
                subtitulo: 'Administra tus productos digitales',
                novoProduto: 'Nuevo Producto'
            },

            vazio: {
                titulo: 'Aún no hay productos',
                subtitulo: 'Crea tu primer producto digital',
                criarProduto: 'Crear Producto'
            },

            escolha: {
                titulo: 'Crear Nuevo Producto',
                subtitulo: '¿Cómo prefieres registrar tu producto?',
                manualTitulo: 'Crear Manualmente',
                manualDescricao: 'Completa los campos, precios y descripciones a tu manera.',
                iaTitulo: 'Crear con IA',
                novo: 'Nuevo',
                iaDescricao: 'Genera títulos, descripciones y textos automáticamente en segundos.'
            },

            novo: {
                tituloModal: 'Nuevo Producto'
            },

            editar: {
                tituloModal: 'Editar Producto',
                salvarAlteracoes: 'Guardar Cambios'
            },

            excluir: {
                tituloModal: 'Eliminar Producto',
                confirmacao: '¿Estás seguro de que deseas eliminar',
                aviso: 'Esta acción no se puede deshacer.',
                excluirProduto: 'Eliminar Producto'
            },

            form: {
                titulo: 'Título',
                tituloPlaceholder: 'Nombre del producto',
                descricaoCurta: 'Descripción Corta',
                descricaoCurtaPlaceholder: 'Una línea sobre el producto',
                descricaoCompleta: 'Descripción Completa',
                descricaoCompletaPlaceholder: 'Describe tu producto en detalle',
                preco: 'Precio (R$)',
                categoria: 'Categoría',
                comissao: 'Comisión de Afiliado (%)',
                status: 'Estado',
                imagemCapa: 'Imagen de Portada',
                linkProduto: 'Enlace del Producto',
                cancelar: 'Cancelar',
                salvarProduto: 'Guardar Producto'
            },

            categorias: {
                curso: 'Curso',
                mentoria: 'Mentoría'
            },

            status: {
                ativo: 'Activo',
                rascunho: 'Borrador',
                inativo: 'Inactivo'
            }
        },

        vitrine: {
            tituloDocumento: 'Tienda - Monetiza',
            buscaTopo: '¿Qué estás buscando...',
            buscarProdutos: 'Buscar productos...',
            areaVendedor: 'Área del Vendedor',
            maisVendidos: 'Más Vendidos',
            nenhumProduto: 'No se encontraron productos.',
            rodape: 'Plataforma de productos digitales con sistema de afiliados',

            usuario: {
                visitante: 'Visitante',
                subtitulo: 'Tienda Monetiza'
            },

            hero: {
                titulo: 'Productos Digitales de Alta Calidad',
                subtitulo: 'Encuentra cursos, e-books, plantillas y mucho más. ¡Empieza a aprender o vender hoy!'
            },

            filtros: {
                titulo: 'Filtros:',
                todas: 'Todas',
                cursos: 'Cursos',
                templates: 'Plantillas',
                mentorias: 'Mentorías'
            },

            ordenacao: {
                maisVendidos: 'Más Vendidos',
                recentes: 'Más Recientes',
                menorPreco: 'Menor Precio',
                maiorPreco: 'Mayor Precio'
            }
        },

        configuracoes: {
            tituloDocumento: 'Configuración - Monetiza',
            tituloPagina: 'Configuración',
            subtituloPagina: 'Administra tu perfil y preferencias',

            abas: {
                perfil: 'Mi Perfil',
                notificacoes: 'Notificaciones',
                seguranca: 'Seguridad',
                pagamento: 'Pago',
                idioma: 'Idioma'
            },

            perfil: {
                titulo: 'Información del Perfil',
                subtitulo: 'Actualiza tu información personal',
                alterarFoto: 'Cambiar foto',
                nome: 'Nombre Completo',
                nomePlaceholder: 'Nombre',
                email: 'Correo electrónico',
                emailBloqueado: 'El correo electrónico no se puede cambiar',
                bio: 'Biografía',
                bioPlaceholder: 'Cuéntanos un poco sobre ti...',
                telefone: 'Teléfono',
                salvar: 'Guardar Cambios'
            },

            notificacoes: {
                titulo: 'Notificaciones',
                subtitulo: 'Configura cómo deseas recibir notificaciones',
                vendas: 'Ventas',
                vendasDescricao: 'Notificar cuando se realice una venta',
                comissoes: 'Comisiones',
                comissoesDescricao: 'Notificar cuando ganes una comisión',
                mensagens: 'Mensajes',
                mensagensDescricao: 'Notificar al recibir nuevos mensajes',
                email: 'Correo electrónico',
                emailDescricao: 'Recibir notificaciones por correo electrónico',
                contratos: 'Contratos',
                contratosDescricao: 'Notificar sobre actualizaciones de contratos',
                afiliacoes: 'Afiliaciones',
                afiliacoesDescricao: 'Notificar sobre solicitudes y cambios de afiliación',
                salvar: 'Guardar Preferencias'
            },

            seguranca: {
                titulo: 'Seguridad',
                subtitulo: 'Cambia tu contraseña para mantener tu cuenta protegida',
                senhaAtual: 'Contraseña Actual',
                senhaAtualPlaceholder: 'Ingresa tu contraseña actual',
                novaSenha: 'Nueva Contraseña',
                novaSenhaPlaceholder: 'Ingresa la nueva contraseña',
                confirmarSenha: 'Confirmar Nueva Contraseña',
                confirmarSenhaPlaceholder: 'Ingresa nuevamente la nueva contraseña',
                dicaSenha: 'La contraseña debe tener al menos 6 caracteres',
                alterarSenha: 'Cambiar Contraseña'
            },

            pagamento: {
                titulo: 'Datos de Pago',
                subtitulo: 'Administra las claves PIX utilizadas para recibir ventas y comisiones',
                chavesCadastradas: 'Claves registradas',
                adicionarPix: 'Agregar clave PIX',
                nenhumaChave: 'No hay claves PIX registradas',
                nomeTitular: 'Nombre del Titular',
                nomeTitularPlaceholder: 'Nombre completo del titular',
                tipoChave: 'Tipo de Clave PIX',
                selecione: 'Seleccione',
                chaveAleatoria: 'Clave Aleatoria',
                chavePix: 'Clave PIX',
                chavePixPlaceholder: 'Ingresa tu clave PIX',
                ajudaPix: 'Utilizado para recibir pagos de ventas y comisiones',
                cancelar: 'Cancelar',
                salvar: 'Guardar'
            },

            idioma: {
                titulo: 'Idioma de la Plataforma',
                subtitulo: 'Elige el idioma que deseas utilizar en Monetiza',
                portugues: 'Português',
                ingles: 'English',
                espanhol: 'Español',
                salvar: 'Guardar Idioma'
            }
        }
    }
}

function obterTraducao(objeto, caminho) {
    return caminho
        .split('.')
        .reduce(
            (atual, chave) =>
                atual && atual[chave] !== undefined
                    ? atual[chave]
                    : null,
            objeto
        )
}

function aplicarIdioma(idioma) {
    const idiomaValido = traducoes[idioma]
        ? idioma
        : 'pt-BR'

    localStorage.setItem('idioma', idiomaValido)

    document.documentElement.lang =
        idiomaValido === 'pt-BR'
            ? 'pt-br'
            : idiomaValido

    document.querySelectorAll('[data-i18n]').forEach(elemento => {
        const chave = elemento.dataset.i18n
        const texto = obterTraducao(
            traducoes[idiomaValido],
            chave
        )

        if (texto !== null) {
            elemento.textContent = texto
        }
    })

    document.querySelectorAll('[data-i18n-placeholder]').forEach(elemento => {
        const chave = elemento.dataset.i18nPlaceholder
        const texto = obterTraducao(
            traducoes[idiomaValido],
            chave
        )

        if (texto !== null) {
            elemento.placeholder = texto
        }
    })
}

function obterIdiomaAtual() {
    return localStorage.getItem('idioma') || 'pt-BR'
}

window.i18n = {
    aplicarIdioma,
    obterIdiomaAtual
}

document.addEventListener('DOMContentLoaded', () => {
    aplicarIdioma(obterIdiomaAtual())
})