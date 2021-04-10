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

    manageposts: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // se usuario é admin
            if (data.role === 'admin') {

                // obter dados de usuários
                let posts = await database.getPosts();

                // exibir página e passar dados 
                res.render('ejs/manage-posts.ejs', { data, posts, token });
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

                // obter data dd/mm/yyy
                let date = generateDate();

                // exibir página de publicação
                res.render('ejs/publish.ejs', { data, token, date });
            }

        } catch (error) {
            console.log(error.message);
        }
    },

    signup: (req, res, next) => {
        res.render('ejs/signup.ejs');
    },

    updatepost: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // recuperar id de usuário
            let id = req.query.id;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados do post
                let post = await database.getPostById(id);

                // ajustar data de dd/mm/yyyy para o padrão yyyy-mm-dd
                let resetDate = post.date.split('/');
                resetDate = `${resetDate[2]}-${resetDate[1]}-${resetDate[0]}`;
                post.date = resetDate;

                // exibir página de usuários e passar dados 
                res.render('ejs/update-post.ejs', { data, id, post, token });
            }

        } catch (error) {
            console.log(error.message);
        }
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

                // gerar token JWT (expira em 1 hora)
                const token = jwt.sign({ name, email, role }, req.app.get('superSecret'), { expiresIn: '1h' });

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
            obj.video = req.body.video;
            obj.text = req.body.text;
            obj.date = req.body.date;

            // extrair url do código embutido do vídeo
            obj.video = obj.video.split('src="')[1];
            obj.video = obj.video.split('"')[0];

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

    updatepost: async (req, res, next) => {

        try {

            // obter token da url
            let token = req.query.token;

            // obter id do formulário
            let id = req.body.id;

            // carregar página da postagem
            res.redirect(`/updatepost?token=${token}&id=${id}`);

        } catch (error) {
            console.log(error.message);
        }

    },

}

// PUT
const put = {

    saveeditions: async (req, res, next) => {

        try {

            // recuperar token passado na url
            let token = req.query.token;

            // criar objeto com dados enviados pelo formulário
            let obj = {};
            obj.id = req.query.id; // id da url
            obj.title = req.body.title;
            obj.video = req.body.video;
            obj.text = req.body.text;
            obj.date = req.body.date;

            // ajustar data para padrão dd/mm/yyyy
            let newDate = obj.date.split('-');
            newDate = `${newDate[2]}/${newDate[1]}/${newDate[0]}`;
            obj.date = newDate;

            // atualizar post
            await database.saveEditions(obj);

            // redirecionar a pagina de login
            res.redirect('/login?token=' + token);

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
    },

    deletepost: async (req, res, next) => {

        try {

            let id = req.body.id;

            // deletar usuário pelo id
            await database.deletePost(id);

            // recarregar a página
            res.redirect('back');

        } catch (error) {
            console.log(error.message);
        }
    }
}

// gerar data no padrão internacional yyyy/mm/dd
function generateDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

module.exports = {
    get, post, put, del
}

/*

    Referências

    [1] How do I get the current date in JavaScript?
        https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript

*/