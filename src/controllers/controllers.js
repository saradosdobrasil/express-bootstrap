'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// GET
const get = {

    index: (req, res, next) => {
        res.render('ejs/index.ejs');
    },

    protected: (req, res, next) => {

        jwt.verify(req.token, req.app.get('superSecret'), (err, data) => {

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
const post = {

    login: (req, res, next) => {
        const user = { id: 3 };
        const token = jwt.sign({ user }, req.app.get('superSecret'));
        res.json({ token });
    },
}

module.exports = {
    get, post
}