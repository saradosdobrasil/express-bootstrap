"use strict";

class User {

    constructor(id, name, password, email) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
        this.role = defineRole();
    }

    // define quem é administrador e quem é usuário pelo e-mail
    defineRole() {
        if (this.email === 'myUsername@mail.com') {
            return 'admin';
        } else {
            return 'user';
        }

    }
}

module.exports = User;