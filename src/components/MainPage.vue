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
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"><!--src=item.image-->

          
          <v-container fill-height fluid width="100%">
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox class="d-flex justify-space-between">
                <div>
                  <div class="titleText">{{item.title}}</div>
                  <div class="subtitleText">Опубликовано {{new Date(item.createdAt).toISOString().split('T')[0]}} {{new Date(item.createdAt).toTimeString().split(' ')[0]}} </div>
                </div>
                <span>
                  <span :class="likeValue(item.liked)" href="#" @click="likeNewsItem(item.title, !item.liked)"> ♡ </span>
                  {{ item.liked  }}
                  <!--{{ textsStore.countLikes(item.id) }}-->
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
            <v-row :class="amountOfText(item.title)">
              {{ item.text }}
            </v-row>
            <v-row>
              <v-btn color="black" @click="showMore(item.title)"> {{ amountOfText(item.title) == 'textNewsAll' ? 'Скрыть' : 'Ещё' }} </v-btn>
            </v-row>
            
            <v-row>
            <div class="likes"> Комментарии({{item.comments.length }}) 
              <!--<v-btn color="black" @click="item.showComments=true">Показать больше... </v-btn>-->
            </div>
            </v-row>
            {{ item.showComments }}
            <v-row class="flex column" md="6" v-if="item.comments.length">
              <v-card color="#000" class="comments"
                v-for="(item1, index1) in item.comments"
                id="item1.id"
                :key="index1"
                >
                <p>{{item1.text}}</p>
                <strong>{{item1.who}} {{item1.date}} {{item1.time}}</strong>
              </v-card>
              <v-btn color="black" @click="loadMoreComments(item.title)">ещё комментарии... </v-btn>
            </v-row>
            <v-row v-else>Комментариев пока нет</v-row>
            
            <v-row v-if="currentUser != null">
              <v-textarea
              bg-color="grey-dark"
              color="purple"
              label="Прокомментировать"
              v-model="item.commentText"
              ></v-textarea>
              <v-btn flat color="purple" @click="submitComment(item.title, item.commentText)">Отправить</v-btn>
            </v-row>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
      <v-btn color="#fff" @click="loadMoreNews">Загрузить еще</v-btn>
    </v-flex>

  </v-container>
</template>

<script>
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8081/News', // URL сервера
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

// Отслеживаем, когда у сервера истечет время действия токена
apiClient.interceptors.response.use(
    (response) => response, // Если запрос успешен, просто возвращаем его
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Токен истек! Удаляем его из хранилища...");
        
        // Удаляем токен из localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("person");
  
        // Перенаправляем пользователя на страницу входа
        window.location.href = "/login"; 
      }
      
      return Promise.reject(error); // Возвращаем ошибку для обработки в коде
    }
  );


// Функция для получения новостей
async function fetchNews(page) {
  try {
    const response = await apiClient.get(`/show/${page}`);
    return response.data; // Возвращает список новостей
  } catch (error) {
    console.error('Ошибка при получении новостей:', error.response || error.message);
    throw error;
  }
}

// Функция для управления лайками
async function likeNews(title, like) {
  try {
    const response = await apiClient.post('/like', null, {
      params: { title, like },
    }, // Параметры credentials автоматически передаются как JSON
          {
            headers: {
              'Content-Type': 'application/json', // Устанавливаем тип контента как JSON
            },
            withCredentials: true, // Для отправки куки
          });
    return response.data; // Возвращает количество лайков
  } catch (error) {
    console.error('Ошибка при управлении лайком:', error);
    throw error;
  }
}

