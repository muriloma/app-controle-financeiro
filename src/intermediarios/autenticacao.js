const jwt = require('jsonwebtoken');
require('dotenv').config();

const autenticarLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado.' })
    };

    const token = authorization.split(' ')[1];

    try {
        const assinaturaToken = jwt.verify(token, process.env.CHAVE_SECRETA);
        req.usuario = assinaturaToken;

        next();
    } catch (error) {

        if (error.message === 'invalid signature') {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
        }
        return res.status(401).json({ mensagem: 'Não autorizado.' })
    };
};
module.exports = { autenticarLogin };