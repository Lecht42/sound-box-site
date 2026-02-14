import { createApp } from 'vue'
import 'vue-awesome-paginate/dist/style.css'
import './style.css'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router).mount('#app')
