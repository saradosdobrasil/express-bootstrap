'use strict';

const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const router = require('./src/routes');
const settings = require('./settings');
const localhost = `${settings.location.host}${settings.location.port}`;
const views = path.join(__dirname, 'src/views');

// JSON Server
const jsonServer = require('json-server');
const publicDataBase = path.join(__dirname, '/db/public.json');
const routerPublicDataBase = jsonServer.router(publicDataBase);
const privateDataBase = path.join(__dirname, '/db/private.json');
const routerPrivateDataBase = jsonServer.router(privateDataBase);
const jsonServerMiddlewares = jsonServer.defaults({ noCors: true }); // [5]

// Socket.IO
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

// * ----- CONFIGURAÇÕES ----- *

// chave secreta usada para gerar tokens com JSON Web Tokens
app.set('superSecret', process.env.SECRET);

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
app.use(function (req, res, next) {
    req.io = io;
    next();
});

// usar middleware router do Express
app.use(router);

// usar middlewares do JSON Server
app.use(jsonServerMiddlewares);

// [1] montar rotas públicas do JSON Server no endpoint /public
app.use('/public', routerPublicDataBase);

// montar rotas privadas do JSON Server no endpoint /private
app.use('/private', routerPrivateDataBase);

// ativar CORS
app.use(cors());

// comprimir todas as rotas
app.use(compression());

// definir página de erro (exibir página inicial)
app.use((req, res, next) => {
    res.redirect('/');
});


// * ----- START ----- *

// inicializar servidor (que contém o socket.IO)
httpServer.listen(`${settings.location.port}`, function () {
    console.log(`Servidor executando em: ${localhost}`);
});

/*
    Referências

    [1] Mounting JSON Server on another endpoint example
        https://github.com/typicode/json-server#mounting-json-server-on-another-endpoint-example

    [2] JSON Server / how to work with many json files together?
        https://github.com/typicode/json-server/issues/367#issuecomment-281523344

    [3] How to access POST form fields
        https://stackoverflow.com/questions/5710358/how-to-access-post-form-fields

    [4] Express JS: No 'Access-Control-Allow-Origin' header is present on the requested resource
        https://stackoverflow.com/questions/40025450/express-js-no-access-control-allow-origin-header-is-present-on-the-requested/40026625

    [5] JSON Server API
        https://www.npmjs.com/package/json-server#api

*/