const pool = require('../conexao')

const cadastrar = async (req, res) => {
    const { id: usuarioId } = req.usuario
    let { descricao } = req.body

    if (!descricao) {
        return res.status(400).json({ mensagem: "A descrição da categoria deve ser informada." })
    }

    try {
        descricao = descricao.toLowerCase()

        const { rows: categoriaCriada } = await pool.query({
            text: `INSERT INTO categorias (usuario_id, descricao) values ($1,$2) RETURNING *`,
            values: [usuarioId, descricao]
        })

        return res.status(201).json(categoriaCriada[0]);
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};

const listar = async (req, res) => {
    const { id: usuarioId } = req.usuario

    try {
        const { rows } = await pool.query({
            text: `SELECT * FROM categorias WHERE usuario_id = $1`,
            values: [usuarioId]
        })

        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};


module.exports = {
    cadastrar,
    listar
}