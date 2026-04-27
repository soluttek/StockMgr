<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/useCatalogStore'
import { useStockStore } from '@/stores/useStockStore'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const stock = useStockStore()

const id = route.params.id as string

const product = computed(() => catalog.products.find(p => p.id === id))
const brand = computed(() => catalog.brands.find(b => b.id === product.value?.brand_id))
const category = computed(() => catalog.categories.find(c => c.id === product.value?.category_id))

const productStock = computed(() => stock.inventory.filter(i => i.product_id === id))

</script>

<template>
  <div class="product-detail page-container">
    <header class="page-header">
      <button @click="router.back()" class="btn-back">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h2 class="text-gradient">Detalle de Producto</h2>
    </header>

    <div v-if="product" class="detail-container">
      <div class="product-card">
        <div class="product-header">
          <span class="sku-badge">{{ product.sku }}</span>
          <span class="quality-badge">{{ product.quality_grade }}</span>
        </div>
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-meta">
          <span>{{ brand?.name || 'Marca Desconocida' }}</span>
          <span>•</span>
          <span>{{ category?.name || 'Categoría Desconocida' }}</span>
        </div>
      </div>

      <div class="stock-section mt-4">
        <h3>Stock en Almacenes</h3>
        <div v-if="productStock.length > 0" class="stock-grid">
          <div v-for="item in productStock" :key="item.warehouse_id" class="stock-card">
            <div class="stock-info">
              <span class="warehouse-name">{{ catalog.warehouses.find(w => w.id === item.warehouse_id)?.name || 'Almacén' }}</span>
              <span class="reorder-point">Mínimo: {{ item.reorder_point }}</span>
            </div>
            <div class="stock-quantity" :class="item.quantity <= (item.reorder_point || 0) ? 'text-critical' : 'text-ok'">
              {{ item.quantity }}
            </div>
          </div>
        </div>
        <div v-else class="empty-stock">
          <p>Sin inventario registrado en almacenes.</p>
        </div>
      </div>
      
    </div>
    <div v-else class="empty-state">
      <div class="empty-icon">❓</div>
      <p>Producto <strong>{{ id }}</strong> no encontrado.</p>
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

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sku-badge {
  font-family: var(--font-mono);
  background: var(--accent);
  color: var(--bg-primary);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: var(--fs-xs);
}

.quality-badge {
  font-size: var(--fs-xs);
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-name {
  font-size: var(--fs-xl);
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.product-meta {
  display: flex;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

.mt-4 {
  margin-top: 1rem;
}

h3 {
  font-size: var(--fs-base);
  color: var(--text-secondary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stock-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stock-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-elevated);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stock-info {
  display: flex;
  flex-direction: column;
}

.warehouse-name {
  font-weight: 600;
  font-size: var(--fs-sm);
}

.reorder-point {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.stock-quantity {
  font-family: var(--font-mono);
  font-size: var(--fs-2xl);
  font-weight: 700;
}

.text-critical { color: var(--stock-critical); }
.text-ok { color: var(--stock-ok); }

.empty-stock {
  padding: 1.5rem;
  text-align: center;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: var(--fs-sm);
}
</style>
