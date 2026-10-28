const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')
const vm = require('node:vm')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let consultar
const arquivoDb = require.resolve('../src/config/db')
require.cache[arquivoDb] = { id: arquivoDb, filename: arquivoDb, loaded: true, exports: { query: (...args) => consultar(...args) } }
const { cadastrar, login } = require('../src/controllers/authController')
async function chamar(fn, body) {
  const res = { codigo: 200, status(codigo) { this.codigo = codigo; return this }, json(dados) { this.dados = dados; return this } }
  await fn({ body }, res)
  return res
}
const valido = { nome: 'Pessoa Teste', email: 'teste@example.com', senha: 'Senha123' }
test('cadastro e login rejeitam entradas inválidas antes de consultar banco', async () => {
  consultar = () => { throw Error('Banco não deveria ser consultado') }
  for (const body of [undefined, null, {}, [], {...valido,email:42}, {...valido,senha:{}}, {...valido,email:'sem-arroba'}, {...valido,email:'a @b.com'}, {...valido,email:'a'.repeat(95)+'@b.com'}]) {
    assert.equal((await chamar(cadastrar, body)).codigo, 400)
    assert.equal((await chamar(login, body)).codigo, 400)
  }
  for (const extra of [{nome:'   '},{nome:42},{nome:'a'.repeat(101)},{senha:'curta'},{senha:'a'.repeat(73)},{senha:'á'.repeat(37)}]) {
    assert.equal((await chamar(cadastrar,{...valido,...extra})).codigo,400)
  }
})
test('cadastro preserva espaços na senha e login autentica o mesmo valor', async () => {
  let usuario
  const senha = '  Senha123  '
  consultar = async (sql,args) => {
    if (sql.startsWith('select id')) return [[]]
    assert.equal(args[0],valido.nome)
    assert.equal(args[1],valido.email)
    usuario = {id:1,nome:args[0],senha:args[2]}
    return [{insertId:1}]
  }
  assert.equal((await chamar(cadastrar,{...valido,nome:' Pessoa Teste ',email:' teste@example.com ',senha})).codigo,201)
  assert.equal(await bcrypt.compare(senha,usuario.senha),true)
  assert.equal(await bcrypt.compare(senha.trim(),usuario.senha),false)
  consultar = async () => [[usuario]]
  const anterior = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'somente-para-teste-local'
  try {
    const resposta = await chamar(login,{email:' teste@example.com ',senha})
    assert.equal(resposta.codigo,200)
    assert.equal(jwt.verify(resposta.dados.token,process.env.JWT_SECRET).id,1)
    assert.equal((await chamar(login,{email:valido.email,senha:senha.trim()})).codigo,401)
  } finally { if (anterior === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = anterior }
})
test('falhas internas não expõem detalhes e duplicação de e-mail é tratada', async t => {
  const logs = t.mock.method(console,'error',()=>{})
  consultar = async () => { throw Error('SQL secreto /host/interno') }
  for (const fn of [cadastrar,login]) {
    const resposta = await chamar(fn,valido)
    assert.equal(resposta.codigo,500)
    assert.doesNotMatch(JSON.stringify(resposta.dados),/SQL|host|interno/)
  }
  assert.equal(logs.mock.callCount(),2)
  consultar = async () => { throw Object.assign(Error('duplicado'),{code:'ER_DUP_ENTRY'}) }
  assert.equal((await chamar(cadastrar,valido)).codigo,400)
})
test('formulário envia senha sem trim e rejeita confirmação diferente', async () => {
  const campos = {'cadastro-nome':{value:valido.nome},'cadastro-email':{value:valido.email},'cadastro-senha':{value:'  Senha123  '},'cadastro-rep-senha':{value:'  Senha123  '},termos:{checked:true}}
  let executar, enviado, aviso
  campos['btn-cadastrar']={addEventListener:(_,fn)=>{executar=fn}}
  const contexto = {document:{getElementById:id=>campos[id]},window:{i18n:{t:k=>k}},MonetizaUI:{aviso:async m=>{aviso=m}},fetch:async (_,op)=>{enviado=JSON.parse(op.body);return {ok:false,json:async()=>({erro:'Teste sem servidor'})}}}
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/public/js/cadastro.js'),'utf8'),contexto)
  await executar({preventDefault(){}})
  assert.equal(enviado.senha,'  Senha123  ')
  enviado=null;campos['cadastro-rep-senha'].value='Senha123'
  await executar({preventDefault(){}})
  assert.equal(enviado,null)
  assert.equal(aviso,'cadastro.js.senhasDiferentes')
})
