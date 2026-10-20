const db = require('../config/db')
const fs = require('fs')
const path = require('path')

const { criarServicoContratos, versaoContrato, ErroContrato } = require('../services/contratos/contratoService')
const servico = criarServicoContratos(db)

const pastaContratos = path.join(
    __dirname,
    '..',
    'private',
    'uploads',
    'contratos'
)

function obterNomeArquivo(caminhoArquivo) {
    if (typeof caminhoArquivo !== 'string') {
        return null
    }

    const nome = path.posix.basename(
        caminhoArquivo.replace(/\\/g, '/')
    )

    if (!/^[a-zA-Z0-9._-]+\.pdf$/i.test(nome)) {
        return null
    }

    return nome
}

function removerArquivo(caminhoArquivo) {
    const nome = obterNomeArquivo(caminhoArquivo)

    if (!nome) return

    const caminhoCompleto = path.join(
        pastaContratos,
        nome
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

        return res.json(contratos.map(contrato => ({ ...contrato, versao: versaoContrato(contrato) })))
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

        return res.json({ ...contratos[0], versao: versaoContrato(contratos[0]) })
    } catch (erro) {
        console.error('Erro ao buscar contrato:', erro)

        return res.status(500).json({
            erro: 'Erro interno ao buscar contrato'
        })
    }
}

function executarMutacao(acao, statusSucesso = 200) {
    return async (req, res) => {
        const arquivo = req.file ? `/uploads/contratos/${req.file.filename}` : null
        try {
            const resultado = await acao(req, arquivo)
            return res.status(statusSucesso).json(resultado)
        } catch (erro) {
            if (arquivo && !erro.preservarUpload) {
                try { removerArquivo(arquivo) } catch {
                    console.error('Não foi possível remover o upload rejeitado do contrato.')
                }
            }
            if (erro instanceof ErroContrato) {
                return res.status(erro.status).json({ erro: erro.message })
            }
            console.error('Falha ao alterar contrato:', erro.code || 'erro interno')
            return res.status(500).json({
                erro: 'Não foi possível concluir a operação. Atualize a lista antes de tentar novamente.'
            })
        }
    }
}

const criar = executarMutacao((req, arquivo) =>
    servico.criar(req.usuario.id, req.body, arquivo), 201)
const atualizar = executarMutacao((req, arquivo) =>
    servico.atualizar(req.usuario.id, req.params.id, req.body, arquivo))
const atualizarStatus = executarMutacao(req =>
    servico.atualizarStatus(req.usuario.id, req.params.id, req.body.status))
const aceitar = executarMutacao(req =>
    servico.aceitar(req.usuario.id, req.params.id, req.body.versao))

const baixarPdf = async (req, res) => {
    const contratoId = Number(req.params.id)
    const usuarioId = req.usuario.id

    if (
        !Number.isSafeInteger(contratoId) ||
        contratoId <= 0
    ) {
        return res.status(400).json({
            erro: 'ID do contrato inválido'
        })
    }

    try {
        const [contratos] = await db.query(
            `SELECT c.arquivo_pdf
             FROM contratos c
             INNER JOIN afiliacoes a
                 ON a.id = c.afiliacao_id
             INNER JOIN produtos p
                 ON p.id = a.produto_id
             WHERE c.id = ?
               AND (
                   p.usuario_id = ?
                   OR a.usuario_id = ?
               )
             LIMIT 1`,
            [contratoId, usuarioId, usuarioId]
        )

        if (!contratos.length) {
            return res.status(404).json({
                erro: 'Contrato não encontrado'
            })
        }

        const nome = obterNomeArquivo(
            contratos[0].arquivo_pdf
        )

        if (!nome) {
            return res.status(404).json({
                erro: 'PDF não encontrado'
            })
        }

        res.set({
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff'
        })

        return res.download(
            path.join(pastaContratos, nome),
            `contrato-${contratoId}.pdf`,
            erro => {
                if (!erro) return

                if (res.headersSent) {
                    res.destroy()
                    return
                }

                const naoEncontrado =
                    erro.code === 'ENOENT' ||
                    erro.status === 404

                res.status(
                    naoEncontrado ? 404 : 500
                ).json({
                    erro: naoEncontrado
                        ? 'PDF não encontrado'
                        : 'Não foi possível baixar o PDF'
                })
            }
        )
    } catch (erro) {
        console.error('Erro ao baixar contrato:', erro)

        return res.status(500).json({
            erro: 'Não foi possível baixar o PDF'
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
    aceitar,
    baixarPdf
}