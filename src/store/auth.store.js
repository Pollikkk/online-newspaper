/*import { defineStore } from 'pinia';

import { fetchWrapper, router } from './../helpers/fetch-wrapper';//

const BASE_URL = 'http://localhost:8080/';
const baseUrl = `${BASE_URL}/users`;

export const useAuthStore = defineStore("auth.store",{
    id: 'auth',
    state: () => ({
        // состояние - информация о текущем пользователе
        user: JSON.parse(localStorage.getItem('user')), //пользователь
        returnUrl: null
    }),
    actions: {
        async login(username, password) {//вход в систему
            const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

            //обновление состояния в pinia
            this.user = user;

            // хранит информацию о пользователе и jwt в локальном хранилище, чтоб пользователь оставался авторизованным при обновлении страницы
            localStorage.setItem('user', JSON.stringify(user));

            // перенаправляет на предыдущий url или домашнюю страницу по умолчанию
            router.push(this.returnUrl || '/main');
        },
        logout() {//выход из системы
            this.user = null;
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});*/