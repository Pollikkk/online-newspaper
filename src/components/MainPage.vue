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
          
          <v-row class="commsAndLikes">
            <div class="date">Опубликовано {{item.date}} {{item.time}} </div>
            <div class="likes"> комментарии({{ commLength(item.id) }}) 
              <a class="show_more" href="#" @click="showComm(item.id)">Показать больше... </a>
            </div>
            <a :class="likeValue(item.id)" href="#" @click="putLike(item.id)"> ({{ textsStore.countLikes(item.id) }}) </a>
          </v-row>
          <v-row class="flex column" md="6" v-if="getShowComm(item.id)">
            <v-card color="#b0edf5" class="comments"
              v-for="(item1, index1) in textsStore.retComments(item.id)[0].slice(0, kolComm.find(x=>x.id === item.id)['num'])"
              id="item1.id"
              :key="index1"
              >
              <p>{{item1.text}}</p>
              <p>{{item1.who}} {{item1.date}} {{item1.time}}</p>
            </v-card>
            <a class="show_more" href="#" @click="showMoreComm(item.id)" v-if="kolComm.find(x=>x.id === item.id)['end'] === false">ещё комментарии... </a>
          </v-row>
        </div>
        
      </v-card>
    </v-row>
    {{ textsStore.comments.find(x=>x.id === 3).comms.length }}
    {{ returnComments}}
    {{ textsStore.showComments }}
    {{ kolComm }}
    {{ kolComm.find(x=>x.id === 1) }}
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
      kolComm: [],//кол-во комментариев
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
    getShowComm(id){//получить комментарии
      console.log('id: ' + id);
      console.log(this.textsStore.getShow(id));
      return this.textsStore.getShow(id);
    },
    showComm(id){//показать комментарии
      this.textsStore.show(id);
      this.kolComm.push({ id: id, num: 3, end: false });
    },
    showMoreComm(id){ //увеличиваем число видимых комментариев
      if(this.commLength(id)>=this.kolComm.find(x=>x.id === id).num)
        this.kolComm.find(x=>x.id === id).num += 3;
      else this.kolComm.find(x=>x.id === id).end = true;//помечаем, что это конец комментариев
    },
    commLength(id){//число комментариев
      return this.textsStore.comments.find(x=>x.id === id).comms.length;
    },

    putLike(id){
      if(this.textsStore.likes.find(x=>x.id === id).peopeId.includes(this.textsStore.getCurrentUser)){//если лайкнут
        var index = this.textsStore.likes.find(x=>x.id === id).peopeId.indexOf(this.textsStore.getCurrentUser);
        this.textsStore.likes.find(x=>x.id === id).peopeId.splice(index, 1);//убираем лайк
      }
      else{//ставим лайк -> добавляем человека
        this.textsStore.likes.find(x=>x.id === id).peopeId.push(this.textsStore.getCurrentUser);
      }
    },
    likeValue(id){//определяем, лайкнут ли пост
      console.log(this.textsStore.likes.find(y=>y.id === id).peopeId.indexOf(3));
      return this.textsStore.isLiked(id) === -1 ? 'notLiked' : 'liked'; //меняем стили
      //return 'notLiked';
    }
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

.liked{
  @include liked;
}

.notLiked{
  @include notLiked;
}

.commsAndLikes{
  @include commsAndLikes;
}

</style>
