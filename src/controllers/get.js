'use strict';

module.exports = {

    index: (req, res, next) => {
        res.render('ejs/index.ejs');
    },
    protected: (req, res, next) => {

        jwt.verify(req.token, 'my_secret_key', (err, data) => {

            if (err) {
                // enviar mensagem de acesso proibido
                res.sendStatus(403);

            } else {
                res.json({ text: 'Bem vindo!', data })
            }
        });

        res.json({ text: 'protected' });
    },
}