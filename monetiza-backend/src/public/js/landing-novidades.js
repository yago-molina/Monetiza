document.addEventListener('DOMContentLoaded', () => {
    const carrossel = document.getElementById('novidades-carrossel')
    const slides = document.getElementById('novidades-slides')

    if (!carrossel || !slides) return

    const idiomaAtual = String(
        window.i18n?.obterIdiomaAtual?.() ||
        document.documentElement.lang ||
        'pt-BR'
    ).toLowerCase()

    const idioma = idiomaAtual.startsWith('en')
        ? 'en'
        : idiomaAtual.startsWith('es')
            ? 'es'
            : 'pt-BR'

    const conteudos = {
        'pt-BR': {
            titulo: 'Novidades da Monetiza',
            anterior: 'Novidade anterior',
            proximo: 'Próxima novidade',
            cards: [
                {
                    tipo: 'Explore a plataforma',
                    titulo: 'Transforme sua ideia em um produto',
                    descricao:
                        'Planeje e crie seu e-book com a ajuda da IA da Monetiza.',
                    botao: 'Criar com IA',
                    destino: '/ia-produtos',
                    icone: 'fa-wand-magic-sparkles'
                },
                {
                    tipo: 'Dica rápida',
                    titulo: 'Seu próximo produto começa aqui',
                    descricao:
                        'Cadastre seu produto, escolha uma capa e prepare sua publicação na vitrine.',
                    botao: 'Gerenciar produtos',
                    destino: '/produto',
                    icone: 'fa-bag-shopping'
                },
                {
                    tipo: 'Conheça os recursos',
                    titulo: 'Explore o sistema de afiliados',
                    descricao:
                        'Acesse suas afiliações, acompanhe solicitações e encontre seus links de divulgação.',
                    botao: 'Ver afiliações',
                    destino: '/afiliados',
                    icone: 'fa-link'
                }
            ]
        },
        en: {
            titulo: 'What’s new on Monetiza',
            anterior: 'Previous update',
            proximo: 'Next update',
            cards: [
                {
                    tipo: 'Explore the platform',
                    titulo: 'Turn your idea into a product',
                    descricao:
                        'Plan and create your e-book with help from Monetiza AI.',
                    botao: 'Create with AI',
                    destino: '/ia-produtos',
                    icone: 'fa-wand-magic-sparkles'
                },
                {
                    tipo: 'Quick tip',
                    titulo: 'Your next product starts here',
                    descricao:
                        'Add your product, choose a cover and prepare to publish it in the storefront.',
                    botao: 'Manage products',
                    destino: '/produto',
                    icone: 'fa-bag-shopping'
                },
                {
                    tipo: 'Discover the features',
                    titulo: 'Explore the affiliate system',
                    descricao:
                        'Access your affiliations, track requests and find your promotional links.',
                    botao: 'View affiliations',
                    destino: '/afiliados',
                    icone: 'fa-link'
                }
            ]
        },
        es: {
            titulo: 'Novedades de Monetiza',
            anterior: 'Novedad anterior',
            proximo: 'Siguiente novedad',
            cards: [
                {
                    tipo: 'Explora la plataforma',
                    titulo: 'Transforma tu idea en un producto',
                    descricao:
                        'Planifica y crea tu e-book con la ayuda de la IA de Monetiza.',
                    botao: 'Crear con IA',
                    destino: '/ia-produtos',
                    icone: 'fa-wand-magic-sparkles'
                },
                {
                    tipo: 'Consejo rápido',
                    titulo: 'Tu próximo producto comienza aquí',
                    descricao:
                        'Añade tu producto, elige una portada y prepara su publicación en la tienda.',
                    botao: 'Gestionar productos',
                    destino: '/produto',
                    icone: 'fa-bag-shopping'
                },
                {
                    tipo: 'Descubre las funciones',
                    titulo: 'Explora el sistema de afiliados',
                    descricao:
                        'Accede a tus afiliaciones, sigue las solicitudes y encuentra tus enlaces de promoción.',
                    botao: 'Ver afiliaciones',
                    destino: '/afiliados',
                    icone: 'fa-link'
                }
            ]
        }
    }

    const textos = conteudos[idioma]

    document.getElementById('novidades-titulo').textContent = textos.titulo

    const anterior = carrossel.querySelector('.prev-left')
    const proximo = carrossel.querySelector('.next-left')

    anterior.setAttribute('aria-label', textos.anterior)
    proximo.setAttribute('aria-label', textos.proximo)

    function criarElemento(tag, classe, texto) {
        const elemento = document.createElement(tag)

        if (classe) elemento.className = classe
        if (texto) elemento.textContent = texto

        return elemento
    }

    textos.cards.forEach(card => {
        const slide = criarElemento('article', 'swiper-slide')
        const conteudo = criarElemento('div', 'novidade-conteudo')
        const topo = criarElemento('div', 'novidade-topo')
        const icone = criarElemento(
            'i',
            `fa-solid ${card.icone}`
        )

        icone.setAttribute('aria-hidden', 'true')

        topo.append(
            icone,
            criarElemento('span', 'novidade-tipo', card.tipo)
        )

        const link = criarElemento('a', 'novidade-link', `${card.botao} →`)
        link.href = card.destino

        conteudo.append(
            topo,
            criarElemento('h3', '', card.titulo),
            criarElemento('p', '', card.descricao),
            link
        )

        slide.appendChild(conteudo)
        slides.appendChild(slide)
    })

    // Se a biblioteca não carregar, os cards continuam acessíveis.
    if (typeof Swiper === 'undefined') {
        carrossel.classList.add('novidades-sem-swiper')
        anterior.hidden = true
        proximo.hidden = true
        return
    }

    new Swiper(carrossel, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: textos.cards.length > 1,
        autoHeight: true,
        navigation: {
            nextEl: proximo,
            prevEl: anterior
        },
        a11y: {
            prevSlideMessage: textos.anterior,
            nextSlideMessage: textos.proximo
        }
    })
})