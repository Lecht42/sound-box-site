import { ViteSSG } from 'vite-ssg'
import 'vue-awesome-paginate/dist/style.css'
import 'vue-final-modal/style.css'
import './style.css'
import App from './App.vue'
import { routes, setupMeta } from './router'

export const createApp = ViteSSG(
  App,
  { routes },
  ({  router, isClient }) => {
    if (isClient) {
      setupMeta(router)
    }
  },
)
