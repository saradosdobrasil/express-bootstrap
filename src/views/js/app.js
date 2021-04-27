let vue = new Vue({
    el: '#app',

    data: {
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

        async like(id, user, email, token) {
            try {
                let data = {};
                data.id = id;
                data.user = user;
                data.email = email;
                data.token = token;

                let response = await axios.post(`${this.host.app}/like`, data);
                this.numberOfLikes = response.data.numberOfLikes;

            } catch (error) {
                console.log(error.message);
            }
        }
    },

    mounted() {

        $('.carousel').carousel();
    }

});
