const pool = require('../conexao')
const { buscarCategoria } = require('../utils/funcoesAux')

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

const detalhar = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Por favor informe um id de categoria válido." })
    }

    try {
        const categoria = await buscarCategoria(id, usuarioId)

        if (!categoria.rows[0]) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." })
        }

        return res.status(200).json(categoria[0])
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    };

}

const excluir = async (req, res) => {
    const { id } = req.params
    const usuarioId = req.usuario.id

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Por favor informe um id de categoria válido." })
    }

    try {
        const categoria = await buscarCategoria(id, usuarioId);

        if (!categoria.rows[0]) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        const transacoes = await pool.query({
            text: `SELECT * FROM transacoes WHERE categoria_id = $1 AND usuario_id = $2`,
            values: [id, usuarioId]
        });

        if (transacoes.rowCount > 0) {
            return res.status(403).json({ mensagem: "Não é possível excluir uma categoria com transações cadastradas." })
        }

        await pool.query({
            text: `DELETE FROM categorias WHERE id = $1 AND usuario_id = $2`,
            values: [id, usuarioId]
        });

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

const atualizar = async (req, res) => {
    const { id: usuarioId } = req.usuario;
    const { id } = req.params;
    let { descricao } = req.body;

    if (!descricao) {
        return res.status(400).json({ mensagem: "A descrição da categoria deve ser informada." })
    }
    descricao = descricao.toLowerCase()

    try {
        const categoria = await buscarCategoria(id, usuarioId)

        if (categoria.rowCount === 0) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        await pool.query({
            text: `UPDATE categorias SET descricao = $1 WHERE id = $2`,
            values: [descricao, id]
        });

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};


module.exports = {
    cadastrar,
    listar,
    detalhar,
    excluir,
    atualizar
}