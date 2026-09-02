const db = require('../config/db')
const fs = require('fs')
const path = require('path')

const statusPermitidos = [
    'Pendente',
    'Ativo',
    'Encerrado',
    'Cancelado'
]

function removerArquivo(caminhoArquivo) {
    if (!caminhoArquivo) return

    const caminhoRelativo = caminhoArquivo.replace(/^\/+/, '')

    const caminhoCompleto = path.join(
        __dirname,
        '..',
        'public',
        caminhoRelativo
    )

    if (fs.existsSync(caminhoCompleto)) {
        fs.unlinkSync(caminhoCompleto)
    }
}

const listarAfiliacoes = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [afiliacoes] = await db.query(
            `SELECT
                a.id,
                a.produto_id,
                a.usuario_id AS afiliado_id,
                a.comissao,
                a.status_afiliacao,
                p.titulo AS produto,
                produtor.id AS produtor_id,
                produtor.nome AS produtor,
                afiliado.nome AS afiliado
            FROM afiliacoes a
            INNER JOIN produtos p
                ON p.id = a.produto_id
            INNER JOIN usuarios produtor
                ON produtor.id = p.usuario_id
            INNER JOIN usuarios afiliado
                ON afiliado.id = a.usuario_id
            WHERE a.status_afiliacao = 'Ativa'
            AND (
                p.usuario_id = ?
                OR a.usuario_id = ?
            )
            ORDER BY a.criado_em DESC`,
            [usuario_id, usuario_id]
        )

        return res.json(afiliacoes)
    } catch (erro) {
        console.error('Erro ao listar afiliações:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao carregar afiliações'
        })
    }
}

const listar = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [contratos] = await db.query(
            `SELECT
                c.id,
                c.afiliacao_id,
                c.criado_por_id,
                c.titulo,
                c.arquivo_pdf,
                c.data_inicio,
                c.data_fim,
                c.status_contrato,
                c.observacoes,
                c.aceito_produtor_em,
                c.aceito_afiliado_em,
                c.criado_em,
                c.atualizado_em,
                p.id AS produto_id,
                p.titulo AS produto,
                produtor.id AS produtor_id,
                produtor.nome AS produtor,
                afiliado.id AS afiliado_id,
                afiliado.nome AS afiliado
            FROM contratos c
            INNER JOIN afiliacoes a
                ON a.id = c.afiliacao_id
            INNER JOIN produtos p
                ON p.id = a.produto_id
            INNER JOIN usuarios produtor
                ON produtor.id = p.usuario_id
            INNER JOIN usuarios afiliado
                ON afiliado.id = a.usuario_id
            WHERE
                produtor.id = ?
                OR afiliado.id = ?
            ORDER BY c.criado_em DESC`,
            [usuario_id, usuario_id]
        )

        return res.json(contratos)
    } catch (erro) {
        console.error('Erro ao listar contratos:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao listar contratos'
        })
    }
}

const buscarPorId = async (req, res) => {
    const usuario_id = req.usuario.id
    const { id } = req.params

    if (Number.isNaN(Number(id))) {
        return res.status(400).json({
            erro: 'ID do contrato inválido'
        })
    }

    try {
        const [contratos] = await db.query(
            `SELECT
                c.*,
                p.id AS produto_id,
                p.titulo AS produto,
                produtor.id AS produtor_id,
                produtor.nome AS produtor,
                afiliado.id AS afiliado_id,
                afiliado.nome AS afiliado
            FROM contratos c
            INNER JOIN afiliacoes a
                ON a.id = c.afiliacao_id
            INNER JOIN produtos p
                ON p.id = a.produto_id
            INNER JOIN usuarios produtor
                ON produtor.id = p.usuario_id
            INNER JOIN usuarios afiliado
                ON afiliado.id = a.usuario_id
            WHERE c.id = ?
            AND (
                produtor.id = ?
                OR afiliado.id = ?
            )`,
            [id, usuario_id, usuario_id]
        )

        if (contratos.length === 0) {
            return res.status(404).json({
                erro: 'Contrato não encontrado'
            })
        }

        return res.json(contratos[0])
    } catch (erro) {
        console.error('Erro ao buscar contrato:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao buscar contrato'
        })
    }
}

