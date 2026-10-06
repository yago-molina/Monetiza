const crypto = require('crypto')

class ErroContrato extends Error {
    constructor(status, mensagem) {
        super(mensagem)
        this.status = status
    }
}

function versaoContrato(contrato) {
    // Só os termos do documento; aceitar não altera esta versão.
    return crypto.createHash('sha256').update(JSON.stringify([
        contrato.id, contrato.titulo, contrato.arquivo_pdf,
        contrato.data_inicio, contrato.data_fim, contrato.observacoes || null
    ])).digest('hex')
}

function inteiro(valor) {
    const numero = Number(valor)
    if (!Number.isSafeInteger(numero) || numero <= 0) {
        throw new ErroContrato(400, 'Identificador inválido.')
    }
    return numero
}

function validarDados(dados) {
    const dataValida = valor => {
        if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false
        const data = new Date(`${valor}T00:00:00Z`)
        return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor
    }
    if (typeof dados.titulo !== 'string' || !dados.titulo.trim() ||
        !dataValida(dados.data_inicio) || !dataValida(dados.data_fim) ||
        dados.data_fim < dados.data_inicio ||
        (dados.observacoes != null && typeof dados.observacoes !== 'string')) {
        throw new ErroContrato(400, 'Informe título e datas válidas; a data final não pode ser anterior à inicial.')
    }
}

