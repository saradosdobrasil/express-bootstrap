'use strict';

let express = require('express');
let router = express.Router();
let controllers = require('./controllers/controllers');
let middlewares = require('./controllers/middlewares');

// GET

router.get('/', controllers.get.index);
router.get('/signup', controllers.get.signup);
router.get('/home', controllers.get.home);
// router.get('/home', middlewares.checkToken, controllers.get.home);

// POST
router.post('/login', controllers.post.login);
router.post('/signup', controllers.post.signup);

module.exports = router;