let vue = new Vue({
    el: '#app',

    data: {
        api: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`,
        message: '',
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
            login: 'Login',
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

        createAccount() {

        },


        async getData() {
            try {
                let response = await axios.get(`${this.api}/posts`);
                this.posts = response.data;
                console.log("✔️ Dados:", response.data);
            } catch (err) {
                console.log("⚠️ Atenção...");
                console.log("❌ Erro!");
                console.log(err);
            }
        },

    },

    mounted() {
        this.getData();
    }

});