const criar = async (req, res) => {
    const usuario_id = req.usuario.id

    const {
        afiliacao_id,
        titulo,
        data_inicio,
        data_fim,
        observacoes
    } = req.body

    if (
        !afiliacao_id ||
        !titulo?.trim() ||
        !data_inicio ||
        !data_fim
    ) {
        if (req.file) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)
        }

        return res.status(400).json({
            erro: 'Afiliação, título, arquivo PDF e datas são obrigatórios'
        })
    }

    if (!req.file) {
        return res.status(400).json({
            erro: 'Selecione um arquivo PDF'
        })
    }

    if (data_fim < data_inicio) {
        removerArquivo(`/uploads/contratos/${req.file.filename}`)

        return res.status(400).json({
            erro: 'A data final não pode ser anterior à data inicial'
        })
    }

    try {
        const [afiliacoes] = await db.query(
            `SELECT
                a.id,
                a.usuario_id AS afiliado_id,
                p.usuario_id AS produtor_id
            FROM afiliacoes a
            INNER JOIN produtos p
                ON p.id = a.produto_id
            WHERE a.id = ?
            AND a.status_afiliacao = 'Ativa'
            AND (
                a.usuario_id = ?
                OR p.usuario_id = ?
            )
            LIMIT 1`,
            [afiliacao_id, usuario_id, usuario_id]
        )

        if (afiliacoes.length === 0) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)

            return res.status(403).json({
                erro: 'Afiliação inválida ou sem acesso'
            })
        }

        const [existentes] = await db.query(
            `SELECT id
            FROM contratos
            WHERE afiliacao_id = ?
            AND status_contrato IN ('Pendente', 'Ativo')
            LIMIT 1`,
            [afiliacao_id]
        )

        if (existentes.length > 0) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)

            return res.status(409).json({
                erro: 'Já existe um contrato pendente ou ativo para esta afiliação'
            })
        }

        const caminhoPdf =
            `/uploads/contratos/${req.file.filename}`

        const [resultado] = await db.query(
            `INSERT INTO contratos (
                afiliacao_id,
                criado_por_id,
                titulo,
                arquivo_pdf,
                data_inicio,
                data_fim,
                status_contrato,
                observacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, 'Pendente', ?)`,
            [
                afiliacao_id,
                usuario_id,
                titulo.trim(),
                caminhoPdf,
                data_inicio,
                data_fim,
                observacoes?.trim() || null
            ]
        )

        return res.status(201).json({
            mensagem: 'Contrato criado com sucesso!',
            id: resultado.insertId
        })
    } catch (erro) {
        if (req.file) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)
        }

        console.error('Erro ao criar contrato:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao criar contrato'
        })
    }
}

const atualizar = async (req, res) => {
    const usuario_id = req.usuario.id
    const { id } = req.params

    const {
        titulo,
        data_inicio,
        data_fim,
        observacoes
    } = req.body

    if (Number.isNaN(Number(id))) {
        if (req.file) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)
        }

        return res.status(400).json({
            erro: 'ID do contrato inválido'
        })
    }

    if (
        !titulo?.trim() ||
        !data_inicio ||
        !data_fim
    ) {
        if (req.file) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)
        }

        return res.status(400).json({
            erro: 'Título e datas são obrigatórios'
        })
    }

    if (data_fim < data_inicio) {
        if (req.file) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)
        }

        return res.status(400).json({
            erro: 'A data final não pode ser anterior à data inicial'
        })
    }

    try {
        const [contratos] = await db.query(
            `SELECT
                id,
                criado_por_id,
                arquivo_pdf,
                status_contrato
            FROM contratos
            WHERE id = ?
            LIMIT 1`,
            [id]
        )

        if (contratos.length === 0) {
            if (req.file) {
                removerArquivo(`/uploads/contratos/${req.file.filename}`)
            }

            return res.status(404).json({
                erro: 'Contrato não encontrado'
            })
        }

        const contrato = contratos[0]

        if (
            Number(contrato.criado_por_id) !==
            Number(usuario_id)
        ) {
            if (req.file) {
                removerArquivo(`/uploads/contratos/${req.file.filename}`)
            }

            return res.status(403).json({
                erro: 'Apenas quem criou o contrato pode editá-lo'
            })
        }

        if (
            contrato.status_contrato === 'Encerrado' ||
            contrato.status_contrato === 'Cancelado'
        ) {
            if (req.file) {
                removerArquivo(`/uploads/contratos/${req.file.filename}`)
            }

            return res.status(400).json({
                erro: 'Este contrato não pode mais ser editado'
            })
        }

        let caminhoPdf = contrato.arquivo_pdf

        if (req.file) {
            caminhoPdf =
                `/uploads/contratos/${req.file.filename}`
        }

        await db.query(
            `UPDATE contratos
            SET
                titulo = ?,
                arquivo_pdf = ?,
                data_inicio = ?,
                data_fim = ?,
                observacoes = ?
            WHERE id = ?`,
            [
                titulo.trim(),
                caminhoPdf,
                data_inicio,
                data_fim,
                observacoes?.trim() || null,
                id
            ]
        )

        if (
            req.file &&
            contrato.arquivo_pdf &&
            contrato.arquivo_pdf !== caminhoPdf
        ) {
            removerArquivo(contrato.arquivo_pdf)
        }

        return res.json({
            mensagem: 'Contrato atualizado com sucesso!'
        })
    } catch (erro) {
        if (req.file) {
            removerArquivo(`/uploads/contratos/${req.file.filename}`)
        }

        console.error('Erro ao atualizar contrato:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao atualizar contrato'
        })
    }
}

