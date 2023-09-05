const { Router } = require('express');
const usuario = require('./controladores/usuarios');
const categoria = require('./controladores/categorias')
const transacoes = require('./controladores/transacoes')
const { autenticarLogin } = require('./intermediarios/autenticacao')



const rotas = Router();

rotas.post('/usuario', usuario.cadastrar);
rotas.post('/login', usuario.login);

rotas.use(autenticarLogin)

rotas.get('/usuario', usuario.detalhar)
rotas.put('/usuario', usuario.atualizar)

rotas.post('/categoria', categoria.cadastrar)
rotas.get('/categoria', categoria.listar)
rotas.get('/categoria/:id', categoria.detalhar)
rotas.delete('/categoria/:id', categoria.excluir)
rotas.put('/categoria/:id', categoria.atualizar)

rotas.post('/transacao', transacoes.cadastrar)
rotas.get('/transacao', transacoes.listar)
rotas.get('/transacao/extrato', transacoes.extrato)
rotas.get('/transacao/:id', transacoes.detalhar)
rotas.put('/transacao/:id', transacoes.atualizar)
rotas.delete('/transacao/:id', transacoes.excluir)

module.exports = rotas;