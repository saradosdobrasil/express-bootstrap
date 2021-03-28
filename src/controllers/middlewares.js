'use strict';

module.exports = {

    // verifica se existe token no cabeçalho da requisição
    checkToken: (req, res, next) => {

        const bearerHeader = req.headers['authorization'];

        // se houver cabeçalho de autorização na requisição
        if (typeof bearerHeader !== 'undefined') {

            // cortar string bearer
            const bearer = bearerHeader.split(' ');

            // extrair token do bearer
            const bearerToken = bearer[1];

            // armazenar token na requisição
            req.token = bearerToken;

            // prosseguir a requisição
            next();

        } else {

            // se não houver cabeçalho de autorização enviar mensagem de acesso não permitido
            res.sendStatus(403);
        }

    },

}