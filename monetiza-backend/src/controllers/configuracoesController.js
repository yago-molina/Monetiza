const db = require('../config/db')
const bcrypt = require('bcryptjs')

const buscarConfiguracoes = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [usuarios] = await db.query(
            `SELECT
                id,
                nome,
                email,
                bio,
                telefone,
                foto_perfil
            FROM usuarios
            WHERE id = ?`,
            [usuario_id]
        )

        if (usuarios.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            })
        }

        const [preferencias] = await db.query(
            `SELECT
                notificar_vendas,
                notificar_comissoes,
                notificar_mensagens,
                notificar_email,
                notificar_contratos,
                notificar_afiliacoes
            FROM preferencias_notificacao
            WHERE usuario_id = ?`,
            [usuario_id]
        )

        const [pagamentos] = await db.query(
            `SELECT
                tipo_chave_pix,
                chave_pix,
                nome_titular
            FROM dados_pagamento
            WHERE usuario_id = ?`,
            [usuario_id]
        )

        return res.json({
            usuario: usuarios[0],

            preferencias: preferencias[0] || {
                notificar_vendas: 1,
                notificar_comissoes: 1,
                notificar_mensagens: 1,
                notificar_email: 0,
                notificar_contratos: 1,
                notificar_afiliacoes: 1
            },

            pagamento: pagamentos[0] || null
        })
    } catch (erro) {
        console.error(
            'Erro ao carregar configurações:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao carregar configurações'
        })
    }
}

const atualizarPerfil = async (req, res) => {
    const usuario_id = req.usuario.id

    const {
        nome,
        bio,
        telefone,
        foto_perfil
    } = req.body

    if (!nome || !nome.trim()) {
        return res.status(400).json({
            erro: 'Informe seu nome'
        })
    }

    try {
        await db.query(
            `UPDATE usuarios
            SET
                nome = ?,
                bio = ?,
                telefone = ?,
                foto_perfil = ?
            WHERE id = ?`,
            [
                nome.trim(),
                bio?.trim() || null,
                telefone?.trim() || null,
                foto_perfil?.trim() || null,
                usuario_id
            ]
        )

        return res.json({
            mensagem: 'Perfil atualizado com sucesso!'
        })
    } catch (erro) {
        console.error(
            'Erro ao atualizar perfil:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao atualizar perfil'
        })
    }
}

const atualizarPreferencias = async (req, res) => {
    const usuario_id = req.usuario.id

    const {
        notificar_vendas,
        notificar_comissoes,
        notificar_mensagens,
        notificar_email,
        notificar_contratos,
        notificar_afiliacoes
    } = req.body

    try {
        await db.query(
            `INSERT INTO preferencias_notificacao (
                usuario_id,
                notificar_vendas,
                notificar_comissoes,
                notificar_mensagens,
                notificar_email,
                notificar_contratos,
                notificar_afiliacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                notificar_vendas =
                    VALUES(notificar_vendas),

                notificar_comissoes =
                    VALUES(notificar_comissoes),

                notificar_mensagens =
                    VALUES(notificar_mensagens),

                notificar_email =
                    VALUES(notificar_email),

                notificar_contratos =
                    VALUES(notificar_contratos),

                notificar_afiliacoes =
                    VALUES(notificar_afiliacoes)`,
            [
                usuario_id,
                Boolean(notificar_vendas),
                Boolean(notificar_comissoes),
                Boolean(notificar_mensagens),
                Boolean(notificar_email),
                Boolean(notificar_contratos),
                Boolean(notificar_afiliacoes)
            ]
        )

        return res.json({
            mensagem: 'Preferências salvas com sucesso!'
        })
    } catch (erro) {
        console.error(
            'Erro ao salvar preferências:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao salvar preferências'
        })
    }
}

const salvarPagamento = async (req, res) => {
    const usuario_id = req.usuario.id

    const {
        tipo_chave_pix,
        chave_pix,
        nome_titular
    } = req.body

    const tiposPermitidos = [
        'CPF',
        'CNPJ',
        'Email',
        'Telefone',
        'Aleatoria'
    ]

    if (!tiposPermitidos.includes(tipo_chave_pix)) {
        return res.status(400).json({
            erro: 'Tipo de chave PIX inválido'
        })
    }

    if (!chave_pix || !chave_pix.trim()) {
        return res.status(400).json({
            erro: 'Informe sua chave PIX'
        })
    }

    if (!nome_titular || !nome_titular.trim()) {
        return res.status(400).json({
            erro: 'Informe o nome do titular'
        })
    }

    try {
        await db.query(
            `INSERT INTO dados_pagamento (
                usuario_id,
                tipo_chave_pix,
                chave_pix,
                nome_titular
            )
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                tipo_chave_pix =
                    VALUES(tipo_chave_pix),

                chave_pix =
                    VALUES(chave_pix),

                nome_titular =
                    VALUES(nome_titular)`,
            [
                usuario_id,
                tipo_chave_pix,
                chave_pix.trim(),
                nome_titular.trim()
            ]
        )

        return res.json({
            mensagem: 'Dados de pagamento salvos com sucesso!'
        })
    } catch (erro) {
        console.error(
            'Erro ao salvar pagamento:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao salvar dados de pagamento'
        })
    }
}

const alterarSenha = async (req, res) => {
    const usuario_id = req.usuario.id

    const {
        senha_atual,
        nova_senha,
        confirmar_senha
    } = req.body

    if (!senha_atual || !nova_senha || !confirmar_senha) {
        return res.status(400).json({
            erro: 'Preencha todos os campos'
        })
    }

    if (nova_senha.length < 6) {
        return res.status(400).json({
            erro: 'A nova senha deve ter pelo menos 6 caracteres'
        })
    }

    if (nova_senha !== confirmar_senha) {
        return res.status(400).json({
            erro: 'A confirmação da senha não corresponde'
        })
    }

    if (senha_atual === nova_senha) {
        return res.status(400).json({
            erro: 'A nova senha deve ser diferente da senha atual'
        })
    }

    try {
        const [usuarios] = await db.query(
            `SELECT senha
            FROM usuarios
            WHERE id = ?
            LIMIT 1`,
            [usuario_id]
        )

        if (!usuarios.length) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            })
        }

        const senhaCorreta = await bcrypt.compare(
            senha_atual,
            usuarios[0].senha
        )

        if (!senhaCorreta) {
            return res.status(400).json({
                erro: 'Senha atual incorreta'
            })
        }

        const novaSenhaHash = await bcrypt.hash(
            nova_senha,
            10
        )

        await db.query(
            `UPDATE usuarios
            SET senha = ?
            WHERE id = ?`,
            [
                novaSenhaHash,
                usuario_id
            ]
        )

        return res.json({
            mensagem: 'Senha alterada com sucesso!'
        })
    } catch (erro) {
        console.error(
            'Erro ao alterar senha:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao alterar senha'
        })
    }
}

module.exports = {
    buscarConfiguracoes,
    atualizarPerfil,
    atualizarPreferencias,
    salvarPagamento,
    alterarSenha
}