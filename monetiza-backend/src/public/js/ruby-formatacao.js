(() => {
    function inline(elemento, texto) {
        const partes = texto.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/g)
        for (const parte of partes) {
            const tag = parte.startsWith('**') && parte.endsWith('**') ? 'strong'
                : parte.startsWith('`') && parte.endsWith('`') ? 'code' : null
            if (!tag) { elemento.appendChild(document.createTextNode(parte)); continue }
            const no = document.createElement(tag)
            no.textContent = parte.slice(tag === 'strong' ? 2 : 1, tag === 'strong' ? -2 : -1)
            elemento.appendChild(no)
        }
    }
    window.renderizarMensagemRuby = (elemento, texto) => {
        elemento.replaceChildren()
        elemento.classList.add('ruby-formatado')
        let lista = null, paragrafo = null
        for (const linha of texto.split(/\r?\n/)) {
            if (!linha.trim()) { lista = null; paragrafo = null; continue }
            const item = linha.match(/^\s*(?:([-*]) |(\d+)\. )(.+)$/)
            if (item) {
                const tag = item[2] ? 'ol' : 'ul'
                if (!lista || lista.tagName.toLowerCase() !== tag) {
                    lista = document.createElement(tag)
                    if (tag === 'ol') lista.start = Math.min(Number(item[2]), 999)
                    elemento.appendChild(lista)
                }
                const li = document.createElement('li')
                inline(li, item[3]); lista.appendChild(li); paragrafo = null
            } else {
                lista = null
                if (!paragrafo) { paragrafo = document.createElement('p'); elemento.appendChild(paragrafo) }
                else paragrafo.appendChild(document.createElement('br'))
                inline(paragrafo, linha.replace(/^#{1,6}\s+/, ''))
            }
        }
    }
})()
