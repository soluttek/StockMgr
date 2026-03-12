<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
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
  <div class="app-layout">
    <header class="app-header">
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

    <main class="view-container">
      <div style="text-align: center; margin-top: 4rem;">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Migración a Vue 3 Iniciada 🚀</h2>
        <p style="color: var(--text-secondary); max-width: 300px; margin: 0 auto; line-height: 1.5;">
          El scaffolding básico con Vite, TypeScript y Pinia está configurado. El sistema de Vanilla JS ha sido removido.
        </p>
      </div>
    </main>

    <!-- Bottom Navigation Mockup para mantener la estructura visual rápida -->
    <nav class="bottom-nav" style="display: flex;">
      <a href="#/" class="bottom-nav__item active">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <title>Inicio</title>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Inicio</span>
      </a>
      <a href="#/inventario" class="bottom-nav__item">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <title>Stock</title>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
        <span>Stock</span>
      </a>
      <div class="bottom-nav__spacer"></div>
      <a href="#/marcas" class="bottom-nav__item">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <title>Marcas</title>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        <span>Marcas</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
