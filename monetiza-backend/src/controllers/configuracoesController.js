const db = require('../config/db')
const bcrypt = require('bcryptjs')

const tiposPixPermitidos = [
    'CPF',
    'CNPJ',
    'Email',
    'Telefone',
    'Aleatoria'
]

function prepararPagamento(tipo_chave_pix, chave_pix, nome_titular) {
    if (!tiposPixPermitidos.includes(tipo_chave_pix)) {
        return {
            erro: 'Tipo de chave PIX inválido'
        }
    }

    if (!chave_pix || !chave_pix.trim()) {
        return {
            erro: 'Informe sua chave PIX'
        }
    }

    if (!nome_titular || !nome_titular.trim()) {
        return {
            erro: 'Informe o nome do titular'
        }
    }

    let chavePixSalva = chave_pix.trim()

    if (
        tipo_chave_pix === 'CPF' ||
        tipo_chave_pix === 'CNPJ' ||
        tipo_chave_pix === 'Telefone'
    ) {
        chavePixSalva =
            chavePixSalva.replace(/\D/g, '')
    }

    if (
        tipo_chave_pix === 'CPF' &&
        chavePixSalva.length !== 11
    ) {
        return {
            erro: 'CPF deve ter 11 dígitos'
        }
    }

    if (
        tipo_chave_pix === 'CNPJ' &&
        chavePixSalva.length !== 14
    ) {
        return {
            erro: 'CNPJ deve ter 14 dígitos'
        }
    }

    if (
        tipo_chave_pix === 'Telefone' &&
        chavePixSalva.length !== 10 &&
        chavePixSalva.length !== 11
    ) {
        return {
            erro: 'Informe um telefone válido'
        }
    }

    if (tipo_chave_pix === 'Email') {
        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailValido.test(chavePixSalva)) {
            return {
                erro: 'Informe um email válido'
            }
        }
    }

    return {
        chavePixSalva,
        nomeTitularSalvo: nome_titular.trim()
    }
}

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
                id,
                tipo_chave_pix,
                chave_pix,
                nome_titular,
                criado_em,
                atualizado_em
            FROM dados_pagamento
            WHERE usuario_id = ?
            ORDER BY criado_em DESC`,
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

            pagamentos,

            pagamento:
                pagamentos.length > 0
                    ? pagamentos[0]
                    : null
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
        telefone
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
                telefone = ?
            WHERE id = ?`,
            [
                nome.trim(),
                bio?.trim() || null,
                telefone?.trim() || null,
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

const listarPagamentos = async (req, res) => {
    const usuario_id = req.usuario.id

    try {
        const [pagamentos] = await db.query(
            `SELECT
                id,
                tipo_chave_pix,
                chave_pix,
                nome_titular,
                criado_em,
                atualizado_em
            FROM dados_pagamento
            WHERE usuario_id = ?
            ORDER BY criado_em DESC`,
            [usuario_id]
        )

        return res.json({
            pagamentos
        })
    } catch (erro) {
        console.error(
            'Erro ao listar pagamentos:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao listar pagamentos'
        })
    }
}

const adicionarPagamento = async (req, res) => {
    const usuario_id = req.usuario.id

    const {
        tipo_chave_pix,
        chave_pix,
        nome_titular
    } = req.body

    const pagamento = prepararPagamento(
        tipo_chave_pix,
        chave_pix,
        nome_titular
    )

    if (pagamento.erro) {
        return res.status(400).json({
            erro: pagamento.erro
        })
    }

    try {
        const [existentes] = await db.query(
            `SELECT id
            FROM dados_pagamento
            WHERE usuario_id = ?
            AND tipo_chave_pix = ?
            AND chave_pix = ?
            LIMIT 1`,
            [
                usuario_id,
                tipo_chave_pix,
                pagamento.chavePixSalva
            ]
        )

        if (existentes.length > 0) {
            return res.status(400).json({
                erro: 'Esta chave PIX já está cadastrada'
            })
        }

        const [resultado] = await db.query(
            `INSERT INTO dados_pagamento (
                usuario_id,
                tipo_chave_pix,
                chave_pix,
                nome_titular
            )
            VALUES (?, ?, ?, ?)`,
            [
                usuario_id,
                tipo_chave_pix,
                pagamento.chavePixSalva,
                pagamento.nomeTitularSalvo
            ]
        )

        return res.status(201).json({
            mensagem: 'Forma de pagamento adicionada com sucesso!',
            pagamento_id: resultado.insertId
        })
    } catch (erro) {
        console.error(
            'Erro ao adicionar pagamento:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao adicionar pagamento'
        })
    }
}

