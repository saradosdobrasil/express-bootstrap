'use strict';

const axios = require('axios');
const settings = require('../../settings');
const private_url = `${settings.location.host}3000/private`;
const headers = { 'Content-Type': 'application/json' };
const apikey = `apikey=${process.env.APIKEY}`;
const Like = require('../models/Like');

module.exports = {

    deletePost: async (id) => {

        try {

            await axios.delete(`${private_url}/posts/${id}?${apikey}`);

        } catch (error) {
            console.log(error.message);
        }

    },

    deleteUser: async (id) => {

        try {

            await axios.delete(`${private_url}/users/${id}?${apikey}`);

        } catch (error) {
            console.log(error.message);
        }

    },

    deleteLike: async (postId, userId) => {

        try {

            let response = await axios.get(`${private_url}/likes/${postId}?${apikey}`);

            // filtrar array de usuários (ignorar objetos com userId)
            let filteredUsers = response.data.users.filter(user => user.id !== userId);

            // copiar array filtrado para a resposta original
            response.data.users = filteredUsers;

            // atualizar likes do post no banco
            let params = response.data;
            await axios.put(`${private_url}/likes/${postId}?${apikey}`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }
    },

    getAdmins: async () => {

        try {

            let response = await axios.get(`${private_url}/users?_sort=id&_order=desc&role=admin&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getLastUser: async () => {

        try {

            let response = await axios.get(`${private_url}/users?_sort=id&_order=desc&_limit=1&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getLastPost: async () => {

        try {

            let response = await axios.get(`${private_url}/posts?_sort=id&_order=desc&_limit=1&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getNumberOfLikes: async (postId) => {

        try {

            let response = await axios.get(`${private_url}/likes/${postId}?${apikey}`);
            return response.data.users.length;

        } catch (error) {
            console.log(error.message);
        }

    },


    getNextPostById: async (postId) => {

        try {

            // converter string para número
            id = Number(id);

            let nextId;

            // obter posts
            let response = await axios.get(`${private_url}/posts?_order=asc&${apikey}`);
            let posts = response.data;

            // extrair apenas ids dos posts e ordená-los
            let ids = posts.map(post => post.id);

            // percorrer ids
            for (let i = 0; i < ids.length; i++) {

                // se id do post for encontrado, retornar o id posterior se não for inexistente
                if (postId === ids[i] && ids[i + 1] !== undefined) {
                    nextId = ids[i + 1];
                    break;
                }
            }

            // obter e retornar dados do post posterior
            let nextPost = await axios.get(`${private_url}/posts/${nextId}?${apikey}`);
            return nextPost.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getPostById: async (id) => {

        try {

            let response = await axios.get(`${private_url}/posts/${id}?${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getPreviousPostById: async (id) => {

        try {

            // converter string para número
            id = Number(id);

            let previousId;

            // obter posts
            let response = await axios.get(`${private_url}/posts?_order=asc&${apikey}`);
            let posts = response.data;

            // extrair apenas ids dos posts
            let ids = posts.map(post => post.id);

            // percorrer ids
            for (let i = 0; i < ids.length; i++) {

                // se id do post for encontrado, retornar o id anterior se não for inexistente
                if (id === ids[i] && ids[i - 1] !== undefined) {
                    previousId = ids[i - 1];
                    break;
                }
            }

            // obter e retornar dados do post anterior
            let previousPost = await axios.get(`${private_url}/posts/${previousId}?${apikey}`);
            return previousPost.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getPosts: async () => {

        try {

            let response = await axios.get(`${private_url}/posts?_sort=id&_order=desc&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getUserById: async (id) => {

        try {

            let response = await axios.get(`${private_url}/users/${id}?${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    getUsers: async () => {

        try {

            let response = await axios.get(`${private_url}/users?_sort=id&_order=desc&role=user&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }

    },

    updatePost: async (obj) => {
        try {

            let params = obj;
            return await axios.put(`${private_url}/posts/${obj.id}?${apikey}`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }
    },

    saveLike: async (postId, user) => {

        try {

            // buscar like no banco
            let like = await axios.get(`${private_url}/likes?id=${postId}&${apikey}`);
            console.log(like.data);

            // se like não se encontra no banco
            if (like.data.length === 0) {

                // criar objeto like e salvar no banco
                let params = new Like(postId, user);
                await axios.post(`${private_url}/likes?${apikey}`, params, { headers: headers });
            }
            // se like já existe no banco
            else {

                // adicionar usuário ao array de users
                like = like.data[0];
                like.users.push(user);

                // atualizar like no banco
                let params = like;
                await axios.put(`${private_url}/likes/${postId}?${apikey}`, params, { headers: headers });

            }

        } catch (error) {
            console.log(error.message);
        }

    },

    savePost: async (obj) => {

        try {

            let params = obj;
            return await axios.post(`${private_url}/posts?${apikey}`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }

    },

    saveUser: async (obj) => {

        try {

            let params = obj;
            return await axios.post(`${private_url}/users?${apikey}`, params, { headers: headers });

        } catch (error) {
            console.log(error.message);
        }

    },

    searchLikeOfUser: async (postId, userId) => {
        try {

            let response = await axios.get(`${private_url}/likes/${postId}?${apikey}`);
            let boolean = false;

            // se post não possui nenhum like
            if (response.data.users.length === 0) {
                return boolean;

            } else {

                response.data.users.forEach(user => {
                    if (user.id === userId) {
                        boolean = true;
                    }
                });

                return boolean;
            }

        } catch (error) {
            console.log(error.message);
        }
    },

    searchEmail: async (email) => {
        try {

            let response = await axios.get(`${private_url}/users?email=${email}&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }
    },

    searchUser: async (email, password) => {
        try {

            let response = await axios.get(`${private_url}/users?email=${email}&password=${password}&${apikey}`);
            return response.data;

        } catch (error) {
            console.log(error.message);
        }
    },


}