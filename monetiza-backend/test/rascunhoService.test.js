const {test} = require('node:test')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const express = require('express')
const jwt = require('jsonwebtoken')
const { criarServicoRascunhos, validarEstado, nomePdf } = require('../src/services/rascunhos/rascunhoService')
const { criarRotasRascunhos } = require('../src/routes/rascunhoIaRoutes')
const { estadoVazio, criarProdutoValido, criarCapitulo } = require('./fixtures/rascunho')
function banco() {
 const linhas = new Map()
 async function query(sql,args) {
  if(sql.startsWith('SELECT id FROM usuarios')) return [[{id:args[0]}]]
  if(sql.includes('COUNT(*)')) return [[{total:[...linhas.values()].filter(l=>l.usuario_id===args[0]).length}]]
  if(sql.startsWith('SELECT *')) {const l=linhas.get(args[0]);return [[...(l?.usuario_id===args[1]?[structuredClone(l)]:[])]]}
  if(sql.startsWith('SELECT id, titulo')) return [[...linhas.values()].filter(l=>l.usuario_id===args[0])]
  if(sql.startsWith('INSERT')) {
   const [id,usuario_id,titulo,estado,versao,ultima_gravacao]=args
   if(linhas.has(id)) {const e=Error('duplicate');e.code='ER_DUP_ENTRY';throw e}
   linhas.set(id,{id,usuario_id,titulo,estado,versao,ultima_gravacao,produto_publicado_id:null});return [{affectedRows:1}]
  }
  if(sql.startsWith('UPDATE')) {
   const [titulo,estado,versao,ultima_gravacao,id,usuario]=args
   const l=linhas.get(id);assert.equal(l.usuario_id,usuario)
   Object.assign(l,{titulo,estado,versao,ultima_gravacao});return [{affectedRows:1}]
  }
  throw Error(sql)
 }
 return {linhas,execute:query,getConnection:async()=>({query,execute:query,beginTransaction:async()=>{},commit:async()=>{},rollback:async()=>{},release:()=>{}})}
}
const requisicao = (estado=estadoVazio(),versao=0)=>({estado,versao,gravacao:crypto.randomUUID()})
test('Salva e recupera capítulos/PDF e isola contas',async()=>{
 const db=banco(),s=criarServicoRascunhos(db),id=crypto.randomUUID()
 const estado={...estadoVazio(),produtoGerado:criarProdutoValido(),capitulosPdfProntos:[criarCapitulo()],pdfPublicado:'http://localhost/uploads/produtos/1-'+crypto.randomUUID()+'.pdf'}
 await s.salvar(1,id,requisicao(estado))
 assert.deepEqual((await s.obter(1,id)).estado,estado)
 await assert.rejects(s.obter(2,id),e=>e.status===404)
 assert.deepEqual(await s.listar(2),[])
 await assert.rejects(s.salvar(2,id,requisicao()),e=>e.status===409)
 assert.equal((await s.obter(1,id)).estado.pdfPublicado,estado.pdfPublicado)
})
test('Conflito de versão não sobrescreve e repetição de gravação é idempotente',async()=>{
 const s=criarServicoRascunhos(banco()),id=crypto.randomUUID(),r=requisicao()
 assert.equal((await s.salvar(1,id,r)).versao,1)
 assert.equal((await s.salvar(1,id,r)).versao,1)
 await assert.rejects(s.salvar(1,id,requisicao()),e=>e.status===409)
 await s.salvar(1,id,requisicao({...estadoVazio(),textoPrompt:'nova ideia'},1))
 assert.equal((await s.obter(1,id)).estado.textoPrompt,'nova ideia')
})
test('Rascunho publicado é somente leitura',async()=>{
 const db=banco(),s=criarServicoRascunhos(db),id=crypto.randomUUID()
 await s.salvar(1,id,requisicao());db.linhas.get(id).produto_publicado_id=5
 await assert.rejects(s.salvar(1,id,requisicao(estadoVazio(),1)),e=>e.status===409)
})
test('Rejeita PDF de outra conta, estrutura corrompida e capítulo sem produto',()=>{
 assert.throws(()=>validarEstado({...estadoVazio(),pdfPublicado:'http://localhost/uploads/produtos/2-'+crypto.randomUUID()+'.pdf'},1))
 assert.throws(()=>validarEstado({...estadoVazio(),capitulosPdfProntos:[criarCapitulo()]},1))
 assert.throws(()=>validarEstado({...estadoVazio(),produtoGerado:{}},1))
 assert.equal(nomePdf('http://localhost/uploads/produtos/1-../../secret.pdf',1),null)
 assert.equal(nomePdf('http://localhost/uploads/produtos/1-'+crypto.randomUUID()+'.pdf',1)?.endsWith('.pdf'),true)
})
test('Limita tamanho e rejeita histórico com role system',()=>{
 const estado=estadoVazio();estado.historicos.consultor=[{role:'system',content:'teste'}]
 assert.throws(()=>validarEstado(estado,1),e=>e.status===400)
 assert.throws(()=>validarEstado({...estadoVazio(),extra:'x'.repeat(2100000)},1),e=>e.status===413)
})
test('API exige JWT e aceita rascunho maior que parser global de 100kb',async t=>{
 process.env.JWT_SECRET='test-draft'
 const app=express();app.use('/ia/rascunhos',criarRotasRascunhos(criarServicoRascunhos(banco())));app.use(express.json())
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r))
 t.after(()=>{server.closeAllConnections();server.close()})
 const base='http://127.0.0.1:'+server.address().port+'/ia/rascunhos'
 const id=crypto.randomUUID()
 assert.equal((await fetch(base)).status,401)
 const headers={'Content-Type':'application/json',Authorization:'Bearer '+jwt.sign({id:1},process.env.JWT_SECRET)}
 const estado=estadoVazio();estado.historicos.consultor=[{role:'assistant',content:'a'.repeat(120000)}]
 const result=await fetch(base+'/'+id,{method:'PUT',headers,body:JSON.stringify(requisicao(estado))})
 assert.equal(result.status,200)
 const other=await fetch(base+'/'+id,{headers:{Authorization:'Bearer '+jwt.sign({id:2},process.env.JWT_SECRET)}})
 assert.equal(other.status,404)
 const invalid=await fetch(base+'/'+id,{method:'PUT',headers,body:'{'})
 assert.equal(invalid.status,400)
})
