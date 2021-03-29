'use strict';

const axios = require('axios');

module.exports = {

    getusers: async () => {

        try {

            let response = axios.get(`${admin}/users?_sort=id&_order=desc`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    saveUser: async (obj) => {

        try {



        } catch (error) {
            console.log(error.message);
        }

    },
}