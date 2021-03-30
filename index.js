'use strict';

const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv').config();
const router = require('./src/routes');
const settings = require('./settings');
const secret = settings.secret;
const views = path.join(__dirname, 'src/views');

// Socket.IO
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// JSON Server
const jsonServer = require('json-server');
const db = path.join(__dirname, '/db/db.json');
const routerDataBase = jsonServer.router(db);
const jsonServerMiddlewares = jsonServer.defaults({ noCors: true });


// * ----- CONFIGURAÇÕES ----- *

// chave secreta usada para gerar tokens com JSON Web Tokens
app.set('superSecret', secret);

// configurar template engine ejs
app.set('view engine', ejs);

// definir diretório 'public' para entrega de templates do ejs
app.set('views', views);

// configurar indentação de espaços das respostas JSON
app.set('json spaces', 2);


// * ----- MIDDLEWARES ----- *

// definir diretório 'views' para entrega de arquivos estáticos do Express
app.use(express.static(views));

// [3] permitir usar dados enviados por formulários e urls e codificá-los em JSON
// colocar sempre antes de app.use(router)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Usar Socket.IO nas rotas do Express
// colocar sempre antes de app.use(router)
app.use(function (req, res, next) {
    req.io = io;
    next();
});

// usar middleware router do Express
app.use(router);

// [1] montar rotas de posts do Json Server no endpoint /api
app.use('/api', routerDataBase);

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
app.listen(`${settings.location.port}`, function () {
    console.log(`Servidor executando em: ${settings.location.host}${settings.location.port}`);
});

/*
    Referências

    [1] Mounting JSON Server on another endpoint example
        https://github.com/typicode/json-server#mounting-json-server-on-another-endpoint-example

    [2] JSON Server / how to work with many json files together?
        https://github.com/typicode/json-server/issues/367#issuecomment-281523344

    [3] How to access POST form fields
        https://stackoverflow.com/questions/5710358/how-to-access-post-form-fields

*/