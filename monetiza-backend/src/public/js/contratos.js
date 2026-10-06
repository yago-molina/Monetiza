document.addEventListener('DOMContentLoaded', async () => {
    console.log('contratos.js carregado')

    const token = localStorage.getItem('token')
    const t = chave => window.i18n?.t(chave) ?? chave

    let usuarioLogado = {}

    if (!token) {
        window.location.href = '/login'
        return
    }

    const modal = document.getElementById('modalContrato')
    const form = document.getElementById('form-contrato')

    const listaContratos = document.getElementById('lista-contratos')
    const estadoVazio = document.getElementById('estado-vazio')
    const inputBusca = document.getElementById('busca-contratos')

    const selectAfiliacao = document.getElementById('afiliacao')
    const inputTitulo = document.getElementById('titulo')
    const inputArquivo = document.getElementById('arquivo')
    const inputDataInicio = document.getElementById('dataInicio')
    const inputDataFim = document.getElementById('dataFim')
    const inputObservacoes = document.getElementById('observacoes')
    const arquivoAtual = document.getElementById('arquivo-atual')
    const tituloModal = document.getElementById('titulo-modal')

    const btnAdicionar = document.getElementById('btn-adicionar-contrato')
    const btnNovo = document.getElementById('btn-novo-contrato')
    const btnFechar = document.getElementById('btn-fechar-modal')
    const btnCancelar = document.getElementById('btn-cancelar')
    const btnSalvar = document.getElementById('btn-salvar-contrato')

    const nomeUsuario = document.getElementById('nome-usuario')
    const emailUsuario = document.getElementById('email-usuario')

    let contratos = []
    let versaoEditando = null
    let contratoEditando = null

    if (nomeUsuario && usuarioLogado.nome) {
        nomeUsuario.textContent = usuarioLogado.nome
    }

    if (emailUsuario && usuarioLogado.email) {
        emailUsuario.textContent = usuarioLogado.email
    }

    function headersAuth() {
        return {
            Authorization: `Bearer ${token}`
        }
    }

    function headersJson() {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }

    async function verificarSessao(response) {
        if (response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('usuarioLogado')

            await MonetizaUI.aviso(t('contratos.js.sessaoExpirada'))

            window.location.href = '/login'

            return false
        }

        return true
    }

    function abrirModalNovo() {
        contratoEditando = null
        versaoEditando = null

        if (form) {
            form.reset()
        }

        if (selectAfiliacao) {
            selectAfiliacao.disabled = false
            selectAfiliacao.value = ''
        }

        if (inputArquivo) {
            inputArquivo.value = ''
            inputArquivo.required = true
        }

        if (arquivoAtual) {
            arquivoAtual.innerHTML = ''
        }

        if (tituloModal) {
            tituloModal.textContent =
                t('contratos.js.novoContrato')
        }

        if (btnSalvar) {
            btnSalvar.textContent =
                t('contratos.js.salvar')
            btnSalvar.disabled = false
        }

        if (modal) {
            modal.classList.add('active')
            document.body.style.overflow = 'hidden'
        }
    }

    function fecharModal() {
        if (modal) {
            modal.classList.remove('active')
        }

        document.body.style.overflow = ''

        if (form) {
            form.reset()
        }

        if (selectAfiliacao) {
            selectAfiliacao.disabled = false
        }

        if (inputArquivo) {
            inputArquivo.required = false
            inputArquivo.value = ''
        }

        if (arquivoAtual) {
            arquivoAtual.innerHTML = ''
        }

        contratoEditando = null
        versaoEditando = null
    }

    async function carregarAfiliacoes() {
        if (!selectAfiliacao) return

        try {
            const response = await fetch('/contratos-api/afiliacoes', {
                headers: headersAuth()
            })

            if (!await verificarSessao(response)) return

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro ||
                    t('contratos.js.erroCarregarAfiliacoes')
                )
            }

            selectAfiliacao.innerHTML =
                `<option value="">${t('contratos.js.selecioneAfiliacao')}</option>`

            dados.forEach(afiliacao => {
                const option = document.createElement('option')

                option.value = afiliacao.id

                option.textContent =
                    `${afiliacao.produto} - ${afiliacao.produtor} / ${afiliacao.afiliado}`

                selectAfiliacao.appendChild(option)
            })
        } catch (erro) {
            console.error('Erro ao carregar afiliações:', erro)
        }
    }

    async function carregarContratos() {
        try {
            const response = await fetch('/contratos-api', {
                headers: headersAuth()
            })

            if (!await verificarSessao(response)) return

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro ||
                    t('contratos.js.erroCarregarContratos')
                )
            }

            contratos = Array.isArray(dados) ? dados : []

            renderizarContratos(contratos)
        } catch (erro) {
            console.error('Erro ao carregar contratos:', erro)

            if (listaContratos) {
                listaContratos.innerHTML = `
                    <div class="empty-card">
                        <div class="empty-content">
                            <h3>${t('contratos.js.erroCarregarContratos')}</h3>
                            <p>${t('contratos.js.tenteNovamente')}</p>
                        </div>
                    </div>
                `
            }
        }
    }

    function formatarData(data) {
        if (!data) return '-'

        const somenteData = String(data).split('T')[0]
        const partes = somenteData.split('-')

        if (partes.length !== 3) {
            return data
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`
    }

    function traduzirStatus(status) {
        const statusMap = {
            Pendente: 'pendente',
            Ativo: 'ativo',
            Encerrado: 'encerrado',
            Cancelado: 'cancelado'
        }

        const chave = statusMap[status]

        if (!chave) {
            return status
        }

        return t(`contratos.js.status.${chave}`)
    }

        function escaparHTML(valor) {
        return String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }

    function obterUrlPdfSegura(caminho) {
        if (
            typeof caminho !== 'string' ||
            !caminho.trim()
        ) {
            return ''
        }

        try {
            const url = new URL(
                caminho,
                window.location.origin
            )

            const permitido =
                url.origin === window.location.origin &&
                url.pathname.startsWith('/uploads/contratos/') &&
                url.pathname.toLowerCase().endsWith('.pdf')

            return permitido ? url.href : ''
        } catch {
            return ''
        }
    }

    function escaparHTML(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

    function renderizarContratos(lista) {
        if (!listaContratos || !estadoVazio) return

        listaContratos.innerHTML = ''

        if (!lista || lista.length === 0) {
            estadoVazio.style.display = 'flex'
            return
        }

        estadoVazio.style.display = 'none'

        lista.forEach(contrato => {
            const card = document.createElement('div')

            card.className = 'contrato-card'

            const criador = Number(contrato.criado_por_id) === Number(usuarioLogado.id)
            const pendente = contrato.status_contrato === 'Pendente'
            const finalizado = ['Encerrado', 'Cancelado'].includes(contrato.status_contrato)
            const podeEditar = criador && pendente &&
                !contrato.aceito_produtor_em && !contrato.aceito_afiliado_em
            const podeCancelar = criador && !finalizado
            const meuAceite = Number(contrato.produtor_id) === Number(usuarioLogado.id)
                ? contrato.aceito_produtor_em : contrato.aceito_afiliado_em
            const podeAceitar = pendente && !meuAceite

            const produtorAceitou =
                contrato.aceito_produtor_em
                    ? t('contratos.js.aceito')
                    : t('contratos.js.aguardando')

            const afiliadoAceitou =
                contrato.aceito_afiliado_em
                    ? t('contratos.js.aceito')
                    : t('contratos.js.aguardando')

            card.innerHTML = `
                <div class="contrato-header">
                    <div>
                        <h3>${escaparHTML(contrato.titulo)}</h3>
                        <p>${escaparHTML(contrato.produto)}</p>
                    </div>

                    <span class="contrato-status">
                        ${traduzirStatus(contrato.status_contrato)}
                    </span>
                </div>

                <div class="contrato-info">
                    <p>
                        <strong>${t('contratos.js.produtor')}:</strong>
                        ${escaparHTML(contrato.produtor)}
                    </p>

                    <p>
                        <strong>${t('contratos.js.afiliado')}:</strong>
                        ${escaparHTML(contrato.afiliado)}
                    </p>

                    <p>
                        <strong>${t('contratos.js.periodo')}:</strong>
                        ${formatarData(contrato.data_inicio)}
                        ${t('contratos.js.ate')}
                        ${formatarData(contrato.data_fim)}
                    </p>

                    <p>
                        <strong>${t('contratos.js.aceiteProdutor')}:</strong>
                        ${produtorAceitou}
                    </p>

                    <p>
                        <strong>${t('contratos.js.aceiteAfiliado')}:</strong>
                        ${afiliadoAceitou}
                    </p>

                    ${
                        contrato.observacoes
                            ? `
                                <p>
                                    <strong>${t('contratos.js.observacoes')}:</strong>
                                    ${escaparHTML(contrato.observacoes)}
                                </p>
                            `
                            : ''
                    }
                </div>

                <div class="contrato-actions">
                        <button
                            type="button"
                            class="btn-contrato btn-baixar-pdf"
                            data-id="${escaparHTML(contrato.id)}"
                        >
                            <i class="fa-solid fa-file-pdf"></i>
                            Baixar PDF
                        </button>

                    ${
                        podeAceitar
                            ? `
                                <button
                                    type="button"
                                    class="btn-contrato btn-aceitar"
                                    data-versao="${escaparHTML(contrato.versao)}"
                                    data-id="${escaparHTML(contrato.id)}"
                                >
                                    <i class="fa-solid fa-check"></i>
                                    ${t('contratos.js.aceitar')}
                                </button>
                            `
                            : ''
                    }

                    ${
                        podeEditar
                            ? `
                                <button
                                    type="button"
                                    class="btn-contrato btn-editar"
                                    data-id="${escaparHTML(contrato.id)}"
                                >
                                    <i class="fa-solid fa-pen"></i>
                                    ${t('contratos.js.editar')}
                                </button>

                            `
                            : ''
                    }
                    ${
                        podeCancelar
                            ? `
                                <button
                                    type="button"
                                    class="btn-contrato btn-cancelar-contrato"
                                    data-id="${escaparHTML(contrato.id)}"
                                >
                                    <i class="fa-solid fa-xmark"></i>
                                    ${t('contratos.js.cancelar')}
                                </button>
                            `
                            : ''
                    }
                </div>
            `

            listaContratos.appendChild(card)
        })

        adicionarEventosCards()
    }

    async function baixarPdfContrato(id, botao) {
    const contratoId = Number(id)

    if (
        !Number.isSafeInteger(contratoId) ||
        contratoId <= 0
    ) {
        await MonetizaUI.aviso('Contrato inválido')
        return
    }

    if (botao.disabled) return

    botao.disabled = true

    try {
        const response = await fetch(
            `/contratos-api/${contratoId}/pdf`,
            {
                headers: headersAuth(),
                cache: 'no-store'
            }
        )

        if (!await verificarSessao(response)) return

        if (!response.ok) {
            const dados = await response.json()
                .catch(() => ({}))

            throw new Error(
                dados.erro ||
                'Não foi possível baixar o PDF'
            )
        }

        const arquivo = await response.blob()
        const urlTemporaria = URL.createObjectURL(arquivo)

        const link = document.createElement('a')

        link.href = urlTemporaria
        link.download = `contrato-${contratoId}.pdf`

        document.body.appendChild(link)
        link.click()
        link.remove()

        setTimeout(() => {
            URL.revokeObjectURL(urlTemporaria)
        }, 60000)
    } catch (erro) {
        console.error('Erro ao baixar PDF:', erro)
        await MonetizaUI.aviso(erro.message)
    } finally {
        botao.disabled = false
    }
}

document.addEventListener('click', evento => {
    const botao = evento.target.closest(
        '.btn-baixar-pdf'
    )

    if (!botao) return

    evento.preventDefault()

    baixarPdfContrato(
        botao.dataset.id,
        botao
    )
})

    function adicionarEventosCards() {
        document.querySelectorAll('.btn-aceitar')
            .forEach(botao => {
                botao.addEventListener('click', () => {
                    aceitarContrato(botao.dataset.id, botao.dataset.versao)
                })
            })

        document.querySelectorAll('.btn-editar')
            .forEach(botao => {
                botao.addEventListener('click', () => {
                    editarContrato(botao.dataset.id)
                })
            })

        document.querySelectorAll('.btn-cancelar-contrato')
            .forEach(botao => {
                botao.addEventListener('click', () => {
                    cancelarContrato(botao.dataset.id)
                })
            })
    }

    async function salvarContrato(event) {
        event.preventDefault()

        if (
            !selectAfiliacao ||
            !inputTitulo ||
            !inputArquivo ||
            !inputDataInicio ||
            !inputDataFim ||
            !inputObservacoes
        ) {
            await MonetizaUI.aviso(t('contratos.js.erroCamposFormulario'))
            return
        }

        const arquivo = inputArquivo.files[0]

        if (!contratoEditando && !selectAfiliacao.value) {
            await MonetizaUI.aviso(t('contratos.js.selecioneAfiliacaoAlerta'))
            return
        }

        if (!inputTitulo.value.trim()) {
            await MonetizaUI.aviso(t('contratos.js.informeTitulo'))
            return
        }

        if (!contratoEditando && !arquivo) {
            await MonetizaUI.aviso(t('contratos.js.selecionePdf'))
            return
        }

        if (
            arquivo &&
            (
                arquivo.type !== 'application/pdf' ||
                !arquivo.name.toLowerCase().endsWith('.pdf')
            )
        ) {
            await MonetizaUI.aviso(t('contratos.js.pdfInvalido'))
            return
        }

        if (!inputDataInicio.value || !inputDataFim.value) {
            await MonetizaUI.aviso(t('contratos.js.informeDatas'))
            return
        }

        if (inputDataFim.value < inputDataInicio.value) {
            await MonetizaUI.aviso(
                t('contratos.js.dataFinalInvalida')
            )
            return
        }

        const formData = new FormData()
        if (contratoEditando) formData.append('versao', versaoEditando || '')

        if (!contratoEditando) {
            formData.append(
                'afiliacao_id',
                selectAfiliacao.value
            )
        }

        formData.append(
            'titulo',
            inputTitulo.value.trim()
        )

        formData.append(
            'data_inicio',
            inputDataInicio.value
        )

        formData.append(
            'data_fim',
            inputDataFim.value
        )

        formData.append(
            'observacoes',
            inputObservacoes.value.trim()
        )

        if (arquivo) {
            formData.append(
                'arquivo_pdf',
                arquivo
            )
        }

        if (btnSalvar) {
            btnSalvar.disabled = true

            btnSalvar.textContent =
                contratoEditando
                    ? t('contratos.js.salvando')
                    : t('contratos.js.criando')
        }

        try {
            const url =
                contratoEditando
                    ? `/contratos-api/${contratoEditando}`
                    : '/contratos-api'

            const metodo =
                contratoEditando
                    ? 'PUT'
                    : 'POST'

            const response = await fetch(url, {
                method: metodo,
                headers: headersAuth(),
                body: formData
            })

            if (!await verificarSessao(response)) return

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    t('contratos.js.erroSalvarContrato')
                )
            }

            await MonetizaUI.aviso(resultado.mensagem)

            fecharModal()

            await carregarContratos()
        } catch (erro) {
            console.error(
                'Erro ao salvar contrato:',
                erro
            )

            await MonetizaUI.aviso(erro.message)
        } finally {
            if (btnSalvar) {
                btnSalvar.disabled = false

                btnSalvar.textContent =
                    contratoEditando
                        ? t('contratos.js.salvarAlteracoes')
                        : t('contratos.js.salvar')
            }
        }
    }

    async function editarContrato(id) {
        try {
            const response = await fetch(
                `/contratos-api/${id}`,
                {
                    headers: headersAuth()
                }
            )

            if (!await verificarSessao(response)) return

            const contrato = await response.json()

            if (!response.ok) {
                throw new Error(
                    contrato.erro ||
                    t('contratos.js.erroCarregarContrato')
                )
            }

            if (contrato.status_contrato !== 'Pendente' ||
                contrato.aceito_produtor_em || contrato.aceito_afiliado_em) {
                throw new Error('Este contrato não permite mais edição. Atualize a lista.')
            }
            contratoEditando = contrato.id
            versaoEditando = contrato.versao

            if (selectAfiliacao) {
                selectAfiliacao.value =
                    contrato.afiliacao_id

                selectAfiliacao.disabled = true
            }

            if (inputTitulo) {
                inputTitulo.value =
                    contrato.titulo || ''
            }

            if (inputDataInicio) {
                inputDataInicio.value =
                    contrato.data_inicio
                        ? String(
                            contrato.data_inicio
                        ).split('T')[0]
                        : ''
            }

            if (inputDataFim) {
                inputDataFim.value =
                    contrato.data_fim
                        ? String(
                            contrato.data_fim
                        ).split('T')[0]
                        : ''
            }

            if (inputObservacoes) {
                inputObservacoes.value =
                    contrato.observacoes || ''
            }

            if (inputArquivo) {
                inputArquivo.value = ''
                inputArquivo.required = false
            }

            if (arquivoAtual) {
                arquivoAtual.innerHTML =
                    contrato.arquivo_pdf
                        ? `
                            ${t('contratos.js.pdfAtual')}:
                            <button
                            type="button"
                            class="btn-contrato btn-baixar-pdf"
                            data-id="${escaparHTML(contrato.id)}"
                        >
                            Baixar PDF
                        </button>
                        `
                        : ''
            }

            if (tituloModal) {
                tituloModal.textContent =
                    t('contratos.js.editarContrato')
            }

            if (btnSalvar) {
                btnSalvar.textContent =
                    t('contratos.js.salvarAlteracoes')
            }

            if (modal) {
                modal.classList.add('active')
                document.body.style.overflow = 'hidden'
            }
        } catch (erro) {
            console.error(
                'Erro ao editar contrato:',
                erro
            )

            await MonetizaUI.aviso(erro.message)
        }
    }

    async function aceitarContrato(id, versao) {
        if (!await MonetizaUI.confirmar(
            t('contratos.js.confirmarAceite'),
            { titulo: 'Aceitar contrato' }
        )) {
            return
        }

        try {
            const response = await fetch(
                `/contratos-api/${id}/aceitar`,
                {
                    method: 'PATCH',
                    headers: headersJson(),
                    body: JSON.stringify({ versao })
                }
            )

            if (!await verificarSessao(response)) return

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    t('contratos.js.erroAceitarContrato')
                )
            }

            await MonetizaUI.aviso(resultado.mensagem)

            await carregarContratos()
        } catch (erro) {
            console.error(
                'Erro ao aceitar contrato:',
                erro
            )

            await MonetizaUI.aviso(erro.message)
        }
    }

    async function cancelarContrato(id) {
        if (!await MonetizaUI.confirmar(
            t('contratos.js.confirmarCancelamento'),
            { titulo: 'Cancelar contrato' }
        )) {
            return
        }

        try {
            const response = await fetch(
                `/contratos-api/${id}/status`,
                {
                    method: 'PATCH',
                    headers: headersJson(),
                    body: JSON.stringify({
                        status: 'Cancelado'
                    })
                }
            )

            if (!await verificarSessao(response)) return

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    t('contratos.js.erroCancelarContrato')
                )
            }

            await MonetizaUI.aviso(resultado.mensagem)

            await carregarContratos()
        } catch (erro) {
            console.error(
                'Erro ao cancelar contrato:',
                erro
            )

            await MonetizaUI.aviso(erro.message)
        }
    }

    if (btnAdicionar) {
        btnAdicionar.addEventListener(
            'click',
            abrirModalNovo
        )
    }

    if (btnNovo) {
        btnNovo.addEventListener(
            'click',
            abrirModalNovo
        )
    }

    if (btnFechar) {
        btnFechar.addEventListener(
            'click',
            fecharModal
        )
    }

    if (btnCancelar) {
        btnCancelar.addEventListener(
            'click',
            fecharModal
        )
    }

    if (modal) {
        modal.addEventListener(
            'click',
            event => {
                if (event.target === modal) {
                    fecharModal()
                }
            }
        )
    }

    document.addEventListener(
        'keydown',
        event => {
            if (
                event.key === 'Escape' &&
                modal?.classList.contains('active')
            ) {
                fecharModal()
            }
        }
    )

    if (form) {
        form.addEventListener(
            'submit',
            salvarContrato
        )
    }

    if (inputBusca) {
        inputBusca.addEventListener(
            'input',
            () => {
                const termo =
                    inputBusca.value
                        .trim()
                        .toLowerCase()

                if (!termo) {
                    renderizarContratos(
                        contratos
                    )

                    return
                }

                const filtrados =
                    contratos.filter(
                        contrato => {
                            return (
                                contrato.titulo
                                    ?.toLowerCase()
                                    .includes(termo) ||

                                contrato.produto
                                    ?.toLowerCase()
                                    .includes(termo) ||

                                contrato.produtor
                                    ?.toLowerCase()
                                    .includes(termo) ||

                                contrato.afiliado
                                    ?.toLowerCase()
                                    .includes(termo) ||

                                contrato.status_contrato
                                    ?.toLowerCase()
                                    .includes(termo)
                            )
                        }
                    )

                renderizarContratos(
                    filtrados
                )
            }
        )
    }

    try {
        const respostaPerfil = await fetch('/usuario/perfil', { headers: headersAuth() })
        if (!await verificarSessao(respostaPerfil)) return
        if (!respostaPerfil.ok) throw new Error('Não foi possível identificar sua conta.')
        const perfil = await respostaPerfil.json()
        usuarioLogado = perfil.usuario
        if (!usuarioLogado?.id) throw new Error('Sessão inválida. Entre novamente.')
        carregarAfiliacoes()
        carregarContratos()
    } catch (erro) {
        await MonetizaUI.aviso(erro.message)
    }
})