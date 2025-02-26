<template>
  <v-container>
    <v-row>
    <v-col xs="12" sm="6" v-if="error" class="error">{{ error }}</v-col>
    <v-col :cols="12" v-else>
      <v-card class="chooseThemes" color="#1e1a57" v-show="currentUser">
        <div class="flex">
          <v-card-title class="mainHeaderSortThemes">Сортировка по темам:</v-card-title>
          <v-btn color="#1e1a57" class="arrowButton" @click="showChoiseOfThemes = !showChoiseOfThemes"> {{ showChoiseOfThemes ? ' ▲ ' : ' ▼ ' }} </v-btn>
        </div>
          <div v-show="showChoiseOfThemes">
            <h4 class="headerSortThemes">Показывать в первую очередь:</h4>
            <v-card-text class="flex">
              <div class="flex no-wrap">
                <div v-for="item in themes" :key="item" >
                <label>
                  <input type="checkbox" :value="item" v-model="chooseThemes" />
                  {{ item }}
                </label>
                </div>
              </div>
            </v-card-text>
            <h4 class="headerSortThemes">Скрыть темы:</h4>
            <v-card-text class="flex">
              <div class="flex no-wrap">
                <div v-for="item in themes" :key="item" >
                <label>
                  <input type="checkbox" :value="item" v-model="deleteThemes" />
                  {{ item }}
                </label>
                </div>
              </div>
              <v-btn color="#1e1a57" @click="sortByThemes()">Настроить</v-btn>
            </v-card-text>
          </div>
      </v-card>
      <div v-if="loading" class="error">Загрузка новостей...</div>
      <v-card 
          class="card"
          v-for="(item) in newsList"
          :id="item.id"
          :key="item.id"
          color="black" 
          v-else>


          <v-btn color="black" v-if="isAdmin && !item.isEditing" @click="delNew(item.title)">DEL</v-btn>
          <v-btn color="black" v-if="isAdmin" @click="redNew(item.title)">RED</v-btn>

          <v-img
              class="titleText"
              width="100%"
              :src=item.imgSource v-if="!item.isEditing">

          
          <v-container fill-height fluid width="100%">
            <v-layout fill-height>
              <v-col xs="12" align-end flexbox class="d-flex justify-space-between">
                <div>
                  <div class="titleText">{{item.title}}</div>
                  <div class="subtitleText">Опубликовано {{new Date(item.createdAt).toISOString().split('T')[0]}} {{new Date(item.createdAt).toTimeString().split(' ')[0]}} </div>
                  <div class="themesText" v-for="(item) in item.themes" :key="item">
                    #{{ item }}
                  </div>
                </div>
                <span>
                  <span :class="[likeValue(item.likedByThisUser), { disabled: currentUser===null }]" href="#" @click="likeNewsItem(item.title, !item.likedByThisUser)"> ♡ </span>
                  {{ item.countLikes }}
                </span>
              </v-col>
            </v-layout>
          </v-container>
        </v-img>

        <div v-else>
          <v-text-field  v-model="item.title" label="Редактировать заголовок" />
          <h4>Редактировать темы:</h4>
          <div v-for="item1 in themes" :key="item1">
            <label>
              <input type="checkbox" :value="item1" v-model="item.themes" />
              {{ item1 }}
            </label>
          </div>
          <v-text-field  v-model="item.imgSource" label="Ссылка на картинку" />
        </div>
        

        <v-slide-y-transition v-if="!item.isEditing">
          <v-card-text v-if="!item.show">  <!--  !  -->
            <v-row :class="amountOfText(item.title)">
              {{ item.text }}
            </v-row>
            <v-row>
              <v-btn color="black" @click="showMore(item.title)"> {{ amountOfText(item.title) == 'textNewsAll' ? 'Скрыть' : 'Ещё' }} </v-btn>
            </v-row>
            
            <v-row>
              <div class="likes"> Комментарии({{item.kolComments}}) 
              </div>
            </v-row>
              
            <v-row class="flex column" md="6" v-if="item.kolComments!==0">
              <v-card color="#000" class="comments"
                v-for="(item1, index1) in item.comments"
                id="item1.id"
                :key="index1"
                >
                <strong>{{item1.text}}</strong>
                <i>{{item1.ownerName}} {{new Date(item1.createdAt).toISOString().split('T')[0]}} {{new Date(item1.createdAt).toTimeString().split(' ')[0]}}</i>
                <v-btn color="black" v-show="isAdmin" @click="delComment(item.title, item1.id)">DEL</v-btn>
              </v-card>
              <v-btn color="black" @click="loadMoreComments(item.title)" v-if="!item.allComments">ещё комментарии... </v-btn>
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

        <v-textarea v-else v-model="item.text" label="Редактировать текст"></v-textarea>

      </v-card>
      <v-btn color="#fff" @click="loadNews" v-if="!allNews">Загрузить еще</v-btn>
      <div  class="error" v-else>Это пока все новости</div>
    </v-col>
  </v-row>

  </v-container>
