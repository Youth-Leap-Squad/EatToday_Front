import { createApp } from 'vue'
import App from './App.vue'
import '@/common/main.css'
import router from './router'      

createApp(App)
  .use(router)                  
  .mount('#app')
