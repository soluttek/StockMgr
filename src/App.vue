<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import BottomNav from '@/components/layout/BottomNav.vue'

const auth = useAuthStore()
const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(async () => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  // Inicializamos la sesión global
  await auth.initialize()
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<template>
  <div class="app-layout">
    <header class="app-header" v-if="auth.user">
      <div class="header-title">
        <svg class="header-logo" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
          <title>Logo</title>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <h1>Stock<span class="accent">Mgr</span></h1>
      </div>
      <div style="display: flex; align-items: center; gap: var(--sp-3)">
        <div class="header-status">
          <span class="status-dot" :class="{ 'status-dot--online': isOnline }"></span>
          <span class="status-label">{{ isOnline ? 'Online' : 'Offline' }}</span>
        </div>
      </div>
    </header>

    <div v-if="!auth.user && $route.path !== '/login'" class="security-banner">
      <span class="icon">🛡️</span>
      <p>
        <strong>Navegación Protegida:</strong> Los datos se muestran vacíos porque no hay una sesión activa. Supabase (RLS) bloquea los registros por seguridad.<br>
        Si tiene alguna duda o problema, contacte con <router-link to="/soporte" class="support-link">Soporte Técnico</router-link>.
      </p>
    </div>

    <main class="view-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <BottomNav v-if="auth.user" />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.security-banner {
  background: #f59e0b;
  color: #451a03;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  line-height: 1.4;
  border-bottom: 2px solid #d97706;
}

.security-banner .icon {
  font-size: 1.25rem;
}

.security-banner p {
  margin: 0;
}

.support-link {
  color: #451a03;
  text-decoration: underline;
  font-weight: 700;
}

/* Transición básica de páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
