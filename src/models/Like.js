"use strict";

class Like {

    constructor(id, obj = { id, user, email, date, time }) {
        this.id = id; // post id
        this.users = this.saveLike(obj);
    }

    saveLike(obj) {
        let arr = [];
        arr.push(obj);
        return arr;
    }
}

module.exports = Like;