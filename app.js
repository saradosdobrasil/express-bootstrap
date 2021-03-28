'use strict';

const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv').config();
const router = require('./src/routes');
const views = path.join(__dirname, 'src/views');
const SECRET = process.env.SECRET; // chave secreta do arquivo .env
const PORT = process.env.PORT || 3000;

// JSON Server
const jsonServer = require('json-server');
const db = require('./db/db.js');
const routerUsers = jsonServer.router(db.users);
const routerPosts = jsonServer.router(db.posts);
const jsonServerMiddlewares = jsonServer.defaults({ noCors: true });


// * ----- CONFIGURAÇÕES ----- *

// chave secreta usada para gerar tokens com JSON Web Tokens
app.set('superSecret', SECRET);

// configurar template engine ejs
app.set('view engine', ejs);

// definir diretório 'public' para entrega de templates do ejs
app.set('views', views);

// configurar indentação de espaços das respostas JSON
app.set('json spaces', 2);


// * ----- MIDDLEWARES ----- *

// definir diretório 'views' para entrega de arquivos estáticos do Express
app.use(express.static(views));

// usar middleware router do Express
app.use(router);

// [1] montar rotas de posts do Json Server no endpoint /api
app.use('/api', routerPosts);

// montar rotas de usuários do Json Server no endpoint /admin
app.use('/admin', routerUsers);

// usar parser para json e corpos de requisição
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ativar CORS
app.use(cors());

// comprimir todas as rotas
app.use(compression());

// definir página de erro
app.use((req, res, next) => {
    res.render('ejs/error.ejs');
});

// * ----- START ----- *

// inicializar servidor
app.listen(PORT, function () {
    console.log(`Server running at: http://localhost:${PORT}`);
});

/*
    Referências

    [1] Mounting JSON Server on another endpoint example
        https://github.com/typicode/json-server#mounting-json-server-on-another-endpoint-example

    [2] JSON Server / how to work with many json files together?
    https://github.com/typicode/json-server/issues/367#issuecomment-281523344

*/