// Функция для получения комментариев
async function fetchComments(page, title) {
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    const response = await apiClient.get('/showComm', {
      params: { 
        page: page, 
        title: title 
      },
      headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            },
            withCredentials: true, // Для отправки куки
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
      show: true,

      newsList: [],//список новостей
      loading: false,
      error: null,
      currentPage: 0, // Текущая страница

      selectedNewsId: null,//

      currentUser: null,

    };
  },
  name: 'MainPage',
  setup() {
  },
  methods: {
    async loadNews() {//вывод новостей
      this.loading = true;
      this.error = null;
      try {
        const news = await fetchNews(this.currentPage);
        this.newsList.push(...news.map((n) => ({ ...n, showAllText: false, commentText: '', showComments: true, commentsPage: 0, comments: []}))); // Добавляем новости к списку
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        console.log('Ошибка при загрузке новостей:', error);
        this.error = 'Не удалось загрузить новости. Пожалуйста, попробуйте позже.';
      }finally {
        this.loading = false;
      }
    },
    async likeNewsItem(title, like) {//ставим лайк
      try {
        const likeCount = await likeNews(title, like);
        const newsItem = this.newsList.find((news) => news.title === title);
        newsItem.liked = like;

        console.log(`Количество лайков для "${title}": ${likeCount}`);
      } catch (error) {
        console.error('Ошибка при управлении лайком:', error);
      }
    },
    likeValue(value){//определяем, лайкнут ли пост
      //console.log(this.textsStore.likes.find(y=>y.id === id).peopeId.indexOf(3));
      return value === true ? 'liked' : 'notLiked'; //меняем стили
      //return 'notLiked';
    },

    amountOfText(newsTitle){//проверяем кол-во текста
      const newsItem = this.newsList.find((news) => news.title === newsTitle);
      console.log(newsItem);
      return newsItem.showAllText==true ? 'textNewsAll' : 'textNewsPart';
    },
    showMore(newsTitle){//развернуть текст
      const newsItem = this.newsList.find((news) => news.title === newsTitle);
      console.log(newsTitle);
      console.log(newsItem);
      newsItem.showAllText = !newsItem.showAllText;
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
    // Функция для добавления комментария
    async submitComment(title, text) {
      // Находим новость по заголовку
      const newsItem = this.newsList.find((news) => news.title === title);
      if (!newsItem) return;

      try {
        const token = localStorage.getItem("token"); // Получаем JWT токен
        //const commentDTO = { text: text }; // Структура объекта CommentDTO /*const commentDTO = { text: newsItem.commentText };*/
        const response = await apiClient.post(
          `/addComment`,{text: text},
          {
            params: { title: title },  // Заголовок новости 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            },
            withCredentials: true, // Если требуется аутентификация
          }
        );

        if (response.status === 200) {
          console.log('Комментарий успешно добавлен');
          alert('Комментарий успешно добавлен');
          newsItem.commentText = ''; // Очистка поля после успешной отправки
        } else {
          console.error('Ошибка при добавлении комментария:', response.data);
          alert('Ошибка при добавлении комментария');
        }
      } catch (error) {
        console.error('Ошибка при добавлении комментария:', error);
        alert('Не удалось добавить комментарий.');
      }
    },
    async loadComments(title) {
      // Находим новость по заголовку
      const newsItem = this.newsList.find((news) => news.title === title);
      if (!newsItem) return;

      try {
        const commentsList = await fetchComments(newsItem.commentsPage, newsItem.title);
        newsItem.comments.push(...commentsList); // Добавляем комментарии к списку
      } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error);
      }
    },
    loadMoreComments(title) {
      // Находим новость по ID
      const newsItem = this.newsList.find((news) => news.title === title);
      if (!newsItem) return;

      newsItem.commentsPage++;
      this.loadComments(title);
    },

    

    getShowComm(id){//получить комментарии
      console.log('id: ' + id);
      console.log(this.textsStore.getShow(id));
      return this.textsStore.getShow(id);
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
    }
  },
  mounted() {
    this.loadNews();
    this.currentUser = localStorage.getItem("person");
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

.textNewsAll{
  @include textNewsAll;
}

.textNewsPart{
  @include textNewsPart;
}

</style>
