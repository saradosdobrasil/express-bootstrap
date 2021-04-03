'use strict';

require("dotenv").config({ silent: true });

module.exports = {

    location: {
        host: "http://localhost:",
        port: process.env.PORT || 3000
    },
};