</template>

<script>
import axios from 'axios';

//для newsController, LikeController, CommentController, 
const apiClient = axios.create({ 
    baseURL: 'http://localhost:8081/news', // URL сервера
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  });

//для AdminController
const apiAdmin = axios.create({ 
    baseURL: 'http://localhost:8081/admin', // URL сервера
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  });

  const apiAuth = axios.create({ 
  baseURL: 'http://localhost:8081/auth', // URL сервера
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//для ConfigureThemesController
const apiConfig = axios.create({ 
  baseURL: 'http://localhost:8081/config', // URL сервера
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isAlertShown = false;
// Отслеживаем, когда у сервера истечет время действия токена
apiClient.interceptors.response.use(
    (response) => response, // Если запрос успешен, просто возвращаем его
    (error) => {
      console.log("Что у вас здесь происходит..");
      console.log(error);
      if (error.response && error.response.status === 400) {
        console.log("Токен истек! Удаляем его из хранилища...");
        
        // Удаляем токен из localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("person");
        localStorage.removeItem("name");
  
        // Отправляем предупреждение
        if(!isAlertShown){
          alert("Вы не авторизованы!");
          isAlertShown = true;
        }
      }
      
      return Promise.reject(error); // Возвращаем ошибку для обработки в коде
    }
  );


// Функция для получения новостей
async function fetchMoreNews(page) {
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    let response;
    if(token!==null){
      response = await apiClient.get(`/showforAuthorized/${page}`,{
          headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            }
          });
    }
    else{
      response = await apiClient.get(`/show/${page}`);
    }
    
    console.log("Новости:" + response.data[0]);

    for (let key in response.data[0]) {
      console.log(`${key}: ${response.data[0][key]}`);
    }

    return response.data; // Возвращает список новостей
  } catch (error) {
    console.error('Ошибка при получении новостей:', error.response || error.message);
    throw error;
  }
}

// Функции для управления лайками
async function likeNews(title) {
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    const response = await apiClient.post('/like', null, {
      params: { title },
     // Параметры credentials автоматически передаются как JSON
          headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            }
          });
    return response.data; // Возвращает количество лайков
  } catch (error) {
    console.error('Ошибка при управлении лайком:', error);
    throw error;
  }
}

async function unlikeNews(title, email) {
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    console.log(email);
    const response = await apiClient.delete('/unlike', {
      params: { title, email },
      headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            }
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
    const response = await apiClient.get('/showComm', {
      params: { 
        page: page, 
        title: title 
      }
    });
    const data = Object.values(response.data);  //чтоб избежать ошибок с forEach
    console.log("Ответ при получении комментов: "+response.data);
    data.forEach(item => {
            console.log(item);
            });

    return response.data; // Возвращает список комментариев
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
    throw error;
  }
}

//Вывод всех тем
async function fetchThemes() {
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    const response = await axios.get('http://localhost:8081/config/allThemes', {
      headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            },
            withCredentials: true, // Для отправки куки
    });
    return response.data; // Возвращает список тем
  } catch (error) {
    console.error('Ошибка при получении тем:', error);
    throw error;
  }
}

async function countComm(title){   
      const response = await apiClient.get('/countComm', {
        params: { title: title }
      });
      const kol = await response.data;
      console.log("kol_comms " + response);
      console.log("kol_comms " + kol);
      return kol;
}

