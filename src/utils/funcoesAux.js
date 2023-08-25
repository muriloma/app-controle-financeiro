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


module.exports = {
    verificarSeEmailEmUso
}