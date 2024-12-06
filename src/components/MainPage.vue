<template>
  <v-container>
    <!--<v-toolbar color="indigo" dark fixed app>
      <v-toolbar-title>Title</v-toolbar-title>
      
      <v-toolbar-items class="hidden-sm-and-down" >
        <div>Имя</div>
        <router-link :to="{ path: '/login'}">
          <v-btn flat>Войти</v-btn>
        </router-link>
      </v-toolbar-items>
    </v-toolbar>-->
    <v-row>
      <h1 class="header">Главная</h1>
    </v-row>
    <v-row class="flex column">
      <v-card color="#ffff" class="card">
        <div class="content">
          <v-row>
            <div class="img">Картинка</div>
            <h3 class="name">Имя</h3>
          </v-row>
          <v-row>
            <p class="text">текст</p>
          </v-row>
          <v-row>
            <div class="date">дата</div>
            <div class="comments">комм</div>
            <div class="likes">лайки</div>
            <div class="show_more">больше</div>
          </v-row>
        </div>
      </v-card>
    </v-row>
    
  </v-container>
</template>

<script>
export default {
  name: 'MainPage',
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
</style>