const atualizarStatus = async (req, res) => {
    const usuario_id = req.usuario.id
    const { id } = req.params
    const { status } = req.body

    if (Number.isNaN(Number(id))) {
        return res.status(400).json({
            erro: 'ID do contrato inválido'
        })
    }

    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({
            erro: 'Status de contrato inválido'
        })
    }

    try {
        const [contratos] = await db.query(
            `SELECT
                c.id,
                c.criado_por_id,
                c.status_contrato,
                p.usuario_id AS produtor_id,
                a.usuario_id AS afiliado_id
            FROM contratos c
            INNER JOIN afiliacoes a
                ON a.id = c.afiliacao_id
            INNER JOIN produtos p
                ON p.id = a.produto_id
            WHERE c.id = ?
            LIMIT 1`,
            [id]
        )

        if (contratos.length === 0) {
            return res.status(404).json({
                erro: 'Contrato não encontrado'
            })
        }

        const contrato = contratos[0]

        const participa =
            Number(contrato.produtor_id) === Number(usuario_id) ||
            Number(contrato.afiliado_id) === Number(usuario_id)

        if (!participa) {
            return res.status(403).json({
                erro: 'Você não tem acesso a este contrato'
            })
        }

        if (
            status === 'Cancelado' &&
            Number(contrato.criado_por_id) !== Number(usuario_id)
        ) {
            return res.status(403).json({
                erro: 'Apenas quem criou o contrato pode cancelá-lo'
            })
        }

        await db.query(
            `UPDATE contratos
            SET status_contrato = ?
            WHERE id = ?`,
            [status, id]
        )

        return res.json({
            mensagem: 'Status do contrato atualizado com sucesso!'
        })
    } catch (erro) {
        console.error('Erro ao atualizar status:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao atualizar status do contrato'
        })
    }
}

const aceitar = async (req, res) => {
    const usuario_id = req.usuario.id
    const { id } = req.params

    if (Number.isNaN(Number(id))) {
        return res.status(400).json({
            erro: 'ID do contrato inválido'
        })
    }

    try {
        const [contratos] = await db.query(
            `SELECT
                c.id,
                c.status_contrato,
                c.aceito_produtor_em,
                c.aceito_afiliado_em,
                p.usuario_id AS produtor_id,
                a.usuario_id AS afiliado_id
            FROM contratos c
            INNER JOIN afiliacoes a
                ON a.id = c.afiliacao_id
            INNER JOIN produtos p
                ON p.id = a.produto_id
            WHERE c.id = ?
            LIMIT 1`,
            [id]
        )

        if (contratos.length === 0) {
            return res.status(404).json({
                erro: 'Contrato não encontrado'
            })
        }

        const contrato = contratos[0]

        if (
            contrato.status_contrato === 'Encerrado' ||
            contrato.status_contrato === 'Cancelado'
        ) {
            return res.status(400).json({
                erro: 'Este contrato não pode mais ser aceito'
            })
        }

        if (
            Number(contrato.produtor_id) === Number(usuario_id)
        ) {
            await db.query(
                `UPDATE contratos
                SET aceito_produtor_em =
                    COALESCE(
                        aceito_produtor_em,
                        CURRENT_TIMESTAMP
                    )
                WHERE id = ?`,
                [id]
            )
        } else if (
            Number(contrato.afiliado_id) === Number(usuario_id)
        ) {
            await db.query(
                `UPDATE contratos
                SET aceito_afiliado_em =
                    COALESCE(
                        aceito_afiliado_em,
                        CURRENT_TIMESTAMP
                    )
                WHERE id = ?`,
                [id]
            )
        } else {
            return res.status(403).json({
                erro: 'Você não participa deste contrato'
            })
        }

        const [[contratoAtualizado]] = await db.query(
            `SELECT
                aceito_produtor_em,
                aceito_afiliado_em
            FROM contratos
            WHERE id = ?`,
            [id]
        )

        if (
            contratoAtualizado.aceito_produtor_em &&
            contratoAtualizado.aceito_afiliado_em
        ) {
            await db.query(
                `UPDATE contratos
                SET status_contrato = 'Ativo'
                WHERE id = ?`,
                [id]
            )
        }

        return res.json({
            mensagem: 'Contrato aceito com sucesso!'
        })
    } catch (erro) {
        console.error('Erro ao aceitar contrato:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao aceitar contrato'
        })
    }
}

module.exports = {
    listarAfiliacoes,
    listar,
    buscarPorId,
    criar,
    atualizar,
    atualizarStatus,
    aceitar
}