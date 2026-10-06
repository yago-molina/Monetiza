(() => {
    window.criarGerenciadorRascunhos = ({ token, capturar, restaurar, vazio, aoPublicar }) => {
        let id = crypto.randomUUID(), versao = 0, publicado = null
        let pronto = false, ocupado = false, trocando = false, ultimo = '', pendente = null
        let fila = Promise.resolve(), timer, alterado = false
        const painel = document.createElement('section')
        painel.className = 'ia-rascunhos'
        painel.innerHTML = `<strong>Meus rascunhos</strong>
            <select aria-label="Rascunhos salvos"><option value="">Escolha um rascunho</option></select>
            <button type="button" data-abrir>Abrir</button>
            <button type="button" data-novo>Novo produto</button>
            <button type="button" data-salvar>Salvar agora</button>
            <button type="button" data-copia>Salvar cópia</button>
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
            if (localStorage.getItem('token') !== token) throw new Error('A conta mudou. Atualize a página.')
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
                if (!resposta.ok) { const erro = new Error(dados.erro || 'Falha ao acessar os rascunhos.'); erro.status=resposta.status; throw erro }
                return dados
            } finally { clearTimeout(tempo) }
        }
        async function listar() {
            const registros = await pedir('')
            select.replaceChildren(new Option('Escolha um rascunho',''))
            for (const registro of registros) {
                select.add(new Option(registro.titulo + (registro.produto_publicado_id?' — publicado':''),registro.id))
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
                        ultimo=snapshot();alterado=false;aoPublicar(publicado);informar('Este produto já foi publicado.');botoes()
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
                if (!pronto) throw new Error('Aguarde carregar os rascunhos. Se falhou, use Salvar agora para reconectar.')
                if (publicado) return
                informar('Salvando…')
                await gravarPendente() // Repete a mesma operação se a resposta anterior se perdeu.
                if (publicado) return
                const texto = snapshot()
                if (texto !== ultimo) {
                    pendente = {versao,gravacao:crypto.randomUUID(),estado:JSON.parse(texto)}
                    await gravarPendente()
                }
                alterado = snapshot() !== ultimo
                informar(alterado?'Há alterações para salvar.':'Salvo')
                if (!Array.from(select.options).some(o=>o.value===id)) {
                    select.add(new Option(capturar().produtoGerado?.cadastro?.titulo || 'Novo produto',id))
                }
                const option = Array.from(select.options).find(o=>o.value===id)
                if (option) option.textContent = capturar().produtoGerado?.cadastro?.titulo || capturar().ideiaEscolhida || 'Novo produto'
                select.value = id
            }).catch(erro=>{ alterado=true; informar('Falha ao salvar: '+erro.message); throw erro })
            fila = tarefa
            return tarefa
        }
        function agendar() {
            if (!pronto || publicado || trocando) return
            alterado = true
            informar('Alterações não salvas…')
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
            informar(publicado?'Publicado — crie um novo produto para continuar.':'Rascunho recuperado. Salvo.')
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
            trocando=true;botoes();informar('Carregando rascunhos…')
            try {
                const registros=await listar()
                if (registros.length) await carregar(registros[0].id)
                else { ultimo=snapshot(); informar('Pronto. Seu trabalho será salvo automaticamente.') }
                pronto=true
            } catch (erro) { pronto=false;informar('Falha ao carregar: '+erro.message) }
            finally { trocando=false;botoes() }
        }
        async function executar(acao) {
            if (!pronto || ocupado || trocando || publicado) {
                await MonetizaUI.aviso(publicado?'Este produto já foi publicado. Use Novo produto.':'Aguarde terminar a operação ou carregar os rascunhos.')
                return
            }
            ocupado=true;botoes()
            document.getElementById('prompt').disabled=true
            try { await salvar(); if (publicado) { await MonetizaUI.aviso('Este produto já foi publicado. Use Novo produto.'); return } return await acao() }
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
            if (!await MonetizaUI.confirmar('Salvar o trabalho atual e começar outro produto?',{titulo:'Novo produto'})) return
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
                informar('Cópia salva. O rascunho anterior foi preservado.')
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
                if (!r.ok) {const e=new Error('Não foi possível recuperar o PDF salvo.');e.status=r.status;throw e}
                return r.blob()
            },
            publicado(produtoId) {publicado=produtoId;alterado=false;pendente=null;clearTimeout(timer);informar('Publicado');aoPublicar(produtoId);botoes()},
            ocupado:()=>ocupado
        }
    }
})()
