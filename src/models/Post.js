"use strict";

class Post {

    constructor({ title, date, text }) {
        this.title = title;
        this.date = date;
        this.text = text;
        this.likes = []
    }
}

module.exports = Post;