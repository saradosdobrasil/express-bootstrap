'use strict';

const express = require('express');
const router = require('./src/routes');
const path = require('path');
const views = path.join(__dirname, 'src/views');
const ejs = require('ejs');
const helmet = require('helmet');
const PORT = process.env.PORT || 3000;

// criar instância do Express
const app = express();

// definir diretório 'views' para entrega de arquivos estáticos do Express
app.use(express.static(views));

// usar middleware router do Express
app.use(router);

// usar parser para json e corpos de requisição
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// usar Helmet para proteger o aplicativo vulnerabilidades conhecidas da Web
app.use(helmet());

// configurar template engine ejs
app.set('view engine', ejs);

// definir diretório 'public' para entrega de templates do ejs
app.set('views', views);

// configurar indentação de espaços das respostas json
app.set('json spaces', 2);

// inicializar servidor
app.listen(PORT, function () {
    console.log(`Server running at: http://localhost:${PORT}`);
});