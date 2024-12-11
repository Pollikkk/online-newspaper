import { defineStore } from "pinia";
export const useUserStore = defineStore("users", {
    state: () => {
      return {
        usersList: [{name: '', lastname: '', email: '', password: ''},{name: '', lastname: '', email: '', password: ''}],

      };
    },
    getters: {
      
    },
    actions: {
        
    },
  });
  