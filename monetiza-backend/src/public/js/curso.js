document.addEventListener('DOMContentLoaded', async () => {
    const id = location.pathname.match(/^\/cursos\/(\d+)$/)?.[1]
    const token = localStorage.getItem('token')
    if (!token) { location.assign('/login'); return }
    const el = id => document.getElementById(id)
    const base = `/api/cursos/${id}`
    let curso, aulaAtual, ocupado = false, alterado = false, selecao = 0
    const aviso = mensagem => { el('aviso').textContent = mensagem }
    async function api(url, options = {}) {
        const headers = { Authorization: `Bearer ${token}`, ...options.headers }
        if (typeof options.body === 'string') headers['Content-Type'] = 'application/json'
        const resposta = await fetch(url, { ...options, headers, cache: 'no-store' })
        const dados = await resposta.json().catch(() => ({}))
        if (!resposta.ok) throw new Error(resposta.status === 401 ? 'Sessão expirada. Entre novamente.' : dados.erro || 'Não foi possível concluir a operação.')
        return dados
    }
    async function executar(fn) {
        if (ocupado) return
        ocupado = true
        el('editor').querySelectorAll('button, input, textarea, select').forEach(e => { e.disabled = true })
        try { await fn() } catch (erro) { aviso(erro.message) } finally {
            ocupado = false
            el('editor').querySelectorAll('button, input, textarea, select').forEach(e => { e.disabled = false })
        }
    }
    function elemento(tag, texto) {
        const item = document.createElement(tag)
        if (texto) item.textContent = texto
        return item
    }
    function botao(texto, fn) {
        const b = elemento('button', texto)
        b.type = 'button'
        b.addEventListener('click', fn)
        return b
    }
    function campoTitulo(objeto, container) {
        const label = elemento('label', 'Título')
        const campo = elemento('input')
        campo.maxLength = 150
        campo.value = objeto.titulo
        campo.addEventListener('input', () => { objeto.titulo = campo.value; alterado = true })
        label.append(campo)
        container.append(label)
    }
    function campoUpload(aula, tipo, container) {
        const label = elemento('label', tipo === 'video' ? 'Vídeo MP4' : 'Material PDF (opcional)')
        const input = elemento('input')
        input.type = 'file'
        input.accept = tipo === 'video' ? '.mp4,video/mp4' : '.pdf,application/pdf'
        label.append(input)
        container.append(label, elemento('small', aula[tipo] ? 'Arquivo enviado.' : 'Nenhum arquivo enviado.'))
        input.addEventListener('change', () => executar(async () => {
            const arquivo = input.files[0]
            if (!arquivo) return
            const limite = (tipo === 'video' ? 250 : 20) * 1024 * 1024
            if (arquivo.size > limite) throw new Error('Arquivo acima do limite informado.')
            aviso('Enviando arquivo. Aguarde antes de sair da página...')
            const form = new FormData()
            form.append('arquivo', arquivo)
            const dados = await api(`${base}/arquivos/${tipo}`, { method: 'POST', body: form })
            aula[tipo] = dados.id
            alterado = true
            desenharEditor()
            aviso('Arquivo enviado. Clique em Salvar curso para vincular à aula.')
        }))
    }
    function desenharEditor() {
        el('modulos-editor').replaceChildren()
        curso.estrutura.forEach((modulo, indice) => {
            const grupo = elemento('fieldset')
            grupo.append(elemento('legend', `Módulo ${indice + 1}`))
            campoTitulo(modulo, grupo)
            modulo.aulas.forEach((aula, posicao) => {
                const bloco = elemento('fieldset')
                bloco.append(elemento('legend', `Aula ${posicao + 1}`))
                campoTitulo(aula, bloco)
                campoUpload(aula, 'video', bloco)
                campoUpload(aula, 'material', bloco)
                if (posicao > 0) bloco.append(botao('Mover aula para cima', () => {
                    [modulo.aulas[posicao - 1], modulo.aulas[posicao]] = [aula, modulo.aulas[posicao - 1]]
                    alterado = true; desenharEditor()
                }))
                grupo.append(bloco)
            })
            grupo.append(botao('Adicionar aula', () => {
                modulo.aulas.push({ id: crypto.randomUUID(), titulo: 'Nova aula', video: null, material: null })
                alterado = true; desenharEditor()
            }))
            if (indice > 0) grupo.append(botao('Mover módulo para cima', () => {
                [curso.estrutura[indice - 1], curso.estrutura[indice]] = [modulo, curso.estrutura[indice - 1]]
                alterado = true; desenharEditor()
            }))
            el('modulos-editor').append(grupo)
        })
    }
    function atualizarProgresso() {
        const ids = curso.estrutura.flatMap(
            modulo => modulo.aulas.map(aula => aula.id)
        )

        const quantidade = ids.filter(
            id => curso.concluidas.includes(id)
        ).length

        el('progresso').textContent =
            `${quantidade} de ${ids.length} aulas concluídas`

        atualizarVisualDasAulas()
    }
    async function selecionarAula(aula) {
        const atual = ++selecao
        el('video').pause()
        el('video').removeAttribute('src')
        el('video').load()
        el('video').hidden = true
        el('material').hidden = true
        el('conclusao').hidden = true
        el('video-aviso').textContent = ''
        try {
            await api(`${base}/sessao`, { method: 'POST' })
            if (atual !== selecao) return
            aulaAtual = aula
            el('aula-titulo').textContent = aula.titulo
            if (aula.video) {
                el('video').src = `${base}/midia/${aula.video}`
                el('video').hidden = false
            } else el('video-aviso').textContent = 'Vídeo ainda não enviado.'
            if (aula.material) {
                el('material').href = `${base}/midia/${aula.material}`
                el('material').hidden = false
            }
            el('concluida').checked = curso.concluidas.includes(aula.id)
            el('conclusao').hidden = false
        } catch (erro) { aviso(erro.message) }
    }
    function atualizarVisualDasAulas() {
    el('aulas').querySelectorAll('.curso-aula').forEach(botao => {
        const id = botao.dataset.aulaId
        const concluida = curso.concluidas.includes(id)
        const selecionada = aulaAtual?.id === id

        botao.classList.toggle('selecionada', selecionada)
        botao.classList.toggle('concluida', concluida)

        if (selecionada) {
            botao.setAttribute('aria-current', 'true')
        } else {
            botao.removeAttribute('aria-current')
        }

        botao.querySelector('.curso-aula-icone').textContent =
            concluida ? '✓' : '▷'

        botao.querySelector('.curso-aula-status').textContent =
            concluida
                ? 'Concluída'
                : selecionada
                    ? 'Aula selecionada'
                    : 'Assistir aula'
    })

    el('aulas').querySelectorAll('.curso-modulo').forEach(grupo => {
        const botoes = [...grupo.querySelectorAll('.curso-aula')]

        const concluidas = botoes.filter(botao =>
            curso.concluidas.includes(botao.dataset.aulaId)
        ).length

        grupo.querySelector('.curso-modulo-progresso').textContent =
            `${concluidas}/${botoes.length} concluídas`
    })
}

function desenharAluno() {
    document.title = `${curso.titulo} — Monetiza`

    el('titulo').textContent = curso.titulo
    el('apresentacao').textContent = curso.apresentacao
    el('curso-app').style.setProperty('--destaque', curso.cor)

    el('capa').hidden = false
    el('capa').alt = ''
    el('capa').onerror = () => {
        el('capa').hidden = true
    }
    el('capa').src = curso.capa

    // Preserva os módulos abertos ao salvar alterações no curso.
    const gruposAnteriores = [
        ...el('aulas').querySelectorAll('.curso-modulo')
    ]

    const abertos = new Set(
        gruposAnteriores
            .filter(grupo => grupo.open)
            .map(grupo => Number(grupo.dataset.indice))
    )

    el('aulas').replaceChildren()

    curso.estrutura.forEach((modulo, indice) => {
        const grupo = elemento('details')
        grupo.className = 'curso-modulo'
        grupo.dataset.indice = indice
        grupo.open = gruposAnteriores.length
            ? abertos.has(indice)
            : indice === 0

        const resumo = elemento('summary')
        resumo.className = 'curso-modulo-resumo'

        const numero = elemento(
            'span',
            String(indice + 1).padStart(2, '0')
        )
        numero.className = 'curso-modulo-numero'

        const informacoes = elemento('span')
        informacoes.className = 'curso-modulo-informacoes'

        const nome = elemento('strong', modulo.titulo)
        const progresso = elemento('small')
        progresso.className = 'curso-modulo-progresso'

        informacoes.append(nome, progresso)

        const seta = elemento('span', '⌄')
        seta.className = 'curso-modulo-seta'
        seta.setAttribute('aria-hidden', 'true')

        resumo.append(numero, informacoes, seta)

        const lista = elemento('div')
        lista.className = 'curso-modulo-aulas'

        modulo.aulas.forEach(aula => {
            const item = botao('', () => selecionarAula(aula))
            item.className = 'curso-aula'
            item.dataset.aulaId = aula.id

            const icone = elemento('span', '▷')
            icone.className = 'curso-aula-icone'
            icone.setAttribute('aria-hidden', 'true')

            const textos = elemento('span')
            textos.className = 'curso-aula-textos'

            const titulo = elemento('strong', aula.titulo)
            const status = elemento('small', 'Assistir aula')
            status.className = 'curso-aula-status'

            textos.append(titulo, status)
            item.append(icone, textos)
            lista.append(item)
        })

        if (!modulo.aulas.length) {
            lista.append(elemento('p', 'Este módulo ainda não possui aulas.'))
        }

        grupo.append(resumo, lista)
        el('aulas').append(grupo)
    })

    atualizarProgresso()
}
    el('editor').addEventListener('input', () => { alterado = true })
    el('adicionar-modulo').addEventListener('click', () => {
        curso.estrutura.push({ titulo: 'Novo módulo', aulas: [] })
        alterado = true; desenharEditor()
    })
    el('salvar').addEventListener('click', () => executar(async () => {
        aviso('Salvando curso...')
        const arquivoCapa = el('editar-capa').files[0]
        if (arquivoCapa) {
            const form = new FormData()
            form.append('capa', arquivoCapa)
            const dados = await api('/produtos/capa', { method: 'POST', body: form })
            curso.capa = dados.capa
            el('editar-capa').value = ''
        }
        const corpo = { versao: curso.versao, estrutura: curso.estrutura, capa: curso.capa,
            titulo: el('editar-titulo').value, apresentacao: el('editar-apresentacao').value,
            preco: el('editar-preco').value, comissao: el('editar-comissao').value,
            cor: el('editar-cor').value, status_produto: el('editar-status').value }
        const resultado = await api(base, { method: 'PUT', body: JSON.stringify(corpo) })
        Object.assign(curso, corpo, resultado)
        alterado = false
        desenharAluno()
        aviso('Curso salvo. A publicação segue o status selecionado.')
    }))
    el('concluida').addEventListener('change', async () => {
        const aula = aulaAtual
        const concluida = el('concluida').checked
        el('concluida').disabled = true
        try {
            await api(`${base}/progresso/${aula.id}`, { method: 'PUT', body: JSON.stringify({ concluida }) })
            curso.concluidas = curso.concluidas.filter(id => id !== aula.id)
            if (concluida) curso.concluidas.push(aula.id)
            atualizarProgresso()
        } catch (erro) { if (aulaAtual === aula) el('concluida').checked = !concluida; aviso(erro.message) }
        finally { el('concluida').disabled = false }
    })
    const renovarSessao = setInterval(async () => {
        if (!aulaAtual) return
        if (localStorage.getItem('token') !== token) {
            el('video').pause()
            el('video').removeAttribute('src')
            el('video').load()
            aviso('Sua sessão mudou. Entre novamente para continuar.')
            clearInterval(renovarSessao)
            return
        }
        try { await api(`${base}/sessao`, { method: 'POST' }) }
        catch (erro) { aviso(erro.message) }
    }, 10 * 60 * 1000)

    el('video').addEventListener('error', () => {
        el('video-aviso').textContent = 'Não foi possível reproduzir. Selecione a aula novamente. Se persistir, confira sua sessão e se o vídeo usa H.264/AAC.'
    })
    window.addEventListener('beforeunload', evento => {
        if (alterado || ocupado) { evento.preventDefault(); evento.returnValue = '' }
    })
    try {
        if (!id) throw new Error('Endereço de curso inválido.')
        curso = await api(base)
        desenharAluno()
        el('cabecalho').hidden = false
        el('area-aluno').hidden = false
        if (curso.editor) {
            for (const chave of ['titulo', 'apresentacao', 'preco', 'comissao', 'cor']) el(`editar-${chave}`).value = curso[chave]
            el('editar-status').value = curso.status_produto
            el('editor').hidden = false
            desenharEditor()
        }
        aviso(curso.editor ? 'Você está no editor e na prévia do seu curso.' : 'Seu curso está disponível.')
    } catch (erro) { aviso(erro.message) }
})
