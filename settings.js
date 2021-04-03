'use strict';

require("dotenv").config({ silent: true });

module.exports = {

    location: {
        host: "http://localhost:",
        port: process.env.PORT || 3000
    },

    // chaves secretas do arquivo .env geradas pelo script 'password_generator.js'
    secret: process.env.SECRET

};