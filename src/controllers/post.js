'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res, next) => {
        const user = { id: 3 };
        const token = jwt.sign({ user }, 'my_secret_key');
        res.json({ token });
    },
}
