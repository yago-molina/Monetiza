const db = require('../config/db')

const listar = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [notificacoes] = await db.query(
            `SELECT
                id,
                tipo,
                titulo,
                mensagem,
                link,
                lida,
                criado_em,
                lido_em
            FROM notificacoes
            WHERE usuario_id = ?
            ORDER BY criado_em DESC
            LIMIT 30`,
            [usuario_id]
        )

        return res.json(notificacoes)

    } catch (erro) {
        console.error(
            'Erro ao listar notificações:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao listar notificações'
        })
    }
}

const naoLidas = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [[resultado]] = await db.query(
            `SELECT COUNT(*) AS total
            FROM notificacoes
            WHERE usuario_id = ?
            AND lida = 0`,
            [usuario_id]
        )

        return res.json({
            total: Number(resultado.total || 0)
        })

    } catch (erro) {
        console.error(
            'Erro ao contar notificações:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao carregar notificações'
        })
    }
}

const marcarComoLida = async (req, res) => {
    const usuario_id = req.usuario.id
    const { id } = req.params

    try {
        const [resultado] = await db.query(
            `UPDATE notificacoes
            SET
                lida = 1,
                lido_em = CURRENT_TIMESTAMP
            WHERE id = ?
            AND usuario_id = ?`,
            [id, usuario_id]
        )

        if (!resultado.affectedRows) {
            return res.status(404).json({
                erro: 'Notificação não encontrada'
            })
        }

        return res.json({
            sucesso: true
        })

    } catch (erro) {
        console.error(
            'Erro ao marcar notificação como lida:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao atualizar notificação'
        })
    }
}

const marcarTodasComoLidas = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        await db.query(
            `UPDATE notificacoes
            SET
                lida = 1,
                lido_em = CURRENT_TIMESTAMP
            WHERE usuario_id = ?
            AND lida = 0`,
            [usuario_id]
        )

        return res.json({
            sucesso: true
        })

    } catch (erro) {
        console.error(
            'Erro ao marcar notificações como lidas:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao atualizar notificações'
        })
    }
}

module.exports = {
    listar,
    naoLidas,
    marcarComoLida,
    marcarTodasComoLidas
}