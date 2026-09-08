const db = require('../config/db')

function ordenarUsuarios(usuarioId, outroUsuarioId) {
    return {
        usuario1Id: Math.min(Number(usuarioId), Number(outroUsuarioId)),
        usuario2Id: Math.max(Number(usuarioId), Number(outroUsuarioId))
    }
}

async function buscarConversaExistente(usuarioId, outroUsuarioId) {
    const { usuario1Id, usuario2Id } = ordenarUsuarios(
        usuarioId,
        outroUsuarioId
    )

    const [conversas] = await db.query(`
        SELECT id
        FROM conversas
        WHERE usuario_1_id = ?
        AND usuario_2_id = ?
        LIMIT 1
    `, [usuario1Id, usuario2Id])

    return conversas[0] || null
}

async function verificarRelacao(usuarioId, outroUsuarioId) {
    const [compras] = await db.query(`
        SELECT 1
        FROM vendas v
        INNER JOIN venda_itens vi
            ON vi.venda_id = v.id
        WHERE v.status_venda = 'pago'
        AND (
            (v.comprador_id = ? AND vi.vendedor_id = ?)
            OR
            (v.comprador_id = ? AND vi.vendedor_id = ?)
        )
        LIMIT 1
    `, [
        usuarioId,
        outroUsuarioId,
        outroUsuarioId,
        usuarioId
    ])

    if (compras.length) return true

    const [afiliacoes] = await db.query(`
        SELECT 1
        FROM afiliacoes a
        INNER JOIN produtos p
            ON p.id = a.produto_id
        WHERE a.status_afiliacao IN ('Pendente', 'Ativa')
        AND (
            (a.usuario_id = ? AND p.usuario_id = ?)
            OR
            (a.usuario_id = ? AND p.usuario_id = ?)
        )
        LIMIT 1
    `, [
        usuarioId,
        outroUsuarioId,
        outroUsuarioId,
        usuarioId
    ])

    if (afiliacoes.length) return true

    const [contratos] = await db.query(`
        SELECT 1
        FROM contratos c
        INNER JOIN afiliacoes a
            ON a.id = c.afiliacao_id
        INNER JOIN produtos p
            ON p.id = a.produto_id
        WHERE c.status_contrato IN ('Pendente', 'Ativo')
        AND (
            (a.usuario_id = ? AND p.usuario_id = ?)
            OR
            (a.usuario_id = ? AND p.usuario_id = ?)
        )
        LIMIT 1
    `, [
        usuarioId,
        outroUsuarioId,
        outroUsuarioId,
        usuarioId
    ])

    return contratos.length > 0
}

const listarContatos = async (req, res) => {
    const usuarioId = Number(req.usuario.id)

    try {
        const [contatos] = await db.query(`
            SELECT
                u.id,
                u.nome,
                u.email,
                u.foto_perfil,
                GROUP_CONCAT(
                    DISTINCT rel.tipo
                    ORDER BY rel.tipo
                    SEPARATOR ', '
                ) AS relacoes
            FROM usuarios u
            INNER JOIN (
                SELECT
                    vi.vendedor_id AS contato_id,
                    'Compra' AS tipo
                FROM vendas v
                INNER JOIN venda_itens vi
                    ON vi.venda_id = v.id
                WHERE v.comprador_id = ?
                AND v.status_venda = 'pago'

                UNION

                SELECT
                    v.comprador_id AS contato_id,
                    'Venda' AS tipo
                FROM vendas v
                INNER JOIN venda_itens vi
                    ON vi.venda_id = v.id
                WHERE vi.vendedor_id = ?
                AND v.status_venda = 'pago'

                UNION

                SELECT
                    p.usuario_id AS contato_id,
                    'Afiliação' AS tipo
                FROM afiliacoes a
                INNER JOIN produtos p
                    ON p.id = a.produto_id
                WHERE a.usuario_id = ?
                AND a.status_afiliacao IN ('Pendente', 'Ativa')

                UNION

                SELECT
                    a.usuario_id AS contato_id,
                    'Afiliação' AS tipo
                FROM afiliacoes a
                INNER JOIN produtos p
                    ON p.id = a.produto_id
                WHERE p.usuario_id = ?
                AND a.status_afiliacao IN ('Pendente', 'Ativa')

                UNION

                SELECT
                    p.usuario_id AS contato_id,
                    'Contrato' AS tipo
                FROM contratos c
                INNER JOIN afiliacoes a
                    ON a.id = c.afiliacao_id
                INNER JOIN produtos p
                    ON p.id = a.produto_id
                WHERE a.usuario_id = ?
                AND c.status_contrato IN ('Pendente', 'Ativo')

                UNION

                SELECT
                    a.usuario_id AS contato_id,
                    'Contrato' AS tipo
                FROM contratos c
                INNER JOIN afiliacoes a
                    ON a.id = c.afiliacao_id
                INNER JOIN produtos p
                    ON p.id = a.produto_id
                WHERE p.usuario_id = ?
                AND c.status_contrato IN ('Pendente', 'Ativo')
            ) rel
                ON rel.contato_id = u.id

            WHERE u.id <> ?

            GROUP BY
                u.id,
                u.nome,
                u.email,
                u.foto_perfil

            ORDER BY u.nome ASC
        `, [
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId
        ])

        return res.json(contatos)
    } catch (erro) {
        console.error('Erro ao listar contatos:', erro)

        return res.status(500).json({
            erro: 'Erro ao listar contatos'
        })
    }
}

