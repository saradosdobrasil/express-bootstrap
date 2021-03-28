let vue = new Vue({
    el: '#app',

    data: {
        api: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`,
        message: '',
        error: 'Erro 404',
        posts: [],
        texts: {
            title: "My App"
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
