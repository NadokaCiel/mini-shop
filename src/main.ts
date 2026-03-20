import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'

import App from './App.vue'
import { registerRouteGuard } from './router/guard'
import { useAuthStore } from './stores/auth'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const authStore = useAuthStore(pinia)
  authStore.hydrate()
  registerRouteGuard()

  return {
    app,
  }
}
