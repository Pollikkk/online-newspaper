import { defineStore } from "pinia";
export const useTextsStore = defineStore("texts", {
    state: () => {
      return {
        articles: [
            {id: 1,
                name: 'Топ 5 стран по количеству биткоинов на счетах', text: 'По состоянию на июль 2024 года правительства всего мира в совокупности контролируют около 2,2% от общего объема предложения биткоина. В отличие от частных инвесторов и корпораций, большинство правительств не занимаются регулярной покупкой или продажей биткоинов. Вместо этого они, как правило, получают «монеты» путем конфискации активов, связанных с преступной деятельностью. Другой вариант — пожертвования. ', date: "01.12.2024", time: '12:00', show:'false'},
            {id: 2,
                name: 'Получены новые снимки галактики Сомбреро', text: 'Первое широко известное изображение галактики Сомбреро, было сделано космическим телескопом «Хаббл». Теперь же все фанаты звезд, благодаря космическому телескопу Джеймса Уэбба (JWST), увидели его в среднем инфракрасном диапазоне — галактика видна с беспрецедентной детализацией. Кстати, теперь некоторые ставят под вопрос целесообразность такого названия.', date: '03.12.2024', time: '14:00', show:'false'},
            {id: 3,
                name: 'Том Круз и теория рукопожатий', text: '21-летний Уилф Эллиотт из Клактона работает татуировщиком и благодаря своим талантам уже пообщался со многими известными музыкантами, ютуберами и актерами. Художник-дальтоник с удовольствием рисует портреты своих любимых знаменитостей, а после того, как он поделился ими в ***, у него даже появилась возможность познакомиться с некоторыми из них. ', date: '05.12.2024', time: '15:00', show:'false'}],
        comments: [
            {id: 1, comms: [{text: 'wow', who:"Петр", date:"06.12.2024", time: '13:15'}]},
            {id: 2, comms: [{text: 'Вот это поворот', who:"Алексей", date:"06.12.2024", time: '16:00'},
                {text: 'Ого', who:"Алексей", date:"06.12.2024", time: '16:00'},
                {text: 'Вот это поворот', who:"Алексей", date:"06.12.2024", time: '16:00'},
                {text: 'Ого', who:"Алексей", date:"06.12.2024", time: '16:00'},
                {text: 'Вот это поворот', who:"Алексей", date:"06.12.2024", time: '16:00'},
                {text: 'Ого', who:"Алексей", date:"06.12.2024", time: '16:00'},
                {text: 'Вот это поворот', who:"Алексей", date:"06.12.2024", time: '16:00'},
                {text: 'Ого', who:"Алексей", date:"06.12.2024", time: '16:00'}
            ]},
            {id: 3, comms: [{text: 'Вот это поворот', who:"Алексей", date:"06.12.2024", time: '18:00'}]},   //комменты- массив объектов- name: название статьи, comms: [{text: ..., who:..., date:...}]
            ],
        likes: [{id: 1, peopeId: [1,10]},
                {id: 2, peopeId: [2, 32]},
                {id: 3, peopeId: [3, 32]}],  //имена пользователей
        showComments: [{id: 1, show: false},
                        {id: 2, show: false},
                        {id: 3, show: false}]
      };
    },
    getters: {
      getCurrentUser(){//получить id авторизованного пользователя
        return 3;
      },
      
      
    },
    actions: {
      show(id){
        this.showComments.find(x=>x.id === id).show = true;
      },
      getShow(id){
        console.log(id);
        console.log(this.showComments.find(x=>x.id === id).show);
        return this.showComments.find(x=>x.id === id).show;
      },
      retComments(id){
        console.log('Коммы: ');
        console.log(this.comments.filter(i=>i.id === id).map((e) => { return e.comms}));
        return this.comments.filter(i=>i.id === id).map((e) => { return e.comms});
      },

      countLikes(id){
        return this.likes.find(x=>x.id === id).peopeId.length;
      },
      isLiked(id){//проверка лайка у конкретного поста
        return this.likes.find(y=>y.id === id).peopeId.indexOf(this.getCurrentUser);
      },

      addComment(id, text, user){
        //нужно взять из переменной user
        this.comments.find(x=>x.id === id).comms.push({text: text, who: user, date: 'now', time: 'now'});
      }
    },
  });
  