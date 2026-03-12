<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCatalogStore } from '@/stores/useCatalogStore'
import { useStockStore } from '@/stores/useStockStore'
import { useAuthStore } from '@/stores/useAuthStore'
import KpiCard from '@/components/ui/KpiCard.vue'

const catalog = useCatalogStore()
const stock = useStockStore()
const auth = useAuthStore()

onMounted(async () => {
  await Promise.all([
    catalog.fetchCatalog(),
    stock.fetchInventory()
  ])
})

const lowStockCount = computed(() => {
  return stock.inventory.filter(item => item.quantity <= (item.reorder_point || 5)).length
})

const totalStockValue = computed(() => {
  // Placeholder: en una fase futura calcularemos el valor monetario si hay precios
  return stock.inventory.reduce((acc, item) => acc + item.quantity, 0)
})
</script>

<template>
  <div class="dashboard page-container">
    <header class="page-header">
      <div class="welcome-section">
        <h2 class="text-gradient">Panel de Control</h2>
        <p class="text-secondary">Estado actual de la logística</p>
      </div>
      <div class="user-badge" v-if="auth.user">
        <div class="user-avatar">{{ auth.user.email?.[0].toUpperCase() }}</div>
        <div class="user-info">
          <span class="user-name">{{ auth.user.email?.split('@')[0] }}</span>
          <span class="user-role-tag">{{ auth.role }}</span>
        </div>
      </div>
    </header>

    <div class="metrics-grid">
      <KpiCard 
        title="Total Productos" 
        :value="catalog.products.length" 
        color="#3498db"
        icon='<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>'
      />
      <KpiCard 
        title="Stock Bajo" 
        :value="lowStockCount" 
        color="#e67e22"
        :trend="{ value: 12, positive: false }"
        icon='<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
      />
      <KpiCard 
        title="Items en Almacén" 
        :value="totalStockValue" 
        color="#2ecc71"
        icon='<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>'
      />
      <KpiCard 
        title="Marcas" 
        :value="catalog.brands.length" 
        color="#9b59b6"
        icon='<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>'
      />
    </div>

    <section class="quick-access">
      <h3 class="section-title">Acceso Rápido</h3>
      <div class="actions-container">
        <router-link to="/escaner" class="action-card">
          <div class="action-icon scanner">📸</div>
          <div class="action-text">
            <h4>Escanear Código</h4>
            <p>Entrada/Salida rápida</p>
          </div>
        </router-link>
        
        <router-link to="/inventario" class="action-card">
          <div class="action-icon inventory">📦</div>
          <div class="action-text">
            <h4>Ver Inventario</h4>
            <p>Consulta y filtros</p>
          </div>
        </router-link>

        <router-link to="/movimientos" class="action-card">
          <div class="action-icon movements">🔄</div>
          <div class="action-text">
            <h4>Historial</h4>
            <p>Últimos movimientos</p>
          </div>
        </router-link>
      </div>
    </section>

    <section class="recent-alerts" v-if="lowStockCount > 0">
      <h3 class="section-title alerts">Alertas Críticas</h3>
      <div class="alert-list">
        <div v-for="item in stock.inventory.filter(i => i.quantity <= (i.reorder_point || 5)).slice(0, 3)" :key="item.product_id" class="alert-item">
          <span class="alert-status">Crítico</span>
          <div class="alert-details">
            <strong>{{ catalog.products.find(p => p.id === item.product_id)?.name || 'Producto desconocido' }}</strong>
            <span>Quedan solo {{ item.quantity }} unidades</span>
          </div>
          <router-link :to="`/inventario?search=${item.product_id}`" class="btn-fix">Reponer</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-secondary);
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.05);
}

.user-avatar {
  width: 35px;
  height: 35px;
  background: var(--accent);
  color: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.user-role-tag {
  font-size: 0.65rem;
  color: var(--accent);
  text-transform: uppercase;
  font-weight: 800;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: var(--bg-secondary);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: white;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s ease;
}

.action-card:active {
  transform: scale(0.98);
  background: rgba(255,255,255,0.03);
}

.action-icon {
  width: 50px;
  height: 50px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 1px solid rgba(255,255,255,0.05);
}

.action-text h4 {
  margin: 0;
  font-size: 1rem;
}

.action-text p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-item {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.alert-status {
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.alert-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alert-details strong {
  font-size: 0.9rem;
}

.alert-details span {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.btn-fix {
  background: white;
  color: black;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
}

@media (min-width: 600px) {
  .actions-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
