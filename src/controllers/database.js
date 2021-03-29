'use strict';

const axios = require('axios');
const settings = require('../../settings');
const location_href = `${settings.location.host}3000`;
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

module.exports = {

    getUsers: async () => {

        try {

            let response = await axios.get(`${location_href}/admin/users?_sort=id&_order=desc`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    saveUser: async (obj) => {

        try {

            let params = obj;
            let response = await axios.post(`${location_href}/admin/users`, params, {
                headers: headers
            });
            
            return response.data;


        } catch (error) {
            console.log(error.message);
        }

    },
}