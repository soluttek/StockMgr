<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const id = route.params.id
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h2 class="text-gradient">Detalle de Producto</h2>
      <p class="text-secondary">Información extendida y compatibilidad</p>
    </header>
    <div class="empty-state">
      <div class="empty-icon">🔧</div>
      <p>Vista del producto <strong>{{ id }}</strong> en desarrollo</p>
    </div>
  </div>
</template>