const listarConversas = async (req, res) => {
    const usuarioId = Number(req.usuario.id)

    try {
        const [conversas] = await db.query(`
            SELECT
                c.id,
                c.usuario_1_id,
                c.usuario_2_id,
                c.criado_em,
                c.atualizado_em,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.id
                    ELSE u1.id
                END AS outro_usuario_id,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.nome
                    ELSE u1.nome
                END AS outro_usuario_nome,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.email
                    ELSE u1.email
                END AS outro_usuario_email,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.foto_perfil
                    ELSE u1.foto_perfil
                END AS outro_usuario_foto,

                (
                    SELECT m.conteudo
                    FROM mensagens m
                    WHERE m.conversa_id = c.id
                    ORDER BY
                        m.enviado_em DESC,
                        m.id DESC
                    LIMIT 1
                ) AS ultima_mensagem,

                (
                    SELECT m.enviado_em
                    FROM mensagens m
                    WHERE m.conversa_id = c.id
                    ORDER BY
                        m.enviado_em DESC,
                        m.id DESC
                    LIMIT 1
                ) AS ultima_mensagem_em,

                (
                    SELECT COUNT(*)
                    FROM mensagens m
                    WHERE m.conversa_id = c.id
                    AND m.remetente_id <> ?
                    AND m.lido_em IS NULL
                ) AS nao_lidas

            FROM conversas c

            INNER JOIN usuarios u1
                ON u1.id = c.usuario_1_id

            INNER JOIN usuarios u2
                ON u2.id = c.usuario_2_id

            WHERE
                c.usuario_1_id = ?
                OR c.usuario_2_id = ?

            ORDER BY COALESCE(
                (
                    SELECT MAX(m.enviado_em)
                    FROM mensagens m
                    WHERE m.conversa_id = c.id
                ),
                c.atualizado_em
            ) DESC
        `, [
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId
        ])

        return res.json(conversas)
    } catch (erro) {
        console.error('Erro ao listar conversas:', erro)

        return res.status(500).json({
            erro: 'Erro ao listar conversas'
        })
    }
}

const criarConversa = async (req, res) => {
    const usuarioId = Number(req.usuario.id)
    const outroUsuarioId = Number(req.body.usuario_id)

    if (!outroUsuarioId) {
        return res.status(400).json({
            erro: 'Informe o usuário'
        })
    }

    if (usuarioId === outroUsuarioId) {
        return res.status(400).json({
            erro: 'Você não pode iniciar uma conversa consigo mesmo'
        })
    }

    try {
        const [usuarios] = await db.query(`
            SELECT id
            FROM usuarios
            WHERE id = ?
            LIMIT 1
        `, [outroUsuarioId])

        if (!usuarios.length) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            })
        }

        const conversaExistente = await buscarConversaExistente(
            usuarioId,
            outroUsuarioId
        )

        if (conversaExistente) {
            return res.json({
                mensagem: 'Conversa já existente',
                conversa_id: conversaExistente.id
            })
        }

        const podeConversar = await verificarRelacao(
            usuarioId,
            outroUsuarioId
        )

        if (!podeConversar) {
            return res.status(403).json({
                erro: 'Você só pode iniciar conversas com usuários relacionados às suas compras, vendas, afiliações ou contratos'
            })
        }

        const { usuario1Id, usuario2Id } = ordenarUsuarios(
            usuarioId,
            outroUsuarioId
        )

        const [resultado] = await db.query(`
            INSERT INTO conversas (
                usuario_1_id,
                usuario_2_id
            )
            VALUES (?, ?)
        `, [
            usuario1Id,
            usuario2Id
        ])

        return res.status(201).json({
            mensagem: 'Conversa criada com sucesso',
            conversa_id: resultado.insertId
        })
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            try {
                const conversa = await buscarConversaExistente(
                    usuarioId,
                    outroUsuarioId
                )

                if (conversa) {
                    return res.json({
                        mensagem: 'Conversa já existente',
                        conversa_id: conversa.id
                    })
                }
            } catch (erroBusca) {
                console.error(
                    'Erro ao buscar conversa existente:',
                    erroBusca
                )
            }
        }

        console.error('Erro ao criar conversa:', erro)

        return res.status(500).json({
            erro: 'Erro ao criar conversa'
        })
    }
}

