'use strict';

const jwt = require('jsonwebtoken');

// GET
let get = {
    index: (req, res, next) => {
        res.render('ejs/index.ejs');
    },
    protected: (req, res, next) => {

        jwt.verify(req.token, 'my_secret_key', (err, data) => {

            if (err) {
                // enviar mensagem de acesso proibido
                res.sendStatus(403);

            } else {
                res.json({ text: 'Bem vindo!', data })
            }
        });

        res.json({ text: 'protected' });
    },
}

// POST
let post = {
    login: (req, res, next) => {
        const user = { id: 3 };
        const token = jwt.sign({ user }, 'my_secret_key');
        res.json({ token });
    },
}

module.exports = {
    get, post
}