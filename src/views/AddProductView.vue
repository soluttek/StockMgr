<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="add-product page-container">
    <header class="page-header">
      <button @click="router.back()" class="btn-back">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h2 class="text-gradient">Nuevo Producto</h2>
    </header>

    <div class="placeholder-card">
      <div class="placeholder-icon">🛠️</div>
      <h3>Módulo en Construcción</h3>
      <p>Estamos migrando la lógica de creación de productos desde el motor legacy.</p>
      <button @click="router.back()" class="btn-primary">Volver</button>
    </div>
  </div>
</template>

<style scoped>
.placeholder-card {
  background: var(--bg-secondary);
  padding: 3rem;
  border-radius: var(--radius-lg);
  text-align: center;
  margin-top: 2rem;
}
.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.btn-back {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
}
.btn-primary {
  margin-top: 2rem;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
</style>
