/*import { defineStore } from 'pinia';

import { fetchWrapper } from './../helpers/fetch-wrapper';

const BASE_URL = 'http://localhost:8000/';
const baseUrl = `${BASE_URL}/users`;

export const useUsersStore = defineStore("users.store",{
    id: 'users',
    state: () => ({
        users: {}   //все пользователи, полученные из API
        /*
            {} - начальное состояние.
            { loading: true } - пользователи в данный момент извлекаются из API.
            [{ ... }, { ... }, { ... }] - массив пользователей, возвращаемый API.
            { error: 'an error message' } - запрос к API не удался, и была возвращена ошибка.
        */
    /*}),
    actions: {
        async getAll() {
            this.users = { loading: true };
            fetchWrapper.get(baseUrl)
                .then(users => this.users = users)
                .catch(error => this.users = { error })
        }
    }
});*/