const iniciarConversaProduto = async (req, res) => {
    const usuarioId = Number(req.usuario.id)
    const produtoId = Number(req.body.produto_id)

    if (!produtoId) {
        return res.status(400).json({
            erro: 'Produto inválido'
        })
    }

    try {
        const [produtos] = await db.query(`
            SELECT
                p.id,
                p.usuario_id AS vendedor_id,
                p.titulo
            FROM produtos p
            WHERE p.id = ?
            AND p.status_produto = 'Ativo'
            AND p.excluido_em IS NULL
            LIMIT 1
        `, [produtoId])

        if (!produtos.length) {
            return res.status(404).json({
                erro: 'Produto não encontrado'
            })
        }

        const produto = produtos[0]
        const vendedorId = Number(produto.vendedor_id)

        if (vendedorId === usuarioId) {
            return res.status(400).json({
                erro: 'Você é o vendedor deste produto'
            })
        }

        const conversaExistente = await buscarConversaExistente(
            usuarioId,
            vendedorId
        )

        if (conversaExistente) {
            return res.json({
                mensagem: 'Conversa já existente',
                conversa_id: conversaExistente.id
            })
        }

        const { usuario1Id, usuario2Id } = ordenarUsuarios(
            usuarioId,
            vendedorId
        )

        const [resultado] = await db.query(`
            INSERT INTO conversas (
                usuario_1_id,
                usuario_2_id
            )
            VALUES (?, ?)
        `, [
            usuario1Id,
            usuario2Id
        ])

        return res.status(201).json({
            mensagem: 'Conversa com o vendedor criada',
            conversa_id: resultado.insertId
        })
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            try {
                const [produtos] = await db.query(`
                    SELECT usuario_id
                    FROM produtos
                    WHERE id = ?
                    LIMIT 1
                `, [produtoId])

                if (produtos.length) {
                    const conversa = await buscarConversaExistente(
                        usuarioId,
                        produtos[0].usuario_id
                    )

                    if (conversa) {
                        return res.json({
                            mensagem: 'Conversa já existente',
                            conversa_id: conversa.id
                        })
                    }
                }
            } catch (erroBusca) {
                console.error(
                    'Erro ao buscar conversa existente:',
                    erroBusca
                )
            }
        }

        console.error(
            'Erro ao iniciar conversa pelo produto:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro ao iniciar conversa com o vendedor'
        })
    }
}

const listarMensagens = async (req, res) => {
    const usuarioId = Number(req.usuario.id)
    const conversaId = Number(req.params.id)

    if (!conversaId) {
        return res.status(400).json({
            erro: 'Conversa inválida'
        })
    }

    try {
        const [conversas] = await db.query(`
            SELECT
                c.id,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.id
                    ELSE u1.id
                END AS outro_usuario_id,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.nome
                    ELSE u1.nome
                END AS outro_usuario_nome,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.email
                    ELSE u1.email
                END AS outro_usuario_email,

                CASE
                    WHEN c.usuario_1_id = ?
                    THEN u2.foto_perfil
                    ELSE u1.foto_perfil
                END AS outro_usuario_foto

            FROM conversas c

            INNER JOIN usuarios u1
                ON u1.id = c.usuario_1_id

            INNER JOIN usuarios u2
                ON u2.id = c.usuario_2_id

            WHERE c.id = ?
            AND (
                c.usuario_1_id = ?
                OR c.usuario_2_id = ?
            )

            LIMIT 1
        `, [
            usuarioId,
            usuarioId,
            usuarioId,
            usuarioId,
            conversaId,
            usuarioId,
            usuarioId
        ])

        if (!conversas.length) {
            return res.status(404).json({
                erro: 'Conversa não encontrada'
            })
        }

        const [mensagens] = await db.query(`
            SELECT
                m.id,
                m.conversa_id,
                m.remetente_id,
                m.conteudo,
                m.enviado_em,
                m.lido_em,
                u.nome AS remetente_nome
            FROM mensagens m

            INNER JOIN usuarios u
                ON u.id = m.remetente_id

            WHERE m.conversa_id = ?

            ORDER BY
                m.enviado_em ASC,
                m.id ASC
        `, [conversaId])

        return res.json({
            conversa: conversas[0],
            mensagens
        })
    } catch (erro) {
        console.error('Erro ao listar mensagens:', erro)

        return res.status(500).json({
            erro: 'Erro ao listar mensagens'
        })
    }
}

