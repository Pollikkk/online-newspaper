<template>
  <v-container>
    <v-flex xs12 sm6 offset-sm3 v-if="error" class="error">{{ error }}</v-flex>
    <v-flex xs12 sm6 offset-sm3 v-else>
      <div v-if="loading"  class="error">Загрузка новостей...</div>
      <v-card 
          class="card"
          v-for="(item, index) in newsList"
          id="item.id"
          :key="index"
          color="black" 
          v-else>

          <v-img
              class="titleText"
              width="100%"
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg">

          
          <v-container fill-height fluid width="100%">
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox class="d-flex justify-space-between">
                <div>
                  <div class="titleText">{{item.title}}</div>
                  <div class="subtitleText">Опубликовано {{item.date}} {{item.time}}</div>
                </div>
                <span>
                  <span :class="likeValue(item.likeValue)" href="#" @click="likeNewsItem(item.title, !item.likeValue)"> ♡ </span>
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
            
            <v-row>
            <div class="likes"> Комментарии({{ item.comments.length() }}) 
              <v-btn color="black" @click="showComm(item.id)">Показать больше... </v-btn>
            </div>
            </v-row>
            <v-row class="flex column" md="6" v-if="getShowComm(item.id)">
              <v-card color="#000" class="comments"
                v-for="(item1, index1) in item.comments"
                id="item1.id"
                :key="index1"
                >
                <p>{{item1.text}}</p>
                <p>{{item1.who}} {{item1.date}} {{item1.time}}</p>
              </v-card>
              <v-btn color="black" @click="loadMoreComments(item.id)" v-if="kolComm.find(x=>x.id === item.id)['end'] === false">ещё комментарии... </v-btn>
            </v-row>
            <v-row>
              <v-textarea
              bg-color="grey-dark"
              color="purple"
              label="Прокомментировать"
              v-model="item.commentText"
              ></v-textarea>
              <v-btn flat color="purple" @click="submitComment(item.id, item.title)">Отправить</v-btn>
            </v-row>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
      <v-btn color="#fff" @click="loadMoreNews">Загрузить еще</v-btn>
    </v-flex>

  </v-container>
</template>

<script>
import { useTextsStore } from "../store/texts";
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/News', // URL сервера
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для получения новостей
async function fetchNews(page) {
  try {
    const response = await apiClient.get(`/show/${page}`);
    return response.data; // Возвращает список новостей
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    throw error;
  }
}

// Функция для управления лайками
async function likeNews(title, like) {
  try {
    const response = await apiClient.post('/like', null, {
      params: { title, like },
    });
    return response.data; // Возвращает количество лайков
  } catch (error) {
    console.error('Ошибка при управлении лайком:', error);
    throw error;
  }
}

// Функция для добавления комментария
async function addComment(commentDTO, newsTitle) {
  try {
    const response = await apiClient.post('/addComment', commentDTO, {
      params: { title: newsTitle },
    });
    return response.data; // Возвращает статус
  } catch (error) {
    console.error('Ошибка при добавлении комментария:', error);
    throw error;
  }
}

// Функция для получения комментариев
async function fetchComments(page, title) {
  try {
    const response = await apiClient.get('/showComm', {
      params: { page, title },
    });
    return response.data; // Возвращает список комментариев
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
    throw error;
  }
}

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
      loading: false,
      error: null,
      currentPage: 0, // Текущая страница

      selectedNewsId: null,//
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
    async loadNews() {//вывод новостей
      this.loading = true;
      this.error = null;
      try {
        const news = await fetchNews(this.currentPage);
        this.newsList.push(...news.map((n) => ({ ...n, commentText: '', commentsPage: 0, comments: []}))); // Добавляем новости к списку
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        this.error = 'Не удалось загрузить новости. Пожалуйста, попробуйте позже.';
      }finally {
        this.loading = false;
      }
    },
    async likeNewsItem(title, like) {//ставим лайк
      try {
        const likeCount = await likeNews(title, like);
        console.log(`Количество лайков для "${title}": ${likeCount}`);
      } catch (error) {
        console.error('Ошибка при управлении лайком:', error);
      }
    },
    loadMoreNews() {//загрузка новостей
      this.currentPage++;
      this.loadNews();
    },
    logout() {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      this.$emit('logout');
    },
    async submitComment(newsId, title) {
      // Находим новость по ID
      const newsItem = this.newsList.find((news) => news.id === newsId);
      if (!newsItem) return;

      try {
        const commentDTO = { text: newsItem.commentText }; // Структура объекта CommentDTO
        await addComment(commentDTO, title); // Отправляем запрос на сервер
        alert('Комментарий добавлен!');
        newsItem.commentText = '';
      } catch (error) {
        console.error('Ошибка при добавлении комментария:', error);
        alert('Не удалось добавить комментарий.');
      }
    },
    async loadComments(newsId) {
      // Находим новость по ID
      const newsItem = this.newsList.find((news) => news.id === newsId);
      if (!newsItem) return;

      try {
        const commentsList = await fetchComments(newsItem.commentsPage, newsItem.title);
        newsItem.comments.push(...commentsList); // Добавляем комментарии к списку
      } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error);
      }
    },
    loadMoreComments(newsId) {
      // Находим новость по ID
      const newsItem = this.newsList.find((news) => news.id === newsId);
      if (!newsItem) return;

      newsItem.commentsPage++;
      this.loadComments(newsId);
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
    likeValue(value){//определяем, лайкнут ли пост
      //console.log(this.textsStore.likes.find(y=>y.id === id).peopeId.indexOf(3));
      return !value === false ? 'notLiked' : 'liked'; //меняем стили
      //return 'notLiked';
    }
  },
  mounted() {
    this.loadNews();
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

.error{
  @include error;
}

</style>
