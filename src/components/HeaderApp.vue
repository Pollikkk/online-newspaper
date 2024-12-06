<template>
    <v-app-bar
      app
      color="indigo"
    >
        <v-app-bar-title>
        <h3 class="text-h4 white--text">News</h3>
      </v-app-bar-title>
      <v-app-bar-items class="footerLinks">
        <div>Имя</div>
        <router-link :to="{ path: '/login'}">
          <v-btn flat>Войти</v-btn>
        </router-link>
      </v-app-bar-items>
    </v-app-bar>
</template>

<script>
export default {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../styles/style.scss";

.footerLinks{
    @include footerLinks;
  }  

</style>