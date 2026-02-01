import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { createYmaps } from 'vue-yandex-maps'

const app = createApp(App)

const yandexMapApiKey = import.meta.env.VITE_YANDEX_MAP_API_KEY
if (yandexMapApiKey) {
  app.use(
    createYmaps({
      apikey: yandexMapApiKey,
      lang: 'ru_RU',
      version: '3.0',
    }),
  )
} else {
  console.warn('Yandex Map API key is missing. Contacts map will be disabled.')
}

app.use(router).mount('#app')
