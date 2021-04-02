'use strict';

let express = require('express');
let router = express.Router();
let controllers = require('./controllers/controllers');
let middlewares = require('./controllers/middlewares');

// GET

router.get('/', controllers.get.index);
router.get('/signup', controllers.get.signup);
router.get('/login', middlewares.authentication, controllers.get.login);

// POST
router.post('/login', controllers.post.login);
router.post('/signup', controllers.post.signup);

// DELETE
router.delete('/user', controllers.del.user);

module.exports = router;