'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const public_db = require('./public_db');
const private_db = require('./private_db');

// GET
const get = {

    addtocarousel: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados de posts
                let images = await public_db.getListOfImages();

                // exibir página do carousel
                res.render('ejs/add-to-carousel.ejs', { data, images, token });
            }

        } catch (error) {
            console.log(error.message);
        }
    },

    admins: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados de posts
                let admins = await private_db.getAdmins();

                // exibir página de usuários e passar dados 
                res.render('ejs/admins.ejs', { data, admins, token });
            }

        } catch (error) {
            console.log(error.message);
        }
    },

    authentication: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // exibir página do admin
            if (data.role === 'admin') {

                // obter dados de usuários
                let users = await private_db.getUsers();

                // exibir página de admin e passar dados 
                res.render('ejs/home-admin.ejs', { data, users, token });
            }

            // exibir página do usuário
            if (data.role === 'user') {

                // obter dados de posts
                let posts = await private_db.getPosts();

                // criar resumo dos textos
                let length = 100;
                posts.forEach(post => {
                    if (post.text.length > length) {
                        post.text = post.text.substring(0, length) + "...";
                    }
                });

                let carousel = await public_db.getDataOfCarousel();
                let cards = await public_db.getDataOfCards();

                // exibir página de usuário e passar dados 
                res.render('ejs/home.ejs', { data, posts, carousel, cards, token });
            }

        } catch (error) {
            console.log(error.message);
        }

    },

    index: async (req, res, next) => {

        try {

            let carousel = await public_db.getDataOfCarousel();
            let cards = await public_db.getDataOfCards();

            res.render('ejs/index.ejs', { carousel, cards });

        } catch (error) {
            console.log(error.message);
        }
    },

    login: (req, res, next) => {
        res.render('ejs/login.ejs', { alert: 'login' });
    },

    managecarousel: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados de posts
                let carousel = await public_db.getDataOfCarousel();

                // exibir página do carousel
                res.render('ejs/manage-carousel.ejs', { carousel, data, token });
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
                let posts = await private_db.getPosts();

                // ajustar data para padrão dd/mm/yyyy
                let newDate;
                posts.map(post => {
                    newDate = post.date.split('-');
                    newDate = `${newDate[2]}/${newDate[1]}/${newDate[0]}`;
                    post.date = newDate;
                });

                // exibir página e passar dados 
                res.render('ejs/manage-posts.ejs', { data, posts, token });
            }

        } catch (error) {
            console.log(error.message);
        }

    },

    post: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // recuperar id do post
            let id = req.query.id;

            // obter dados do post, anterior e posterior
            let post = await private_db.getPostById(id);

            // formatar data para padrão brasileiro
            post.date = formatDate(post.date);

            let previous = await private_db.getPreviousPostById(id);
            let next = await private_db.getNextPostById(id);

            // verificar se post já foi curtido pelo usuário
            let postAlreadyLiked = await private_db.searchLikeOfUser(id, data.id);

            // obter número de likes do post
            let numberOfLikes = await private_db.getNumberOfLikes(id);

            // obter objeto do Socket.IO
            let io = req.io;

            // Enviar mensagem de conexão no lado servidor para o lado cliente
            io.on("connection", socket => {
                socket.emit("post", { numberOfLikes, postAlreadyLiked });
            });

            // exibir página da postagem
            res.render('ejs/post.ejs', { data, post, previous, next, token });


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

    updatecarousel: async (req, res, next) => {

        try {

            // recuperar dados do usuário autenticado passados no middleware 'authentication'
            let data = req.data;
            let token = req.token;

            // recuperar id de usuário
            let id = req.query.id;

            // se usuário é admin
            if (data.role === 'admin') {

                // obter dados do slide
                let slide = await public_db.getSlideOfCarouselById(id);

                // obter dados das imagens do carousel
                let images = await public_db.getListOfImages();

                // exibir página de edição do slide
                res.render('ejs/update-carousel.ejs', { data, id, slide, images, token });
            }

        } catch (error) {
            console.log(error.message);
        }
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
                let post = await private_db.getPostById(id);

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
                let users = await private_db.getUsers();

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


    addtocarousel: async (req, res, next) => {

        try {

            // recuperar token passado na url
            let token = req.query.token;

            // obter objeto do corpo do formulário
            let obj = req.body;

            // salvar no banco publico
            await public_db.saveToCarousel(obj);

            // redirecionar a pagina de autenticação
            res.redirect('/managecarousel?token=' + token);

        } catch (error) {
            console.log(error.message);
        }

    },

    // criação do token de acesso
    login: async (req, res, next) => {

        try {

            let email = req.body.email;
            let password = req.body.password;

            // verificar se existe e-mail de usuário no banco
            let searchUser = await private_db.searchUser(email);

            // se não existe e-mail de usuário
            if (searchUser.length === 0) {

                // exibir página usuário não cadastrado
                res.render('ejs/login.ejs', { alert: 'user not found' });

            }
            // se existe e-mail no banco 
            else {

                // verificar se a senha informada está correta
                let searchUserAndPassword = await private_db.searchUserAndPassword(email, password);

                // se usuário existe e senha está errada
                if (searchUserAndPassword.length === 0) {

                    res.render('ejs/login.ejs', { alert: 'user already registered' });
                }

                // se usuário existe e senha está correta
                if (searchUserAndPassword.length === 1) {

                    // obter nome do usuário
                    let id = searchUser[0].id;

                    // obter nome do usuário
                    let name = searchUser[0].name;

                    // obter papel do usuário
                    let role = searchUser[0].role;

                    // gerar token JWT (expira em 1 hora)
                    const token = jwt.sign({ id, name, email, role }, req.app.get('superSecret'), { expiresIn: '1h' });

                    // redirecionar à rota de autenticação
                    res.redirect(`/authentication?token=` + token);

                }

            }

        } catch (error) {
            console.log(error.message);
        }

    },

    // curtida em post
    like: async (req, res, next) => {

        try {

            // obter dados enviados pelo corpo da requisição
            let data = req.body;

            // variável para armazenar número de likes
            let numberOfLikes;

            // verificar se post já foi curtido pelo usuário
            let postAlreadyLiked = await private_db.searchLikeOfUser(data.postId, data.userId);

            // se já foi curtido
            if (postAlreadyLiked === true) {

                // remover like do usuário
                await private_db.deleteLike(data.postId, data.userId);

                // informar na interface que post não foi curtido
                postAlreadyLiked = false;

                // obter nova contagem de likes e retornar dados
                numberOfLikes = await private_db.getNumberOfLikes(data.postId);
                res.json({ postAlreadyLiked, numberOfLikes });

            }
            // se não foi curtido
            else {

                // criar objeto de usuário a partir dos dados enviados pelo formulário
                let obj = {}
                obj.id = Number(data.userId);
                obj.name = data.name;
                obj.email = data.email;
                obj.date = generateDate();
                obj.time = generateHour();

                //salvar like do usuário no banco
                await private_db.saveLike(data.postId, obj);

                // informar na interface que post foi curtido
                postAlreadyLiked = true;

                // obter número de likes do post e retornar
                numberOfLikes = await private_db.getNumberOfLikes(data.postId);
                res.json({ postAlreadyLiked, numberOfLikes });
            }

        } catch (error) {
            console.log(error.message);
        }

    },

    publish: async (req, res, next) => {

        try {

            // recuperar token passado na url
            let token = req.query.token;

            // criar post a partir dos dados enviados pelo formulário
            let post = new Post(req.body);

            // salvar post
            await private_db.savePost(post);

            // redirecionar a pagina de gerenciar postagens
            res.redirect('/manageposts?token=' + token);

        } catch (error) {
            console.log(error.message);
        }

    },

    signup: async (req, res, next) => {

        try {

            // obter email do formulário
            let email = req.body.email;

            // verificar se existe conta de email cadastrada
            let searchEmail = await private_db.searchEmail(email);

            // se existe conta de email cadastrada
            if (searchEmail.length > 0) {

                // voltar a pagina inicial e exibir alerta de usuário já registrado
                req.baseUrl = '/';
                res.render('ejs/index.ejs', { alert: 'user already registered' });
            }
            else
                if (searchEmail.length === 0) {

                    // criar novo usuário a partir dos dados do formulário
                    let newUser = new User(req.body);

                    // salvar novo usuário no banco
                    await private_db.saveUser(newUser);

                    // redirecionar à pagina de login
                    res.redirect('/login');
                }

        } catch (error) {
            console.log(error.message);
        }

    },

    updatecarousel: async (req, res, next) => {

        try {

            // obter token da url
            let token = req.query.token;

            // obter id do formulário
            let id = req.body.id;

            // carregar página da postagem
            res.redirect(`/updatecarousel?token=${token}&id=${id}`);

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

            // recuperar id passado na url
            let id = req.query.id;

            // obter dados enviados pelo formulário
            let obj = req.body;

            // adicionar id ao objeto
            obj.id = id;

            // atualizar post
            await private_db.updatePost(obj);

            // redirecionar a pagina de gerenciar postagens
            res.redirect('/manageposts?token=' + token);

        } catch (error) {
            console.log(error.message);
        }

    },

    updateslide: async (req, res, next) => {

        try {

            // recuperar token passado na url
            let token = req.query.token;

            // recuper id do slide
            let id = req.query.id;

            // criar objeto com dados enviados pelo formulário
            let obj = req.body;

            // adicionar o id ao objeto
            obj.id = id;

            // atualizar post
            await public_db.updateSlide(obj);

            // redirecionar a pagina de autenticação
            res.redirect('/managecarousel?token=' + token);

        } catch (error) {
            console.log(error.message);
        }

    },

}
// DELETE
const del = {

    deleteofcarousel: async (req, res, next) => {

        try {

            let id = req.body.id;

            // deletar slide do carousel
            await public_db.deleteSlideOfCarousel(id);

            // recarregar a página
            res.redirect('back');

        } catch (error) {
            console.log(error.message);
        }
    },

    deleteuser: async (req, res, next) => {

        try {

            let id = req.body.id;

            // deletar usuário pelo id
            await private_db.deleteUser(id);

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
            await private_db.deletePost(id);

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

// formatar data no padrão brasileiro dd/mm/yyy
function formatDate(date) {
    let newDate = date.split("-");
    newDate = `${newDate[2]}/${newDate[1]}/${newDate[0]}`;
    return newDate;
}


// [2] gerar hora em padrão internacional
function generateHour() {
    let date = new Date();
    let hours = addZero(date.getHours());
    let minutes = addZero(date.getMinutes());
    let seconds = addZero(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

// [2] adiciona zero na hora
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

module.exports = {
    get, post, put, del
}

/*

    Referências

    [1] How do I get the current date in JavaScript?
        https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript

    [2] JavaScript getHours() Method
        https://www.w3schools.com/jsref/jsref_gethours.asp
*/