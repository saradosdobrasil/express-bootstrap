let vue = new Vue({
    el: '#app',

    data: {
        api: `${window.location.href}api`,
        forms: {
            login: {
                email: '',
                password: ''
            }
        },
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
    },

    mounted() {

        $('.carousel').carousel();
    }

});
