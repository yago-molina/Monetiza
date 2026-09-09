document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token')
    const t = chave => window.i18n?.t(chave) ?? chave

    if (!token) return

    function criarMenuPerfil() {
        if (document.getElementById('menu-perfil-global')) return

        const estilo = document.createElement('style')

        estilo.textContent = `
            .perfil-topo-clicavel {
                cursor: pointer;
            }

            .menu-perfil-global {
                position: fixed;
                min-width: 190px;
                background: #1c1c1e;
                border: 1px solid #2c2c2e;
                border-radius: 10px;
                padding: 8px;
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
                z-index: 99999;
                display: none;
            }

            .menu-perfil-global.aberto {
                display: block;
            }

            .menu-perfil-global a,
            .menu-perfil-global button {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 11px 12px;
                border: none;
                border-radius: 7px;
                background: transparent;
                color: #ffffff;
                text-decoration: none;
                font-size: 14px;
                font-family: inherit;
                cursor: pointer;
                text-align: left;
                transition: background 0.2s;
            }

            .menu-perfil-global a:hover,
            .menu-perfil-global button:hover {
                background: #2c2c2e;
            }

            .menu-perfil-global i {
                width: 18px;
                text-align: center;
                color: #a4a4a8;
            }

            .menu-perfil-global .btn-sair-perfil {
                color: #ff6b6b;
            }

            .menu-perfil-global .btn-sair-perfil i {
                color: #ff6b6b;
            }

            .menu-perfil-divisor {
                height: 1px;
                background: #2c2c2e;
                margin: 5px 0;
            }
        `

        document.head.appendChild(estilo)

        const menu = document.createElement('div')

        menu.id = 'menu-perfil-global'
        menu.className = 'menu-perfil-global'

        menu.innerHTML = `
            <a href="/minhasCompras">
                <i class="fa-solid fa-bag-shopping"></i>
                <span>${t('perfilGlobal.minhasCompras')}</span>
            </a>

            <div class="menu-perfil-divisor"></div>

            <button
                type="button"
                class="btn-sair-perfil"
                id="btn-sair-perfil"
            >
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>${t('perfilGlobal.sair')}</span>
            </button>
        `

        document.body.appendChild(menu)

        document
            .getElementById('btn-sair-perfil')
            ?.addEventListener('click', () => {
                localStorage.removeItem('token')
                localStorage.removeItem('usuarioLogado')
                window.location.href = '/login'
            })
    }

    function configurarCliquePerfil() {
        criarMenuPerfil()

        const menu =
            document.getElementById('menu-perfil-global')

        const perfisTopo =
            document.querySelectorAll(
                '.top-bar-actions .fa-circle-user, ' +
                '.top-bar-right .fa-circle-user, ' +
                '.top-bar-actions .foto-usuario-topo, ' +
                '.top-bar-right .foto-usuario-topo'
            )

        perfisTopo.forEach(elemento => {

            const botao = elemento.parentElement

            if (!botao) return

            botao.classList.add(
                'perfil-topo-clicavel'
            )

            botao.addEventListener(
                'click',
                evento => {
                    evento.preventDefault()
                    evento.stopPropagation()

                    const rect =
                        botao.getBoundingClientRect()

                    menu.style.top =
                        `${rect.bottom + 8}px`

                    menu.style.left =
                        `${Math.max(
                            10,
                            rect.right - 190
                        )}px`

                    menu.classList.toggle(
                        'aberto'
                    )
                }
            )
        })

        document.addEventListener(
            'click',
            evento => {
                if (
                    !menu.contains(evento.target)
                ) {
                    menu.classList.remove(
                        'aberto'
                    )
                }
            }
        )

        window.addEventListener(
            'resize',
            () => {
                menu.classList.remove(
                    'aberto'
                )
            }
        )

        window.addEventListener(
            'scroll',
            () => {
                menu.classList.remove(
                    'aberto'
                )
            }
        )
    }

    try {

        const response = await fetch(
            '/configuracoes-api',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {

            console.error(
                'Erro ao carregar perfil global:',
                response.status
            )

            configurarCliquePerfil()
            return
        }

        const dados = await response.json()

        const usuario = dados.usuario

        if (!usuario) {
            configurarCliquePerfil()
            return
        }

        const nomeUsuario =
            document.getElementById('nome-usuario')

        const emailUsuario =
            document.getElementById('email-usuario')

        if (nomeUsuario) {

            nomeUsuario.textContent =
                usuario.nome ||
                t('perfilGlobal.usuario')

        }

        if (emailUsuario) {

            emailUsuario.textContent =
                usuario.email || ''

        }

        const foto = usuario.foto_perfil

        if (foto) {

            const avataresSidebar =
                document.querySelectorAll(
                    '.avatar-fallback'
                )

            avataresSidebar.forEach(avatar => {

                avatar.innerHTML = `
                    <img
                        src="${foto}"
                        alt="${t('perfilGlobal.fotoPerfil')}"
                        class="foto-usuario-global"
                    >
                `

            })

            const iconesTopo =
                document.querySelectorAll(
                    '.top-bar-actions .fa-circle-user, ' +
                    '.top-bar-right .fa-circle-user'
                )

            iconesTopo.forEach(icone => {

                const pai = icone.parentElement

                if (!pai) return

                pai.innerHTML = `
                    <img
                        src="${foto}"
                        alt="${t('perfilGlobal.fotoPerfil')}"
                        class="foto-usuario-topo"
                    >
                `

            })

        }

        configurarCliquePerfil()

    } catch (erro) {

        console.error(
            'Erro ao carregar perfil global:',
            erro
        )

        configurarCliquePerfil()
    }

})