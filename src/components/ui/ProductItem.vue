<script setup lang="ts">
import type { EnrichedProduct } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  product: EnrichedProduct
  brandName?: string
}>()

const stockStatus = computed(() => {
  const stock = props.product.current_stock ?? 0
  const limit = props.product.reorder_point ?? 5
  if (stock <= 0) return 'critical'
  if (stock <= limit) return 'low'
  return 'ok'
})
</script>

<template>
  <router-link :to="`/producto/${product.id}`" class="product-item">
    <div class="product-item__info">
      <div class="product-item__name">{{ product.name }}</div>
      <div class="product-item__meta">
        <span class="product-item__sku">{{ product.sku }}</span>
        <span v-if="brandName" class="separator">•</span>
        <span v-if="brandName" class="product-item__brand">{{ brandName }}</span>
      </div>
      <div class="product-item__category">{{ product.quality_grade }}</div>
    </div>
    
    <div class="stock-badge" :class="`stock-badge--${stockStatus}`">
      {{ product.current_stock ?? 0 }}
    </div>
  </router-link>
</template>

<style scoped>
.product-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all var(--duration) var(--ease-out);
  text-decoration: none;
  color: inherit;
}

.product-item:active {
  background: var(--bg-elevated);
  transform: scale(0.99);
}

.product-item__info {
  flex: 1;
  min-width: 0;
}

.product-item__name {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.product-item__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2px;
}

.product-item__sku {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--accent);
  letter-spacing: 0.05em;
}

.separator {
  color: var(--text-muted);
  font-size: 0.6rem;
}

.product-item__brand {
  font-size: var(--fs-xs);
  color: var(--text-secondary);
}

.product-item__category {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.stock-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--fs-lg);
}

.stock-badge--ok {
  background: var(--stock-ok-bg);
  color: var(--stock-ok);
}

.stock-badge--low {
  background: var(--stock-low-bg);
  color: var(--stock-low);
}

.stock-badge--critical {
  background: var(--stock-critical-bg);
  color: var(--stock-critical);
  animation: pulse-red 2s ease infinite;
}

@keyframes pulse-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
