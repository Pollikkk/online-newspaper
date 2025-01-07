<template>
  <v-app class="body">
    <!--<HeaderApp></HeaderApp>
    <v-main class="forMain">
      <RouterView></RouterView>
    </v-main>-->

    <HeaderApp></HeaderApp>
    <v-main class="forMain">
      <RouterView></RouterView>
    </v-main>

    <!--
    <LoginPage v-if="!isLoggedIn" @auth-success="handleAuthSuccess" />
    <MainPage
      v-else
      :userEmail="userEmail"
      @logout="handleLogout"
    />-->
  </v-app>
</template>

<script>

import HeaderApp from './components/HeaderApp.vue';
export default {
  name: 'App',

  components: {
    HeaderApp
  },

  data: () => ({
    //
  }),

/*
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: false,
      userEmail: ''
    };
  },
  methods: {
    handleAuthSuccess(email) {
      this.isLoggedIn = true;
      this.userEmail = email;
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.userEmail = '';
    }
  },
  mounted() {
    // Проверяем токен при загрузке приложения
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }*/
};
</script>

<style lang="scss">

  @import "styles/style.scss";
  .body{
    @include body;
  }
  .button{
    @include button;
  }
  .forMain{
    @include forMain;
  }

</style>