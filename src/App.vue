<template>
  <v-app class="body">
    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
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

</style>