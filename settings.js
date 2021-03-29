require("dotenv").config({ silent: true });

module.exports = {

    location: {
        host: "http://localhost:",
        port: process.env.PORT || 3000
    },
    secret: process.env.SECRET // chave secreta do arquivo .env

};