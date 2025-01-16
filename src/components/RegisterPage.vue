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
                  v-model="credentials.firstname"
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

export default {
  name: 'RegisterPage',
  props : ["nextUrl"],
  data:() => ({
    valid: false,
    credentials: {
      firstname: '',
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
        if (this.credentials.password === this.credentials.password_confirmation && this.credentials.password.length > 0)
          {
            const response = await axios.post('http://localhost:8081/api/auth/registration', this.credentials);
            const token = response.data;

            // Сохраняем токен в localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('person', this.credentials.email);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Переход на страницу новостей
            this.$router.push({ name: 'main' });
          } 
          else {
            this.credentials.password = ""
            this.credentials.passwordConfirm = ""
            return alert("Passwords do not match")
          }
      } catch (error) {
        console.error('Ошибка при регистрации:' + error);
        alert('Ошибка регистрации', error);
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
