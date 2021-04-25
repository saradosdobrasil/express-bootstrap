"use strict";

const settings = require('../../settings');

class User {

    constructor({ id, name, password, email }) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = this.defineRole();
    }

    // define papel de administrador e usuário do sistema pelo email
    defineRole() {
        // se email está incluído no array de 'settings.admin'
        if (settings.admin.includes(this.email)) {
            return 'admin';
        } else {
            return 'user';
        }

    }
}

module.exports = User;