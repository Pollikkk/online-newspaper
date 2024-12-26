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

export default {
setup() {
},
methods:{
  getUser(){
    console.log(localStorage.getItem('user'))
    return localStorage.getItem('user') == null; 
  },
  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    location.reload();
  }
},
computed:{
  username(){ return localStorage.getItem('user')},

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