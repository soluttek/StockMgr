import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import { registerSW } from 'virtual:pwa-register'

// Import global CSS
import './app.css'

// Registrar Service Worker para PWA (Offline capability)
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 Nueva versión disponible, actualizando...')
  },
  onOfflineReady() {
    console.log('📱 StockMgr está listo para usarse sin conexión')
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

