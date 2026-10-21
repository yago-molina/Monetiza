const iaInterface = (() => {
    const textos = {
        revisar: ['Revisar conteúdo', 'Review content', 'Revisar contenido'],
        anuncio: ['Editar anúncio', 'Edit listing', 'Editar anuncio'],
        ideia: ['Usar esta ideia', 'Use this idea', 'Usar esta idea'],
        gerar: ['Gerar produto com este planejamento', 'Generate from this plan', 'Generar con este plan'],
        estruturar: ['Estruturar ideia', 'Structure idea', 'Estructurar idea'],
        verificar: ['Verificando conexão…', 'Checking connection…', 'Comprobando conexión…'],
        online: ['Assistente disponível', 'Assistant available', 'Asistente disponible'],
        offline: ['Assistente indisponível', 'Assistant unavailable', 'Asistente no disponible'],
        tentar: ['Tentar novamente', 'Try again', 'Intentar de nuevo'],
        parar: ['Interromper após este capítulo', 'Stop after this chapter', 'Detener después de este capítulo'],
        parando: ['Aguardando o capítulo atual terminar…', 'Waiting for this chapter to finish…', 'Esperando que termine este capítulo…'],
        pausado: ['Geração interrompida. Os capítulos concluídos foram salvos.', 'Generation stopped. Completed chapters were saved.', 'Generación detenida. Los capítulos completados se guardaron.'],
        recuperar: ['Recuperando a geração: nova tentativa em 60 segundos.', 'Recovering generation: retrying in 60 seconds.', 'Recuperando la generación: nuevo intento en 60 segundos.'],
        retomando: ['Tentando gerar o capítulo novamente…', 'Retrying chapter generation…', 'Intentando generar el capítulo de nuevo…'],
        tempo: ['Tempo decorrido', 'Elapsed time', 'Tiempo transcurrido'],
        baixar: ['Baixar PDF', 'Download PDF', 'Descargar PDF'],
        publicado: ['Editar em Meus produtos', 'Edit in My products', 'Editar en Mis productos'],
        vazio: ['Gere o PDF primeiro para desenvolver os capítulos. Depois, revise o conteúdo aqui.', 'Generate the PDF first to develop the chapters, then review them here.', 'Genera el PDF primero para desarrollar los capítulos y después revísalos aquí.'],
        pendente: ['Capítulo ainda não gerado', 'Chapter not generated yet', 'Capítulo aún no generado'],
        titulo: ['Título', 'Title', 'Título'],
        introducao: ['Introdução', 'Introduction', 'Introducción'],
        secao: ['Seção', 'Section', 'Sección'],
        conteudo: ['Conteúdo', 'Content', 'Contenido'],
        atividade: ['Atividade prática', 'Practical activity', 'Actividad práctica'],
        ponto: ['Ponto-chave', 'Key point', 'Punto clave'],
        conclusao: ['Conclusão', 'Conclusion', 'Conclusión'],
        salvar: ['Salvar revisão', 'Save review', 'Guardar revisión'],
        cancelar: ['Cancelar', 'Cancel', 'Cancelar'],
        descartar: ['Descartar as alterações desta revisão?', 'Discard changes to this review?', '¿Descartar los cambios de esta revisión?'],
        salvo: ['Revisão salva. Gere o PDF novamente para atualizar o arquivo.', 'Review saved. Generate the PDF again to update the file.', 'Revisión guardada. Genera el PDF de nuevo para actualizarlo.'],
        semIdeia: ['Escreva uma ideia ou converse com o consultor primeiro.', 'Write an idea or talk to the advisor first.', 'Escribe una idea o habla primero con el asesor.'],
        semPlano: ['Estruture sua ideia antes de gerar o produto.', 'Structure your idea before generating the product.', 'Estructura tu idea antes de generar el producto.'],
        falhaFluxo: ['A conexão terminou antes de concluir o capítulo. Tente novamente.', 'Connection ended before the chapter was completed. Try again.', 'La conexión terminó antes de completar el capítulo. Inténtalo de nuevo.']
    }

    function texto(chave) {
        const idioma = window.i18n?.obterIdiomaAtual() || 'pt-BR'
        return textos[chave][idioma === 'en' ? 1 : idioma === 'es' ? 2 : 0]
    }

    let publicado = null, interromper = false, timer = null
    let estadoConexao = 'verificar'
    let dialogo, form, botaoRevisar, parar, relogio, aviso, retry

    function rotulo(elemento, chave) {
        elemento.removeAttribute('data-i18n')
        elemento.textContent = texto(chave)
    }

    function botao(chave, pai, acao) {
        const el = document.createElement('button')
        el.type = 'button'
        el.className = 'btn-secundario'
        el.dataset.iaTexto = chave
        el.textContent = texto(chave)
        el.addEventListener('click', acao)
        pai.appendChild(el)
        return el
    }

    function conexao(estado) {
        estadoConexao = estado

        document.querySelectorAll('.online, .api-status').forEach(el => {
            el.textContent = texto(estado)
            el.setAttribute('role', 'status')
        })

        if (retry) retry.disabled = estado === 'verificar'
    }

    function publicacao(id) {
        publicado = id
        botaoEditarProduto.disabled = false
        botaoGerarPdf.disabled = false
        botaoPublicarProduto.disabled = Boolean(id)

        if (botaoRevisar) botaoRevisar.disabled = Boolean(id)

        rotulo(botaoEditarProduto, id ? 'publicado' : 'anuncio')

        if (id) rotulo(botaoGerarPdf, 'baixar')
        else botaoGerarPdf.textContent = t('iaProdutos.preview.gerarPdf')
    }

    function iniciarPdf() {
        interromper = false
        parar.disabled = false
        parar.textContent = texto('parar')
        aviso.textContent = ''

        const inicio = Date.now()
        clearInterval(timer)

        const tick = () => {
            relogio.textContent =
                `${texto('tempo')}: ${Math.floor((Date.now() - inicio) / 1000)}s`
        }

        tick()
        timer = setInterval(tick, 1000)
    }

    function finalizarPdf() {
        clearInterval(timer)
        timer = null
    }

    async function revisar() {
        exigirProduto()

        if (!capitulosPdfProntos.some(Boolean)) {
            await MonetizaUI.aviso(texto('vazio'))
            return
        }

        form.replaceChildren()

        const copia = structuredClone(capitulosPdfProntos)
        const campos = []

        const titulo = document.createElement('h2')
        titulo.textContent = texto('revisar')
        form.appendChild(titulo)

        function campoTexto(pai, chave, valor, limite, atribuir) {
            const label = document.createElement('label')
            label.textContent = texto(chave)

            const input = document.createElement('textarea')
            input.value = valor
            input.required = true
            input.maxLength = limite
            input.rows = limite <= 300 ? 2 : 6

            label.appendChild(input)
            pai.appendChild(label)
            campos.push({ input, atribuir })
        }

        produtoGerado.produto.capitulos.forEach((estrutura, indice) => {
            const bloco = document.createElement('fieldset')
            const legenda = document.createElement('legend')

            legenda.textContent = `${estrutura.numero}. ${estrutura.titulo}`
            bloco.appendChild(legenda)
            form.appendChild(bloco)

            const cap = copia[indice]

            if (!cap) {
                const p = document.createElement('p')
                p.textContent = texto('pendente')
                bloco.appendChild(p)
                return
            }

            campoTexto(bloco, 'titulo', cap.titulo, 300, v => cap.titulo = v)
            campoTexto(bloco, 'introducao', cap.introducao, 6000, v => cap.introducao = v)

            cap.secoes.forEach(secao => {
                campoTexto(bloco, 'secao', secao.titulo, 300, v => secao.titulo = v)
                campoTexto(bloco, 'conteudo', secao.conteudo, 15000, v => secao.conteudo = v)
            })

            campoTexto(
                bloco, 'atividade', cap.atividade_pratica,
                5000, v => cap.atividade_pratica = v
            )

            cap.pontos_chave.forEach((ponto, i) => {
                campoTexto(bloco, 'ponto', ponto, 1000, v => cap.pontos_chave[i] = v)
            })

            campoTexto(bloco, 'conclusao', cap.conclusao, 5000, v => cap.conclusao = v)
        })

        const cancelar = async () => {
            const mudou = campos.some(
                ({ input }) => input.value !== input.defaultValue
            )

            if (!mudou || await MonetizaUI.confirmar(texto('descartar'))) {
                dialogo.close()
            }
        }

        campos.forEach(({ input }) => {
            input.defaultValue = input.value
        })

        botao('cancelar', form, cancelar)
        const salvar = botao('salvar', form, () => form.requestSubmit())

        dialogo.oncancel = evento => {
            evento.preventDefault()
            cancelar()
        }

        form.onsubmit = evento => {
            evento.preventDefault()

            campos.forEach(({ input }) => {
                input.setCustomValidity(
                    input.value.trim() ? '' : texto('conteudo')
                )
                input.oninput = () => input.setCustomValidity('')
            })

            if (!form.reportValidity()) return

            rascunhos.executar(async () => {
                salvar.disabled = true

                try {
                    campos.forEach(({ input, atribuir }) => {
                        atribuir(input.value.trim())
                    })

                    capitulosPdfProntos = copia
                    pdfPublicado = null
                    arquivoPdfPronto = null

                    await rascunhos.salvar()

                    dialogo.close()
                    status.innerText = texto('salvo')
                } finally {
                    salvar.disabled = false
                }
            })
        }

        dialogo.showModal()
    }

    function iniciar() {
        const acoes = document.querySelector('.produto-acoes')

        botaoRevisar = botao(
            'revisar', acoes,
            () => rascunhos.executar(revisar)
        )

        dialogo = document.createElement('dialog')
        dialogo.id = 'revisao-capitulos'
        dialogo.setAttribute('aria-label', texto('revisar'))

        form = document.createElement('form')
        dialogo.appendChild(form)
        document.body.appendChild(dialogo)

        window.addEventListener('beforeunload', evento => {
            const alterado = [...form.querySelectorAll('textarea')]
                .some(el => el.value !== el.defaultValue)

            if (dialogo.open && alterado) {
                evento.preventDefault()
                evento.returnValue = ''
            }
        })

        const passos = document.createElement('div')
        passos.className = 'ia-proximos-passos'
        document.querySelector('.chat-input-area').before(passos)

        botao('ideia', passos, () => rascunhos.executar(async () => {
            const ultima = [...historicos.consultor]
                .reverse()
                .find(m => m.role === 'assistant')

            const ideia = prompt.value.trim() || ultima?.content

            if (!ideia) return MonetizaUI.aviso(texto('semIdeia'))

            ideiaEscolhida = ideia
            etapaAtual = 'promptBuilder'
            atualizarVisualEtapa()

            prompt.value = ideia
            await rascunhos.salvar()

            // Permite escolher uma sugestão antes de enviar.
        }))

        botao('gerar', passos, () => rascunhos.executar(async () => {
            if (!promptGerado) return MonetizaUI.aviso(texto('semPlano'))

            etapaAtual = 'produto'
            atualizarVisualEtapa()
            prompt.value = promptGerado

            await enviarMensagem()
        }))

        document.querySelector('.modelo-area').hidden = true

        document.querySelectorAll(
            '[data-i18n="iaProdutos.prototipo"], ' +
            '[data-i18n="iaProdutos.fluxo.prototipo"]'
        ).forEach(el => el.remove())

        retry = botao(
            'tentar',
            document.querySelector('.topbar-ia'),
            carregarModelos
        )

        const painel = modalLoadingPdf.querySelector('.pdf-modal-conteudo')

        relogio = document.createElement('p')
        aviso = document.createElement('p')
        aviso.setAttribute('role', 'status')
        painel.append(relogio, aviso)

        parar = botao('parar', painel, () => {
            interromper = true
            parar.disabled = true
            parar.textContent = texto('parando')
        })

        function traduzirUI() {
            document.querySelectorAll('[data-ia-texto]').forEach(el => {
                el.textContent = texto(el.dataset.iaTexto)
            })

            document.querySelectorAll(
                '[data-i18n="complementos.promptBuilder"]'
            ).forEach(el => {
                el.dataset.iaTexto = 'estruturar'
                rotulo(el, 'estruturar')
            })

            conexao(estadoConexao)
            publicacao(publicado)
        }

        traduzirUI()
        window.addEventListener('i18n:change', traduzirUI)
    }

    return {
        iniciar,
        conexao,
        publicacao,
        texto,
        iniciarPdf,
        finalizarPdf,
        interrompido: () => interromper,
        publicado: () => publicado,
        montando: () => {
            parar.disabled = true
        },
        progresso: etapa => {
            aviso.textContent = etapa
                ? texto(etapa === 'recuperando' ? 'recuperar' : 'retomando')
                : ''
        }
    }
})()