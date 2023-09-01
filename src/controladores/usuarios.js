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

const detalhar = async (req, res) => {
    const { id } = req.usuario;

    if (!id) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }

    try {
        const usuario = await pool.query({
            text: `SELECT id, nome, email FROM usuarios WHERE id = $1`,
            values: [id]
        })

        return res.status(200).json(usuario.rows[0])
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};

const atualizar = async (req, res) => {
    const { id } = req.usuario;
    const { nome, email, senha } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ mensagem: "Informe ao menos um dado para ser atualizado." })
    }

    try {
        const { rows: usuario } = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id])


        for (let dado of Object.keys(req.body)) {
            const queryAtualizarDado = `UPDATE usuarios SET ${dado} = $1 WHERE id = $2`;

            if (dado.toLowerCase() === 'nome') {
                await pool.query(queryAtualizarDado, [nome, id])
            }

            if (dado.toLowerCase() === 'email') {
                if (usuario[0].email !== email) {
                    if (await verificarSeEmailEmUso(email)) {
                        return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' })
                    }
                }
                await pool.query(queryAtualizarDado, [email, id])
            }

            if (dado.toLowerCase() === 'senha') {
                const senhaCriptografada = await bcrypt.hash(senha, 10);
                await pool.query(queryAtualizarDado, [senhaCriptografada, id])
            }
        };

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    };
};

module.exports = {
    cadastrar,
    login,
    detalhar,
    atualizar
}