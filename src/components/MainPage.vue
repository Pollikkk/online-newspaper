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
      <v-card color="#ffff" 
          class="card"
          v-for="(item, index) in textsStore.articles"
          id="item.id"
          :key="index">
        <div class="content">
          <v-row>
            <div class="img">Картинка</div>
            <h3 class="name">{{item.name}}</h3>
          </v-row>
          <v-row>
            <p class="text">{{item.text}}</p>
          </v-row>
          
          <v-row>
            <div class="date">Опубликовано {{item.date}} {{item.time}} </div>
            <div class="likes">комментарии() </div>
              <div class="likes">лайки() </div>
              <a class="show_more" href="#" @click="showComm(item.id)">показать больше </a>
          </v-row>
          <v-row class="flex column" md="6" v-if="getShowComm(item.id)">
            <v-card color="#b0edf5" class="comments"
              v-for="(item1, index1) in textsStore.retComments(item.id)[0]"
              id="item1.id"
              :key="index1"
              >
              <p>{{item1.text}}</p>
              <p>{{item1.who}} {{item1.date}} {{item1.time}}</p>
            </v-card>
          </v-row>
        </div>
        
      </v-card>
    </v-row>
    {{ returnComments}}
    {{ textsStore.showComments }}
  </v-container>
</template>

<script>
import { useTextsStore } from "../store/texts";

export default {
  data() {
    return {
      foodObr: [],
      prov: [],
      res: false,
    };
  },
  name: 'MainPage',
  setup() {
    const textsStore = useTextsStore();

    return {
      textsStore
    };
  },
  methods: {
    getShowComm(id){
      console.log('id: ' + id);
      console.log(this.textsStore.getShow(id));
      return this.textsStore.getShow(id);
    },
    showComm(id){
      this.textsStore.show(id);
    },
    
  },
  computed:{
    
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

.comments{
  @include comments;
}
</style>
