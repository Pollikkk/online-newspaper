<template>
  <v-container>
    <!--<p>Вы вошли как: {{ userEmail }}</p>
    <button @click="logout">Выйти</button>-->

    <v-flex xs12 sm6 offset-sm3>
      <v-card 
          class="card"
          v-for="(item, index) in textsStore.articles"
          id="item.id"
          :key="index"
          color="black">

          <v-img
              class="titleText"
              width="100%"
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
          >
          <v-container fill-height fluid width="100%">
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox class="d-flex justify-space-between">
                <div>
                  <div class="titleText">{{item.name}}</div>
                  <div class="subtitleText">Опубликовано {{item.date}} {{item.time}}</div>
                </div>
                <span>
                  <span :class="likeValue(item.id)" href="#" @click="putLike(item.id)"> ♡ </span>
                  {{ textsStore.countLikes(item.id) }}
                </span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click="item.show = !item.show">
            READ
            <v-icon>{{ item.show ? 'mdi_arrow_down' : 'mdi_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-slide-y-transition>
          <v-card-text v-if="!item.show">
            <v-row>
              {{item.text}}
            </v-row>
            
            <!--<v-row>
            <div class="likes"> комментарии({{ commLength(item.id) }}) 
              <v-btn color="black" @click="showComm(item.id)">Показать больше... </v-btn>
            </div>
            </v-row>
            <v-row class="flex column" md="6" v-if="getShowComm(item.id)">
              <v-card color="#000" class="comments"
                v-for="(item1, index1) in textsStore.retComments(item.id)[0].slice(0, kolComm.find(x=>x.id === item.id)['num'])"
                id="item1.id"
                :key="index1"
                >
                <p>{{item1.text}}</p>
                <p>{{item1.who}} {{item1.date}} {{item1.time}}</p>
              </v-card>
              <v-btn color="black" @click="showMoreComm(item.id)" v-if="kolComm.find(x=>x.id === item.id)['end'] === false">ещё комментарии... </v-btn>
            </v-row>-->
            <v-row>
              <v-textarea
              bg-color="grey-dark"
              color="purple"
              label="Прокомментировать"
              v-model="commentText"
              ></v-textarea>
              <v-btn flat color="purple" @click="addComment">Отправить</v-btn>
            </v-row>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </v-flex>
    {{ textsStore.comments.find(x=>x.id === 3).comms.length }}
    {{ returnComments}}
    {{ textsStore.showComments }}
    {{ kolComm }}
    {{ kolComm.find(x=>x.id === 1) }}


    <!--Пробный вариант для связи с сервером-->
    <v-flex xs12 sm6 offset-sm3>
      <v-card v-for="news in newsList" :key="news.id"
      class="card"
      color="black"
      >
        <v-img
              class="titleText"
              width="100%"
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
          >
          <v-container fill-height fluid width="100%">
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox class="d-flex justify-space-between">
                <div>
                  <div class="titleText">{{news.title}}</div>
                  <!--<div class="subtitleText">Опубликовано {{item.date}} {{item.time}}</div>-->
                </div>
                <span>
                  <!--<span :class="likeValue(item.id)" href="#" @click="putLike(item.id)"> ♡ </span>
                  {{ textsStore.countLikes(item.id) }}-->
                </span>
              </v-flex>
            </v-layout>

          </v-container>
      </v-img>
      </v-card>
    </v-flex>



  </v-container>
</template>

<script>
import { useTextsStore } from "../store/texts";
import axios from 'axios';

export default {
  props: ['userEmail'],
  data() {
    return {
      foodObr: [],
      prov: [],
      res: false,
      kolComm: [],//кол-во комментариев
      show: false,
      newsList: [],//список новостей
      selectedNewsId: null,
      commentText: '',
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
    async fetchNews() {//вывод новостей
      try {
        const response = await axios.get('/News');
        this.newsList = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    },
    logout() {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      this.$emit('logout');
    },
    async addComment() {//добавление комментов
      try {
        const response = await axios.post(`/News/addComment/${this.selectedNewsId}`, {
          text: this.commentText
        });
        if (response.status === 200) {
          alert('Комментарий добавлен!');
          this.showCommentForm = false;
          this.commentText = '';
        }
      } catch (error) {
        console.error('Ошибка при добавлении комментария:', error);
      }
    },
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
  mounted() {
    this.fetchNews();
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

.date{
  @include date;
}

.titleText{
  @include titleText;
}

.subtitleText{
  @include subtitleText;
}

</style>
