const multer = require('multer')
const path = require('path')
const fs = require('fs')

const pastaUpload = path.join(
    __dirname,
    '..',
    'public',
    'uploads',
    'contratos'
)

if (!fs.existsSync(pastaUpload)) {
    fs.mkdirSync(pastaUpload, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaUpload)
    },

    filename: (req, file, cb) => {
        const nomeSeguro = file.originalname
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9.\-_]/g, '')

        cb(
            null,
            `${Date.now()}-${Math.round(Math.random() * 1e9)}-${nomeSeguro}`
        )
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/pdf' &&
        path.extname(file.originalname).toLowerCase() === '.pdf'
    ) {
        return cb(null, true)
    }

    cb(new Error('Apenas arquivos PDF são permitidos'))
}

const uploadContrato = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

module.exports = uploadContrato