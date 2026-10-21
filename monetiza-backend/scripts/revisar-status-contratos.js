// Execute com o servidor parado e backup do banco.
// Não apaga documentos nem aceites. Corrige apenas ativos sem os dois aceites.
require('dotenv').config()
const db = require('../src/config/db')
async function revisar() {
    const [resultado] = await db.query(`
        UPDATE contratos SET status_contrato = 'Pendente'
        WHERE status_contrato = 'Ativo'
        AND (aceito_produtor_em IS NULL OR aceito_afiliado_em IS NULL)
    `)
    console.log(`${resultado.affectedRows} contrato(s) voltaram para Pendente por falta de aceite.`)
}
revisar().catch(erro => {
    console.error('Falha ao revisar contratos:', erro.code || 'erro interno')
    process.exitCode = 1
}).finally(() => db.end())
