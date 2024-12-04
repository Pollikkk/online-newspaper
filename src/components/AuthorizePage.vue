<template>
    <v-container class="form">
        <v-row class="flex column">
            <v-card color="#ffff" class="card">
              <div class="content">
                <v-row>
                  <h3 class="name">Регистрация нового пользователя</h3>
                </v-row>
                <v-row>
                    <v-text-field 
                    class="textfield"
                    placeholder="Имя"
                    type="text"
                  >
                  </v-text-field>
                  <v-text-field
                    class="textfield"
                    placeholder="Фамилия"
                    type="text"
                  >
                  </v-text-field>
                </v-row>
                <v-row>
                    <v-text-field
                    class="textfield"
                    placeholder="Email"
                    type="text"
                  >
                  </v-text-field>
                </v-row>
                <v-row>
                    <v-text-field
                    class="textfield"
                    placeholder="Пароль"
                    type="text"
                  >
                  </v-text-field>
                </v-row>
                <v-row>
                  <v-btn>Зарегистрироваться</v-btn>
                </v-row>
              </div>
            </v-card>
          </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'HelloWorld',
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

  .form{
    @include form;
  }

  .textfield{
    @include textfield;
  }
  </style>
  