function criarServicoContratos(db) {
    async function transacao(executar) {
        const conexao = await db.getConnection()
        let tentouCommit = false
        try {
            await conexao.beginTransaction()
            const resultado = await executar(conexao)
            tentouCommit = true
            await conexao.commit()
            return resultado
        } catch (erro) {
            try { await conexao.rollback() } catch {}
            // Se a conexão cair no commit, o resultado pode ser indeterminado.
            // Não apagar o PDF que talvez já esteja referenciado no banco.
            if (tentouCommit) erro.preservarUpload = true
            throw erro
        } finally {
            conexao.release()
        }
    }

    async function bloquear(conexao, id, usuario) {
        const [linhas] = await conexao.query(`
            SELECT c.*, p.usuario_id AS produtor_id, a.usuario_id AS afiliado_id
            FROM contratos c
            JOIN afiliacoes a ON a.id = c.afiliacao_id
            JOIN produtos p ON p.id = a.produto_id
            WHERE c.id = ? LIMIT 1 FOR UPDATE`, [inteiro(id)])
        const contrato = linhas[0]
        if (!contrato || ![Number(contrato.produtor_id), Number(contrato.afiliado_id)].includes(usuario)) {
            throw new ErroContrato(404, 'Contrato não encontrado para esta conta.')
        }
        return contrato
    }

    function exigirPendente(contrato) {
        if (contrato.status_contrato !== 'Pendente') {
            throw new ErroContrato(409, 'Este contrato não está pendente. Atualize a lista.')
        }
    }

    function conferirVersao(contrato, versao) {
        if (typeof versao !== 'string' || versao !== versaoContrato(contrato)) {
            throw new ErroContrato(409, 'O contrato mudou. Atualize a lista e revise o documento novamente.')
        }
    }

    async function criar(usuarioId, dados, arquivo) {
        const usuario = inteiro(usuarioId)
        const afiliacao = inteiro(dados.afiliacao_id)
        validarDados(dados)
        if (!arquivo) throw new ErroContrato(400, 'Selecione um arquivo PDF.')
        return transacao(async conexao => {
            // A afiliação serializa criações concorrentes do mesmo contrato.
            const [linhas] = await conexao.query(`
                SELECT a.id, a.usuario_id AS afiliado_id, p.usuario_id AS produtor_id
                FROM afiliacoes a JOIN produtos p ON p.id = a.produto_id
                WHERE a.id = ? AND a.status_afiliacao = 'Ativa'
                AND (a.usuario_id = ? OR p.usuario_id = ?)
                LIMIT 1 FOR UPDATE`, [afiliacao, usuario, usuario])
            if (!linhas.length) throw new ErroContrato(403, 'Afiliação inválida ou sem acesso.')
            const [existentes] = await conexao.query(`
                SELECT id FROM contratos WHERE afiliacao_id = ?
                AND status_contrato IN ('Pendente', 'Ativo') LIMIT 1 FOR UPDATE`, [afiliacao])
            if (existentes.length) throw new ErroContrato(409, 'Já existe um contrato pendente ou ativo para esta afiliação.')
            const [resultado] = await conexao.query(`
                INSERT INTO contratos (afiliacao_id, criado_por_id, titulo, arquivo_pdf,
                    data_inicio, data_fim, status_contrato, observacoes)
                VALUES (?, ?, ?, ?, ?, ?, 'Pendente', ?)`, [
                afiliacao, usuario, dados.titulo.trim(), arquivo,
                dados.data_inicio, dados.data_fim, dados.observacoes?.trim() || null
            ])
            return { mensagem: 'Contrato criado com sucesso!', id: resultado.insertId }
        })
    }

    async function atualizar(usuarioId, id, dados, arquivo) {
        const usuario = inteiro(usuarioId)
        validarDados(dados)
        return transacao(async conexao => {
            const contrato = await bloquear(conexao, id, usuario)
            if (Number(contrato.criado_por_id) !== usuario) {
                throw new ErroContrato(403, 'Apenas quem criou o contrato pode editá-lo.')
            }
            exigirPendente(contrato)
            if (contrato.aceito_produtor_em || contrato.aceito_afiliado_em) {
                throw new ErroContrato(409, 'O contrato já recebeu um aceite. Para mudar o conteúdo, cancele e crie outro contrato.')
            }
            conferirVersao(contrato, dados.versao)
            await conexao.query(`UPDATE contratos SET titulo = ?, arquivo_pdf = ?,
                data_inicio = ?, data_fim = ?, observacoes = ? WHERE id = ?`, [
                dados.titulo.trim(), arquivo || contrato.arquivo_pdf,
                dados.data_inicio, dados.data_fim, dados.observacoes?.trim() || null, contrato.id
            ])
            return { mensagem: 'Contrato atualizado com sucesso!' }
        })
    }

    async function atualizarStatus(usuarioId, id, status) {
        const usuario = inteiro(usuarioId)
        if (!['Cancelado', 'Encerrado'].includes(status)) {
            throw new ErroContrato(400, 'O contrato só fica ativo pelos dois aceites. Não é permitido reabri-lo manualmente.')
        }
        return transacao(async conexao => {
            const contrato = await bloquear(conexao, id, usuario)
            if (status === 'Cancelado' && Number(contrato.criado_por_id) !== usuario) {
                throw new ErroContrato(403, 'Apenas quem criou o contrato pode cancelá-lo.')
            }
            if (['Cancelado', 'Encerrado'].includes(contrato.status_contrato)) {
                if (contrato.status_contrato === status) return { mensagem: 'O contrato já está nesse status.' }
                throw new ErroContrato(409, 'Contratos finalizados não podem mudar de status.')
            }
            if (status === 'Encerrado' && contrato.status_contrato !== 'Ativo') {
                throw new ErroContrato(409, 'Somente um contrato ativo pode ser encerrado.')
            }
            await conexao.query('UPDATE contratos SET status_contrato = ? WHERE id = ?', [status, contrato.id])
            return { mensagem: 'Status do contrato atualizado com sucesso!' }
        })
    }

    async function aceitar(usuarioId, id, versao) {
        const usuario = inteiro(usuarioId)
        return transacao(async conexao => {
            const contrato = await bloquear(conexao, id, usuario)
            conferirVersao(contrato, versao)
            if (contrato.status_contrato === 'Ativo' && contrato.aceito_produtor_em && contrato.aceito_afiliado_em) {
                return { mensagem: 'O contrato já foi aceito pelas duas partes.' }
            }
            exigirPendente(contrato)
            const campo = Number(contrato.produtor_id) === usuario
                ? 'aceito_produtor_em' : 'aceito_afiliado_em'
            // O nome da coluna vem desta lista fixa, nunca do pedido do cliente.
            await conexao.query(`UPDATE contratos SET ${campo} = COALESCE(${campo}, CURRENT_TIMESTAMP)
                WHERE id = ?`, [contrato.id])
            await conexao.query(`UPDATE contratos SET status_contrato = 'Ativo'
                WHERE id = ? AND status_contrato = 'Pendente'
                AND aceito_produtor_em IS NOT NULL AND aceito_afiliado_em IS NOT NULL`, [contrato.id])
            return { mensagem: 'Aceite registrado com sucesso!' }
        })
    }

    return { criar, atualizar, atualizarStatus, aceitar }
}
module.exports = { criarServicoContratos, versaoContrato, ErroContrato }
