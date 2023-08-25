const { Router } = require('express');
const usuario = require('./controladores/usuarios');


const rotas = Router();

rotas.post('/usuario', usuario.cadastrar);
rotas.post('/login', usuario.login);

module.exports = rotas;