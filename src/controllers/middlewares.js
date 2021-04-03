'use strict';

const jwt = require('jsonwebtoken');

module.exports = {

    authentication: (req, res, next) => {

        let token = req.query.token;

        // verificar token
        jwt.verify(token, req.app.get('superSecret'), (err, data) => {

            // se token for inválido
            if (err) {

                // redirecionar à pagina de login
                res.redirect('/');

            }
            // se token for válido
            else {

                // guardar dados na requisição
                req.data = data;

                // liberar acesso à rota
                next();
            }
        });
    },

    authorization: (req, res, next) => {

        // se houver parâmetro query na url
        if (req.query.apikey !== undefined) {

            // se valor do parâmetro for igual a chave da API
            if (req.query.apikey === process.env.APIKEY) {
                console.log('Acesso autorizado a API');
                next();
            }

        } else {
            // voltar à pagina de login
            res.redirect('/');
        }
    }
}