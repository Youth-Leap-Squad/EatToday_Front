import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import '@/common/main.css'
import router from './router'      

createApp(App)
  .use(router)                  
  .mount('#app')
