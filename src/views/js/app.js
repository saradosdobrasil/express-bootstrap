let vue = new Vue({

    el: '#app',

    data: {
        message: ''
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
                let response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
                this.data = response.data;
                console.log("✔️ Dados:", response.data);
            } catch (err) {
                console.log("⚠️ Atenção...");
                console.log("❌ Erro!");
                console.log(err);
            }
        },
        
        hello() {
            this.message = 'hello, world!';
        },
    },

    mounted() {
        this.getData();
        this.hello();
    }

});
