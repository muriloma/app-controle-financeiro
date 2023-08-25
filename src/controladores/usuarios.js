const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate } = require("email-validator");
const { verificarSeEmailEmUso } = require('../utils/funcoesAux')
require('dotenv').config();



const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Dados não informados.' })
    };

    if (!validate(email)) {
        return res.status(400).json({ mensagem: 'Por favor informe um email válido.' })
    };

    try {
        if (await verificarSeEmailEmUso(email)) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastroUsuario = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3) RETURNING id, nome, email
        `;

        const { rows } = await pool.query(queryCadastroUsuario, [nome, email, senhaCriptografada]);

        return res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Dados não informados.' })
    };

    try {
        const buscarUsuario = await pool.query({
            text: `SELECT * FROM usuarios WHERE email = $1`,
            values: [email]
        });

        if (buscarUsuario.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        };

        const senhaValidada = await bcrypt.compare(senha, buscarUsuario.rows[0].senha);

        if (!senhaValidada) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        };

        const { id, nome } = buscarUsuario.rows[0];

        const token = jwt.sign({ id }, process.env.CHAVE_SECRETA, { expiresIn: '60 min' });

        const usuario = { id, nome, email };

        return res.status(200).json({ usuario, token });
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    };
};


module.exports = {
    cadastrar,
    login
}