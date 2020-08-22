'use strict';

// GET
let get = {
    index: (req, res, next) => {
        res.render('ejs/index.ejs');
    },
}

module.exports = {
    get
}