<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCatalogStore } from "@/stores/useCatalogStore";

const router = useRouter();
const catalog = useCatalogStore();

onMounted(async () => {
	if (catalog.brands.length === 0) {
		await catalog.fetchCatalog();
	}
});
</script>

<template>
  <div class="brands-view page-container">
    <header class="page-header">
      <button @click="router.back()" class="btn-back">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h2 class="text-gradient">Marcas</h2>
      <p class="text-secondary">Catálogo oficial</p>
    </header>

    <div v-if="catalog.isLoading" class="loading-state">Cargando...</div>
    <div v-else class="brands-grid">
      <div v-for="brand in catalog.brands" :key="brand.id" class="brand-card">
        <div class="brand-icon">{{ brand.name.charAt(0) }}</div>
        <div class="brand-name">{{ brand.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.brand-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-xl);
  font-weight: 700;
  color: var(--accent);
}

.brand-name {
  font-weight: 600;
  font-size: var(--fs-sm);
  color: var(--text-primary);
}

.loading-state {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-muted);
}
</style>
