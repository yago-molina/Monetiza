const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function exigir(condicao, mensagem, status = 400) {
    if (!condicao) throw Object.assign(new Error(mensagem), { status })
}
function texto(valor, max, obrigatorio = false) {
    exigir(typeof valor === 'string', 'Texto inválido.')
    const resultado = valor.trim()
    exigir(resultado.length <= max && (!obrigatorio || resultado.length > 0), `Informe um texto de até ${max} caracteres.`)
    return resultado
}
function capaValida(valor) {
    if (/^\/uploads\/capas\/[0-9a-f-]{36}\.webp$/i.test(valor)) return true
    try { return ['http:', 'https:'].includes(new URL(valor).protocol) } catch { return false }
}
function validarEstrutura(modulos, arquivos, publicar) {
    exigir(Array.isArray(modulos) && modulos.length <= 50, 'Use até 50 módulos.')
    const ids = new Set()
    let total = 0
    const resultado = modulos.map(modulo => {
        exigir(modulo && Array.isArray(modulo.aulas) && modulo.aulas.length <= 100, 'Módulo inválido.')
        const aulas = modulo.aulas.map(aula => {
            exigir(aula && UUID.test(aula.id) && !ids.has(aula.id), 'Identificador de aula inválido ou repetido.')
            ids.add(aula.id)
            total++
            const validarArquivo = (id, tipo) => {
                if (!id) return null
                exigir(UUID.test(id) && arquivos.some(a => a.id === id && a.tipo === tipo), 'Arquivo não pertence a este curso ou tem tipo incorreto.')
                return id
            }
            const video = validarArquivo(aula.video, 'video')
            exigir(!publicar || video, 'Todas as aulas precisam de vídeo antes da publicação.')
            return { id: aula.id, titulo: texto(aula.titulo, 150, true), video, material: validarArquivo(aula.material, 'material') }
        })
        exigir(!publicar || aulas.length > 0, 'Módulos publicados precisam de aulas.')
        return { titulo: texto(modulo.titulo, 150, true), aulas }
    })
    exigir(total <= 500 && (!publicar || total > 0), 'O curso precisa ter de 1 a 500 aulas para publicação.')
    return resultado
}
module.exports = { UUID, exigir, texto, capaValida, validarEstrutura }
