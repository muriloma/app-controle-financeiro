const { Router } = require('express');
const usuario = require('./controladores/usuarios');
const categoria = require('./controladores/categorias')
const { autenticarLogin } = require('./intermediarios/autenticacao')



const rotas = Router();

rotas.post('/usuario', usuario.cadastrar);
rotas.post('/login', usuario.login);

rotas.use(autenticarLogin)

rotas.get('/usuario', usuario.detalhar)
rotas.put('/usuario', usuario.atualizar)

rotas.post('/categoria', categoria.cadastrar)
rotas.get('/categoria', categoria.listar)


module.exports = rotas;