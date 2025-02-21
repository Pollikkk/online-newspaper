<template>
  <v-container class="form">
    <v-card class="cardLogin card" color="#fff">
      <v-row class="flex column">
          <v-form v-model="valid">
              <h3 class="name">Вход в личный аккаунт</h3>
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
        
              <v-btn block type="button" @click="login" color="#0e0d27">
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

const apiAuth = axios.create({ 
  baseURL: 'http://localhost:8081/auth', // URL сервера
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default {
  name: 'LoginPage',
  data:() => ({
    valid: false,
    credentials: {
        email: '',
        password: '',
        token: ''
    },
    emailRules: [
      value => {
        if (value) return true

        return 'E-mail- обязательное поле.'
      },
      value => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail должен быть валидным.'
      },
    ],
    passwordRules: [
      value => {
        if (value) return true

        return 'Password- обязательное поле.'
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
        if(this.credentials.email == "" || this.credentials.password == ""){
          alert("Заполните пустые поля!");
          return;
        }
        const response = await apiAuth.post('/login', {
          email: this.credentials.email,
          password: this.credentials.password
        }, // Параметры credentials автоматически передаются как JSON
          );
        
        console.log('Ответ от сервера: ', response); // Логирование ответа от сервера
        if(response.data!=='Неверные учетные данные пользователя'){
          this.token = response.data;
          // Сохраняем токен в localStorage
          localStorage.setItem('token', this.token);
          localStorage.setItem('person', this.credentials.email);
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }
        else{
          alert(response.data);
        }
        // Переход на страницу новостей
        window.location.href = "/main";
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
