'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const database = require('./database');

// GET
const get = {

    admins: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados de posts
                let admins = await database.getAdmins();

                // exibir página de usuários e passar dados 
                res.render('ejs/admins.ejs', { data, admins, token });
            }

        } catch (error) {
            console.log(error.message);
        }
    },

    index: (req, res, next) => {
        res.render('ejs/index.ejs', { alert: 'login' });
    },

    login: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // exibir página do admin
            if (data.role === 'admin') {

                // obter dados de usuários
                let users = await database.getUsers();

                // exibir página de admin e passar dados 
                res.render('ejs/home-admin.ejs', { data, users, token });
            }

            // exibir página do usuário
            if (data.role === 'user') {

                // obter dados de posts
                let posts = await database.getPosts();

                // exibir página de usuário e passar dados 
                res.render('ejs/home.ejs', { data, posts, token });
            }

        } catch (error) {
            console.log(error.message);
        }

    },

    publish: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados de posts
                let users = await database.getUsers();

                // exibir página de usuários e passar dados 
                res.render('ejs/publish.ejs', { data, users, token });
            }

        } catch (error) {
            console.log(error.message);
        }
    },

    signup: (req, res, next) => {
        res.render('ejs/signup.ejs');
    },

    users: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados de posts
                let users = await database.getUsers();

                // exibir página de usuários e passar dados 
                res.render('ejs/users.ejs', { data, users, token });
            }

        } catch (error) {
            console.log(error.message);
        }
    }

}

// POST
const post = {

    // criação do token de acesso
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

                // obter papel do usuário
                let role = searchUser[0].role;

                // gerar token JWT
                const token = jwt.sign({ name, email, role }, req.app.get('superSecret'));

                // redirecionar à rota de autenticação
                res.redirect(`/login?token=` + token);

            }

        } catch (error) {
            console.log(error.message);
        }

    },

    publish: async (req, res, next) => {

        try {

            // recuperar token passado na url
            let token = req.query.token;

            // criar objeto com dados enviados pelo formulário
            let obj = {};
            obj.id = '';
            obj.title = req.body.title;
            obj.text = req.body.text;
            obj.date = req.body.date;

            // ajustar data para padrão dd/mm/yyyy
            let newDate = obj.date.split('-');
            newDate = `${newDate[2]}/${newDate[1]}/${newDate[0]}`;
            obj.date = newDate;

            // obter id do último post
            let lastPost = await database.getLastPost();

            if (lastPost.length === 0) {
                obj.id = 1;
            } else {
                obj.id = lastPost[0].id + 1;
            }

            // salvar post
            await database.savePost(obj);

            // redirecionar a pagina de login
            res.redirect('/login?token=' + token);

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

    deleteuser: async (req, res, next) => {

        try {

            let id = req.body.id;

            // deletar usuário pelo id
            await database.deleteUser(id);

            // recarregar a página
            res.redirect('back');

        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = {
    get, post, del
}