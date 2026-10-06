const fs = require('fs/promises')
const { constants } = require('fs')
const path = require('path')
async function migrar() {
    const origem = path.join(__dirname, '../src/public/uploads/produtos')
    const destino = path.join(__dirname, '../src/private/uploads/produtos')
    await fs.mkdir(destino, { recursive: true })
    const nomes = await fs.readdir(origem).catch(erro => {
        if (erro.code === 'ENOENT') return []
        throw erro
    })
    let total = 0
    for (const nome of nomes) {
        if (!/^\d+-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.pdf$/i.test(nome)) {
            throw new Error(`Nome inesperado: ${nome}. Revise antes de continuar.`)
        }
        const de = path.join(origem, nome)
        const para = path.join(destino, nome)
        if (!(await fs.lstat(de)).isFile()) throw new Error('Origem não é arquivo regular.')
        try {
            await fs.copyFile(de, para, constants.COPYFILE_EXCL)
        } catch (erro) {
            if (erro.code !== 'EEXIST') throw erro
        }
        const [antes, depois] = await Promise.all([fs.readFile(de), fs.readFile(para)])
        if (!antes.equals(depois)) throw new Error(`Conteúdo divergente: ${nome}`)
        await fs.unlink(de)
        total++
    }
    console.log(`${total} PDF(s) migrado(s).`)
}
migrar().catch(erro => { console.error(erro.message); process.exitCode = 1 })
