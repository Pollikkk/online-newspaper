<template>
  <v-app class="body">
    <HeaderApp></HeaderApp>
    <v-main class="forMain">
      <RouterView></RouterView>
    </v-main>
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
}
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