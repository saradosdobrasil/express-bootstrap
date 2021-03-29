'use strict';

const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const database = require('./database');

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

    signup: (req, res, next) => {
        res.render('ejs/signup.ejs');
    }

}

// POST
const post = {

    login: (req, res, next) => {
        const user = { id: 3 };
        const token = jwt.sign({ user }, req.app.get('superSecret'));
        res.json({ token });
    },

    signup: async (req, res, next) => {

        try {

            // dados do formulário
            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;

            // obter dados do último usuário cadastrado (por id)
            let users = await database.getUsers();
            let lastId = users[0].id;
            let newId = lastId + 1;

            // criar novo usuário
            let newUser = new User(newId, name, password, email);

            // salvar novo usuário no banco
            await database.saveUser(newUser);

            // gerar token
            const token = jwt.sign({ id: newId, name: name, email: email }, req.app.get('superSecret'));

            // armazenar token
            req.token = token;

            // direcionar a página de login
            res.render('ejs/index.ejs');

        } catch (error) {
            console.log(error.message);
        }

    },
}


module.exports = {
    get, post
}