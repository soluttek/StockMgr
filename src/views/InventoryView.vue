<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ProductItem from "@/components/ui/ProductItem.vue";
import { useCatalogStore } from "@/stores/useCatalogStore";
import { useStockStore } from "@/stores/useStockStore";

const catalog = useCatalogStore();
const stock = useStockStore();

const searchQuery = ref("");
const selectedBrandId = ref<string | null>(null);

// Datos enriquecidos (Unimos producto con su stock y nombre de marca)
const enrichedProducts = computed(() => {
	return catalog.products.map((p) => {
		const stockInfo = stock.inventory.find((i) => i.product_id === p.id);
		return {
			...p,
			current_stock: stockInfo?.quantity ?? 0,
			reorder_point: stockInfo?.reorder_point ?? 5,
		};
	});
});

const filteredProducts = computed(() => {
	return enrichedProducts.value.filter((p) => {
		const matchesSearch =
			p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			p.sku.toLowerCase().includes(searchQuery.value.toLowerCase());
		const matchesBrand =
			!selectedBrandId.value || p.brand_id === selectedBrandId.value;
		return matchesSearch && matchesBrand;
	});
});

onMounted(async () => {
	await Promise.all([catalog.fetchCatalog(), stock.fetchInventory()]);
});
</script>

<template>
  <div class="inventory page-container">
    <header class="page-header sticky">
      <h2 class="text-gradient">Inventario</h2>
      <div class="search-bar">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Buscar SKU, nombre...">
      </div>
      
      <div class="filter-chips">
        <button 
          class="chip" 
          :class="{ active: !selectedBrandId }" 
          @click="selectedBrandId = null"
        >
          Todos
        </button>
        <button 
          v-for="brand in catalog.brands" 
          :key="brand.id" 
          class="chip"
          :class="{ active: selectedBrandId === brand.id }"
          @click="selectedBrandId = brand.id"
        >
          {{ brand.name }}
        </button>
      </div>
    </header>

    <div v-if="catalog.isLoading" class="loading-state">
      <div class="spinner"></div>
      <span>Sincronizando almacén...</span>
      <p class="sync-hint">Esto puede tardar unos segundos la primera vez.</p>
    </div>

    <div v-else-if="catalog.error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>Error de conexión</p>
      <small>{{ catalog.error }}</small>
      <button @click="catalog.fetchCatalog(true)" class="btn-retry">Reintentar</button>
    </div>

    <div v-else class="product-list">
      <ProductItem 
        v-for="product in filteredProducts" 
        :key="product.id"
        :product="product"
        :brand-name="catalog.brands.find(b => b.id === product.brand_id)?.name"
      />
      
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <p>No se encontraron productos</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header.sticky {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  z-index: 10;
  padding-bottom: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 0.25rem 0.75rem;
  margin: 1rem 0;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.75rem 0;
  color: white;
  outline: none;
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.filter-chips::-webkit-scrollbar { display: none; }

.chip {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.chip.active {
  background: var(--accent);
  color: var(--bg-primary);
  border-color: var(--accent);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

.sync-hint {
  font-size: 0.7rem;
  opacity: 0.5;
  margin-top: -0.5rem;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  color: #ef4444;
}

.error-icon { font-size: 2.5rem; }
.error-state small { color: var(--text-secondary); margin-bottom: 1rem; }

.btn-retry {
  background: var(--bg-secondary);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
</style>
