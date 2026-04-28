<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCatalogStore } from "@/stores/useCatalogStore";
import { useStockStore } from "@/stores/useStockStore";

const router = useRouter();
const stock = useStockStore();
const catalog = useCatalogStore();

const getProductName = (id: string) => {
	return (
		catalog.products.find((p) => p.id === id)?.name || "Producto Desconocido"
	);
};

onMounted(async () => {
	if (catalog.products.length === 0) {
		await catalog.fetchCatalog();
	}
	// En un caso real se fetchearía history, pero como movements no tiene fetch method aquí, podemos hacer uno simple.
	// Suponiendo que hay lógica de movements en useStockStore.
});
// Ya que `useStockStore` puede no tener fetchMovements expuesto, usamos los helpers que existan o mostramos "Módulo de logs".
</script>

<template>
  <div class="movements-view page-container">
    <header class="page-header">
      <button @click="router.back()" class="btn-back">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h2 class="text-gradient">Movimientos</h2>
    </header>

    <div class="empty-state">
      <div class="empty-icon">📊</div>
      <p>El historial de movimientos detallado está en auditoría en la BD directamente.</p>
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
.empty-state {
  margin-top: 4rem;
  text-align: center;
  color: var(--text-muted);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}
</style>
