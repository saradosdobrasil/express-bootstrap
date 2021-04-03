'use strict';

const crypto = require('crypto');
const password = crypto.randomBytes(256).toString('base64');

console.log(password);