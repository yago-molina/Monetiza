require('dotenv').config()
const { migrar } = require('./scripts/migrar-pdfs')

async function iniciar() {
    await migrar()
    const app = require('./src/app')
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
}
iniciar().catch(erro => {
    console.error('Servidor não iniciado: confira a migração dos PDFs.', erro.message)
    process.exitCode = 1
})
