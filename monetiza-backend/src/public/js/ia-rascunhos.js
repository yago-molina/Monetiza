(() => {
    window.criarGerenciadorRascunhos = ({ token, capturar, restaurar, vazio, aoPublicar }) => {
        let id = crypto.randomUUID(), versao = 0, publicado = null
        let pronto = false, ocupado = false, trocando = false, ultimo = '', pendente = null
        let fila = Promise.resolve(), timer, alterado = false
        const painel = document.createElement('section')
        painel.className = 'ia-rascunhos'
        painel.innerHTML = `<strong>${window.i18n.t('complementos.meusRascunhos')}</strong>
            <select aria-label="${window.i18n.t('complementos.rascunhosSalvos')}"><option value="">${window.i18n.t('complementos.escolhaUmRascunho')}</option></select>
            <button type="button" data-abrir>${window.i18n.t('complementos.abrir')}</button>
            <button type="button" data-novo>${window.i18n.t('complementos.novoProduto')}</button>
            <button type="button" data-salvar>${window.i18n.t('complementos.salvarAgora')}</button>
            <button type="button" data-copia>${window.i18n.t('complementos.salvarCopia')}</button>
            <span role="status" aria-live="polite"></span>`
        document.getElementById('status').insertAdjacentElement('afterend',painel)
        const select = painel.querySelector('select')
        const aviso = painel.querySelector('[role=status]')
        const abrir = painel.querySelector('[data-abrir]')
        const novoBtn = painel.querySelector('[data-novo]')
        const salvarBtn = painel.querySelector('[data-salvar]')
        const copiaBtn = painel.querySelector('[data-copia]')
        function informar(texto) { aviso.textContent = texto }
        function botoes() {
            copiaBtn.disabled = ocupado || trocando || !pronto
            abrir.disabled = ocupado || trocando || !pronto
            novoBtn.disabled = ocupado || trocando || !pronto
            select.disabled = ocupado || trocando
            salvarBtn.disabled = ocupado || trocando || Boolean(publicado)
        }
        function sessao() {
            if (localStorage.getItem('token') !== token) throw new Error(window.i18n.t('complementos.aContaMudouAtualizeAPagina'))
        }
        async function pedir(caminho, options={}) {
            sessao()
            const controller = new AbortController()
            const tempo = setTimeout(()=>controller.abort(),20000)
            try {
                const resposta = await fetch('/ia/rascunhos'+caminho,{
                    ...options, cache:'no-store', signal:controller.signal,
                    headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}
                })
                sessao()
                const dados = await resposta.json().catch(()=>({}))
                if (!resposta.ok) { const erro = new Error(dados.erro || window.i18n.t('complementos.falhaAoAcessarOsRascunhos')); erro.status=resposta.status; throw erro }
                return dados
            } finally { clearTimeout(tempo) }
        }
        async function listar() {
            const registros = await pedir('')
            select.replaceChildren(new Option(window.i18n.t('complementos.escolhaUmRascunho'),''))
            for (const registro of registros) {
                select.add(new Option(registro.titulo + (registro.produto_publicado_id?window.i18n.t('complementos.publicadoExtra'):''),registro.id))
            }
            select.value = id
            return registros
        }
        function snapshot() { return JSON.stringify(capturar()) }
        async function gravarPendente() {
            if (!pendente) return
            let resultado
            try { resultado = await pedir('/'+id,{method:'PUT',body:JSON.stringify(pendente)}) }
            catch(erro) {
                if (erro.status===409) {
                    const atual = await pedir('/'+id)
                    if (atual.produto_publicado_id) {
                        publicado=atual.produto_publicado_id;versao=atual.versao;pendente=null
                        ultimo=snapshot();alterado=false;aoPublicar(publicado);informar(window.i18n.t('complementos.esteProdutoJaFoiPublicado'));botoes()
                        return
                    }
                }
                throw erro
            }
            versao = resultado.versao
            ultimo = JSON.stringify(pendente.estado)
            pendente = null
        }
        function salvar() {
            clearTimeout(timer)
            const tarefa = fila.catch(()=>{}).then(async()=>{
                if (!pronto) throw new Error(window.i18n.t('complementos.aguardeCarregarOsRascunhosSeFalhouUseSalvarAgoraPara'))
                if (publicado) return
                informar(window.i18n.t('complementos.salvando'))
                await gravarPendente() // Repete a mesma operação se a resposta anterior se perdeu.
                if (publicado) return
                const texto = snapshot()
                if (texto !== ultimo) {
                    pendente = {versao,gravacao:crypto.randomUUID(),estado:JSON.parse(texto)}
                    await gravarPendente()
                }
                alterado = snapshot() !== ultimo
                informar(alterado?window.i18n.t('complementos.haAlteracoesParaSalvar'):window.i18n.t('complementos.salvo'))
                if (!Array.from(select.options).some(o=>o.value===id)) {
                    select.add(new Option(capturar().produtoGerado?.cadastro?.titulo || window.i18n.t('complementos.novoProduto'),id))
                }
                const option = Array.from(select.options).find(o=>o.value===id)
                if (option) option.textContent = capturar().produtoGerado?.cadastro?.titulo || capturar().ideiaEscolhida || window.i18n.t('complementos.novoProduto')
                select.value = id
            }).catch(erro=>{ alterado=true; informar(window.i18n.t('complementos.falhaAoSalvar')+erro.message); throw erro })
            fila = tarefa
            return tarefa
        }
        function agendar() {
            if (!pronto || publicado || trocando) return
            alterado = true
            informar(window.i18n.t('complementos.alteracoesNaoSalvas'))
            clearTimeout(timer)
            timer = setTimeout(()=>salvar().catch(()=>{}),800)
        }
        async function carregar(alvo) {
            const registro = await pedir('/'+alvo)
            id=registro.id; versao=registro.versao; publicado=registro.produto_publicado_id
            pendente=null
            restaurar(registro.estado)
            ultimo=snapshot(); alterado=false
            select.value=id
            informar(publicado?window.i18n.t('complementos.publicadoCrieUmNovoProdutoParaContinuar'):window.i18n.t('complementos.rascunhoRecuperadoSalvo'))
            aoPublicar(publicado)
        }
        async function novo(interno=false) {
            if (!pronto || (ocupado && !interno)) return
            await salvar()
            id=crypto.randomUUID();versao=0;publicado=null;pendente=null;ultimo=''
            restaurar(vazio());aoPublicar(null);alterado=true
            await salvar()
        }
        async function iniciar() {
            trocando=true;botoes();informar(window.i18n.t('complementos.carregandoRascunhos'))
            try {
                const registros=await listar()
                if (registros.length) await carregar(registros[0].id)
                else { ultimo=snapshot(); informar(window.i18n.t('complementos.prontoSeuTrabalhoSeraSalvoAutomaticamente')) }
                pronto=true
            } catch (erro) { pronto=false;informar(window.i18n.t('complementos.falhaAoCarregar')+erro.message) }
            finally { trocando=false;botoes() }
        }
        async function executar(acao) {
            if (!pronto || ocupado || trocando || publicado) {
                await MonetizaUI.aviso(publicado?window.i18n.t('complementos.esteProdutoJaFoiPublicadoUseNovoProduto'):window.i18n.t('complementos.aguardeTerminarAOperacaoOuCarregarOsRascunhos'))
                return
            }
            ocupado=true;botoes()
            document.getElementById('prompt').disabled=true
            try { await salvar(); if (publicado) { await MonetizaUI.aviso(window.i18n.t('complementos.esteProdutoJaFoiPublicadoUseNovoProduto')); return } return await acao() }
            catch (erro) { await MonetizaUI.aviso(erro.message) }
            finally { ocupado=false;document.getElementById('prompt').disabled=false;botoes() }
        }
        abrir.addEventListener('click',async()=>{
            if (!select.value || ocupado || trocando) return
            const alvo=select.value
            trocando=true;botoes()
            try { await salvar(); await carregar(alvo) }
            catch(erro) { await MonetizaUI.aviso(erro.message) }
            finally { trocando=false;botoes() }
        })
        novoBtn.addEventListener('click',async()=>{
            if (!pronto || ocupado || trocando) return
            if (!await MonetizaUI.confirmar(window.i18n.t('complementos.salvarOTrabalhoAtualEComecarOutroProduto'),{titulo:window.i18n.t('complementos.novoProduto')})) return
            ocupado=true;botoes()
            try { await novo(true) } catch(erro) { await MonetizaUI.aviso(erro.message) }
            finally { ocupado=false;botoes() }
        })
        copiaBtn.addEventListener('click',async()=>{
            if (!pronto || ocupado || trocando) return
            ocupado=true;botoes();clearTimeout(timer)
            try {
                await fila.catch(()=>{})
                id=crypto.randomUUID();versao=0;pendente=null;ultimo='';publicado=null
                aoPublicar(null);alterado=true
                await salvar()
                informar(window.i18n.t('complementos.copiaSalvaORascunhoAnteriorFoiPreservado'))
            } catch(erro) { await MonetizaUI.aviso(erro.message) }
            finally { ocupado=false;botoes() }
        })
        salvarBtn.addEventListener('click',()=>{ if (!pronto) iniciar(); else salvar().catch(()=>{}) })
        window.addEventListener('beforeunload',evento=>{
            if (alterado || pendente || ocupado) { evento.preventDefault();evento.returnValue='' }
        })
        window.addEventListener('storage',evento=>{
            if (evento.key==='token' || evento.key===null) window.location.reload()
        })
        return { iniciar, salvar, agendar, executar, novo,
            podeMudar:()=>pronto && !ocupado && !trocando && !publicado,
            referencia:()=>({rascunho_id:id,rascunho_versao:versao}),
            async baixarPdf() {
                sessao()
                const r=await fetch(`/ia/rascunhos/${id}/pdf`,{cache:'no-store',headers:{Authorization:`Bearer ${token}`}})
                if (!r.ok) {const e=new Error(window.i18n.t('complementos.naoFoiPossivelRecuperarOPdfSalvo'));e.status=r.status;throw e}
                return r.blob()
            },
            publicado(produtoId) {publicado=produtoId;alterado=false;pendente=null;clearTimeout(timer);informar(window.i18n.t('complementos.publicado'));aoPublicar(produtoId);botoes()},
            ocupado:()=>ocupado
        }
    }
})()