//РАБОТА С ПРЕДПОЧТЕНИЯМИ ПОЛЬЗОВАТЕЛЯ
async function addPreference(theme, status){
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    const response = await apiConfig.post('/addPrefer', null, {
        params: {theme: theme, status: status},
        headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            },
      });
      console.log("addPreference " + theme);
    return response.data; 
  } catch (error) {
    console.error('Ошибка при добавлении предпочтения:', error);
    throw error;
  }
}
async function delPreference(theme){
  console.log(theme);
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    const response = await apiConfig.delete('/delPrefer', {
        params: {theme: theme.trim()},
        headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            },
      });
      console.log("delPreference " + theme);
      
    return response.data; 
  } catch (error) {
    console.error('Ошибка при удалении предпочтения:', error);
    throw error;
  }
}

async function UserPrefer(){
  try {
    const token = localStorage.getItem("token"); // Получаем JWT токен
    const response = await apiConfig.get('/prefersCurUsr', {
          headers: {
                'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
              },
        });
        console.log("Предпочтения пользователя: ", response.data);
      return response.data; 
    } catch (error) {
      console.error('Ошибка при получении предпочтений пользователя: ', error);
      throw error;
  }
}

async function who(){
  try{
    const token = localStorage.getItem("token"); // Получаем JWT токен
    const response = await apiAuth.get('/who', {
          headers: {
                'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
              },
        });
        console.log("Кто: ", response.data);
      return response.data; 
    } catch (error) {
      console.error('Ошибка при получении who: ', error);
      throw error;
  }
}

