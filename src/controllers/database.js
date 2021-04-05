'use strict';

const axios = require('axios');
const settings = require('../../settings');
const location_href = `${settings.location.host}3000/api`;
const headers = { 'Content-Type': 'application/json' };
const apikey = `apikey=${process.env.APIKEY}`;

module.exports = {

    deletePost: async (id) => {

        try {

            await axios.delete(`${location_href}/posts/${id}?${apikey}`);

        } catch (error) {
            console.log(error.message);
        }

    },

    deleteUser: async (id) => {

        try {

            await axios.delete(`${location_href}/users/${id}?${apikey}`);

        } catch (error) {
            console.log(error.message);
        }

    },

    getAdmins: async () => {

        try {

            let response = await axios.get(`${location_href}/users?_sort=id&_order=desc&role=admin&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getLastUser: async () => {

        try {

            let response = await axios.get(`${location_href}/users?_sort=id&_order=desc&_limit=1&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getLastPost: async () => {

        try {

            let response = await axios.get(`${location_href}/posts?_sort=id&_order=desc&_limit=1&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getPostById: async (id) => {

        try {

            let response = await axios.get(`${location_href}/posts/${id}?${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getPosts: async () => {

        try {

            let response = await axios.get(`${location_href}/posts?_sort=id&_order=desc&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getUserById: async (id) => {

        try {

            let response = await axios.get(`${location_href}/users/${id}?${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getUsers: async () => {

        try {

            let response = await axios.get(`${location_href}/users?_sort=id&_order=desc&role=user&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    saveEditions: async (obj) => {
        try {

            let params = obj;
            return await axios.put(`${location_href}/posts/${obj.id}?${apikey}`, params, { headers: headers });


        } catch (error) {
            console.log(error.message);
        }
    },

    savePost: async (obj) => {

        try {

            let params = obj;
            return await axios.post(`${location_href}/posts?${apikey}`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }

    },

    saveUser: async (obj) => {

        try {

            let params = obj;
            return await axios.post(`${location_href}/users?${apikey}`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }

    },

    searchEmail: async (email) => {
        try {

            let response = await axios.get(`${location_href}/users?email=${email}&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }
    },

    searchUser: async (email, password) => {
        try {

            let response = await axios.get(`${location_href}/users?email=${email}&password=${password}&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }
    },


}