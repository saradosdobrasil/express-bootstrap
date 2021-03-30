'use strict';

const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const database = require('./database');

// GET
const get = {

    index: (req, res, next) => {

        // obter objeto Socket.IO configurado no arquivo 'server.js'
        let io = req.io;

        // enviar dados para o Socket.IO
        io.emit('test', 'Olá');

        res.render('ejs/index.ejs');
    },

    home: (req, res, next) => {

        let token = req.query.token;

        jwt.verify(token, req.app.get('superSecret'), (err, data) => {

            if (err) {
                // enviar mensagem de acesso proibido
                res.sendStatus(403);

            } else {
                res.json({ text: 'Bem vindo!', data })
            }
        });

    },

    signup: (req, res, next) => {
        res.render('ejs/signup.ejs');
    }

}

// POST
const post = {

    login: async (req, res, next) => {

        try {

            let email = req.body.email;
            let password = req.body.password;

            // verificar se usuário existe no banco a partir dos dados informados
            let searchUser = await database.searchUser(email, password);

            // se usuário não existe
            if (searchUser.length === 0) {

                // exibir página usuário não cadastrado
                res.render('ejs/login_fail.ejs')
            }

            // se usuário existe
            if (searchUser.length === 1) {

                // gerar token
                const token = jwt.sign({ email: email }, req.app.get('superSecret'));

                // armazenar token
                req.token = token;

                // redirecionar à pagina inicial
                res.redirect('/home?token=' + token);

            }

        } catch (error) {
            console.log(error.message);
        }

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