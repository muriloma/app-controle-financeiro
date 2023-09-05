const pool = require('../conexao');
const { buscarCategoria, buscarTransacao } = require('../utils/funcoesAux')


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

const cadastrar = async (req, res) => {
    let { descricao, valor, data, categoria_id, tipo } = req.body
    const { id: usuarioId } = req.usuario
    descricao = descricao.toLowerCase()
    tipo = tipo.toLowerCase()
    valor = Number(valor)

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: 'Por favor, informe o tipo de transação correto.' })
    }

    if (isNaN(valor)) {
        return res.status(400).json({ mensagem: 'Informe um valor válido.' })
    }

    try {
        const categoria = await buscarCategoria(categoria_id, usuarioId)

        if (categoria.rowCount === 0) {
            return res.status(404).json({ mensagem: "Essa categoria não existe." })
        }

        let { rows } = await pool.query({
            text: `INSERT INTO transacoes (tipo, descricao, valor, data, usuario_id, categoria_id)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `,
            values: [tipo, descricao, valor, data, usuarioId, categoria_id]
        })
        const transacao = rows[0]

        transacao.categoria_nome = categoria.rows[0].descricao

        return res.status(201).json(transacao)
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};

const extrato = async (req, res) => {
    const { id: usuarioId } = req.usuario;

    try {
        const query = 'SELECT SUM(valor) AS total FROM transacoes WHERE usuario_id = $1 AND tipo = $2';

        const { rows: entrada } = await pool.query(query, [usuarioId, 'entrada'])
        const { rows: saida } = await pool.query(query, [usuarioId, 'saida'])

        const valorEntradas = entrada[0] && entrada[0].total ? entrada[0].total : 0;
        const valorSaidas = saida[0] && saida[0].total ? saida[0].total : 0;

        const total = {
            entrada: valorEntradas,
            saida: valorSaidas,
        };

        return res.status(200).json(total);
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }

};

const detalhar = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Por favor informe um Id de transação válido." })
    }

    try {
        const { rows } = await pool.query({
            text: `SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2`,
            values: [id, usuarioId]
        });

        const { rows: transacao } = await buscarTransacao(id, usuarioId)

        if (!transacao[0]) {
            return res.status(404).json({ mensagem: "Transação não encontrada." })
        }

        return res.status(200).json(transacao[0])
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    };
};

const atualizar = async (req, res) => {
    const { id } = req.params
    const { id: usuarioId } = req.usuario
    let { descricao, valor, data, categoria_id, tipo } = req.body

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Por favor informe um id de transação válido." })
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ mensagem: "Informe ao menos um dado para ser atualizado." })
    }

    try {
        const transacao = await buscarTransacao(id, usuarioId);

        if (transacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." })
        };

        if (tipo) {
            tipo = tipo.toLowerCase()
            if (tipo !== 'entrada' && tipo !== 'saida') {
                return res.status(400).json({ mensagem: 'Por favor, informe o tipo de transação correto.' })
            }
        };

        if (categoria_id) {
            if (isNaN(Number(categoria_id))) {
                return res.status(400).json({ mensagem: "Por favor informe um id de categoria válido." })
            }
            const categoria = await buscarCategoria(categoria_id, usuarioId);

            if (categoria.rowCount === 0) {
                return res.status(404).json({ mensagem: "Essa categoria não existe." })
            }

            if (categoria.rows[0].usuario_id != usuarioId) {
                return res.status(404).json({ mensagem: "Categoria não cadastrada para o usuário." })
            };
        };
        if (valor) {
            if (isNaN(Number(valor))) {
                return res.status(400).json({ mensagem: "O valor informado deve ser um número válido" })
            }
        }

        for (let i = 0; i < Object.keys(req.body).length; i++) {
            const dado = Object.keys(req.body)[i];
            const conteudo = Object.values(req.body)[i];

            await pool.query({
                text: `UPDATE transacoes SET ${dado} = $1 WHERE id = $2`,
                values: [conteudo, id]
            })
        };

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};

const excluir = async (req, res) => {
    const { id } = req.params
    const { id: usuarioId } = req.usuario

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Por favor informe um id de transação válido." })
    }

    try {
        const transacao = await buscarTransacao(id, usuarioId)

        if (transacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." })
        }

        await pool.query({
            text: `DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2`,
            values: [id, usuarioId]
        })

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ erro: error.message })
    }
};


module.exports = {
    listar,
    cadastrar,
    extrato,
    detalhar,
    atualizar,
    excluir
};