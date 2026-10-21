const multer = require('multer')
const sharp = require('sharp')
const path = require('node:path')
const fs = require('node:fs/promises')
const { randomUUID } = require('node:crypto')

const pastaCapas = path.join(
    __dirname,
    '../public/uploads/capas'
)

const receberArquivo = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
        fields: 0
    }
}).single('capa')

function uploadCapa(req, res) {
    receberArquivo(req, res, async erro => {
        if (erro) {
            console.error('Falha no upload da capa:', erro.code, erro.message)
            return res.status(
                erro.code === 'LIMIT_FILE_SIZE' ? 413 : 400
            ).json({
                erro: erro.code === 'LIMIT_FILE_SIZE'
                    ? 'A imagem deve ter no máximo 5 MB.'
                    : 'Envie apenas uma imagem no campo capa.'
            })
        }

        if (!req.file) {
            return res.status(400).json({
                erro: 'Selecione uma imagem de capa.'
            })
        }

        let imagemFinal

        try {
            const imagem = sharp(req.file.buffer, {
                limitInputPixels: 25_000_000,
                failOn: 'warning'
            })

            const metadados = await imagem.metadata()

            if (
                !['jpeg', 'png', 'webp'].includes(metadados.format) ||
                (metadados.pages || 1) > 1
            ) {
                return res.status(400).json({
                    erro: 'Use uma imagem PNG, JPG ou WebP sem animação.'
                })
            }

            imagemFinal = await imagem
                .rotate()
                .resize({
                    width: 1600,
                    height: 1600,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 85 })
                .toBuffer()
        } catch {
            return res.status(400).json({
                erro: 'Imagem inválida, corrompida ou com resolução muito grande.'
            })
        }

        try {
            await fs.mkdir(pastaCapas, { recursive: true })

            const nome = `${randomUUID()}.webp`

            await fs.writeFile(
                path.join(pastaCapas, nome),
                imagemFinal,
                { flag: 'wx' }
            )

            return res.status(201).json({
                capa: `/uploads/capas/${nome}`
            })
        } catch (erroGravacao) {
            console.error('Erro ao salvar capa:', erroGravacao)

            return res.status(500).json({
                erro: 'Não foi possível salvar a imagem.'
            })
        }
    })
}

module.exports = { uploadCapa }