const enviarMensagem = async (req, res) => {
    const usuarioId = Number(req.usuario.id)
    const conversaId = Number(req.params.id)
    const conteudo = String(req.body.conteudo || '').trim()

    if (!conversaId) {
        return res.status(400).json({
            erro: 'Conversa inválida'
        })
    }

    if (!conteudo) {
        return res.status(400).json({
            erro: 'Digite uma mensagem'
        })
    }

    if (conteudo.length > 2000) {
        return res.status(400).json({
            erro: 'A mensagem deve ter no máximo 2000 caracteres'
        })
    }

    try {
        const [conversas] = await db.query(`
            SELECT id
            FROM conversas
            WHERE id = ?
            AND (
                usuario_1_id = ?
                OR usuario_2_id = ?
            )
            LIMIT 1
        `, [
            conversaId,
            usuarioId,
            usuarioId
        ])

        if (!conversas.length) {
            return res.status(404).json({
                erro: 'Conversa não encontrada'
            })
        }

        const [resultado] = await db.query(`
            INSERT INTO mensagens (
                conversa_id,
                remetente_id,
                conteudo
            )
            VALUES (?, ?, ?)
        `, [
            conversaId,
            usuarioId,
            conteudo
        ])

        await db.query(`
            UPDATE conversas
            SET atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [conversaId])

        const [mensagens] = await db.query(`
            SELECT
                m.id,
                m.conversa_id,
                m.remetente_id,
                m.conteudo,
                m.enviado_em,
                m.lido_em,
                u.nome AS remetente_nome
            FROM mensagens m

            INNER JOIN usuarios u
                ON u.id = m.remetente_id

            WHERE m.id = ?
            LIMIT 1
        `, [resultado.insertId])

        return res.status(201).json({
            mensagem: 'Mensagem enviada',
            dados: mensagens[0]
        })
    } catch (erro) {
        console.error('Erro ao enviar mensagem:', erro)

        return res.status(500).json({
            erro: 'Erro ao enviar mensagem'
        })
    }
}

const marcarComoLidas = async (req, res) => {
    const usuarioId = Number(req.usuario.id)
    const conversaId = Number(req.params.id)

    if (!conversaId) {
        return res.status(400).json({
            erro: 'Conversa inválida'
        })
    }

    try {
        const [conversas] = await db.query(`
            SELECT id
            FROM conversas
            WHERE id = ?
            AND (
                usuario_1_id = ?
                OR usuario_2_id = ?
            )
            LIMIT 1
        `, [
            conversaId,
            usuarioId,
            usuarioId
        ])

        if (!conversas.length) {
            return res.status(404).json({
                erro: 'Conversa não encontrada'
            })
        }

        await db.query(`
            UPDATE mensagens
            SET lido_em = CURRENT_TIMESTAMP
            WHERE conversa_id = ?
            AND remetente_id <> ?
            AND lido_em IS NULL
        `, [
            conversaId,
            usuarioId
        ])

        return res.json({
            mensagem: 'Mensagens marcadas como lidas'
        })
    } catch (erro) {
        console.error(
            'Erro ao marcar mensagens como lidas:',
            erro
        )

        return res.status(500).json({
            erro: 'Erro ao marcar mensagens como lidas'
        })
    }
}

module.exports = {
    listarContatos,
    listarConversas,
    criarConversa,
    iniciarConversaProduto,
    listarMensagens,
    enviarMensagem,
    marcarComoLidas
}