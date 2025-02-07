<template>
  <v-container class="form">
    <v-card class="cardLogin card" color="#fff">
      <v-row class="flex column">
        <v-form v-model="valid">
                <h3 class="name">Регистрация нового пользователя</h3>
                  <v-text-field 
                  class="textfield"
                  :rules="nameRules"
                  placeholder="Имя"
                  type="text"
                  v-model="credentials.name"
                >
                </v-text-field>
                <v-text-field
                  class="textfield"
                  :rules="lastNameRules"
                  placeholder="Фамилия"
                  type="text"
                  v-model="credentials.lastname"
                >
                </v-text-field>
                  <v-text-field
                  class="textfield"
                  :rules="emailRules"
                  placeholder="Email"
                  type="text"
                  v-model="credentials.email"
                >
                </v-text-field>
                  <v-text-field
                  class="textfield"
                  :rules="passwordRules"
                  placeholder="Пароль"
                  type="text"
                  v-model="credentials.password"
                >
                </v-text-field>
                <v-text-field
                  class="textfield"
                  :rules="passwordRules"
                  placeholder="Введите пароль повторно"
                  type="text"
                  v-model="credentials.password_confirmation"
                >
                </v-text-field>
                <v-btn block type="submit" @click="register" color="#0e0d27">Зарегистрироваться</v-btn>
      </v-form>
      </v-row>
      </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';


/*const apiAuth = axios.create({ 
  baseURL: 'http://localhost:8081/auth', // URL сервера
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});*/

export default {
  name: 'RegisterPage',
  props : ["nextUrl"],
  data:() => ({
    valid: false,
    credentials: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      password_confirmation : ''
    },
    

    nameRules: [
      value => {
        if (value) return true

        return 'Имя- обязательное поле.'
      }
    ],
    lastNameRules: [
      value => {
        if (value) return true

        return 'Фамилия- обязательное поле.'
      }
    ],
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

        return 'Пароль- обязательное поле.'
      }
    ]

  }),
  methods: {
    async register() {
      try {
        
        console.log(JSON.stringify(this.credentials));
        if (this.credentials.password === this.credentials.password_confirmation && this.credentials.password.length > 0)
          {
            const requestData = {
              name: this.credentials.name,
              lastname: this.credentials.lastname,
              email: this.credentials.email,
              password: this.credentials.password
            };
          
            console.log("Отправляемый запрос:", requestData);

            const response = await axios.post('http://localhost:8081/auth/registration', 
              {
                name: this.credentials.name,
                lastname: this.credentials.lastname,
                email: this.credentials.email,
                password: this.credentials.password
              }, 
              {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true, // Для отправки куки
              });
              
            console.log('Ответ от сервера: ', response); // Логирование ответа от сервера


            const token = response.data.token;

            // Сохраняем токен в localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('person', this.credentials.email);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            alert("Вы успешно зарегистрированы!")
            // Переход на страницу новостей
            window.location.href = "/main";
          } 
          else {
            this.credentials.password = ""
            this.credentials.passwordConfirm = ""
            alert("Пароли не совпадают!")
          }
      } catch (error) {
        console.error('Ошибка при регистрации:' + error);

        if (error.response && error.response.data) {
          alert('Ошибка регистрации: ' + error.response.data);
        } else {
          alert('Ошибка при регистрации, попробуйте позже.');
        }
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
