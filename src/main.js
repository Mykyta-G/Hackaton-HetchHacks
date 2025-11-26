import { createApp } from 'vue'
import App from './App.vue'
import { IonicVue } from '@ionic/vue'
import './styles/main.css'

const app = createApp(App)
app.use(IonicVue)
app.mount('#app')
