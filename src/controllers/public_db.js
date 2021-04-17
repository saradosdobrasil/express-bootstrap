'use strict';

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const settings = require('../../settings');
const public_url = `${settings.location.host}3000/public`;
const headers = { 'Content-Type': 'application/json' };
const apikey = `apikey=${process.env.APIKEY}`;
const imagesPath = path.join(__dirname, '../views/images/carousel');

module.exports = {

    deleteSlideOfCarousel: async (id) => {

        try {

            await axios.delete(`${public_url}/carousel/${id}?${apikey}`);

        } catch (error) {
            console.log(error.message);
        }

    },

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

    getSlideOfCarouselById: async (id) => {

        try {

            let response = await axios.get(`${public_url}/carousel/${id}?${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    saveToCarousel: async (obj) => {

        try {

            let params = obj;
            return await axios.post(`${public_url}/carousel?${apikey}`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }

    },

    updateSlide: async (obj) => {
        try {

            let params = obj;
            return await axios.put(`${public_url}/carousel/${obj.id}?${apikey}`, params, { headers: headers });


        } catch (error) {
            console.log(error.message);
        }
    },

    getListOfImages() {
        let readDir = fs.readdirSync(imagesPath);
        let images = [];

        readDir.forEach(item => {
            let pathFile = path.join(imagesPath, item);
            let isFile = fs.lstatSync(pathFile).isFile();
            if (isFile === true) {
                images.push(path.join('/images/carousel', item));
            }
        });

        return images;
    }


}