const pool = require('../conexao');

async function verificarSeEmailEmUso(email) {
    try {
        const emailBuscado = await pool.query({
            text: `SELECT * FROM usuarios WHERE email = $1`,
            values: [email]
        })

        if (emailBuscado.rowCount > 0) {
            return true
        }
        if (emailBuscado.rowCount === 0) {
            return false
        }
    } catch (error) {
        return error.message
    }
};

async function buscarCategoria(categoriaId, usuarioId) {
    try {
        const categoria = await pool.query({
            text: `SELECT * FROM categorias WHERE id = $1 AND usuario_id = $2`,
            values: [categoriaId, usuarioId]
        })

        return categoria
    } catch (error) {
        return error.message
    }
};


module.exports = {
    verificarSeEmailEmUso,
    buscarCategoria
}