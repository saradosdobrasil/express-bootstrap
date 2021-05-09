'use strict';

let express = require('express');
let router = express.Router();
let controllers = require('./controllers/controllers');
let middlewares = require('./controllers/middlewares');

// GET

router.get('/', controllers.get.index);
router.get('/admins', middlewares.authentication, controllers.get.admins);
router.get('/addtocarousel', middlewares.authentication, controllers.get.addtocarousel);
router.get('/authentication', middlewares.authentication, controllers.get.authentication);
router.get('/login', controllers.get.login);
router.get('/managecarousel', middlewares.authentication, controllers.get.managecarousel);
router.get('/manageposts', middlewares.authentication, controllers.get.manageposts);
router.get('/post', middlewares.authentication, controllers.get.post);
router.get('/private*', middlewares.authorization); // obter acesso aos dados privados
router.get('/public*', middlewares.authorization); // obter acesso aos dados públicos
router.get('/publish', middlewares.authentication, controllers.get.publish);
router.get('/signup', controllers.get.signup);
router.get('/updatecarousel', middlewares.authentication, controllers.get.updatecarousel);
router.get('/updatepost', middlewares.authentication, controllers.get.updatepost);
router.get('/users', middlewares.authentication, controllers.get.users);

// POST
router.post('/addtocarousel', controllers.post.addtocarousel);
router.post('/login', controllers.post.login); // obter token de acesso
router.post('/deleteofcarousel', controllers.del.deleteofcarousel);
router.post('/deleteuser', controllers.del.deleteuser);
router.post('/deletepost', controllers.del.deletepost);
router.post('/like', controllers.post.like);
router.post('/publish', controllers.post.publish);
router.post('/saveeditions', controllers.put.saveeditions);
router.post('/signup', controllers.post.signup);
router.post('/updatecarousel', controllers.post.updatecarousel);
router.post('/updatepost', controllers.post.updatepost);
router.post('/updateslide', controllers.put.updateslide);

module.exports = router;