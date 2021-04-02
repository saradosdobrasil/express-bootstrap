'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const database = require('./database');

// GET
const get = {

    index: (req, res, next) => {
        res.render('ejs/index.ejs', { alert: 'login' });
    },

    login: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware
            let data = req.data;

            // exibir página do admin
            if (data.role === 'admin') {

                let users = await database.getUsers();

                res.render('ejs/admin.ejs', { data, users });
            }

            // exibir página do usuário
            if (data.role === 'user') {
                res.render('ejs/home.ejs', { data });
            }

        } catch (error) {
            console.log(error.message);
        }

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
                res.render('ejs/index.ejs', { alert: 'user not found' });
            }

            // se usuário existe
            if (searchUser.length === 1) {

                // obter nome do usuário
                let name = searchUser[0].name;

                let id = searchUser[0].id;

                // obter papel do usuário
                let role = searchUser[0].role;

                // gerar token JWT
                const token = jwt.sign({ name, email, role }, req.app.get('superSecret'));

                // redirecionar à rota de autenticação
                res.redirect(`/login?id=${id}&token=` + token);

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

            // verificar se existe conta de email cadastrada
            let searchEmail = await database.searchEmail(email);

            // se existe conta de email cadastrada
            if (searchEmail.length > 0) {

                // voltar a pagina inicial e exibir alerta de usuário já registrado
                req.baseUrl = '/';
                res.render('ejs/index.ejs', { alert: 'user already registered' });
            }
            else
                if (searchEmail.length === 0) {

                    // obter dados do último usuário cadastrado (por id)
                    let users = await database.getLastUser();
                    let lastId = users[0].id;
                    let newId = lastId + 1;

                    // criar novo usuário
                    let newUser = new User(newId, name, password, email);

                    // salvar novo usuário no banco
                    await database.saveUser(newUser);

                    // redirecionar à pagina de login
                    res.redirect('/');
                }

        } catch (error) {
            console.log(error.message);
        }

    },
}

// DELETE
const del = {

    user: async (req, res, next) => {

        try {

            let token = req.query.token;
            let id = req.body.id;

            let deleteUser = await database.deleteUser(id);
            console.log(deleteUser);

            res.redirect('/home?token=' + token);


        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = {
    get, post, del
}