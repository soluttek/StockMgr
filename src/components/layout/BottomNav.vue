<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ref, onMounted, onUnmounted } from 'vue'

const auth = useAuthStore()
const isOnline = ref(navigator.onLine)

function updateOnlineStatus() {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<template>
  <!-- Indicador de Red Independiente -->
  <div 
    class="network-status" 
    :class="isOnline ? 'status-online' : 'status-offline'"
  >
    <span class="status-dot"></span>
    {{ isOnline ? 'En Línea' : 'Desconectado (Guardando en local)' }}
  </div>

  <nav class="bottom-nav">
    <router-link to="/" class="bottom-nav__item">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <title>Inicio</title>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span>Inicio</span>
    </router-link>

    <router-link to="/inventario" class="bottom-nav__item">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <title>Stock</title>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
      <span>Stock</span>
    </router-link>

    <!-- Espacio central para el FAB del Escáner -->
    <div class="bottom-nav__spacer"></div>

    <router-link to="/marcas" class="bottom-nav__item">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <title>Marcas</title>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
      <span>Marcas</span>
    </router-link>

    <router-link to="/perfil" class="bottom-nav__item">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <title>Perfil</title>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span>Perfil</span>
    </router-link>
  </nav>

  <!-- FAB Flotante del Escáner -->
  <router-link to="/escaner" class="fab-scan" v-if="auth.user">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5">
      <title>Escanear</title>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  </router-link>
</template>

<style scoped>
.network-status {
  position: fixed;
  bottom: calc(var(--nav-height) + var(--safe-bottom) - 1px);
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  z-index: 89; /* Justo debajo del nav (90) pero encima del contenido */
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.status-online {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-top: 1px solid rgba(16, 185, 129, 0.2);
  backdrop-filter: blur(8px);
}

.status-online .status-dot {
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.status-offline {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-top: 1px solid rgba(239, 68, 68, 0.3);
  backdrop-filter: blur(8px);
}

.status-offline .status-dot {
  background-color: #ef4444;
  box-shadow: 0 0 6px #ef4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.router-link-active {
  color: var(--accent) !important;
}
</style>

