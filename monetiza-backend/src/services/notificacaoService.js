// Colunas selecionadas exclusivamente nesta lista, nunca por entrada do usuário.
const preferencias = {
    Venda: 'notificar_vendas', Comissao: 'notificar_comissoes',
    Mensagem: 'notificar_mensagens', Contrato: 'notificar_contratos',
    Afiliacao: 'notificar_afiliacoes'
}
async function notificar(db, { usuarioId, tipo, titulo, mensagem, link }) {
    const coluna = preferencias[tipo]
    if (!coluna || !Number.isSafeInteger(Number(usuarioId)) || Number(usuarioId) <= 0) {
        throw new Error('Destinatário ou tipo de notificação inválido')
    }
    if (!/^\/(?!\/)/.test(link) || link.includes('\\')) throw new Error('Link interno inválido')
    // Sem preferência cadastrada, vale o padrão habilitado do schema.
    const [resultado] = await db.query(`INSERT INTO notificacoes
        (usuario_id, tipo, titulo, mensagem, link)
        SELECT ?, ?, ?, ?, ? FROM usuarios u
        LEFT JOIN preferencias_notificacao pn ON pn.usuario_id = u.id
        WHERE u.id = ? AND COALESCE(pn.${coluna}, 1) = 1`, [
        usuarioId, tipo, String(titulo).slice(0, 150), String(mensagem).slice(0, 500), link, usuarioId
    ])
    return resultado.affectedRows > 0
}
// Eventos sem transação própria não devem transformar uma ação já salva em erro.
async function notificarSemBloquear(db, dados) {
    try { return await notificar(db, dados) } catch (erro) {
        console.error('Notificação não gravada:', erro.code || erro.message)
        return false
    }
}
module.exports = { notificar, notificarSemBloquear }
