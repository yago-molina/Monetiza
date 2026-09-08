const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const {
    buscarConfiguracoes,
    atualizarPerfil,
    atualizarPreferencias,
    listarPagamentos,
    adicionarPagamento,
    editarPagamento,
    excluirPagamento,
    alterarSenha,
    atualizarFotoPerfil
} = require('../controllers/configuracoesController')

const autenticar =
    require('../middlewares/authMiddleware')

    const pastaPerfis = path.join(
        __dirname,
        '..',
        'public',
        'uploads',
        'perfis'
    )

    if (!fs.existsSync(pastaPerfis)) {
        fs.mkdirSync(
            pastaPerfis,
            { recursive: true }
        )
    }

    const storagePerfil = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pastaPerfis)
        },

        filename: (req, file, cb) => {
            const extensoes = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/webp': '.webp'
            }

            const extensao =
                extensoes[file.mimetype]

            cb(
                null,
                `perfil-${req.usuario.id}-${Date.now()}${extensao}`
            )
        }
    })

    const uploadPerfil = multer({
        storage: storagePerfil,

        limits: {
            fileSize: 5 * 1024 * 1024
        },

        fileFilter: (req, file, cb) => {
            const tiposPermitidos = [
                'image/jpeg',
                'image/png',
                'image/webp'
            ]

            if (!tiposPermitidos.includes(file.mimetype)) {
                return cb(
                    new Error(
                        'Apenas imagens JPG, PNG ou WEBP são permitidas'
                    )
                )
            }

            cb(null, true)
        }
    })

router.use(autenticar)

router.get(
    '/',
    buscarConfiguracoes
)

router.put(
    '/perfil',
    atualizarPerfil
)

router.put(
    '/notificacoes',
    atualizarPreferencias
)

router.get(
    '/pagamentos',
    listarPagamentos
)

router.post(
    '/pagamentos',
    adicionarPagamento
)

router.put(
    '/pagamentos/:id',
    editarPagamento
)

router.delete(
    '/pagamentos/:id',
    excluirPagamento
)

router.put(
    '/seguranca',
    alterarSenha
)

router.put(
    '/foto',
    uploadPerfil.single('foto'),
    atualizarFotoPerfil
)

module.exports = router