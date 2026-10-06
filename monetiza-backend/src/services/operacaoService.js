const { createHash } = require('node:crypto')
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

class ErroOperacao extends Error {
    constructor(status, mensagem) { super(mensagem); this.status = status }
}
function serializar(valor) {
    if (Array.isArray(valor)) return '[' + valor.map(serializar).join(',') + ']'
    if (valor && typeof valor === 'object') return '{' + Object.keys(valor).sort()
        .map(chave => JSON.stringify(chave) + ':' + serializar(valor[chave])).join(',') + '}'
    return JSON.stringify(valor)
}
// A reserva e a alteração de negócio precisam compartilhar a mesma transação InnoDB.
async function iniciar(conexao, req, operacao) {
    const chave = req.get('Idempotency-Key')
    if (typeof chave !== 'string' || !UUID.test(chave)) {
        throw new ErroOperacao(400, 'Identificador da operação inválido. Atualize a página e tente novamente.')
    }
    const referencia = [req.usuario.id, operacao, chave.toLowerCase()]
    const hash = createHash('sha256').update(serializar(req.body)).digest('hex')
    // A chave única também bloqueia requisições concorrentes até commit/rollback.
    await conexao.query(`INSERT INTO operacoes_idempotentes (usuario_id, operacao, chave, corpo_hash)
        VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE chave = chave`, [...referencia, hash])
    const [[registro]] = await conexao.query(`SELECT corpo_hash, resposta_status, resposta_json
        FROM operacoes_idempotentes WHERE usuario_id = ? AND operacao = ? AND chave = ? FOR UPDATE`, referencia)
    if (registro.corpo_hash !== hash) {
        throw new ErroOperacao(409, 'Esta operação já foi usada com outros dados. Reabra o formulário.')
    }
    const repeticao = registro.resposta_status ? {
        status: registro.resposta_status,
        corpo: typeof registro.resposta_json === 'string' ? JSON.parse(registro.resposta_json) : registro.resposta_json
    } : null
    return { referencia, repeticao }
}
async function concluir(conexao, reserva, status, corpo) {
    await conexao.query(`UPDATE operacoes_idempotentes SET resposta_status = ?, resposta_json = ?
        WHERE usuario_id = ? AND operacao = ? AND chave = ?`, [status, JSON.stringify(corpo), ...reserva.referencia])
    await conexao.commit()
    return { status, corpo }
}
module.exports = { iniciar, concluir, ErroOperacao, serializar }
