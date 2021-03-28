'use strict';

let express = require('express');
let router = express.Router();
let controller = require('./controllers/controllers');
let middleware = require('./controllers/middlewares');

// GET

router.get('/', controller.get.index);
router.get('/protected', middleware.checkToken, controller.get.protected);

// POST
router.post('/login', controller.post.login);

module.exports = router;