'use strict';

let express = require('express');
let router = express.Router();
let controllers = require('./controllers/controllers');

// GET

router.get('/', controllers.get.index);


module.exports = router;