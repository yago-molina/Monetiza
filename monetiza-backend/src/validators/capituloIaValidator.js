function erroValidacao(mensagem) {
    const erro = new Error(mensagem)

    erro.codigo =
        'CAPITULO_IA_INVALIDO'

    return erro
}

function objetoValido(valor) {
    return (
        valor !== null &&
        typeof valor === 'object' &&
        !Array.isArray(valor)
    )
}

function validarTexto(
    valor,
    campo,
    limite = 20000
) {
    if (
        typeof valor !== 'string' ||
        valor.trim() === ''
    ) {
        throw erroValidacao(
            `O campo ${campo} do capítulo é inválido.`
        )
    }

    if (valor.length > limite) {
        throw erroValidacao(
            `O campo ${campo} ultrapassou o limite permitido.`
        )
    }
}

function validarCapituloGerado(
    capituloGerado,
    capituloEsperado
) {
    if (!objetoValido(capituloGerado)) {
        throw erroValidacao(
            'A IA não retornou um capítulo estruturado.'
        )
    }

    if (
        capituloGerado.versao_schema !==
        '1.0'
    ) {
        throw erroValidacao(
            'A versão do capítulo é incompatível.'
        )
    }

    if (
        !Number.isInteger(
            capituloGerado.numero
        ) ||
        capituloGerado.numero !==
            capituloEsperado.numero
    ) {
        throw erroValidacao(
            'O número do capítulo gerado é inválido.'
        )
    }

    validarTexto(
        capituloGerado.titulo,
        'titulo',
        300
    )

    validarTexto(
        capituloGerado.introducao,
        'introducao',
        6000
    )

    if (
        !Array.isArray(
            capituloGerado.secoes
        ) ||
        capituloGerado.secoes.length < 3 ||
        capituloGerado.secoes.length > 6
    ) {
        throw erroValidacao(
            'O capítulo deve possuir entre 3 e 6 seções.'
        )
    }

    capituloGerado.secoes.forEach(
        (secao, indice) => {
            if (!objetoValido(secao)) {
                throw erroValidacao(
                    `A seção ${indice + 1} é inválida.`
                )
            }

            validarTexto(
                secao.titulo,
                `secoes[${indice}].titulo`,
                300
            )

            validarTexto(
                secao.conteudo,
                `secoes[${indice}].conteudo`,
                15000
            )
        }
    )

    validarTexto(
        capituloGerado.atividade_pratica,
        'atividade_pratica',
        5000
    )

    if (
        !Array.isArray(
            capituloGerado.pontos_chave
        ) ||
        capituloGerado.pontos_chave.length < 3 ||
        capituloGerado.pontos_chave.length > 8
    ) {
        throw erroValidacao(
            'O capítulo deve possuir entre 3 e 8 pontos-chave.'
        )
    }

    capituloGerado.pontos_chave.forEach(
        (ponto, indice) => {
            validarTexto(
                ponto,
                `pontos_chave[${indice}]`,
                1000
            )
        }
    )

    validarTexto(
        capituloGerado.conclusao,
        'conclusao',
        5000
    )

    return capituloGerado
}

module.exports = {
    validarCapituloGerado
}