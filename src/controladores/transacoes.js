const pool = require('../conexao');

const listar = async (req, res) => {
    let { filtro } = req.query;

    try {
        const { rows: transacoes } = await pool.query({
            text: `
                SELECT  t.*, c.descricao AS categoria_nome
                FROM transacoes t JOIN categorias c 
                ON t.categoria_id = c.id WHERE t.usuario_id = $1 
                AND c.usuario_id = $1;
                `,
            values: [req.usuario.id]
        })

        if (filtro) {
            let transacoesFiltradas = [];

            for (let categoria of filtro) {
                const transacoesEscolhidas = transacoes.filter((transacao) => {
                    return transacao.categoria_nome.includes(categoria.toLowerCase())
                })
                transacoesFiltradas = transacoesFiltradas.concat(transacoesEscolhidas)
            }
            return res.status(200).json(transacoesFiltradas)
        };
        return res.status(200).json(transacoes);

    } catch (error) {
        return res.status(500).json({ erro: error.message })
    };
};


module.exports = {
    listar
};