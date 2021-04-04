'use strict';

let express = require('express');
let router = express.Router();
let controllers = require('./controllers/controllers');
let middlewares = require('./controllers/middlewares');

// GET

router.get('/', controllers.get.index);
router.get('/admins', middlewares.authentication, controllers.get.admins);
router.get('/api*', middlewares.authorization); // obter acesso a api
router.get('/login', middlewares.authentication, controllers.get.login); // obter token de acesso
router.get('/manageposts', middlewares.authentication, controllers.get.manageposts);
router.get('/publish', middlewares.authentication, controllers.get.publish);
router.get('/signup', controllers.get.signup);
router.get('/users', middlewares.authentication, controllers.get.users);

// POST
router.post('/deleteuser', controllers.del.deleteuser);
router.post('/login', controllers.post.login);
router.post('/publish', controllers.post.publish);
router.post('/signup', controllers.post.signup);

module.exports = router;