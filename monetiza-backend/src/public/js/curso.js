document.addEventListener('DOMContentLoaded', async () => {
    const id = location.pathname.match(/^\/cursos\/(\d+)$/)?.[1]
    const token = localStorage.getItem('token')
    if (!token) { location.assign('/login'); return }
    const el = id => document.getElementById(id)
    const t = window.CursoI18n
    const base = `/api/cursos/${id}`
    let curso, visual, rascunho, aulaAtual, ocupado = false, alterado = false, previa = false, selecao = 0
    let moduloAtual = 0, urlCapa = null, arquivoCapa = null, mensagem = 'loading'
    const aviso = chave => { mensagem = chave; el('aviso').textContent = t(chave) }
    function erro(chave) { return Object.assign(new Error(chave), { chave }) }
    async function api(url, options = {}) {
        const headers = { Authorization: `Bearer ${token}`, ...options.headers }
        if (typeof options.body === 'string') headers['Content-Type'] = 'application/json'
        let resposta
        try { resposta = await fetch(url, { ...options, headers, cache: 'no-store' }) } catch { throw erro('error') }
        const dados = await resposta.json().catch(() => ({}))
        if (!resposta.ok) {
            console.error('Curso:', resposta.status, dados.erro)
            throw erro(({ 401: 'expired', 403: 'forbidden', 404: 'forbidden', 409: 'conflict', 400: 'invalid', 413: 'tooLarge' })[resposta.status] || 'error')
        }
        return dados
    }
    function preferencias() {
        document.querySelectorAll('[data-ct]').forEach(item => { item.textContent = t(item.dataset.ct) })
        el('idioma').value = window.i18n.obterIdiomaAtual()
        el('aviso').textContent = mensagem ? t(mensagem) : ''
        el('estado-edicao').textContent = alterado ? t('unsaved') : ''
    }
    el('idioma').addEventListener('change', evento => window.i18n.aplicarIdioma(evento.target.value))
    window.addEventListener('i18n:change', () => {
        preferencias()
        if (visual) desenharAluno()
        // Não reconstrói o editor: preserva foco, textos e arquivos selecionados.
        el('modulos-editor').querySelectorAll('[data-dinamico]').forEach(item => {
            item.textContent = t(item.dataset.dinamico, { n: item.dataset.numero })
        })
    })
    preferencias()
    async function executar(fn) {
        if (ocupado) return
        ocupado = true
        const controles = document.querySelectorAll('#editor button, #editor input, #editor textarea, #editor select, #barra-produtor button, #faixa-previa button')
        controles.forEach(e => { e.disabled = true })
        try { await fn() } catch (e) { aviso(e.chave || 'error') } finally {
            ocupado = false
            document.querySelectorAll('#editor button, #editor input, #editor textarea, #editor select, #barra-produtor button, #faixa-previa button').forEach(e => { e.disabled = false })
        }
    }
    function elemento(tag, texto) {
        const item = document.createElement(tag)
        if (texto) item.textContent = texto
        return item
    }
    function traduzido(tag, chave, n) {
        const item = elemento(tag, t(chave, { n }))
        item.dataset.dinamico = chave
        if (n !== undefined) item.dataset.numero = n
        return item
    }
    function botao(chave, fn) {
        const b = traduzido('button', chave)
        b.type = 'button'; b.addEventListener('click', fn)
        return b
    }
    function mudar() { alterado = true; el('estado-edicao').textContent = t('unsaved') }
    function campoTitulo(objeto, container) {
        const label = elemento('label')
        const campo = elemento('input')
        campo.maxLength = 150; campo.value = objeto.titulo
        campo.addEventListener('input', () => { objeto.titulo = campo.value; mudar() })
        label.append(traduzido('span', 'title'), campo); container.append(label)
    }
    function campoUpload(aula, tipo, container) {
        const label = elemento('label'), input = elemento('input')
        input.type = 'file'; input.accept = tipo === 'video' ? '.mp4,video/mp4' : '.pdf,application/pdf'
        label.append(traduzido('span', tipo === 'video' ? 'video' : 'pdf'), input)
        const estado = traduzido('small', aula[tipo] ? 'uploaded' : 'noFile')
        container.append(label, estado)
        input.addEventListener('change', () => executar(async () => {
            const arquivo = input.files[0]
            if (!arquivo) return
            if (arquivo.size > (tipo === 'video' ? 250 : 20) * 1024 * 1024) throw erro('tooLarge')
            aviso('sending')
            const form = new FormData(); form.append('arquivo', arquivo)
            const dados = await api(`${base}/arquivos/${tipo}`, { method: 'POST', body: form })
            aula[tipo] = dados.id; mudar()
            estado.dataset.dinamico = 'uploaded'; estado.textContent = t('uploaded')
            aviso('sent')
        }))
    }
    function desenharEditor() {
        el('modulos-editor').replaceChildren()
        rascunho.estrutura.forEach((modulo, indice) => {
            const grupo = elemento('fieldset')
            grupo.append(traduzido('legend', 'module', indice + 1)); campoTitulo(modulo, grupo)
            modulo.aulas.forEach((aula, posicao) => {
                const bloco = elemento('fieldset')
                bloco.append(traduzido('legend', 'lesson', posicao + 1)); campoTitulo(aula, bloco)
                campoUpload(aula, 'video', bloco); campoUpload(aula, 'material', bloco)
                if (posicao > 0) bloco.append(botao('up', () => {
                    [modulo.aulas[posicao - 1], modulo.aulas[posicao]] = [aula, modulo.aulas[posicao - 1]]
                    mudar(); desenharEditor()
                }))
                grupo.append(bloco)
            })
            grupo.append(botao('addLesson', () => {
                modulo.aulas.push({ id: crypto.randomUUID(), titulo: t('newLesson'), video: null, material: null })
                mudar(); desenharEditor()
            }))
            if (indice > 0) grupo.append(botao('up', () => {
                [rascunho.estrutura[indice - 1], rascunho.estrutura[indice]] = [modulo, rascunho.estrutura[indice - 1]]
                mudar(); desenharEditor()
            }))
            el('modulos-editor').append(grupo)
        })
    }
    function lerFormulario() {
        for (const chave of ['titulo', 'apresentacao', 'preco', 'comissao', 'cor']) rascunho[chave] = el(`editar-${chave}`).value
        rascunho.status_produto = el('editar-status').value
    }
    function pararVideo() {
        selecao++; aulaAtual = null
        el('video').pause(); el('video').removeAttribute('src'); el('video').load()
        el('video').hidden = true; el('material').hidden = true; el('conclusao').hidden = true
        el('player-vazio').hidden = false; el('aula-titulo').textContent = ''; el('video-aviso').textContent = ''
    }
    function abrirEditor() {
        if (!curso.editor || ocupado) return
        pararVideo(); previa = false
        el('editor').hidden = false; el('visao-aluno').hidden = true; el('faixa-previa').hidden = true
        el('editar-titulo').focus()
    }
    function verPrevia() {
        if (!curso.editor || ocupado) return
        lerFormulario(); pararVideo(); previa = true
        visual = structuredClone(rascunho)
        visual.capa = urlCapa || visual.capa
        el('editor').hidden = true; el('visao-aluno').hidden = false; el('faixa-previa').hidden = false
        desenharAluno(); el('voltar-editor').focus()
    }
    el('abrir-editor').addEventListener('click', abrirEditor)
    el('voltar-editor').addEventListener('click', abrirEditor)
    el('ver-previa').addEventListener('click', verPrevia)
    el('editar-capa').addEventListener('change', () => {
        if (urlCapa) URL.revokeObjectURL(urlCapa)
        arquivoCapa = el('editar-capa').files[0] || null
        urlCapa = arquivoCapa ? URL.createObjectURL(arquivoCapa) : null
        mudar()
    })
    function progresso() {
        const ids = visual.estrutura.flatMap(m => m.aulas.map(a => a.id))
        const done = ids.filter(id => curso.concluidas.includes(id)).length
        el('progresso').textContent = t('progress', { done, total: ids.length })
        el('barra-progresso').value = ids.length ? done / ids.length * 100 : 0
        el('barra-progresso').setAttribute('aria-label', el('progresso').textContent)
        el('aulas').querySelectorAll('[data-aula]').forEach(b => {
            const concluida = curso.concluidas.includes(b.dataset.aula)
            const atual = aulaAtual?.id === b.dataset.aula
            b.classList.toggle('selecionada', atual)
            if (atual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current')
            b.querySelector('small').textContent = t(concluida ? 'completed' : atual ? 'current' : 'watch')
            b.querySelector('.aula-icone').textContent = concluida ? '✓' : '▷'
        })
    }
    function desenharLista() {
        el('aulas').replaceChildren()
        const modulo = visual.estrutura[moduloAtual]
        el('modulo-atual').textContent = modulo?.titulo || ''
        if (!modulo?.aulas.length) { el('aulas').append(elemento('p', t('empty'))); return }
        const grupo = elemento('details'); grupo.open = true
        grupo.append(elemento('summary', modulo.titulo))
        modulo.aulas.forEach(aula => {
            const b = elemento('button'); b.type = 'button'; b.dataset.aula = aula.id
            const icone = elemento('span', '▷'); icone.className = 'aula-icone'; icone.setAttribute('aria-hidden', 'true')
            const conteudo = elemento('span'); conteudo.append(elemento('strong', aula.titulo), elemento('small'))
            b.append(icone, conteudo); b.addEventListener('click', () => selecionarAula(aula))
            grupo.append(b)
        })
        el('aulas').append(grupo); progresso()
    }
    function desenharAluno() {
        document.title = `${visual.titulo} — Monetiza`
        el('titulo').textContent = visual.titulo; el('apresentacao').textContent = visual.apresentacao
        el('curso-app').style.setProperty('--destaque', visual.cor)
        el('capa').hidden = false; el('capa').onerror = () => { el('capa').hidden = true }; el('capa').src = visual.capa
        el('cards-modulos').replaceChildren()
        visual.estrutura.forEach((modulo, indice) => {
            const card = elemento('button'); card.type = 'button'; card.className = 'modulo-card'
            card.setAttribute('aria-controls', 'area-aluno'); card.setAttribute('aria-pressed', String(indice === moduloAtual))
            const arte = elemento('span'); arte.className = 'modulo-arte'
            const img = elemento('img'); img.alt = ''; img.loading = 'lazy'; img.src = visual.capa
            img.onerror = () => { img.hidden = true }
            arte.append(img, elemento('span', String(indice + 1).padStart(2, '0')))
            const texto = elemento('span'); texto.className = 'modulo-texto'
            texto.append(elemento('small', t('module', { n: indice + 1 })), elemento('strong', modulo.titulo), elemento('small', t('lessons', { n: modulo.aulas.length })), elemento('span', `${t('open')} →`))
            card.append(arte, texto)
            card.addEventListener('click', () => {
                moduloAtual = indice; pararVideo(); desenharLista()
                el('cards-modulos').querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === indice)))
                el('area-aluno').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
                const primeiro = el('aulas').querySelector('button'); primeiro?.focus({ preventScroll: true })
                if (modulo.aulas[0]) selecionarAula(modulo.aulas[0])
            })
            el('cards-modulos').append(card)
        })
        if (!visual.estrutura.length) el('cards-modulos').append(elemento('p', t('empty')))
        if (moduloAtual >= visual.estrutura.length) moduloAtual = 0
        desenharLista(); progresso()
    }
    async function selecionarAula(aula) {
        pararVideo(); const atual = selecao
        el('video-aviso').textContent = t('loading')
        try {
            await api(`${base}/sessao`, { method: 'POST' })
            if (atual !== selecao) return
            aulaAtual = aula; el('aula-titulo').textContent = aula.titulo; el('video-aviso').textContent = ''
            el('player-vazio').hidden = Boolean(aula.video)
            if (aula.video) { el('video').src = `${base}/midia/${aula.video}`; el('video').hidden = false }
            else el('video-aviso').textContent = t('missingVideo')
            if (aula.material) { el('material').href = `${base}/midia/${aula.material}`; el('material').hidden = false }
            el('concluida').checked = curso.concluidas.includes(aula.id); el('concluida').disabled = previa
            el('conclusao').hidden = false; progresso()
        } catch (e) { if (atual === selecao) aviso(e.chave || 'error') }
    }
    el('editor').addEventListener('input', mudar)
    el('adicionar-modulo').addEventListener('click', () => { rascunho.estrutura.push({ titulo: t('newModule'), aulas: [] }); mudar(); desenharEditor() })
    el('salvar').addEventListener('click', () => executar(async () => {
        lerFormulario(); aviso('saving')
        if (arquivoCapa) {
            if (arquivoCapa.size > 5 * 1024 * 1024) throw erro('tooLarge')
            const form = new FormData(); form.append('capa', arquivoCapa)
            const dados = await api('/produtos/capa', { method: 'POST', body: form })
            rascunho.capa = dados.capa; arquivoCapa = null; el('editar-capa').value = ''
            if (urlCapa) URL.revokeObjectURL(urlCapa); urlCapa = null
        }
        const dados = await api(base, { method: 'PUT', body: JSON.stringify(rascunho) })
        Object.assign(rascunho, dados); curso = structuredClone(rascunho); visual = structuredClone(curso)
        alterado = false; el('estado-edicao').textContent = ''; desenharAluno(); aviso('saved')
    }))
    el('concluida').addEventListener('change', async () => {
        if (previa || !aulaAtual) return
        const aula = aulaAtual, concluida = el('concluida').checked
        el('concluida').disabled = true
        try {
            await api(`${base}/progresso/${aula.id}`, { method: 'PUT', body: JSON.stringify({ concluida }) })
            curso.concluidas = curso.concluidas.filter(id => id !== aula.id)
            if (concluida) curso.concluidas.push(aula.id)
            if (rascunho) rascunho.concluidas = [...curso.concluidas]
            progresso()
        } catch (e) { if (aulaAtual === aula) el('concluida').checked = !concluida; aviso(e.chave || 'error') }
        finally { el('concluida').disabled = previa }
    })
    const renovar = setInterval(async () => {
        if (!aulaAtual) return
        if (localStorage.getItem('token') !== token) { pararVideo(); aviso('expired'); clearInterval(renovar); return }
        try { await api(`${base}/sessao`, { method: 'POST' }) } catch (e) { aviso(e.chave || 'error') }
    }, 10 * 60 * 1000)
    el('video').addEventListener('error', () => { el('video-aviso').textContent = t('videoError') })
    window.addEventListener('beforeunload', evento => { if (alterado || ocupado) { evento.preventDefault(); evento.returnValue = '' } })
    try {
        if (!id) throw erro('forbidden')
        curso = await api(base); visual = structuredClone(curso)
        desenharAluno(); el('visao-aluno').hidden = false
        if (curso.editor) {
            rascunho = structuredClone(curso)
            for (const chave of ['titulo', 'apresentacao', 'preco', 'comissao', 'cor']) el(`editar-${chave}`).value = rascunho[chave]
            el('editar-status').value = rascunho.status_produto
            el('barra-produtor').hidden = false; desenharEditor()
        }
        mensagem = ''; el('aviso').textContent = ''
    } catch (e) { aviso(e.chave || 'error') }
})
