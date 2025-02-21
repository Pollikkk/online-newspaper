<template>
    <v-container>
      <v-row>
        <router-link :to="{ path: '/main'}">
            <v-btn class="back">Назад</v-btn>
        </router-link>
      </v-row>
      <v-row>
      <v-col cols="8">
        <v-card color="black">
          <v-card-title>Добавить новость:</v-card-title>
          <v-text-field 
            v-model="news.title" 
            bg-color="grey-dark"
            color="purple"
            label="Заголовок"
            required 
            outlined
            />
          <v-textarea
            v-model="news.text" 
            bg-color="grey-dark"
            color="purple"
            label="Текст новости"
            required 
            outlined
            />
            <v-text-field 
            v-model="news.imgSource" 
            bg-color="grey-dark"
            color="purple"
            label="Картинка"
            outlined
            />
            <h4>Выберите темы:</h4>
            <div v-for="item in themes" :key="item">
              <label>
                <input type="checkbox" :value="item" v-model="news.themes" />
                {{ item }}
              </label>
            </div>
          <v-btn flat color="purple" :disabled="!news.title || !news.text || !news.themes" @click="addNew()">
            Отправить
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="addTheme" color="black" >
          <v-card-title>Добавить тему:</v-card-title>
          <v-text-field 
            v-model="newTheme" 
            bg-color="grey-dark"
            color="purple"
            label="Название"
            required 
            outlined
            />
          <v-btn flat color="purple" :disabled="!newTheme" @click="addTheme()">
            Отправить
          </v-btn>
          
        </v-card>
      </v-col>
    </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
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
  
  export default {
    props: ['userEmail'],
    data() {
      return {
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

      
    },
    mounted() {
        this.loadThemes(); 
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
  
  .themesText{
    @include themesText;
  }
  
  .addTheme{
    @include addTheme;
  }
  
  .chooseThemes{
    @include chooseThemes;
  }

  .back{
    @include back;
  }
  
  </style>
  