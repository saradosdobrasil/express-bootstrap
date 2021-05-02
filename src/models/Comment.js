"use strict";

class Comment {

    constructor(id, obj = { id, user, email, text, date, time }) {
        this.id = id; // post id
        this.users = this.saveComment(obj);
    }

    saveComment(obj) {
        let arr = [];
        arr.push(obj);
        return arr;
    }
}

module.exports = Comment;