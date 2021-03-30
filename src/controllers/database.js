'use strict';

const axios = require('axios');
const settings = require('../../settings');
const location_href = `${settings.location.host}3000/api`;
const headers = {
    'Content-Type': 'application/json'
}

module.exports = {

    getUsers: async () => {

        try {

            let response = await axios.get(`${location_href}/users?_sort=id&_order=desc&_limit=1`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    saveUser: async (obj) => {

        try {

            let params = obj;
            return await axios.post(`${location_href}/users`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }

    },

    searchEmail: async (email) => {
        try {

            let response = await axios.get(`${location_href}/users?email=${email}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }
    },

    searchUser: async (email, password) => {
        try {

            let response = await axios.get(`${location_href}/users?email=${email}&password=${password}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }
    }
}