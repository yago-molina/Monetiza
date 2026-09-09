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
            },

            js: {
                acessoNegado: 'Acesso negado. Faça login primeiro.',
                sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
                erroOperacao: 'Não foi possível completar a operação',
                semLinks: 'Você ainda não tem links de afiliado',
                novaConexao: 'Nova Conexão de Afiliado',
                semSolicitacoes: 'Nenhuma solicitação recebida',
                produto: 'Produto',
                afiliado: 'Afiliado',
                copiar: 'Copiar',
                encerrar: 'Encerrar',
                aguardandoAprovacao: 'Aguardando aprovação',
                solicitarNovamente: 'Solicitar novamente',
                aprovar: 'Aprovar',
                rejeitar: 'Rejeitar',
                linkIndisponivel: 'Este link de afiliado não está disponível.',
                linkCopiado: 'Link de afiliado copiado!',
                copieLink: 'Copie seu link de afiliado:',
                carregandoProdutos: 'Carregando produtos...',
                nenhumProduto: 'Nenhum produto disponível',
                selecioneProduto: 'Selecione um produto',
                selecioneProdutoAlerta: 'Selecione um produto.',
                deComissao: 'de comissão',
                enviando: 'Enviando...',
                confirmarNovaSolicitacao: 'Deseja solicitar afiliação novamente para este produto?',
                confirmarAprovacao: 'Deseja aprovar esta solicitação?',
                confirmarRejeicao: 'Deseja rejeitar esta solicitação?',
                confirmarEncerramento: 'Deseja encerrar esta afiliação?',
                status: {
                    ativa: 'Ativa',
                    pendente: 'Pendente',
                    rejeitada: 'Rejeitada',
                    encerrada: 'Encerrada'
                }
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
            },

            js: {
                acessoNegado: 'Access denied. Please sign in first.',
                sessaoExpirada: 'Your session has expired. Please sign in again.',
                erroOperacao: 'Unable to complete the operation',
                semLinks: 'You do not have any affiliate links yet',
                novaConexao: 'New Affiliate Connection',
                semSolicitacoes: 'No requests received',
                produto: 'Product',
                afiliado: 'Affiliate',
                copiar: 'Copy',
                encerrar: 'End',
                aguardandoAprovacao: 'Waiting for approval',
                solicitarNovamente: 'Request again',
                aprovar: 'Approve',
                rejeitar: 'Reject',
                linkIndisponivel: 'This affiliate link is not available.',
                linkCopiado: 'Affiliate link copied!',
                copieLink: 'Copy your affiliate link:',
                carregandoProdutos: 'Loading products...',
                nenhumProduto: 'No products available',
                selecioneProduto: 'Select a product',
                selecioneProdutoAlerta: 'Select a product.',
                deComissao: 'commission',
                enviando: 'Sending...',
                confirmarNovaSolicitacao: 'Would you like to request affiliation for this product again?',
                confirmarAprovacao: 'Would you like to approve this request?',
                confirmarRejeicao: 'Would you like to reject this request?',
                confirmarEncerramento: 'Would you like to end this affiliation?',
                status: {
                    ativa: 'Active',
                    pendente: 'Pending',
                    rejeitada: 'Rejected',
                    encerrada: 'Ended'
                }
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
            },

            js: {
                acessoNegado: 'Acceso denegado. Inicia sesión primero.',
                sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
                erroOperacao: 'No fue posible completar la operación',
                semLinks: 'Aún no tienes enlaces de afiliado',
                novaConexao: 'Nueva Conexión de Afiliado',
                semSolicitacoes: 'No se recibieron solicitudes',
                produto: 'Producto',
                afiliado: 'Afiliado',
                copiar: 'Copiar',
                encerrar: 'Finalizar',
                aguardandoAprovacao: 'Esperando aprobación',
                solicitarNovamente: 'Solicitar nuevamente',
                aprovar: 'Aprobar',
                rejeitar: 'Rechazar',
                linkIndisponivel: 'Este enlace de afiliado no está disponible.',
                linkCopiado: '¡Enlace de afiliado copiado!',
                copieLink: 'Copia tu enlace de afiliado:',
                carregandoProdutos: 'Cargando productos...',
                nenhumProduto: 'No hay productos disponibles',
                selecioneProduto: 'Selecciona un producto',
                selecioneProdutoAlerta: 'Selecciona un producto.',
                deComissao: 'de comisión',
                enviando: 'Enviando...',
                confirmarNovaSolicitacao: '¿Deseas solicitar afiliación nuevamente para este producto?',
                confirmarAprovacao: '¿Deseas aprobar esta solicitud?',
                confirmarRejeicao: '¿Deseas rechazar esta solicitud?',
                confirmarEncerramento: '¿Deseas finalizar esta afiliación?',
                status: {
                    ativa: 'Activa',
                    pendente: 'Pendiente',
                    rejeitada: 'Rechazada',
                    encerrada: 'Finalizada'
                }
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

// ==================================================
// TRADUÇÕES DOS JAVASCRIPTS - PORTUGUÊS
// ==================================================

traducoes['pt-BR'].cadastro.js = {
    camposObrigatorios: 'Por favor, preencha todos os campos do cadastro.',
    senhaMinima: 'A senha precisa ter pelo menos 8 caracteres.',
    senhasDiferentes: 'As senhas digitadas não coincidem!',
    aceitarTermos: 'Você precisa aceitar os termos para criar sua conta.',
    criandoConta: 'Criando conta...',
    erroCriarConta: 'Não foi possível criar a conta.',
    erroServidor: 'Não foi possível conectar ao servidor.'
}

traducoes['pt-BR'].configuracoes.js = {
    acessoNegado: 'Acesso negado. Faça login primeiro.',
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    erroOperacao: 'Não foi possível completar a operação',
    editar: 'Editar',
    excluir: 'Excluir',
    senhasNaoCoincidem: 'As novas senhas não coincidem.',
    pix: {
        placeholderAleatoria: 'Digite sua chave aleatória',
        placeholderPix: 'Digite sua chave PIX',
        selecioneTipo: 'Selecione o tipo da chave PIX',
        informeChave: 'Informe sua chave PIX',
        cpfInvalido: 'CPF deve ter 11 dígitos',
        cnpjInvalido: 'CNPJ deve ter 14 dígitos',
        emailInvalido: 'Informe um email válido',
        telefoneInvalido: 'Informe um telefone válido',
        adicionarChave: 'Adicionar chave PIX',
        editarChave: 'Editar chave PIX',
        informeTitular: 'Informe o nome do titular',
        confirmarExclusao: 'Deseja excluir a chave PIX'
    },
    foto: {
        formatoInvalido: 'Selecione uma imagem JPG, PNG ou WEBP',
        tamanhoMaximo: 'A imagem deve ter no máximo 5MB'
    }
}

traducoes['pt-BR'].contratos.js = {
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    novoContrato: 'Novo Contrato',
    salvar: 'Salvar',
    erroCarregarAfiliacoes: 'Erro ao carregar afiliações',
    selecioneAfiliacao: 'Selecione uma afiliação',
    erroCarregarContratos: 'Erro ao carregar contratos',
    tenteNovamente: 'Tente novamente mais tarde.',
    aceito: 'Aceito',
    aguardando: 'Aguardando',
    produtor: 'Produtor',
    afiliado: 'Afiliado',
    periodo: 'Período',
    ate: 'até',
    aceiteProdutor: 'Aceite do produtor',
    aceiteAfiliado: 'Aceite do afiliado',
    observacoes: 'Observações',
    verPdf: 'Ver PDF',
    aceitar: 'Aceitar',
    editar: 'Editar',
    cancelar: 'Cancelar',
    erroCamposFormulario: 'Erro ao acessar os campos do formulário.',
    selecioneAfiliacaoAlerta: 'Selecione uma afiliação.',
    informeTitulo: 'Informe o título do contrato.',
    selecionePdf: 'Selecione um arquivo PDF.',
    pdfInvalido: 'Selecione um arquivo PDF válido.',
    informeDatas: 'Informe as datas do contrato.',
    dataFinalInvalida: 'A data final não pode ser anterior à data inicial.',
    salvando: 'Salvando...',
    criando: 'Criando...',
    erroSalvarContrato: 'Erro ao salvar contrato',
    salvarAlteracoes: 'Salvar Alterações',
    erroCarregarContrato: 'Erro ao carregar contrato',
    pdfAtual: 'PDF atual',
    visualizar: 'Visualizar',
    editarContrato: 'Editar Contrato',
    confirmarAceite: 'Deseja aceitar este contrato?',
    erroAceitarContrato: 'Erro ao aceitar contrato',
    confirmarCancelamento: 'Tem certeza que deseja cancelar este contrato?',
    erroCancelarContrato: 'Erro ao cancelar contrato',
    status: {
        pendente: 'Pendente',
        ativo: 'Ativo',
        encerrado: 'Encerrado',
        cancelado: 'Cancelado'
    }
}

traducoes['pt-BR'].dashboard.js = {
    acessoNegado: 'Acesso negado. Faça login primeiro.',
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    erroCarregarUsuario: 'Não foi possível carregar o usuário',
    comprador: 'Comprador',
    vendaAfiliado: 'Venda por afiliado',
    nenhumaVenda: 'Nenhuma venda ainda',
    erroCarregarDashboard: 'Não foi possível carregar o Dashboard'
}

traducoes['pt-BR'].financeiro.js = {
    acessoNegado: 'Acesso negado. Faça login primeiro.',
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    erroOperacao: 'Não foi possível completar a operação',
    tipo: {
        entrada: 'Entrada',
        saida: 'Saída'
    },
    papel: {
        produtor: 'Produtor',
        afiliado: 'Afiliado'
    },
    status: {
        liberado: 'Liberado',
        pendente: 'Pendente',
        cancelado: 'Cancelado'
    },
    promptTipo: 'Digite o tipo da transação: Entrada ou Saida',
    tipoInvalido: 'Digite Entrada ou Saida.',
    promptDescricao: 'Digite a descrição da transação:',
    promptValor: 'Digite o valor da transação:',
    valorInvalido: 'Valor inválido.'
}

traducoes['pt-BR'].iaProdutos.js = {
    objetivo: 'Objetivo',
    criativo: 'Criativo',
    formato: 'Formato',
    promptImagem: 'Prompt de imagem',
    categoria: 'Categoria',
    formatoOriginal: 'Formato original',
    precoSugerido: 'Preço sugerido',
    comissaoSugerida: 'Comissão sugerida',
    publicoAlvo: 'Público-alvo',
    problemaPrincipal: 'Problema principal',
    propostaValor: 'Proposta de valor',
    beneficios: 'Benefícios',
    diferenciais: 'Diferenciais',
    estruturaProduto: 'Estrutura do produto',
    ideiasCriativos: 'Ideias de criativos',
    voce: 'Você',
    copiar: 'Copiar',
    copiado: 'Copiado',
    erroCopiar: 'Erro ao copiar',
    pensando: 'Pensando...',
    modoConsultor: 'Consultor de produtos digitais',
    placeholderConsultor: 'Ex: Quero criar um produto digital, mas ainda não sei o que vender.',
    placeholderPromptBuilder: 'Ex: Quero criar um ebook para iniciantes em academia.',
    modoGeradorProduto: 'Gerador de produtos digitais',
    placeholderProduto: 'Cole aqui o prompt detalhado do produto...',
    statusConsultor: 'Modo atual: Consultor',
    consultorTitulo: 'Consultor',
    consultorTexto1: 'Conte um pouco sobre o que você gostaria de criar.',
    consultorTexto2: 'Você pode informar, por exemplo:',
    consultorItem1: 'um nicho que você conhece;',
    consultorItem2: 'algo que gosta;',
    consultorItem3: 'um público que gostaria de atingir;',
    consultorItem4: 'um problema que gostaria de ajudar a resolver.',
    consultorTexto3: 'Se ainda não tiver nenhuma ideia, também pode simplesmente dizer:',
    consultorExemplo: 'Não sei o que criar.',
    statusPromptBuilder: 'Modo atual: Prompt Builder',
    promptBuilderTexto1: 'Envie uma ideia de produto, mesmo que ainda esteja simples.',
    promptBuilderTexto2: 'Eu vou transformá-la em um **prompt detalhado e profissional** para ser usado pelo Gerador de Produtos.',
    exemplo: 'Exemplo',
    promptBuilderExemplo: 'Quero criar um ebook para pessoas que começaram academia recentemente.',
    statusGeradorProduto: 'Modo atual: Gerador de Produto',
    geradorTitulo: 'Gerador de Produto',
    geradorTexto1: 'Envie um prompt detalhado contendo as especificações do produto.',
    geradorTexto2: 'A Monetiza IA irá transformar esse prompt em uma estrutura completa de produto digital.',
    verificandoConexao: 'Verificando conexão com a IA...',
    iaIndisponivel: 'A IA está indisponível.',
    groqConectada: 'Groq conectada com sucesso.',
    iaIndisponivelCurto: 'IA indisponível',
    respostaInvalida: 'O servidor retornou uma resposta inválida.',
    sessaoExpirada: 'Sua sessão expirou.',
    erroAcessarIA: 'Erro ao acessar a IA.',
    semConteudo: 'A IA não retornou conteúdo.',
    consultorAnalisando: 'Consultor analisando sua mensagem...',
    promptBuilderEstruturando: 'Prompt Builder estruturando sua ideia...',
    gerandoProduto: 'Gerando produto digital...',
    iaAindaIndisponivel: 'A IA ainda não está disponível.',
    digiteMensagem: 'Digite uma mensagem.',
    etapaInvalida: 'Etapa da IA inválida.',
    modelo: 'Modelo',
    tempo: 'Tempo',
    naoFoiPossivelGerar: 'Não foi possível gerar a resposta',
    erroConversarIA: 'Erro ao conversar com a IA.',
    criandoPrompt: 'Criando prompt profissional...',
    promptCriado: 'Prompt criado',
    promptCriadoGerando: 'Prompt criado. Gerando produto...',
    produtoCriadoEm: 'Produto criado em',
    erro: 'Erro',
    erroGerarProduto: 'Erro ao gerar produto.',
    edicaoFutura: 'A edição do produto será implementada na próxima etapa.',
    pdfFuturo: 'A geração de PDF será implementada depois do produto em JSON.',
    publicacaoFutura: 'A publicação será implementada depois da geração do arquivo e da capa.'
}

traducoes['pt-BR'].landing.js = {
    acessoNegado: 'Acesso negado. Faça login primeiro.',
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    erroCarregarUsuario: 'Erro ao carregar os dados do usuário.',
    loginDashboard: 'Por favor, faça login para acessar o painel.'
}

traducoes['pt-BR'].login.js = {
    camposObrigatorios: 'Por favor, preencha o e-mail e a senha.',
    entrando: 'Entrando...',
    credenciaisInvalidas: 'E-mail ou senha incorretos.',
    sucesso: 'Login realizado com sucesso!',
    erroServidor: 'Não foi possível conectar ao servidor.'
}

traducoes['pt-BR'].mensagens.js = {
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    fotoPerfil: 'Foto de perfil',
    erroCarregarUsuario: 'Erro ao carregar usuário',
    usuario: 'Usuário',
    erroCarregarContatos: 'Erro ao carregar contatos',
    nenhumContato: 'Nenhum contato disponível',
    erroCriarConversa: 'Erro ao criar conversa',
    erroCarregarConversas: 'Erro ao carregar conversas',
    nenhumaConversa: 'Nenhuma conversa ainda',
    conversaIniciada: 'Conversa iniciada',
    erroCarregarMensagens: 'Erro ao carregar mensagens',
    nenhumaMensagem: 'Nenhuma mensagem ainda.',
    enviePrimeiraMensagem: 'Envie a primeira mensagem.',
    selecioneConversa: 'Selecione uma conversa.',
    erroEnviarMensagem: 'Erro ao enviar mensagem',
    erroMarcarLidas: 'Erro ao marcar mensagens como lidas'
}

traducoes['pt-BR'].minhasVendas.js = {
    acessoNegado: 'Acesso negado. Faça login primeiro.',
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    erroOperacao: 'Não foi possível completar a operação',
    produto: 'Produto',
    comprador: 'Comprador',
    data: 'Data',
    statusTitulo: 'Status',
    valor: 'Valor',
    comissao: 'Comissão',
    minhasVendas: 'Minhas Vendas',
    comissoes: 'Comissões',
    nenhumaVenda: 'Nenhuma venda encontrada',
    nenhumaComissao: 'Nenhuma comissão encontrada',
    status: {
        pago: 'Pago',
        pendente: 'Pendente',
        cancelado: 'Cancelado',
        reembolsado: 'Reembolsado'
    }
}

traducoes['pt-BR'].paginaProduto.js = {
    produtoNaoEspecificado: 'Produto não especificado.',
    erroCarregarDados: 'Erro ao carregar dados do produto',
    produtoNaoEncontrado: 'Produto não encontrado.',
    produto: 'Produto',
    semTitulo: 'Sem título',
    geral: 'Geral',
    semDescricao: 'Nenhuma descrição detalhada informada.',
    erroCarregarInformacoes: 'Erro ao carregar informações do produto.',
    loginCompra: 'Você precisa estar logado para realizar uma compra.',
    modalNaoEncontrado: 'Erro: Modal de checkout não encontrado no HTML.',
    aguardeProduto: 'Aguarde os dados do produto serem carregados.',
    processando: 'Processando...',
    sessaoExpiradaCurta: 'Sua sessão expirou.',
    falhaPagamento: 'Falha ao processar o pagamento.',
    compraDe: 'Compra de',
    compraSucesso: 'realizada com sucesso!',
    confirmarPagamento: 'Confirmar Pagamento',
    loginVendedor: 'Você precisa estar logado para falar com o vendedor.',
    aguardeProdutoCarregado: 'Aguarde o produto ser carregado.',
    abrindoConversa: 'Abrindo conversa...',
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    erroIniciarConversa: 'Erro ao iniciar conversa com o vendedor',
    conversaNaoIdentificada: 'Não foi possível identificar a conversa',
    falarVendedor: 'Falar com o vendedor'
}

traducoes['pt-BR'].produto.js = {
    acessoNegado: 'Acesso negado. Faça login primeiro.',
    sessaoExpirada: 'Sua sessão expirou. Faça login novamente.',
    erroCarregarUsuario: 'Não foi possível carregar o usuário',
    capaDe: 'Capa de',
    semDescricaoCurta: 'Produto sem descrição curta',
    editar: 'Editar',
    excluir: 'Excluir',
    erroCarregarProdutos: 'Não foi possível carregar os produtos',
    camposObrigatorios: 'Preencha o título, preço, categoria, imagem e link do produto.',
    salvando: 'Salvando...',
    erroCadastrarProduto: 'Não foi possível cadastrar o produto',
    salvarProduto: 'Salvar Produto',
    erroCarregarProduto: 'Não foi possível carregar o produto',
    erroAtualizarProduto: 'Não foi possível atualizar o produto',
    salvarAlteracoes: 'Salvar Alterações',
    produtoNaoEncontrado: 'Produto não encontrado.',
    excluindo: 'Excluindo...',
    erroExcluirProduto: 'Não foi possível excluir o produto',
    excluirProduto: 'Excluir Produto',
    status: {
        ativo: 'Ativo',
        inativo: 'Inativo',
        rascunho: 'Rascunho'
    }
}

traducoes['pt-BR'].vitrine.js = {
    usuario: 'Usuário',
    erroCarregarProdutos: 'Erro ao carregar produtos',
    descricaoPadrao: 'Produto digital disponível na Monetiza',
    por: 'Por',
    venda: 'venda',
    vendas: 'vendas',
    semProdutos: 'Ainda não existem produtos disponíveis.'
}

traducoes['pt-BR'].iaBtn = {
    assistente: 'Assistente IA',
    acionado: 'Assistente IA acionado!'
}

traducoes['pt-BR'].perfilGlobal = {
    usuario: 'Usuário',
    fotoPerfil: 'Foto de perfil'
}


// ==================================================
// TRADUÇÕES DOS JAVASCRIPTS - INGLÊS
// ==================================================

traducoes.en.cadastro.js = {
    camposObrigatorios: 'Please fill in all registration fields.',
    senhaMinima: 'The password must be at least 8 characters long.',
    senhasDiferentes: 'The passwords do not match!',
    aceitarTermos: 'You must accept the terms to create your account.',
    criandoConta: 'Creating account...',
    erroCriarConta: 'Unable to create the account.',
    erroServidor: 'Unable to connect to the server.'
}

traducoes.en.configuracoes.js = {
    acessoNegado: 'Access denied. Please sign in first.',
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    erroOperacao: 'Unable to complete the operation',
    editar: 'Edit',
    excluir: 'Delete',
    senhasNaoCoincidem: 'The new passwords do not match.',
    pix: {
        placeholderAleatoria: 'Enter your random key',
        placeholderPix: 'Enter your PIX key',
        selecioneTipo: 'Select the PIX key type',
        informeChave: 'Enter your PIX key',
        cpfInvalido: 'CPF must have 11 digits',
        cnpjInvalido: 'CNPJ must have 14 digits',
        emailInvalido: 'Enter a valid email',
        telefoneInvalido: 'Enter a valid phone number',
        adicionarChave: 'Add PIX key',
        editarChave: 'Edit PIX key',
        informeTitular: 'Enter the account holder name',
        confirmarExclusao: 'Do you want to delete the PIX key'
    },
    foto: {
        formatoInvalido: 'Select a JPG, PNG or WEBP image',
        tamanhoMaximo: 'The image must be no larger than 5MB'
    }
}

traducoes.en.contratos.js = {
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    novoContrato: 'New Contract',
    salvar: 'Save',
    erroCarregarAfiliacoes: 'Error loading affiliations',
    selecioneAfiliacao: 'Select an affiliation',
    erroCarregarContratos: 'Error loading contracts',
    tenteNovamente: 'Please try again later.',
    aceito: 'Accepted',
    aguardando: 'Waiting',
    produtor: 'Producer',
    afiliado: 'Affiliate',
    periodo: 'Period',
    ate: 'to',
    aceiteProdutor: 'Producer acceptance',
    aceiteAfiliado: 'Affiliate acceptance',
    observacoes: 'Notes',
    verPdf: 'View PDF',
    aceitar: 'Accept',
    editar: 'Edit',
    cancelar: 'Cancel',
    erroCamposFormulario: 'Error accessing the form fields.',
    selecioneAfiliacaoAlerta: 'Select an affiliation.',
    informeTitulo: 'Enter the contract title.',
    selecionePdf: 'Select a PDF file.',
    pdfInvalido: 'Select a valid PDF file.',
    informeDatas: 'Enter the contract dates.',
    dataFinalInvalida: 'The end date cannot be earlier than the start date.',
    salvando: 'Saving...',
    criando: 'Creating...',
    erroSalvarContrato: 'Error saving contract',
    salvarAlteracoes: 'Save Changes',
    erroCarregarContrato: 'Error loading contract',
    pdfAtual: 'Current PDF',
    visualizar: 'View',
    editarContrato: 'Edit Contract',
    confirmarAceite: 'Do you want to accept this contract?',
    erroAceitarContrato: 'Error accepting contract',
    confirmarCancelamento: 'Are you sure you want to cancel this contract?',
    erroCancelarContrato: 'Error canceling contract',
    status: {
        pendente: 'Pending',
        ativo: 'Active',
        encerrado: 'Ended',
        cancelado: 'Canceled'
    }
}

traducoes.en.dashboard.js = {
    acessoNegado: 'Access denied. Please sign in first.',
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    erroCarregarUsuario: 'Unable to load the user',
    comprador: 'Buyer',
    vendaAfiliado: 'Affiliate sale',
    nenhumaVenda: 'No sales yet',
    erroCarregarDashboard: 'Unable to load the Dashboard'
}

traducoes.en.financeiro.js = {
    acessoNegado: 'Access denied. Please sign in first.',
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    erroOperacao: 'Unable to complete the operation',
    tipo: {
        entrada: 'Income',
        saida: 'Expense'
    },
    papel: {
        produtor: 'Producer',
        afiliado: 'Affiliate'
    },
    status: {
        liberado: 'Released',
        pendente: 'Pending',
        cancelado: 'Canceled'
    },
    promptTipo: 'Enter the transaction type: Income or Expense',
    tipoInvalido: 'Enter Income or Expense.',
    promptDescricao: 'Enter the transaction description:',
    promptValor: 'Enter the transaction amount:',
    valorInvalido: 'Invalid amount.'
}

traducoes.en.iaProdutos.js = {
    objetivo: 'Objective',
    criativo: 'Creative',
    formato: 'Format',
    promptImagem: 'Image prompt',
    categoria: 'Category',
    formatoOriginal: 'Original format',
    precoSugerido: 'Suggested price',
    comissaoSugerida: 'Suggested commission',
    publicoAlvo: 'Target audience',
    problemaPrincipal: 'Main problem',
    propostaValor: 'Value proposition',
    beneficios: 'Benefits',
    diferenciais: 'Differentiators',
    estruturaProduto: 'Product structure',
    ideiasCriativos: 'Creative ideas',
    voce: 'You',
    copiar: 'Copy',
    copiado: 'Copied',
    erroCopiar: 'Error copying',
    pensando: 'Thinking...',
    modoConsultor: 'Digital product consultant',
    placeholderConsultor: "Ex: I want to create a digital product, but I don't know what to sell yet.",
    placeholderPromptBuilder: 'Ex: I want to create an ebook for gym beginners.',
    modoGeradorProduto: 'Digital product generator',
    placeholderProduto: 'Paste the detailed product prompt here...',
    statusConsultor: 'Current mode: Consultant',
    consultorTitulo: 'Consultant',
    consultorTexto1: 'Tell me a little about what you would like to create.',
    consultorTexto2: 'You can provide, for example:',
    consultorItem1: 'a niche you know;',
    consultorItem2: 'something you enjoy;',
    consultorItem3: 'an audience you would like to reach;',
    consultorItem4: 'a problem you would like to help solve.',
    consultorTexto3: "If you still don't have an idea, you can simply say:",
    consultorExemplo: "I don't know what to create.",
    statusPromptBuilder: 'Current mode: Prompt Builder',
    promptBuilderTexto1: 'Send a product idea, even if it is still simple.',
    promptBuilderTexto2: 'I will turn it into a **detailed and professional prompt** to be used by the Product Generator.',
    exemplo: 'Example',
    promptBuilderExemplo: 'I want to create an ebook for people who recently started going to the gym.',
    statusGeradorProduto: 'Current mode: Product Generator',
    geradorTitulo: 'Product Generator',
    geradorTexto1: 'Send a detailed prompt containing the product specifications.',
    geradorTexto2: 'Monetiza AI will transform this prompt into a complete digital product structure.',
    verificandoConexao: 'Checking AI connection...',
    iaIndisponivel: 'AI is unavailable.',
    groqConectada: 'Groq connected successfully.',
    iaIndisponivelCurto: 'AI unavailable',
    respostaInvalida: 'The server returned an invalid response.',
    sessaoExpirada: 'Your session has expired.',
    erroAcessarIA: 'Error accessing AI.',
    semConteudo: 'AI returned no content.',
    consultorAnalisando: 'Consultant is analyzing your message...',
    promptBuilderEstruturando: 'Prompt Builder is structuring your idea...',
    gerandoProduto: 'Generating digital product...',
    iaAindaIndisponivel: 'AI is not available yet.',
    digiteMensagem: 'Type a message.',
    etapaInvalida: 'Invalid AI stage.',
    modelo: 'Model',
    tempo: 'Time',
    naoFoiPossivelGerar: 'Unable to generate the response',
    erroConversarIA: 'Error communicating with AI.',
    criandoPrompt: 'Creating professional prompt...',
    promptCriado: 'Prompt created',
    promptCriadoGerando: 'Prompt created. Generating product...',
    produtoCriadoEm: 'Product created in',
    erro: 'Error',
    erroGerarProduto: 'Error generating product.',
    edicaoFutura: 'Product editing will be implemented in the next stage.',
    pdfFuturo: 'PDF generation will be implemented after the product is generated as JSON.',
    publicacaoFutura: 'Publishing will be implemented after the file and cover are generated.'
}

traducoes.en.landing.js = {
    acessoNegado: 'Access denied. Please sign in first.',
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    erroCarregarUsuario: 'Error loading user data.',
    loginDashboard: 'Please sign in to access the dashboard.'
}

traducoes.en.login.js = {
    camposObrigatorios: 'Please enter your email and password.',
    entrando: 'Signing in...',
    credenciaisInvalidas: 'Incorrect email or password.',
    sucesso: 'Login successful!',
    erroServidor: 'Unable to connect to the server.'
}

traducoes.en.mensagens.js = {
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    fotoPerfil: 'Profile picture',
    erroCarregarUsuario: 'Error loading user',
    usuario: 'User',
    erroCarregarContatos: 'Error loading contacts',
    nenhumContato: 'No contacts available',
    erroCriarConversa: 'Error creating conversation',
    erroCarregarConversas: 'Error loading conversations',
    nenhumaConversa: 'No conversations yet',
    conversaIniciada: 'Conversation started',
    erroCarregarMensagens: 'Error loading messages',
    nenhumaMensagem: 'No messages yet.',
    enviePrimeiraMensagem: 'Send the first message.',
    selecioneConversa: 'Select a conversation.',
    erroEnviarMensagem: 'Error sending message',
    erroMarcarLidas: 'Error marking messages as read'
}

traducoes.en.minhasVendas.js = {
    acessoNegado: 'Access denied. Please sign in first.',
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    erroOperacao: 'Unable to complete the operation',
    produto: 'Product',
    comprador: 'Buyer',
    data: 'Date',
    statusTitulo: 'Status',
    valor: 'Amount',
    comissao: 'Commission',
    minhasVendas: 'My Sales',
    comissoes: 'Commissions',
    nenhumaVenda: 'No sales found',
    nenhumaComissao: 'No commissions found',
    status: {
        pago: 'Paid',
        pendente: 'Pending',
        cancelado: 'Canceled',
        reembolsado: 'Refunded'
    }
}

traducoes.en.paginaProduto.js = {
    produtoNaoEspecificado: 'Product not specified.',
    erroCarregarDados: 'Error loading product data',
    produtoNaoEncontrado: 'Product not found.',
    produto: 'Product',
    semTitulo: 'Untitled',
    geral: 'General',
    semDescricao: 'No detailed description provided.',
    erroCarregarInformacoes: 'Error loading product information.',
    loginCompra: 'You must be signed in to make a purchase.',
    modalNaoEncontrado: 'Error: Checkout modal not found in the HTML.',
    aguardeProduto: 'Wait for the product data to load.',
    processando: 'Processing...',
    sessaoExpiradaCurta: 'Your session has expired.',
    falhaPagamento: 'Failed to process payment.',
    compraDe: 'Purchase of',
    compraSucesso: 'completed successfully!',
    confirmarPagamento: 'Confirm Payment',
    loginVendedor: 'You must be signed in to talk to the seller.',
    aguardeProdutoCarregado: 'Wait for the product to load.',
    abrindoConversa: 'Opening conversation...',
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    erroIniciarConversa: 'Error starting conversation with the seller',
    conversaNaoIdentificada: 'Unable to identify the conversation',
    falarVendedor: 'Talk to the seller'
}

traducoes.en.produto.js = {
    acessoNegado: 'Access denied. Please sign in first.',
    sessaoExpirada: 'Your session has expired. Please sign in again.',
    erroCarregarUsuario: 'Unable to load the user',
    capaDe: 'Cover of',
    semDescricaoCurta: 'Product has no short description',
    editar: 'Edit',
    excluir: 'Delete',
    erroCarregarProdutos: 'Unable to load products',
    camposObrigatorios: 'Fill in the title, price, category, image and product link.',
    salvando: 'Saving...',
    erroCadastrarProduto: 'Unable to create the product',
    salvarProduto: 'Save Product',
    erroCarregarProduto: 'Unable to load the product',
    erroAtualizarProduto: 'Unable to update the product',
    salvarAlteracoes: 'Save Changes',
    produtoNaoEncontrado: 'Product not found.',
    excluindo: 'Deleting...',
    erroExcluirProduto: 'Unable to delete the product',
    excluirProduto: 'Delete Product',
    status: {
        ativo: 'Active',
        inativo: 'Inactive',
        rascunho: 'Draft'
    }
}

traducoes.en.vitrine.js = {
    usuario: 'User',
    erroCarregarProdutos: 'Error loading products',
    descricaoPadrao: 'Digital product available on Monetiza',
    por: 'By',
    venda: 'sale',
    vendas: 'sales',
    semProdutos: 'There are no products available yet.'
}

traducoes.en.iaBtn = {
    assistente: 'AI Assistant',
    acionado: 'AI Assistant activated!'
}

traducoes.en.perfilGlobal = {
    usuario: 'User',
    fotoPerfil: 'Profile picture'
}


// ==================================================
// TRADUÇÕES DOS JAVASCRIPTS - ESPANHOL
// ==================================================

traducoes.es.cadastro.js = {
    camposObrigatorios: 'Por favor, completa todos los campos del registro.',
    senhaMinima: 'La contraseña debe tener al menos 8 caracteres.',
    senhasDiferentes: '¡Las contraseñas no coinciden!',
    aceitarTermos: 'Debes aceptar los términos para crear tu cuenta.',
    criandoConta: 'Creando cuenta...',
    erroCriarConta: 'No fue posible crear la cuenta.',
    erroServidor: 'No fue posible conectar con el servidor.'
}

traducoes.es.configuracoes.js = {
    acessoNegado: 'Acceso denegado. Inicia sesión primero.',
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    erroOperacao: 'No fue posible completar la operación',
    editar: 'Editar',
    excluir: 'Eliminar',
    senhasNaoCoincidem: 'Las nuevas contraseñas no coinciden.',
    pix: {
        placeholderAleatoria: 'Ingresa tu clave aleatoria',
        placeholderPix: 'Ingresa tu clave PIX',
        selecioneTipo: 'Selecciona el tipo de clave PIX',
        informeChave: 'Ingresa tu clave PIX',
        cpfInvalido: 'El CPF debe tener 11 dígitos',
        cnpjInvalido: 'El CNPJ debe tener 14 dígitos',
        emailInvalido: 'Ingresa un correo electrónico válido',
        telefoneInvalido: 'Ingresa un teléfono válido',
        adicionarChave: 'Agregar clave PIX',
        editarChave: 'Editar clave PIX',
        informeTitular: 'Ingresa el nombre del titular',
        confirmarExclusao: '¿Deseas eliminar la clave PIX'
    },
    foto: {
        formatoInvalido: 'Selecciona una imagen JPG, PNG o WEBP',
        tamanhoMaximo: 'La imagen debe tener un máximo de 5MB'
    }
}

traducoes.es.contratos.js = {
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    novoContrato: 'Nuevo Contrato',
    salvar: 'Guardar',
    erroCarregarAfiliacoes: 'Error al cargar afiliaciones',
    selecioneAfiliacao: 'Selecciona una afiliación',
    erroCarregarContratos: 'Error al cargar contratos',
    tenteNovamente: 'Inténtalo nuevamente más tarde.',
    aceito: 'Aceptado',
    aguardando: 'Esperando',
    produtor: 'Productor',
    afiliado: 'Afiliado',
    periodo: 'Período',
    ate: 'hasta',
    aceiteProdutor: 'Aceptación del productor',
    aceiteAfiliado: 'Aceptación del afiliado',
    observacoes: 'Observaciones',
    verPdf: 'Ver PDF',
    aceitar: 'Aceptar',
    editar: 'Editar',
    cancelar: 'Cancelar',
    erroCamposFormulario: 'Error al acceder a los campos del formulario.',
    selecioneAfiliacaoAlerta: 'Selecciona una afiliación.',
    informeTitulo: 'Ingresa el título del contrato.',
    selecionePdf: 'Selecciona un archivo PDF.',
    pdfInvalido: 'Selecciona un archivo PDF válido.',
    informeDatas: 'Ingresa las fechas del contrato.',
    dataFinalInvalida: 'La fecha final no puede ser anterior a la fecha inicial.',
    salvando: 'Guardando...',
    criando: 'Creando...',
    erroSalvarContrato: 'Error al guardar el contrato',
    salvarAlteracoes: 'Guardar Cambios',
    erroCarregarContrato: 'Error al cargar el contrato',
    pdfAtual: 'PDF actual',
    visualizar: 'Visualizar',
    editarContrato: 'Editar Contrato',
    confirmarAceite: '¿Deseas aceptar este contrato?',
    erroAceitarContrato: 'Error al aceptar el contrato',
    confirmarCancelamento: '¿Estás seguro de que deseas cancelar este contrato?',
    erroCancelarContrato: 'Error al cancelar el contrato',
    status: {
        pendente: 'Pendiente',
        ativo: 'Activo',
        encerrado: 'Finalizado',
        cancelado: 'Cancelado'
    }
}

traducoes.es.dashboard.js = {
    acessoNegado: 'Acceso denegado. Inicia sesión primero.',
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    erroCarregarUsuario: 'No fue posible cargar el usuario',
    comprador: 'Comprador',
    vendaAfiliado: 'Venta por afiliado',
    nenhumaVenda: 'Aún no hay ventas',
    erroCarregarDashboard: 'No fue posible cargar el Panel'
}

traducoes.es.financeiro.js = {
    acessoNegado: 'Acceso denegado. Inicia sesión primero.',
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    erroOperacao: 'No fue posible completar la operación',
    tipo: {
        entrada: 'Ingreso',
        saida: 'Gasto'
    },
    papel: {
        produtor: 'Productor',
        afiliado: 'Afiliado'
    },
    status: {
        liberado: 'Liberado',
        pendente: 'Pendiente',
        cancelado: 'Cancelado'
    },
    promptTipo: 'Ingresa el tipo de transacción: Ingreso o Gasto',
    tipoInvalido: 'Ingresa Ingreso o Gasto.',
    promptDescricao: 'Ingresa la descripción de la transacción:',
    promptValor: 'Ingresa el valor de la transacción:',
    valorInvalido: 'Valor inválido.'
}

traducoes.es.iaProdutos.js = {
    objetivo: 'Objetivo',
    criativo: 'Creativo',
    formato: 'Formato',
    promptImagem: 'Prompt de imagen',
    categoria: 'Categoría',
    formatoOriginal: 'Formato original',
    precoSugerido: 'Precio sugerido',
    comissaoSugerida: 'Comisión sugerida',
    publicoAlvo: 'Público objetivo',
    problemaPrincipal: 'Problema principal',
    propostaValor: 'Propuesta de valor',
    beneficios: 'Beneficios',
    diferenciais: 'Diferenciales',
    estruturaProduto: 'Estructura del producto',
    ideiasCriativos: 'Ideas de creativos',
    voce: 'Tú',
    copiar: 'Copiar',
    copiado: 'Copiado',
    erroCopiar: 'Error al copiar',
    pensando: 'Pensando...',
    modoConsultor: 'Consultor de productos digitales',
    placeholderConsultor: 'Ej: Quiero crear un producto digital, pero aún no sé qué vender.',
    placeholderPromptBuilder: 'Ej: Quiero crear un ebook para principiantes en el gimnasio.',
    modoGeradorProduto: 'Generador de productos digitales',
    placeholderProduto: 'Pega aquí el prompt detallado del producto...',
    statusConsultor: 'Modo actual: Consultor',
    consultorTitulo: 'Consultor',
    consultorTexto1: 'Cuéntame un poco sobre lo que te gustaría crear.',
    consultorTexto2: 'Puedes informar, por ejemplo:',
    consultorItem1: 'un nicho que conoces;',
    consultorItem2: 'algo que te gusta;',
    consultorItem3: 'un público al que te gustaría llegar;',
    consultorItem4: 'un problema que te gustaría ayudar a resolver.',
    consultorTexto3: 'Si todavía no tienes ninguna idea, también puedes simplemente decir:',
    consultorExemplo: 'No sé qué crear.',
    statusPromptBuilder: 'Modo actual: Prompt Builder',
    promptBuilderTexto1: 'Envía una idea de producto, aunque todavía sea sencilla.',
    promptBuilderTexto2: 'La transformaré en un **prompt detallado y profesional** para utilizarlo en el Generador de Productos.',
    exemplo: 'Ejemplo',
    promptBuilderExemplo: 'Quiero crear un ebook para personas que comenzaron a ir al gimnasio recientemente.',
    statusGeradorProduto: 'Modo actual: Generador de Producto',
    geradorTitulo: 'Generador de Producto',
    geradorTexto1: 'Envía un prompt detallado con las especificaciones del producto.',
    geradorTexto2: 'Monetiza IA transformará este prompt en una estructura completa de producto digital.',
    verificandoConexao: 'Verificando conexión con la IA...',
    iaIndisponivel: 'La IA no está disponible.',
    groqConectada: 'Groq conectada correctamente.',
    iaIndisponivelCurto: 'IA no disponible',
    respostaInvalida: 'El servidor devolvió una respuesta inválida.',
    sessaoExpirada: 'Tu sesión ha expirado.',
    erroAcessarIA: 'Error al acceder a la IA.',
    semConteudo: 'La IA no devolvió contenido.',
    consultorAnalisando: 'El consultor está analizando tu mensaje...',
    promptBuilderEstruturando: 'Prompt Builder está estructurando tu idea...',
    gerandoProduto: 'Generando producto digital...',
    iaAindaIndisponivel: 'La IA aún no está disponible.',
    digiteMensagem: 'Escribe un mensaje.',
    etapaInvalida: 'Etapa de IA inválida.',
    modelo: 'Modelo',
    tempo: 'Tiempo',
    naoFoiPossivelGerar: 'No fue posible generar la respuesta',
    erroConversarIA: 'Error al conversar con la IA.',
    criandoPrompt: 'Creando prompt profesional...',
    promptCriado: 'Prompt creado',
    promptCriadoGerando: 'Prompt creado. Generando producto...',
    produtoCriadoEm: 'Producto creado en',
    erro: 'Error',
    erroGerarProduto: 'Error al generar el producto.',
    edicaoFutura: 'La edición del producto se implementará en la próxima etapa.',
    pdfFuturo: 'La generación de PDF se implementará después del producto en JSON.',
    publicacaoFutura: 'La publicación se implementará después de generar el archivo y la portada.'
}

traducoes.es.landing.js = {
    acessoNegado: 'Acceso denegado. Inicia sesión primero.',
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    erroCarregarUsuario: 'Error al cargar los datos del usuario.',
    loginDashboard: 'Por favor, inicia sesión para acceder al panel.'
}

traducoes.es.login.js = {
    camposObrigatorios: 'Por favor, completa el correo electrónico y la contraseña.',
    entrando: 'Iniciando sesión...',
    credenciaisInvalidas: 'Correo electrónico o contraseña incorrectos.',
    sucesso: '¡Inicio de sesión realizado correctamente!',
    erroServidor: 'No fue posible conectar con el servidor.'
}

traducoes.es.mensagens.js = {
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    fotoPerfil: 'Foto de perfil',
    erroCarregarUsuario: 'Error al cargar el usuario',
    usuario: 'Usuario',
    erroCarregarContatos: 'Error al cargar los contactos',
    nenhumContato: 'No hay contactos disponibles',
    erroCriarConversa: 'Error al crear la conversación',
    erroCarregarConversas: 'Error al cargar las conversaciones',
    nenhumaConversa: 'Aún no hay conversaciones',
    conversaIniciada: 'Conversación iniciada',
    erroCarregarMensagens: 'Error al cargar los mensajes',
    nenhumaMensagem: 'Aún no hay mensajes.',
    enviePrimeiraMensagem: 'Envía el primer mensaje.',
    selecioneConversa: 'Selecciona una conversación.',
    erroEnviarMensagem: 'Error al enviar el mensaje',
    erroMarcarLidas: 'Error al marcar los mensajes como leídos'
}

traducoes.es.minhasVendas.js = {
    acessoNegado: 'Acceso denegado. Inicia sesión primero.',
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    erroOperacao: 'No fue posible completar la operación',
    produto: 'Producto',
    comprador: 'Comprador',
    data: 'Fecha',
    statusTitulo: 'Estado',
    valor: 'Valor',
    comissao: 'Comisión',
    minhasVendas: 'Mis Ventas',
    comissoes: 'Comisiones',
    nenhumaVenda: 'No se encontraron ventas',
    nenhumaComissao: 'No se encontraron comisiones',
    status: {
        pago: 'Pagado',
        pendente: 'Pendiente',
        cancelado: 'Cancelado',
        reembolsado: 'Reembolsado'
    }
}

traducoes.es.paginaProduto.js = {
    produtoNaoEspecificado: 'Producto no especificado.',
    erroCarregarDados: 'Error al cargar los datos del producto',
    produtoNaoEncontrado: 'Producto no encontrado.',
    produto: 'Producto',
    semTitulo: 'Sin título',
    geral: 'General',
    semDescricao: 'No se proporcionó una descripción detallada.',
    erroCarregarInformacoes: 'Error al cargar la información del producto.',
    loginCompra: 'Debes iniciar sesión para realizar una compra.',
    modalNaoEncontrado: 'Error: No se encontró el modal de compra en el HTML.',
    aguardeProduto: 'Espera a que se carguen los datos del producto.',
    processando: 'Procesando...',
    sessaoExpiradaCurta: 'Tu sesión ha expirado.',
    falhaPagamento: 'Error al procesar el pago.',
    compraDe: 'Compra de',
    compraSucesso: 'realizada con éxito!',
    confirmarPagamento: 'Confirmar Pago',
    loginVendedor: 'Debes iniciar sesión para hablar con el vendedor.',
    aguardeProdutoCarregado: 'Espera a que se cargue el producto.',
    abrindoConversa: 'Abriendo conversación...',
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    erroIniciarConversa: 'Error al iniciar conversación con el vendedor',
    conversaNaoIdentificada: 'No fue posible identificar la conversación',
    falarVendedor: 'Hablar con el vendedor'
}

traducoes.es.produto.js = {
    acessoNegado: 'Acceso denegado. Inicia sesión primero.',
    sessaoExpirada: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
    erroCarregarUsuario: 'No fue posible cargar el usuario',
    capaDe: 'Portada de',
    semDescricaoCurta: 'Producto sin descripción corta',
    editar: 'Editar',
    excluir: 'Eliminar',
    erroCarregarProdutos: 'No fue posible cargar los productos',
    camposObrigatorios: 'Completa el título, precio, categoría, imagen y enlace del producto.',
    salvando: 'Guardando...',
    erroCadastrarProduto: 'No fue posible registrar el producto',
    salvarProduto: 'Guardar Producto',
    erroCarregarProduto: 'No fue posible cargar el producto',
    erroAtualizarProduto: 'No fue posible actualizar el producto',
    salvarAlteracoes: 'Guardar Cambios',
    produtoNaoEncontrado: 'Producto no encontrado.',
    excluindo: 'Eliminando...',
    erroExcluirProduto: 'No fue posible eliminar el producto',
    excluirProduto: 'Eliminar Producto',
    status: {
        ativo: 'Activo',
        inativo: 'Inactivo',
        rascunho: 'Borrador'
    }
}

traducoes.es.vitrine.js = {
    usuario: 'Usuario',
    erroCarregarProdutos: 'Error al cargar productos',
    descricaoPadrao: 'Producto digital disponible en Monetiza',
    por: 'Por',
    venda: 'venta',
    vendas: 'ventas',
    semProdutos: 'Aún no hay productos disponibles.'
}

traducoes.es.iaBtn = {
    assistente: 'Asistente IA',
    acionado: '¡Asistente IA activado!'
}

traducoes.es.perfilGlobal = {
    usuario: 'Usuario',
    fotoPerfil: 'Foto de perfil'
}


// ==================================================
// FUNÇÕES DO I18N
// ==================================================

function obterTraducao(objeto,caminho){
    return caminho.split('.').reduce((atual,chave)=>atual&&atual[chave]!==undefined?atual[chave]:null,objeto)
}

function obterIdiomaAtual(){
    return localStorage.getItem('idioma')||'pt-BR'
}

function traduzir(chave,idioma=obterIdiomaAtual()){
    const idiomaValido=traducoes[idioma]?idioma:'pt-BR'
    return obterTraducao(traducoes[idiomaValido],chave)??chave
}

function aplicarIdioma(idioma){
    const idiomaValido=traducoes[idioma]?idioma:'pt-BR'

    localStorage.setItem('idioma',idiomaValido)

    document.documentElement.lang=
        idiomaValido==='pt-BR'
            ?'pt-br'
            :idiomaValido

    document.querySelectorAll('[data-i18n]').forEach(elemento=>{
        const texto=traduzir(elemento.dataset.i18n,idiomaValido)

        if(texto!==elemento.dataset.i18n){
            elemento.textContent=texto
        }
    })

    document.querySelectorAll('[data-i18n-placeholder]').forEach(elemento=>{
        const texto=traduzir(
            elemento.dataset.i18nPlaceholder,
            idiomaValido
        )

        if(texto!==elemento.dataset.i18nPlaceholder){
            elemento.placeholder=texto
        }
    })

    document.querySelectorAll('[data-i18n-title]').forEach(elemento=>{
        const texto=traduzir(
            elemento.dataset.i18nTitle,
            idiomaValido
        )

        if(texto!==elemento.dataset.i18nTitle){
            elemento.title=texto
        }
    })

    document.querySelectorAll('[data-i18n-aria-label]').forEach(elemento=>{
        const texto=traduzir(
            elemento.dataset.i18nAriaLabel,
            idiomaValido
        )

        if(texto!==elemento.dataset.i18nAriaLabel){
            elemento.setAttribute(
                'aria-label',
                texto
            )
        }
    })
}

window.i18n={
    aplicarIdioma,
    obterIdiomaAtual,
    t:traduzir
}

document.addEventListener('DOMContentLoaded',()=>{
    aplicarIdioma(
        obterIdiomaAtual()
    )
})