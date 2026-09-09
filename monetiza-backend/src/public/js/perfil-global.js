document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token')
    const t = chave => window.i18n?.t(chave) ?? chave

    if (!token) return

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

            return

        }

        const dados = await response.json()

        const usuario = dados.usuario

        if (!usuario) return

        const nomeUsuario =
            document.getElementById('nome-usuario')

        const emailUsuario =
            document.getElementById('email-usuario')

        if (nomeUsuario) {

            nomeUsuario.textContent =
                usuario.nome || t('perfilGlobal.usuario')

        }

        if (emailUsuario) {

            emailUsuario.textContent =
                usuario.email || ''

        }

        const foto = usuario.foto_perfil

        console.log(
            'Foto de perfil encontrada:',
            foto
        )

        if (!foto) return

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
                '.top-bar-actions .fa-circle-user, .top-bar-right .fa-circle-user'
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

    } catch (erro) {

        console.error(
            'Erro ao carregar perfil global:',
            erro
        )

    }

})