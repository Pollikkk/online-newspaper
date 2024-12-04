import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from "./routes"
//import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
//import { loadFonts } from './plugins/webfontloader'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const pinia = createPinia()
//loadFonts()
const vuetify = createVuetify({
    components,
    directives,
  })

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app')
