'use strict';

const axios = require('axios');
const settings = require('../../settings');
const public_url = `${settings.location.host}3000/public`;
const headers = { 'Content-Type': 'application/json' };
const apikey = `apikey=${process.env.APIKEY}`;

module.exports = {

    getDataOfCarousel: async () => {

        try {

            let response = await axios.get(`${public_url}/carousel?${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getDataOfCards: async () => {

        try {

            let response = await axios.get(`${public_url}/cards?${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },


}