'use strict';

let express = require('express');
let router = express.Router();
let controllers = require('./controllers/controllers');
let middlewares = require('./controllers/middlewares');

// GET

router.get('/', controllers.get.index);
router.get('/signup', controllers.get.signup);
router.get('/protected', middlewares.checkToken, controllers.get.protected);

// POST
router.post('/login', controllers.post.login);
router.post('/signup', controllers.post.signup);

module.exports = router;