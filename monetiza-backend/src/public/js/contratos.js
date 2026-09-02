document.addEventListener('DOMContentLoaded', () => {
    console.log('contratos.js carregado')

    const token = localStorage.getItem('token')

    let usuarioLogado = {}

    try {
        usuarioLogado = JSON.parse(
            localStorage.getItem('usuarioLogado') || '{}'
        )
    } catch (erro) {
        console.error('Erro ao ler usuarioLogado:', erro)
        usuarioLogado = {}
    }

    if (!token) {
        window.location.href = '/'
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

    function verificarSessao(response) {
        if (response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('usuarioLogado')

            alert('Sua sessão expirou. Faça login novamente.')

            window.location.href = '/'

            return false
        }

        return true
    }

    function abrirModalNovo() {
        contratoEditando = null

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
            tituloModal.textContent = 'Novo Contrato'
        }

        if (btnSalvar) {
            btnSalvar.textContent = 'Salvar'
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
    }

    async function carregarAfiliacoes() {
        if (!selectAfiliacao) return

        try {
            const response = await fetch('/contratos-api/afiliacoes', {
                headers: headersAuth()
            })

            if (!verificarSessao(response)) return

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro || 'Erro ao carregar afiliações'
                )
            }

            selectAfiliacao.innerHTML =
                '<option value="">Selecione uma afiliação</option>'

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

            if (!verificarSessao(response)) return

            const dados = await response.json()

            if (!response.ok) {
                throw new Error(
                    dados.erro || 'Erro ao carregar contratos'
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
                            <h3>Erro ao carregar contratos</h3>
                            <p>Tente novamente mais tarde.</p>
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

            const podeEditar =
                Number(contrato.criado_por_id) ===
                Number(usuarioLogado.id) &&
                !['Encerrado', 'Cancelado']
                    .includes(contrato.status_contrato)

            const produtorAceitou =
                contrato.aceito_produtor_em
                    ? 'Aceito'
                    : 'Aguardando'

            const afiliadoAceitou =
                contrato.aceito_afiliado_em
                    ? 'Aceito'
                    : 'Aguardando'

            card.innerHTML = `
                <div class="contrato-header">
                    <div>
                        <h3>${contrato.titulo}</h3>
                        <p>${contrato.produto}</p>
                    </div>

                    <span class="contrato-status">
                        ${contrato.status_contrato}
                    </span>
                </div>

                <div class="contrato-info">
                    <p>
                        <strong>Produtor:</strong>
                        ${contrato.produtor}
                    </p>

                    <p>
                        <strong>Afiliado:</strong>
                        ${contrato.afiliado}
                    </p>

                    <p>
                        <strong>Período:</strong>
                        ${formatarData(contrato.data_inicio)}
                        até
                        ${formatarData(contrato.data_fim)}
                    </p>

                    <p>
                        <strong>Aceite do produtor:</strong>
                        ${produtorAceitou}
                    </p>

                    <p>
                        <strong>Aceite do afiliado:</strong>
                        ${afiliadoAceitou}
                    </p>

                    ${
                        contrato.observacoes
                            ? `
                                <p>
                                    <strong>Observações:</strong>
                                    ${contrato.observacoes}
                                </p>
                            `
                            : ''
                    }
                </div>

                <div class="contrato-actions">
                    <a
                        href="${contrato.arquivo_pdf}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-contrato"
                    >
                        <i class="fa-solid fa-file-pdf"></i>
                        Ver PDF
                    </a>

                    ${
                        contrato.status_contrato === 'Pendente'
                            ? `
                                <button
                                    type="button"
                                    class="btn-contrato btn-aceitar"
                                    data-id="${contrato.id}"
                                >
                                    <i class="fa-solid fa-check"></i>
                                    Aceitar
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
                                    data-id="${contrato.id}"
                                >
                                    <i class="fa-solid fa-pen"></i>
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn-contrato btn-cancelar-contrato"
                                    data-id="${contrato.id}"
                                >
                                    <i class="fa-solid fa-xmark"></i>
                                    Cancelar
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

    function adicionarEventosCards() {
        document.querySelectorAll('.btn-aceitar')
            .forEach(botao => {
                botao.addEventListener('click', () => {
                    aceitarContrato(botao.dataset.id)
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
            alert('Erro ao acessar os campos do formulário.')
            return
        }

        const arquivo = inputArquivo.files[0]

        if (!contratoEditando && !selectAfiliacao.value) {
            alert('Selecione uma afiliação.')
            return
        }

        if (!inputTitulo.value.trim()) {
            alert('Informe o título do contrato.')
            return
        }

        if (!contratoEditando && !arquivo) {
            alert('Selecione um arquivo PDF.')
            return
        }

        if (
            arquivo &&
            (
                arquivo.type !== 'application/pdf' ||
                !arquivo.name.toLowerCase().endsWith('.pdf')
            )
        ) {
            alert('Selecione um arquivo PDF válido.')
            return
        }

        if (!inputDataInicio.value || !inputDataFim.value) {
            alert('Informe as datas do contrato.')
            return
        }

        if (inputDataFim.value < inputDataInicio.value) {
            alert(
                'A data final não pode ser anterior à data inicial.'
            )
            return
        }

        const formData = new FormData()

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
                    ? 'Salvando...'
                    : 'Criando...'
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

            if (!verificarSessao(response)) return

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    'Erro ao salvar contrato'
                )
            }

            alert(resultado.mensagem)

            fecharModal()

            await carregarContratos()
        } catch (erro) {
            console.error(
                'Erro ao salvar contrato:',
                erro
            )

            alert(erro.message)
        } finally {
            if (btnSalvar) {
                btnSalvar.disabled = false

                btnSalvar.textContent =
                    contratoEditando
                        ? 'Salvar Alterações'
                        : 'Salvar'
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

            if (!verificarSessao(response)) return

            const contrato = await response.json()

            if (!response.ok) {
                throw new Error(
                    contrato.erro ||
                    'Erro ao carregar contrato'
                )
            }

            contratoEditando = contrato.id

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
                            PDF atual:
                            <a
                                href="${contrato.arquivo_pdf}"
                                target="_blank"
                            >
                                Visualizar
                            </a>
                        `
                        : ''
            }

            if (tituloModal) {
                tituloModal.textContent =
                    'Editar Contrato'
            }

            if (btnSalvar) {
                btnSalvar.textContent =
                    'Salvar Alterações'
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

            alert(erro.message)
        }
    }

    async function aceitarContrato(id) {
        if (!confirm(
            'Deseja aceitar este contrato?'
        )) {
            return
        }

        try {
            const response = await fetch(
                `/contratos-api/${id}/aceitar`,
                {
                    method: 'PATCH',
                    headers: headersJson(),
                    body: JSON.stringify({})
                }
            )

            if (!verificarSessao(response)) return

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    'Erro ao aceitar contrato'
                )
            }

            alert(resultado.mensagem)

            await carregarContratos()
        } catch (erro) {
            console.error(
                'Erro ao aceitar contrato:',
                erro
            )

            alert(erro.message)
        }
    }

    async function cancelarContrato(id) {
        if (!confirm(
            'Tem certeza que deseja cancelar este contrato?'
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

            if (!verificarSessao(response)) return

            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(
                    resultado.erro ||
                    'Erro ao cancelar contrato'
                )
            }

            alert(resultado.mensagem)

            await carregarContratos()
        } catch (erro) {
            console.error(
                'Erro ao cancelar contrato:',
                erro
            )

            alert(erro.message)
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

    carregarAfiliacoes()
    carregarContratos()
})