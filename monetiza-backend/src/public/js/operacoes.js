;(() => {
    const pendentes = new Map()
    const t = chave => window.i18n.t('operacoes.' + chave)
    async function enviar(url, opcoes) {
        const headers = new Headers(opcoes.headers)
        let usuario
        try {
            const token = (headers.get('Authorization') || '').split(' ')[1]
            const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
            usuario = JSON.parse(atob(payload)).id
            if (!Number.isSafeInteger(usuario) || usuario <= 0) throw Error()
        } catch { throw new Error(t('sessao')) }
        // O ID lido do token só separa o armazenamento local. O servidor valida o JWT.
        const bytes = new TextEncoder().encode(String(opcoes.body || ''))
        const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
            .map(byte => byte.toString(16).padStart(2, '0')).join('')
        const referencia = `monetiza:operacao:${usuario}:${url}:${hash}`
        if (pendentes.has(referencia)) return (await pendentes.get(referencia)).clone()
        let chave
        try {
            chave = sessionStorage.getItem(referencia)
            if (!/^[a-f0-9-]{36}$/i.test(chave || '')) {
                chave = crypto.randomUUID()
                sessionStorage.setItem(referencia, chave)
            }
        } catch { throw new Error(t('armazenamento')) }
        headers.set('Idempotency-Key', chave)
        const tarefa = (async () => {
            const resposta = await fetch(url, { ...opcoes, headers })
            // Ler o JSON antes de esquecer a chave: uma conexão truncada também é ambígua.
            const dados = await resposta.clone().json()
            const confirmado = resposta.ok && (dados.id || dados.venda?.id)
            if (confirmado || [400, 401, 403, 404, 409, 422].includes(resposta.status)) {
                try { sessionStorage.removeItem(referencia) } catch { /* Repetir a chave é seguro. */ }
            }
            return resposta
        })()
        pendentes.set(referencia, tarefa)
        try { return (await tarefa).clone() }
        finally { pendentes.delete(referencia) }
    }
    window.MonetizaOperacoes = { enviar }
})()
