let socket = io();

let vue = new Vue({
    el: '#app',

    data: {
        css: {
            biHeart: true,
            biHeartFill: false,
            textDark: true,
            textDanger: false
        },
        forms: {
            login: {
                email: '',
                password: ''
            }
        },
        host: {
            app: `${location.protocol}//${location.hostname}:3000`,
        },
        numberOfLikes: null,
        posts: [],
        postAlreadyLiked: null,
        texts: {
            createAccount: 'Criar conta',
            phone: 'Celular',
            email: 'E-mail',
            enter: 'Entrar',
            error: 'Erro 404',
            login: 'Entrar',
            name: 'Nome',
            password: 'Senha',
            register: 'Cadastrar',
            signup: 'Crie uma conta gratuita',
            title: 'Express Bootstrap',
        }
    },

    filters: {
        capitalize: function (value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },

    methods: {

        // evento de submissão de formulários
        onSubmit(event) {
            // console.log("event.preventDefault() acionado:", event);
        },

        async like(postId, userId, name, email, token) {
            try {
                let data = {};
                data.postId = postId;
                data.userId = userId;
                data.name = name;
                data.email = email;
                data.token = token;

                let response = await axios.post(`${this.host.app}/like`, data);
                this.numberOfLikes = response.data.numberOfLikes;
                this.postAlreadyLiked = response.data.postAlreadyLiked;

            } catch (error) {
                console.log(error.message);
            }
        }
    },

    created() {

        socket.on("test", data => {
            console.log(data);
        });

        socket.on("post", data => {
            this.numberOfLikes = data.numberOfLikes;
            this.postAlreadyLiked = data.postAlreadyLiked;
        });

    },


    mounted() {

        // animar carousel
        $('.carousel').carousel();


    }

});
