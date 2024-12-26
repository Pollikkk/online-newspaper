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
                  v-model="firstname"
                >
                </v-text-field>
                <v-text-field
                  class="textfield"
                  :rules="lastNameRules"
                  placeholder="Фамилия"
                  type="text"
                  v-model="lastname"
                >
                </v-text-field>
                  <v-text-field
                  class="textfield"
                  :rules="emailRules"
                  placeholder="Email"
                  type="text"
                  v-model="email"
                >
                </v-text-field>
                  <v-text-field
                  class="textfield"
                  :rules="passwordRules"
                  placeholder="Пароль"
                  type="text"
                  v-model="password"
                >
                </v-text-field>
                <v-text-field
                  class="textfield"
                  :rules="passwordRules"
                  placeholder="Введите пароль повторно"
                  type="text"
                  v-model="password_confirmation"
                >
                </v-text-field>
                <v-btn type="submit" @click="handleSubmit">Зарегистрироваться</v-btn>
      </v-form>
        </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AuthorizePage',
  props : ["nextUrl"],
  data:() => ({
    valid: false,
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation : "",

    nameRules: [
      value => {
        if (value) return true

        return 'Name is required.'
      }
    ],
    lastNameRules: [
      value => {
        if (value) return true

        return 'Lastname is required.'
      }
    ],
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
    ]

  }),
  methods: {
    handleSubmit(e) {
      console.log(this.$route.params);
              e.preventDefault();
              if (this.password === this.password_confirmation && this.password.length > 0)
              {
                  let url = "http://localhost:3000/register"
                  axios.post(url, {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password
                  })
                  .then(response => {
                      localStorage.setItem('user',JSON.stringify(response.data.user))
                      localStorage.setItem('jwt',response.data.token)

                      if (localStorage.getItem('jwt') != null){
                          this.$emit('loggedIn')
                          if(this.$route.params.nextUrl != null){
                              this.$router.push(this.$route.params.nextUrl)
                              location.reload();//
                          }
                          else{
                              this.$router.push('/')
                              location.reload();//
                          }
                      }
                  })
                  .catch(error => {
                      console.error(error);
                  });
              } else {
                  this.password = ""
                  this.passwordConfirm = ""

                  return alert("Passwords do not match")
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
</style>
