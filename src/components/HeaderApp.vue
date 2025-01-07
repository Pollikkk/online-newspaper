<template>
  <v-app-bar
    app
    color="#1e1a57"
  >
      <v-app-bar-title>
      <h3 class="text-h4 white--text">News</h3>
    </v-app-bar-title>
    <v-app-bar-items class="footerLinks">
      <div v-if="username != null">Привет, {{ username }}</div>
      <router-link :to="{ path: '/login'}" v-if="getUser()">
        <v-btn flat>Войти</v-btn>
      </router-link>
      <v-btn flat @click="logout()" v-else>Выйти</v-btn>
    </v-app-bar-items>
  </v-app-bar>
</template>

<script>
//import { useAuthStore } from "../store/auth.store";
import axios from 'axios';
export default {
setup() {
},
methods:{
  getUser(){
    console.log(localStorage.getItem('person'))
    return localStorage.getItem('person') == null; 
  },
  async logout(){
    try {
        const response = await axios.get('http://localhost:8081/auth/logout');
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        if (response.status === 200) {
          alert('Вы успешно вышли!');
          // Перенаправление на главную страницу
          localStorage.removeItem('person');
          localStorage.removeItem('token');
          location.reload();
        }
      } catch (error) {
        console.error('Ошибка при выходе:', error);
        alert('Не удалось выйти. Попробуйте еще раз.');
      }
  }
},
computed:{
  username(){ return localStorage.getItem('person')},

}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../styles/style.scss";

.footerLinks{
  @include footerLinks;
}  

</style>