export default {
  props: ['userEmail'],
  data() {
    return {
      newsLoaded: false,
      foodObr: [],
      prov: [],
      res: false,
      kolComm: [],//кол-во комментариев
      show: true,

      newsList: [],//список новостей
      loading: false,
      error: null,
      currentPage: 1, // Текущая страница

      selectedNewsId: null,//

      currentUser: null,
      isAdmin: false,

      news: {
        title: "",
        text: "",
        imgSource: "",
        themes: [],
      },
      newTheme: '',
      themes: [],
      chooseThemes: [],
      deleteThemes: [],

      //флаги для прогружающей новости кнопки
      allNews: false,

      showChoiseOfThemes: true
    };
  },
  name: 'MainPage',
  setup() {
  },
  methods: {
    async loadNews() {//вывод новостей
      this.loading = true;
      this.error = null;
      const scrollY = window.scrollY; // Запоминаем текущую позицию прокрутки
      console.log('Сохраненная позиция прокрутки:', scrollY);
      try {
        const news = await fetchMoreNews(this.currentPage);

        if(news==0){
          this.allNews = true;
        }
        this.newsList.push(...news.map((n) => ({ 
          ...n, 
          showAllText: false, 
          commentText: '', 
          showComments: true, 
          commentsPage: 0, 
          comments: [],
          kolComments: 0,
          allComments: false,
          isEditing: false,
        }))); // Добавляем новости к списку

        this.newsList.forEach(item => {
              this.countComments(item['title']);
        });

        if (!this.newsLoaded) {//загружаем первые комментарии и кол-во всех комм-в, когда страница только открыта
          this.newsList.forEach(item => {
            this.loadMoreComments(item['title']);
          });
            this.newsLoaded = true;
        }
        console.log('Current page:', this.currentPage);
        this.currentPage++;
        console.log('After news update:', this.newsList);
        
        this.$nextTick(() => {
          console.log('После загрузки новостей. Позиция прокрутки:', scrollY);
          window.requestAnimationFrame(() => {
            window.scrollTo(0, scrollY); // Восстанавливаем позицию прокрутки
          });
        });
        console.log("newsLoaded: ", this.newsLoaded);
      } catch (error) {
        console.log('Ошибка при загрузке новостей:', error);
        this.error = 'Не удалось загрузить новости. Пожалуйста, попробуйте позже.';
      }finally {
        this.loading = false;
      }
    },
    async likeNewsItem(title, liked) {//ставим лайк
      try {
        const newsItem = this.newsList.find((news) => news.title === title);
        newsItem.likedByThisUser = liked;
        if(liked){
          await likeNews(title);
          newsItem.countLikes = newsItem.countLikes + 1;
        }
        else{
          await unlikeNews(title, localStorage.getItem('person'));
          newsItem.countLikes = newsItem.countLikes - 1;
        }
      } catch (error) {
        console.error('Ошибка при управлении лайком:', error);
      }
    },
    likeValue(value){//определяем, лайкнут ли пост
      return value === true ? 'liked' : 'notLiked'; //меняем стили
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
    async countComments(title){               //--------------------------------------------------
      const newsItem = this.newsList.find((news) => news.title === title);
      const kol = await countComm(title);
      newsItem.kolComments = kol;
      return kol;
    },
    // Функция для добавления комментария
    async submitComment(title, text) {
      // Находим новость по заголовку
      const newsItem = this.newsList.find((news) => news.title === title);
      if (!newsItem) return;
      if(text == '') return;

      try {
        const token = localStorage.getItem("token"); // Получаем JWT токен
        const response = await apiClient.post(
          `/addComment`,{text: text},
          {
            params: { title: title },  // Заголовок новости 
            headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            },
            withCredentials: true, // Если требуется аутентификация
          }
        );
        console.log("new comm "+response);

        if (response.status === 200) {
          console.log('Комментарий успешно добавлен');
          alert('Комментарий успешно добавлен');
          window.location.reload();
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
      
        if(commentsList !== ''){
          console.log('COMMS: '+commentsList);
          newsItem.comments.push(...commentsList); // Добавляем комментарии к списку
        }
        else{
          newsItem.allComments = true;
        }
        return commentsList;
      } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error);
        return null;
      }
    },
    loadMoreComments(title) {
      // Находим новость по названию
      const newsItem = this.newsList.find((news) => news.title === title);
      if (!newsItem) return;
      this.loadComments(title);
      newsItem.commentsPage++;
    },
    async loadThemes(){
      try {
        const themesList = await fetchThemes();
        const themesStr = themesList.toString();
        const arr = themesStr.split(','); 
        this.themes = themesStr.split(',');  // Добавляем в массив темы
        console.log("темы: " + arr);

      } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
      }
    },

    //АДМИН
    async addNew(){ //добавление новости
      try {
        const token = localStorage.getItem("token"); // Получаем JWT токен
        const response = await apiAdmin.post('/addNew', this.news,{
          headers: {
                  'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                }
        });
        console.log("new new "+response.data);
        window.location.reload();
        return response.data; // Возвращает список комментариев
      } catch (error) {
        console.error('Ошибка при добавлении новости:', error);
        throw error
        }
    },
    async delNew(title){ //удаление новости
      try {
        const token = localStorage.getItem("token"); // Получаем JWT токен
        const response = await apiAdmin.delete('/delNew', {
          params: {title},
          headers: {
                  'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                }
        });
        const index = this.newsList.findIndex(news => news.title === title);
        if (index !== -1) {
          this.newsList.splice(index, 1);
        }
        return response.data; // Возвращает список комментариев
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        throw error
        }
    },

    //РЕДАКТИРОВАНИЕ НОВОСТИ
    async redNew(title){
      const newsItem = this.newsList.find((news) => news.title === title);
      newsItem.isEditing = !newsItem.isEditing;
      let id;
      if(newsItem.isEditing){
        id = await this.redNew1(title);
        console.log("Полученный id: "+id);
        newsItem.id = id;
      }else {
        if (newsItem.id !== undefined && newsItem.id !== null) { // Проверка, что id не пустой
          await this.redNew2(newsItem.id, title);
          console.log("id передан в redNew2: " + newsItem.id);
        } else {
          console.error("Ошибка: id равен undefined перед вызовом redNew2");
        }
      }
    },
    async redNew1(title){ //отправка запроса на сервер на получение id новости
      try {
        const token = localStorage.getItem("token"); // Получаем JWT токен
        const response = await apiAdmin.get('/editNews', {
          params: {title: title},
          headers: {
                  'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                }
        });
        console.log("Ответ от сервера: ", response.data);
        //const id = response.data; 
        const id = parseInt(response.data, 10);
        if (isNaN(id)) {
          throw new Error("Полученный id не является числом");
        }
        console.log("id, полученный из redNew1: "+id);
        return id; // Возвращает список комментариев
      } catch (error) {
        console.error('Ошибка при получении id новости:', error);
        throw error
      }
    },
    async redNew2(id, title){ //редактирование новости -> запрос на сервер
      try {
        const newsItem = this.newsList.find((news) => news.title === title);
        const body = {id: id, title: newsItem.title, text: newsItem.text, imgSource: newsItem.imgSource, themes: Array.from(newsItem.themes)};
        console.log("body " + body.id);
        const token = localStorage.getItem("token"); // Получаем JWT токен
        const response = await apiAdmin.patch('/editNews', body,{
          headers: {
                  'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                }
        });
        return response.data; // Возвращает список комментариев
      } catch (error) {
        console.error('Ошибка при редактировании новости:', error);
        throw error
        }
    },
    async delComment(title, id){ //удаление комментария
      try {
        const token = localStorage.getItem("token"); // Получаем JWT токен
        const response = await apiClient.delete('/deleteComment', {
          params: {titleNews: title, commentId: id},
          headers: {
                  'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                }
        });
        window.location.reload();
        return response.data; 
      } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        throw error
        }
    },
    async addTheme(){
      try {
        const token = localStorage.getItem("token"); // Получаем JWT токен
        const response = await apiConfig.post('/addNewTheme', null, {
          params: {theme_name: this.newTheme},
          headers: {
                  'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                }
        });
        window.location.reload();
        return response.data; 
      } catch (error) {
        console.error('Ошибка при добавлении темы:', error);
        throw error
        }
    },


    async loadName(){
      const token = localStorage.getItem("token");
      const response2 = await apiAuth.get('/getFIO', {
          headers: {
              'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            }
          });
      console.log(response2.data);
      localStorage.setItem('name', response2.data.name);
      this.currentUser = localStorage.getItem("name");
    },
    //ТЕМАТИКИ
    async sortByThemes(){
      const prevChoise = [
      ...(JSON.parse(localStorage.getItem("checkedThemes")) || []),
      ...(JSON.parse(localStorage.getItem("forbiddenThemes")) || [])
      ].filter(item => item.trim());

      console.log("prevChoise: "+prevChoise);
      if(prevChoise.length > 0){
        await Promise.all(prevChoise.map(theme => delPreference(theme)));
      }
      
      localStorage.removeItem("checkedThemes");
      localStorage.removeItem("forbiddenThemes");

      let chosenThemes = Array.from(this.chooseThemes);
      let forbiddenThemes = Array.from(this.deleteThemes);
      console.log("checkedThemes: " + chosenThemes);
      console.log("forbiddenThemes: " + forbiddenThemes);
      if(chosenThemes.length > 0){
        await Promise.all(chosenThemes.map(theme => addPreference(theme, true)));
      }
      if (forbiddenThemes.length > 0) {
        await Promise.all(forbiddenThemes.map(theme => addPreference(theme, false)));
      }
      
      window.location.reload();
    },
    async usersPreferences(){
      const preferences = await UserPrefer(); //любимые темы
      const filteredKeys1 = Object.entries(preferences)
        .filter(([, value]) => value === true) // Оставляем только ключи с true
        .map(([key]) => key); // Извлекаем только ключи
      localStorage.setItem("checkedThemes", JSON.stringify(filteredKeys1));
      this.chooseThemes = filteredKeys1;

      const filteredKeys2 = Object.entries(preferences) //запрещенные темы
        .filter(([, value]) => value === false) // Оставляем только ключи с false
        .map(([key]) => key); // Извлекаем только ключи
      localStorage.setItem("forbiddenThemes", JSON.stringify(filteredKeys2));
      this.deleteThemes = filteredKeys2;
    }
  },
  mounted() {
    if (!this.newsLoaded) {
      if(localStorage.getItem('token')){
        this.loadThemes();  //Загружаем список тем
        this.loadName();
        this.usersPreferences();
      }
      this.loadNews();  // Загружаем новости, только если они ещё не загружены
      console.log("polzovatel " + this.currentUser);
    }

    if(this.currentUser!= null){
      who().then(result => {
      result == 1 ? this.isAdmin = true : this.isAdmin = false;
      console.log("Кто " + result); // Выведет 1 или 0
      if(this.isAdmin == true){
        localStorage.setItem("isAdmin", true);
      } 
    })
    .catch(error => {
        console.error("Ошибка определения isAdmin: ", error);
      });
    }
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

.no-wrap{
  @include no-wrap;
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

.stickyColumn{
  @include stickyColumn;
}

.themesText{
  @include themesText;
}

.addTheme{
  @include addTheme;
}

.chooseThemes{
  @include chooseThemes;
}

.disabled{
  @include disabled;
}

.headerSortThemes{
  @include headerSortThemes;
}
.mainHeaderSortThemes{
  @include mainHeaderSortThemes;
}

.arrowButton{
  @include arrowButton;
}
</style>
