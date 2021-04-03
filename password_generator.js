'use strict';

const crypto = require('crypto');
const password = crypto.randomBytes(256).toString('hex');

console.log(password);