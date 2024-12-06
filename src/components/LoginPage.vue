<template>
    <v-container class="form">
        <v-row class="flex column">
            <v-form v-model="valid">
                <h3 class="name">Вход в личный аккаунт</h3>
                <v-text-field
                    class="textfield"
                    :rules="emailRules"
                    placeholder="Email"
                    type="text"
                >
                </v-text-field>
          
                <v-text-field
                  class="textfield"
                  :rules="passwordRules"
                  placeholder="Пароль"
                  type="text"
                >
                </v-text-field>
          
                <v-btn class="mt-2" type="submit" block>Войти</v-btn>
                <router-link :to="{ path: '/authorize'}">
                    Нет аккаунта? Создать
                </router-link>
            </v-form>
          </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'LoginPage',
    data:() => ({
      valid: false,
      email: '',
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
      password: '',
      passwordRules: [
        value => {
          if (value) return true

          return 'Password is required.'
        }
      ]

    }),
    props: {
      msg: String
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
  </style>
  