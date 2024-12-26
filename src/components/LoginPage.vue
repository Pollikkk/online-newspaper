<template>
  <v-container class="form">
    <v-card class="cardLogin" color="#fff">
      <v-row class="flex column">
          <v-form v-model="valid">
              <h3 class="name" color="#fff">Вход в личный аккаунт</h3>
              <v-text-field
                  class="textfield"
                  :rules="emailRules"
                  placeholder="Email"
                  type="email"
                  name="username"
                  color="blue"
                  v-model="credentials.email"
              >
              </v-text-field>
        
              <v-text-field
                class="textfield"
                :rules="passwordRules"
                placeholder="Пароль"
                type="password"
                name="password"
                color="blue"
                v-model="credentials.password"
              >
              </v-text-field>
        
              <v-btn block type="submit" @click="login">
                Войти
              </v-btn>
              <router-link :to="{ path: '/register'}">
                  Нет аккаунта? Создать
              </router-link>
          </v-form>
        </v-row>
      </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
//import { useAuthStore } from "../store/auth.store";

export default {
  name: 'LoginPage',
  data:() => ({
    valid: false,
    credentials: {
        email: '',
        password: ''
    },
    emailRules: [
      value => {
        if (value) return true

        return 'E-mail is required.'
      },
      value => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail must be valid.'
      },
    ],
    passwordRules: [
      value => {
        if (value) return true

        return 'Password is required.'
      }
    ],

  }),
  setup() {
  },
  props: {
    msg: String
  },
  methods:{
    async login() {
      try {
        const response = await axios.post('/auth/login', this.credentials);
        const token = response.data;

        // Сохраняем токен в localStorage
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Переход на страницу новостей
        this.$emit('auth-success', this.credentials.email);
      } catch (error) {
        console.error('Ошибка при авторизации:', error);
        alert('Ошибка авторизации');
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../styles/style.scss";

.name{
  @include name;
}

.card{
  @include card;
}

.content{
  @include content;
}

.flex{
  @include flex;
}

.column{
  @include column;
}

.form{
  @include form;
}

.textfield{
  @include textfield;
}

.cardLogin{
  @include cardLogin;
}
</style>
