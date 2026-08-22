const {
    categoriasProduto
} = require('../schemas/produtoIaSchema')

function erroValidacao(mensagem) {
    const erro = new Error(mensagem)
    erro.codigo = 'PRODUTO_IA_INVALIDO'
    return erro
}

function objetoValido(valor) {
    return (
        valor !== null &&
        typeof valor === 'object' &&
        !Array.isArray(valor)
    )
}

function validarTexto(valor, campo, limite = 10000) {
    if (
        typeof valor !== 'string' ||
        valor.trim() === ''
    ) {
        throw erroValidacao(
            `A IA não preencheu corretamente o campo ${campo}.`
        )
    }

    if (valor.length > limite) {
        throw erroValidacao(
            `O campo ${campo} ultrapassou o limite permitido.`
        )
    }
}

function validarListaTextos(
    lista,
    campo,
    minimo = 0,
    maximo = 20
) {
    if (
        !Array.isArray(lista) ||
        lista.length < minimo ||
        lista.length > maximo
    ) {
        throw erroValidacao(
            `A lista ${campo} retornada pela IA é inválida.`
        )
    }

    lista.forEach((item, indice) => {
        validarTexto(
            item,
            `${campo}[${indice}]`,
            2000
        )
    })
}

function validarCadastro(cadastro) {
    if (!objetoValido(cadastro)) {
        throw erroValidacao(
            'A IA não retornou os dados de cadastro do produto.'
        )
    }

    validarTexto(cadastro.titulo, 'cadastro.titulo', 100)
    validarTexto(
        cadastro.descricao_curta,
        'cadastro.descricao_curta',
        2000
    )
    validarTexto(
        cadastro.descricao_completa,
        'cadastro.descricao_completa',
        15000
    )

    if (!categoriasProduto.includes(cadastro.categoria)) {
        throw erroValidacao(
            'A categoria gerada não existe no cadastro de produtos.'
        )
    }

    if (
        !Number.isFinite(cadastro.preco) ||
        cadastro.preco <= 0 ||
        cadastro.preco > 99999999.99
    ) {
        throw erroValidacao(
            'O preço sugerido pela IA é inválido.'
        )
    }

    if (
        !Number.isFinite(cadastro.comissao) ||
        cadastro.comissao < 0 ||
        cadastro.comissao > 100
    ) {
        throw erroValidacao(
            'A comissão sugerida pela IA é inválida.'
        )
    }
}

function validarDetalhesProduto(produto) {
    if (!objetoValido(produto)) {
        throw erroValidacao(
            'A IA não retornou os detalhes do produto.'
        )
    }

    const camposTexto = [
        'tipo_original',
        'subtitulo',
        'nicho',
        'subnicho',
        'publico_alvo',
        'problema_principal',
        'proposta_valor',
        'promessa_principal'
    ]

    camposTexto.forEach((campo) => {
        validarTexto(produto[campo], `produto.${campo}`, 3000)
    })

    validarListaTextos(produto.beneficios, 'produto.beneficios', 1, 8)
    validarListaTextos(produto.diferenciais, 'produto.diferenciais', 1, 8)
    validarListaTextos(produto.bonus, 'produto.bonus', 0, 8)
    validarListaTextos(produto.tags, 'produto.tags', 1, 15)

    if (
        !Array.isArray(produto.capitulos) ||
        produto.capitulos.length < 1 ||
        produto.capitulos.length > 20
    ) {
        throw erroValidacao(
            'A estrutura de capítulos retornada pela IA é inválida.'
        )
    }

    produto.capitulos.forEach((capitulo, indice) => {
        if (!objetoValido(capitulo)) {
            throw erroValidacao(`O capítulo ${indice + 1} é inválido.`)
        }

        if (
            !Number.isInteger(capitulo.numero) ||
            capitulo.numero !== indice + 1
        ) {
            throw erroValidacao(
                'A numeração dos capítulos retornada pela IA é inválida.'
            )
        }

        validarTexto(capitulo.titulo, 'capitulo.titulo', 300)
        validarTexto(capitulo.objetivo, 'capitulo.objetivo', 1500)
        validarTexto(capitulo.resumo, 'capitulo.resumo', 3000)
    })
}

function validarCriativos(criativos) {
    if (
        !Array.isArray(criativos) ||
        criativos.length < 1 ||
        criativos.length > 10
    ) {
        throw erroValidacao(
            'A IA deve retornar entre 1 e 10 ideias de criativos.'
        )
    }

    criativos.forEach((criativo, indice) => {
        if (!objetoValido(criativo)) {
            throw erroValidacao(`O criativo ${indice + 1} é inválido.`)
        }

        [
            'canal',
            'formato',
            'headline',
            'copy',
            'cta',
            'prompt_imagem'
        ].forEach((campo) => {
            validarTexto(
                criativo[campo],
                `criativos[${indice}].${campo}`,
                4000
            )
        })
    })
}

function validarProdutoGerado(produtoGerado) {
    if (!objetoValido(produtoGerado)) {
        throw erroValidacao(
            'A IA não retornou um produto estruturado.'
        )
    }

    if (produtoGerado.versao_schema !== '1.0') {
        throw erroValidacao(
            'A versão do produto gerado não é compatível.'
        )
    }

    validarCadastro(produtoGerado.cadastro)
    validarDetalhesProduto(produtoGerado.produto)
    validarCriativos(produtoGerado.criativos)

    return produtoGerado
}

module.exports = {
    validarProdutoGerado
}
