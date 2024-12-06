<template>
    <v-container class="form">
        <v-row class="flex column">
        <v-form v-model="valid">
                  <h3 class="name">Регистрация нового пользователя</h3>
                    <v-text-field 
                    class="textfield"
                    :rules="nameRules"
                    placeholder="Имя"
                    type="text"
                  >
                  </v-text-field>
                  <v-text-field
                    class="textfield"
                    :rules="lastNameRules"
                    placeholder="Фамилия"
                    type="text"
                  >
                  </v-text-field>
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
                  <v-btn>Зарегистрироваться</v-btn>
        </v-form>
          </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'AuthorizePage',
    data:() => ({
      valid: false,
      firstname: '',
      nameRules: [
        value => {
          if (value) return true

          return 'Name is required.'
        }
      ],
      lastname: '',
      lastNameRules: [
        value => {
          if (value) return true

          return 'Lastname is required.'
        }
      ],
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
  