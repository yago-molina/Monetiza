document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')

    const t = chave => window.i18n?.t(chave) ?? chave

    const tabButtons = document.querySelectorAll('.tab-btn')
    const tabContents = document.querySelectorAll('.tab-content')

    const formPerfil =
        document.getElementById('form-perfil')

    const formPagamento =
        document.getElementById('form-pagamento')

    const formSeguranca =
        document.getElementById('form-seguranca')

    const btnPreferencias =
        document.getElementById('btn-salvar-preferencias')

    const tipoChavePix =
        document.getElementById('tipo-chave-pix')

    const chavePix =
        document.getElementById('chave-pix')

    const listaPagamentos =
        document.getElementById('lista-pagamentos')

    const pagamentosVazio =
        document.getElementById('pagamentos-vazio')

    const btnAdicionarPagamento =
        document.getElementById('btn-adicionar-pagamento')

    const btnCancelarPagamento =
        document.getElementById('btn-cancelar-pagamento')

    const tituloFormPagamento =
        document.getElementById('titulo-form-pagamento')

    const btnAlterarFoto =
        document.getElementById('btn-alterar-foto')

    const inputFotoPerfil =
        document.getElementById('input-foto-perfil')

    const fotoPerfil =
        document.getElementById('foto-perfil')

    const iconeAvatarPerfil =
        document.getElementById('icone-avatar-perfil')

    const fotoPerfilMenu =
        document.getElementById('foto-perfil-menu')

    const iconeAvatarMenu =
        document.getElementById('icone-avatar-menu')

    const inputTelefone =
        document.getElementById('input-telefone')

    const opcoesIdioma =
        document.querySelectorAll('.idioma-opcao')

    const btnSalvarIdioma =
        document.getElementById('btn-salvar-idioma')

    const modalExcluirPix =
        document.getElementById('modal-excluir-pix')

    const btnCancelarExclusaoPix =
        document.getElementById('btn-cancelar-exclusao-pix')

    const btnConfirmarExclusaoPix =
        document.getElementById('btn-confirmar-exclusao-pix')

    let pagamentoParaExcluirId = null

    let idiomaSelecionado = 'pt-BR'

    let pagamentos = []
    let pagamentoEditandoId = null

    if (!token) {
        alert(t('configuracoes.js.acessoNegado'))
        window.location.href = '/'
        return
    }

    function headers() {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    function selecionarIdioma(idioma) {
        idiomaSelecionado = idioma

        opcoesIdioma.forEach(opcao => {
            opcao.classList.toggle(
                'active',
                opcao.dataset.idioma === idioma
            )
        })
    }

    function encerrarSessao() {
        localStorage.removeItem('token')
        localStorage.removeItem('usuarioLogado')

        alert(t('configuracoes.js.sessaoExpirada'))
        window.location.href = '/'
    }

    async function verificarResposta(resposta) {
        if (resposta.status === 401) {
            encerrarSessao()
            throw new Error('Sessão encerrada')
        }

        let dados = {}

        try {
            dados = await resposta.json()
        } catch {
            dados = {}
        }

        if (!resposta.ok) {
            throw new Error(
                dados.erro ||
                t('configuracoes.js.erroOperacao')
            )
        }

        return dados
    }

    function escaparHtml(valor) {
        return String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }

    function formatarCPF(valor) {
        return String(valor || '')
            .replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    function formatarCNPJ(valor) {
        return String(valor || '')
            .replace(/\D/g, '')
            .slice(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(
                /^(\d{2})\.(\d{3})(\d)/,
                '$1.$2.$3'
            )
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
    }

    function formatarTelefone(valor) {
        const numeros = String(valor || '')
            .replace(/\D/g, '')
            .slice(0, 11)

        if (numeros.length <= 10) {
            return numeros
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
        }

        return numeros
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
    }

    function formatarValorPix(tipo, valor) {
        if (tipo === 'CPF') {
            return formatarCPF(valor)
        }

        if (tipo === 'CNPJ') {
            return formatarCNPJ(valor)
        }

        if (tipo === 'Telefone') {
            return formatarTelefone(valor)
        }

        return valor || ''
    }

    function atualizarPlaceholderPix() {
        if (!tipoChavePix || !chavePix) return

        if (tipoChavePix.value === 'CPF') {
            chavePix.placeholder = '000.000.000-00'
        } else if (tipoChavePix.value === 'CNPJ') {
            chavePix.placeholder =
                '00.000.000/0000-00'
        } else if (tipoChavePix.value === 'Email') {
            chavePix.placeholder =
                'email@exemplo.com'
        } else if (
            tipoChavePix.value === 'Telefone'
        ) {
            chavePix.placeholder =
                '(11) 99999-9999'
        } else if (
            tipoChavePix.value === 'Aleatoria'
        ) {
            chavePix.placeholder =
                t('configuracoes.js.pix.placeholderAleatoria')
        } else {
            chavePix.placeholder =
                t('configuracoes.js.pix.placeholderPix')
        }
    }

    function formatarChavePix() {
        if (!tipoChavePix || !chavePix) return

        chavePix.value =
            formatarValorPix(
                tipoChavePix.value,
                chavePix.value
            )
    }

    function validarChavePix(tipo, chave) {
        const valor = chave.trim()

        if (!tipo) {
            return t('configuracoes.js.pix.selecioneTipo')
        }

        if (!valor) {
            return t('configuracoes.js.pix.informeChave')
        }

        if (tipo === 'CPF') {
            const numeros =
                valor.replace(/\D/g, '')

            if (numeros.length !== 11) {
                return t('configuracoes.js.pix.cpfInvalido')
            }
        }

        if (tipo === 'CNPJ') {
            const numeros =
                valor.replace(/\D/g, '')

            if (numeros.length !== 14) {
                return t('configuracoes.js.pix.cnpjInvalido')
            }
        }

        if (tipo === 'Email') {
            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (!emailValido.test(valor)) {
                return t('configuracoes.js.pix.emailInvalido')
            }
        }

        if (tipo === 'Telefone') {
            const numeros =
                valor.replace(/\D/g, '')

            if (
                numeros.length !== 10 &&
                numeros.length !== 11
            ) {
                return t('configuracoes.js.pix.telefoneInvalido')
            }
        }

        return null
    }

    function formatarTelefonePerfil(valor) {
        const numeros = valor
            .replace(/\D/g, '')
            .slice(0, 11)

        if (numeros.length <= 10) {
            return numeros
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
        }

        return numeros
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
    }

    function mostrarFormularioPagamento() {
        formPagamento.classList.remove('hidden')
        btnAdicionarPagamento.classList.add('hidden')
    }

    function esconderFormularioPagamento() {
        formPagamento.classList.add('hidden')
        btnAdicionarPagamento.classList.remove('hidden')

        formPagamento.reset()
        pagamentoEditandoId = null

        tituloFormPagamento.textContent =
            t('configuracoes.js.pix.adicionarChave')

        atualizarPlaceholderPix()
    }

    function abrirNovoPagamento() {
        pagamentoEditandoId = null

        formPagamento.reset()

        tituloFormPagamento.textContent =
            t('configuracoes.js.pix.adicionarChave')

        atualizarPlaceholderPix()

        mostrarFormularioPagamento()
    }

    function editarPagamento(id) {
        const pagamento = pagamentos.find(
            item => Number(item.id) === Number(id)
        )

        if (!pagamento) return

        pagamentoEditandoId =
            Number(pagamento.id)

        document.getElementById(
            'nome-titular'
        ).value =
            pagamento.nome_titular || ''

        tipoChavePix.value =
            pagamento.tipo_chave_pix || ''

        chavePix.value =
            formatarValorPix(
                pagamento.tipo_chave_pix,
                pagamento.chave_pix
            )

        tituloFormPagamento.textContent =
            t('configuracoes.js.pix.editarChave')

        atualizarPlaceholderPix()
        mostrarFormularioPagamento()
    }

    function renderizarPagamentos() {
        if (!listaPagamentos) return

        listaPagamentos.innerHTML = ''

        if (!pagamentos.length) {
            pagamentosVazio.classList.remove(
                'hidden'
            )

            return
        }

        pagamentosVazio.classList.add(
            'hidden'
        )

        listaPagamentos.innerHTML =
            pagamentos.map(pagamento => {
                const chaveFormatada =
                    formatarValorPix(
                        pagamento.tipo_chave_pix,
                        pagamento.chave_pix
                    )

                return `
                    <div class="pagamento-card">
                        <div class="pagamento-card-info">
                            <div class="pagamento-tipo">
                                <i class="fa-solid fa-money-bill-transfer"></i>
                                <strong>
                                    ${escaparHtml(
                                        pagamento.tipo_chave_pix
                                    )}
                                </strong>
                            </div>

                            <span class="pagamento-titular">
                                ${escaparHtml(
                                    pagamento.nome_titular
                                )}
                            </span>

                            <span class="pagamento-chave">
                                ${escaparHtml(
                                    chaveFormatada
                                )}
                            </span>
                        </div>

                        <div class="pagamento-acoes">
                            <button
                                type="button"
                                class="btn-editar-pagamento"
                                data-id="${pagamento.id}"
                            >
                                <i class="fa-solid fa-pen"></i>
                                ${t('configuracoes.js.editar')}
                            </button>

                            <button
                                type="button"
                                class="btn-excluir-pagamento"
                                data-id="${pagamento.id}"
                            >
                                <i class="fa-solid fa-trash"></i>
                                ${t('configuracoes.js.excluir')}
                            </button>
                        </div>
                    </div>
                `
            }).join('')

        document
            .querySelectorAll(
                '.btn-editar-pagamento'
            )
            .forEach(button => {
                button.addEventListener(
                    'click',
                    () => {
                        editarPagamento(
                            button.dataset.id
                        )
                    }
                )
            })

        document
            .querySelectorAll(
                '.btn-excluir-pagamento'
            )
            .forEach(button => {
                button.addEventListener(
                    'click',
                    () => {
                        excluirPagamento(
                            button.dataset.id
                        )
                    }
                )
            })
    }

    async function carregarPagamentos() {
        const resposta = await fetch(
            '/configuracoes-api/pagamentos',
            {
                headers: headers()
            }
        )

        const dados =
            await verificarResposta(resposta)

        pagamentos =
            dados.pagamentos || []

        renderizarPagamentos()
    }

    function atualizarFotoNaTela(caminho) {
        if (!caminho) {
            fotoPerfil?.classList.add('hidden')
            fotoPerfilMenu?.classList.add('hidden')

            iconeAvatarPerfil?.classList.remove('hidden')
            iconeAvatarMenu?.classList.remove('hidden')

            return
        }

        if (fotoPerfil) {
            fotoPerfil.src = caminho
            fotoPerfil.classList.remove('hidden')
        }

        if (fotoPerfilMenu) {
            fotoPerfilMenu.src = caminho
            fotoPerfilMenu.classList.remove('hidden')
        }

        iconeAvatarPerfil?.classList.add('hidden')
        iconeAvatarMenu?.classList.add('hidden')
    }

    async function carregarConfiguracoes() {
        const resposta = await fetch(
            '/configuracoes-api',
            {
                headers: headers()
            }
        )

        const dados =
            await verificarResposta(resposta)

        const usuario = dados.usuario

        selecionarIdioma(
            usuario.idioma || 'pt-BR'
        )

        atualizarFotoNaTela(
            usuario.foto_perfil
        )

        document.getElementById(
            'input-nome'
        ).value =
            usuario.nome || ''

        document.getElementById(
            'input-email'
        ).value =
            usuario.email || ''

        document.getElementById(
            'input-bio'
        ).value =
            usuario.bio || ''

        document.getElementById(
            'input-telefone'
        ).value =
            usuario.telefone || ''

        const nomeMenu =
            document.getElementById(
                'nome-usuario'
            )

        const emailMenu =
            document.getElementById(
                'email-usuario'
            )

        if (nomeMenu) {
            nomeMenu.textContent =
                usuario.nome
        }

        if (emailMenu) {
            emailMenu.textContent =
                usuario.email
        }

        const preferencias =
            dados.preferencias

        document.getElementById(
            'notif-vendas'
        ).checked =
            Boolean(
                preferencias.notificar_vendas
            )

        document.getElementById(
            'notif-comissoes'
        ).checked =
            Boolean(
                preferencias.notificar_comissoes
            )

        document.getElementById(
            'notif-mensagens'
        ).checked =
            Boolean(
                preferencias.notificar_mensagens
            )

        document.getElementById(
            'notif-email'
        ).checked =
            Boolean(
                preferencias.notificar_email
            )

        const notifContratos =
            document.getElementById(
                'notif-contratos'
            )

        if (notifContratos) {
            notifContratos.checked =
                Boolean(
                    preferencias
                        .notificar_contratos
                )
        }

        const notifAfiliacoes =
            document.getElementById(
                'notif-afiliacoes'
            )

        if (notifAfiliacoes) {
            notifAfiliacoes.checked =
                Boolean(
                    preferencias
                        .notificar_afiliacoes
                )
        }

        pagamentos =
            dados.pagamentos || []

        renderizarPagamentos()
    }

    async function salvarPerfil(evento) {
        evento.preventDefault()

        const nome =
            document.getElementById(
                'input-nome'
            ).value

        const bio =
            document.getElementById(
                'input-bio'
            ).value

        const telefone =
            document.getElementById(
                'input-telefone'
            ).value

        try {
            const resposta = await fetch(
                '/configuracoes-api/perfil',
                {
                    method: 'PUT',
                    headers: headers(),

                    body: JSON.stringify({
                        nome,
                        bio,
                        telefone
                    })
                }
            )

            await verificarResposta(
                resposta
            )

            await carregarConfiguracoes()
        } catch (erro) {
            alert(erro.message)
        }
    }

    async function salvarPreferencias() {
        const notifContratos =
            document.getElementById(
                'notif-contratos'
            )

        const notifAfiliacoes =
            document.getElementById(
                'notif-afiliacoes'
            )

        try {
            const resposta = await fetch(
                '/configuracoes-api/notificacoes',
                {
                    method: 'PUT',
                    headers: headers(),

                    body: JSON.stringify({
                        notificar_vendas:
                            document.getElementById(
                                'notif-vendas'
                            ).checked,

                        notificar_comissoes:
                            document.getElementById(
                                'notif-comissoes'
                            ).checked,

                        notificar_mensagens:
                            document.getElementById(
                                'notif-mensagens'
                            ).checked,

                        notificar_email:
                            document.getElementById(
                                'notif-email'
                            ).checked,

                        notificar_contratos:
                            notifContratos
                                ? notifContratos.checked
                                : true,

                        notificar_afiliacoes:
                            notifAfiliacoes
                                ? notifAfiliacoes.checked
                                : true
                    })
                }
            )

            await verificarResposta(
                resposta
            )

        } catch (erro) {
            alert(erro.message)
        }
    }

    async function salvarIdioma() {
        try {
            const resposta = await fetch(
                '/configuracoes-api/idioma',
                {
                    method: 'PUT',
                    headers: headers(),

                    body: JSON.stringify({
                        idioma: idiomaSelecionado
                    })
                }
            )

            await verificarResposta(resposta)

            localStorage.setItem(
                'idioma',
                idiomaSelecionado
            )

            if (window.i18n) {
                window.i18n.aplicarIdioma(
                    idiomaSelecionado
                )
            }
        } catch (erro) {
            alert(erro.message)
        }
    }

    async function salvarPagamento(evento) {
        evento.preventDefault()

        const nome_titular =
            document.getElementById(
                'nome-titular'
            ).value.trim()

        const tipo_chave_pix =
            tipoChavePix.value

        const chave_pix =
            chavePix.value

        if (!nome_titular) {
            alert(
                t('configuracoes.js.pix.informeTitular')
            )
            return
        }

        const erroChave =
            validarChavePix(
                tipo_chave_pix,
                chave_pix
            )

        if (erroChave) {
            alert(erroChave)
            return
        }

        try {
            let url =
                '/configuracoes-api/pagamentos'

            let metodo = 'POST'

            if (pagamentoEditandoId) {
                url =
                    `/configuracoes-api/pagamentos/${pagamentoEditandoId}`

                metodo = 'PUT'
            }

            const resposta = await fetch(
                url,
                {
                    method: metodo,
                    headers: headers(),

                    body: JSON.stringify({
                        nome_titular,
                        tipo_chave_pix,
                        chave_pix
                    })
                }
            )

            await verificarResposta(
                resposta
            )

            esconderFormularioPagamento()

            await carregarPagamentos()
        } catch (erro) {
            alert(erro.message)
        }
    }

    function excluirPagamento(id) {
        const pagamento = pagamentos.find(
            item => Number(item.id) === Number(id)
        )

        if (!pagamento) return

        pagamentoParaExcluirId = Number(id)

        modalExcluirPix.classList.remove('hidden')
    }

    async function confirmarExclusaoPagamento() {
        if (!pagamentoParaExcluirId) return

        const id = pagamentoParaExcluirId

        try {
            btnConfirmarExclusaoPix.disabled = true
            btnConfirmarExclusaoPix.textContent =
                t('configuracoes.js.pix.excluindo')

            const resposta = await fetch(
                `/configuracoes-api/pagamentos/${id}`,
                {
                    method: 'DELETE',
                    headers: headers()
                }
            )

            await verificarResposta(resposta)

            if (
                Number(pagamentoEditandoId) ===
                Number(id)
            ) {
                esconderFormularioPagamento()
            }

            modalExcluirPix.classList.add('hidden')
            pagamentoParaExcluirId = null

            await carregarPagamentos()
        } catch (erro) {
            alert(erro.message)
        } finally {
            btnConfirmarExclusaoPix.disabled = false
            btnConfirmarExclusaoPix.textContent =
                t('configuracoes.pagamento.excluir')
        }
    }

    async function salvarSeguranca(evento) {
        evento.preventDefault()

        const senha_atual =
            document.getElementById(
                'senha-atual'
            ).value

        const nova_senha =
            document.getElementById(
                'nova-senha'
            ).value

        const confirmar_senha =
            document.getElementById(
                'confirmar-senha'
            ).value

        if (
            nova_senha !==
            confirmar_senha
        ) {
            alert(
                t('configuracoes.js.senhasNaoCoincidem')
            )
            return
        }

        try {
            const resposta = await fetch(
                '/configuracoes-api/seguranca',
                {
                    method: 'PUT',
                    headers: headers(),

                    body: JSON.stringify({
                        senha_atual,
                        nova_senha,
                        confirmar_senha
                    })
                }
            )

            await verificarResposta(
                resposta
            )

            formSeguranca.reset()
        } catch (erro) {
            alert(erro.message)
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener(
            'click',
            () => {
                const aba =
                    button.dataset.tab

                tabButtons.forEach(btn => {
                    btn.classList.remove(
                        'active'
                    )
                })

                tabContents.forEach(
                    content => {
                        content.classList.remove(
                            'active'
                        )
                    }
                )

                button.classList.add(
                    'active'
                )

                document.getElementById(
                    `tab-${aba}`
                )?.classList.add(
                    'active'
                )
            }
        )
    })

    async function alterarFotoPerfil(arquivo) {
        if (!arquivo) return

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]

        if (!tiposPermitidos.includes(arquivo.type)) {
            alert(t('configuracoes.js.foto.formatoInvalido'))
            return
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            alert(t('configuracoes.js.foto.tamanhoMaximo'))
            return
        }

        const formData = new FormData()

        formData.append(
            'foto',
            arquivo
        )

        try {
            const resposta = await fetch(
                '/configuracoes-api/foto',
                {
                    method: 'PUT',

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData
                }
            )

            const dados =
                await verificarResposta(resposta)

            atualizarFotoNaTela(
                dados.foto_perfil
            )

            inputFotoPerfil.value = ''
        } catch (erro) {
            alert(erro.message)
        }
    }

    if (tipoChavePix) {
        tipoChavePix.addEventListener(
            'change',
            () => {
                chavePix.value = ''
                atualizarPlaceholderPix()
            }
        )
    }

    if (chavePix) {
        chavePix.addEventListener(
            'input',
            formatarChavePix
        )
    }

    if (btnAdicionarPagamento) {
        btnAdicionarPagamento.addEventListener(
            'click',
            abrirNovoPagamento
        )
    }

    if (btnCancelarPagamento) {
        btnCancelarPagamento.addEventListener(
            'click',
            esconderFormularioPagamento
        )
    }

    if (formPerfil) {
        formPerfil.addEventListener(
            'submit',
            salvarPerfil
        )
    }

    if (formPagamento) {
        formPagamento.addEventListener(
            'submit',
            salvarPagamento
        )
    }

    if (formSeguranca) {
        formSeguranca.addEventListener(
            'submit',
            salvarSeguranca
        )
    }

    if (btnPreferencias) {
        btnPreferencias.addEventListener(
            'click',
            salvarPreferencias
        )
    }

    if (btnAlterarFoto) {
        btnAlterarFoto.addEventListener(
            'click',
            () => {
                inputFotoPerfil.click()
            }
        )
    }

    if (inputFotoPerfil) {
        inputFotoPerfil.addEventListener(
            'change',
            () => {
                const arquivo =
                    inputFotoPerfil.files[0]

                alterarFotoPerfil(arquivo)
            }
        )
    }

    if (inputTelefone) {
        inputTelefone.addEventListener(
            'input',
            () => {
                inputTelefone.value =
                    formatarTelefonePerfil(
                        inputTelefone.value
                    )
            }
        )
    }

    opcoesIdioma.forEach(opcao => {
        opcao.addEventListener(
            'click',
            () => {
                selecionarIdioma(
                    opcao.dataset.idioma
                )
            }
        )
    })

    if (btnSalvarIdioma) {
        btnSalvarIdioma.addEventListener(
            'click',
            salvarIdioma
        )
    }

    try {
        await carregarConfiguracoes()
    } catch (erro) {
        console.error(
            'Erro ao carregar Configurações:',
            erro
        )

        if (
            erro.message !==
            'Sessão encerrada'
        ) {
            alert(erro.message)
        }
    }

    btnCancelarExclusaoPix?.addEventListener(
        'click',
        () => {
            modalExcluirPix.classList.add('hidden')
            pagamentoParaExcluirId = null
        }
    )

    btnConfirmarExclusaoPix?.addEventListener(
        'click',
        confirmarExclusaoPagamento
    )

    modalExcluirPix?.addEventListener(
        'click',
        evento => {
            if (evento.target === modalExcluirPix) {
                modalExcluirPix.classList.add('hidden')
                pagamentoParaExcluirId = null
            }
        }
    )
})