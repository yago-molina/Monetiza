const express = require('express')

const autenticar =
    require('../middlewares/authMiddleware')

const {limitarUsoIa, impedirGeracoesSimultaneas, definirEtapaIa} = require('../middlewares/iaRateLimitMiddleware')

const {status, gerar, gerarCapitulo} = require('../controllers/produtoIaController')

const router = express.Router()

router.use(autenticar)
router.get('/status', status)
router.post('/gerar', impedirGeracoesSimultaneas, limitarUsoIa, gerar)
router.post('/gerar-capitulo', definirEtapaIa('capitulo'), impedirGeracoesSimultaneas, limitarUsoIa, gerarCapitulo)
const multer = require('multer')
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

const uploadPdf = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (_req, arquivo, callback) => {
        if (arquivo.mimetype !== 'application/pdf') {
            return callback(new Error('Envie um PDF válido.'))
        }

        callback(null, true)
    }
})

router.post('/arquivo', (req, res) => {
    uploadPdf.single('arquivo')(req, res, async (erroUpload) => {
        if (erroUpload) {
            return res.status(400).json({ erro: erroUpload.message })
        }

        if (!req.file || req.file.buffer.subarray(0, 5).toString() !== '%PDF-') {
            return res.status(400).json({ erro: 'PDF inválido.' })
        }

        try {
            const pasta = path.join(__dirname, '../public/uploads/produtos')
            await fs.mkdir(pasta, { recursive: true })

            const nome = `${req.usuario.id}-${crypto.randomUUID()}.pdf`
            await fs.writeFile(path.join(pasta, nome), req.file.buffer)

            return res.status(201).json({
                url: `${req.protocol}://${req.get('host')}/uploads/produtos/${nome}`
            })
        } catch (erro) {
            console.error('Erro ao salvar PDF:', erro)
            return res.status(500).json({ erro: 'Não foi possível salvar o PDF.' })
        }
    })
})

module.exports = router