const editarPagamento = async (req, res) => {
    const usuario_id = req.usuario.id
    const pagamento_id = Number(req.params.id)

    if (!pagamento_id) {
        return res.status(400).json({
            erro: 'Pagamento inválido'
        })
    }

    const {
        tipo_chave_pix,
        chave_pix,
        nome_titular
    } = req.body

    const pagamento = prepararPagamento(
        tipo_chave_pix,
        chave_pix,
        nome_titular
    )

    if (pagamento.erro) {
        return res.status(400).json({
            erro: pagamento.erro
        })
    }

    try {
        const [existente] = await db.query(
            `SELECT id
            FROM dados_pagamento
            WHERE id = ?
            AND usuario_id = ?
            LIMIT 1`,
            [
                pagamento_id,
                usuario_id
            ]
        )

        if (existente.length === 0) {
            return res.status(404).json({
                erro: 'Forma de pagamento não encontrada'
            })
        }

        const [duplicados] = await db.query(
            `SELECT id
            FROM dados_pagamento
            WHERE usuario_id = ?
            AND tipo_chave_pix = ?
            AND chave_pix = ?
            AND id <> ?
            LIMIT 1`,
            [
                usuario_id,
                tipo_chave_pix,
                pagamento.chavePixSalva,
                pagamento_id
            ]
        )

        if (duplicados.length > 0) {
            return res.status(400).json({
                erro: 'Esta chave PIX já está cadastrada'
            })
        }

        await db.query(
            `UPDATE dados_pagamento
            SET
                tipo_chave_pix = ?,
                chave_pix = ?,
                nome_titular = ?
            WHERE id = ?
            AND usuario_id = ?`,
            [
                tipo_chave_pix,
                pagamento.chavePixSalva,
                pagamento.nomeTitularSalvo,
                pagamento_id,
                usuario_id
            ]
        )

        return res.json({
            mensagem: 'Forma de pagamento atualizada com sucesso!'
        })
    } catch (erro) {
        console.error(
            'Erro ao editar pagamento:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao editar pagamento'
        })
    }
}

const excluirPagamento = async (req, res) => {
    const usuario_id = req.usuario.id
    const pagamento_id = Number(req.params.id)

    if (!pagamento_id) {
        return res.status(400).json({
            erro: 'Pagamento inválido'
        })
    }

    try {
        const [resultado] = await db.query(
            `DELETE FROM dados_pagamento
            WHERE id = ?
            AND usuario_id = ?`,
            [
                pagamento_id,
                usuario_id
            ]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Forma de pagamento não encontrada'
            })
        }

        return res.json({
            mensagem: 'Forma de pagamento excluída com sucesso!'
        })
    } catch (erro) {
        console.error(
            'Erro ao excluir pagamento:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao excluir pagamento'
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

const atualizarFotoPerfil = async (req, res) => {
    const usuario_id = req.usuario.id

    if (!req.file) {
        return res.status(400).json({
            erro: 'Selecione uma imagem'
        })
    }

    const foto_perfil =
        `/uploads/perfis/${req.file.filename}`

    try {
        const [usuarios] = await db.query(
            `SELECT foto_perfil
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

        await db.query(
            `UPDATE usuarios
            SET foto_perfil = ?
            WHERE id = ?`,
            [
                foto_perfil,
                usuario_id
            ]
        )

        return res.json({
            mensagem: 'Foto de perfil atualizada com sucesso!',
            foto_perfil
        })
    } catch (erro) {
        console.error(
            'Erro ao atualizar foto de perfil:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro interno ao atualizar foto de perfil'
        })
    }
}

module.exports = {
    buscarConfiguracoes,
    atualizarPerfil,
    atualizarPreferencias,
    listarPagamentos,
    adicionarPagamento,
    editarPagamento,
    excluirPagamento,
    alterarSenha,
    atualizarFotoPerfil
}