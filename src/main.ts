import { createApp } from 'vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import './style.css'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
if (googleMapsApiKey) {
  app.use(VueGoogleMaps, {
    load: {
      key: googleMapsApiKey,
      libraries: 'places',
    },
  })
} else {
  console.warn('Google Maps API key is missing. Map on Contacts page will be disabled.')
}

app.use(router).mount('#app')
