const {test} = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const express = require('express')
const draftId='11111111-1111-1111-1111-111111111111'
let draft={id:draftId,usuario_id:1,versao:2,produto_publicado_id:null}, inserts=0, falharCommit=false, antes
const db={getConnection:async()=>({
 beginTransaction:async()=>{antes={draft:{...draft},inserts}},
 query:async(sql,args)=>{
  if(sql.startsWith('SELECT')) {assert.match(sql,/FOR UPDATE/);return [[...(args[0]===draftId&&args[1]===draft.usuario_id?[{...draft}]:[])]]}
  if(sql.includes('INSERT INTO produtos')){inserts++;return [{insertId:50}]}
  if(sql.includes('UPDATE ia_rascunhos')){draft.produto_publicado_id=args[0];draft.versao++;return [{affectedRows:1}]}
  throw Error(sql)
 },commit:async()=>{if(falharCommit)throw Error('Falha simulada')},
 rollback:async()=>{draft=antes.draft;inserts=antes.inserts},release:()=>{}
})}
const configPath=path.resolve(__dirname,'../src/config/db.js')
require.cache[configPath]={id:configPath,filename:configPath,loaded:true,exports:db}
const {criar}=require('../src/controllers/produtoController')
test('Publicação vincula produto uma vez, rejeita outra conta/versão e desfaz falha',async t=>{
 const app=express();app.use(express.json());app.post('/',(req,res)=>{req.usuario={id:Number(req.headers['x-user']||1)};return criar(req,res)})
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>{server.closeAllConnections();server.close()})
 const body={titulo:'Meu produto',categoria:'E-book',preco:10,comissao:0,capa:'https://example.com/capa.jpg',produto_arquivo:'https://example.com/arquivo.pdf',rascunho_id:draftId,rascunho_versao:2}
 const post=(changes={},user=1)=>fetch('http://127.0.0.1:'+server.address().port,{method:'POST',headers:{'Content-Type':'application/json','x-user':String(user)},body:JSON.stringify({...body,...changes})})
 assert.equal((await post({},2)).status,404)
 assert.equal((await post({rascunho_versao:1})).status,409)
 falharCommit=true;assert.equal((await post()).status,500);assert.equal(inserts,0);assert.equal(draft.produto_publicado_id,null)
 falharCommit=false
 assert.equal((await post()).status,201)
 assert.equal(draft.produto_publicado_id,50)
 const repetida=await post()
 assert.equal(repetida.status,200);assert.equal((await repetida.json()).id,50);assert.equal(inserts,1)
})
