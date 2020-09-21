'use strict';

const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const router = require('./src/routes');
const views = path.join(__dirname, 'src/views');
const PORT = process.env.PORT || 3000;

// JSON Server
const jsonServer = require('json-server');
const db = require('./db/db.json');
const jsonServerRouter = jsonServer.router(db);
const jsonServerMiddlewares = jsonServer.defaults({ noCors: true });


// * ----- CONFIGURAÇÕES ----- *

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

// [1] montar rotas do Json Server no endpoint /api
app.use('/api', jsonServerRouter);

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
*/