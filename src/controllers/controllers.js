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

            const user = {};
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;

            console.log(user);

            let users = await database.getUsers();
            let lastId = users[0].id;
            let newId = lastId + 1;

            let newUser = new User(newId, user.name, user.password, user.email);
            console.log(newUser);
            let saveNewUser = await database.saveUser(newUser);
            console.log("aaa", saveNewUser);


            // salvar usuário no banco
            // database.saveUser(user);

            // gerar token
            const token = jwt.sign({ user }, req.app.get('superSecret'));


            // armazenar token
            req.token = token;

            res.render('ejs/index.ejs');

        } catch (error) {
            console.log(error.message);
        }

    },
}


module.exports = {
    get, post
}