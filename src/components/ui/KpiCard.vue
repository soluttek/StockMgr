<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon?: string
  trend?: {
    value: number
    positive: boolean
  }
  color?: string
}>()
</script>

<template>
  <div class="kpi-card" :style="color ? `--accent-local: ${color}` : ''">
    <div class="kpi-card__header">
      <span class="kpi-card__title">{{ title }}</span>
      <div v-if="icon" class="kpi-card__icon" v-html="icon"></div>
    </div>
    
    <div class="kpi-card__body">
      <span class="kpi-card__value">{{ value }}</span>
      <div v-if="trend" class="kpi-card__trend" :class="{ 'positive': trend.positive, 'negative': !trend.positive }">
        {{ trend.positive ? '↑' : '↓' }} {{ trend.value }}%
      </div>
    </div>
    
    <div class="kpi-card__progress">
      <div class="kpi-card__bar"></div>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  --accent-local: var(--accent);
  background: var(--bg-secondary);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-local);
}

.kpi-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.kpi-card__title {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.kpi-card__icon {
  color: var(--accent-local);
  opacity: 0.8;
}

.kpi-card__body {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.kpi-card__value {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
}

.kpi-card__trend {
  font-size: 0.75rem;
  font-weight: 600;
}

.kpi-card__trend.positive { color: #10b981; }
.kpi-card__trend.negative { color: #ef4444; }

.kpi-card__progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.kpi-card__bar {
  height: 100%;
  width: 60%; /* Placeholder logic */
  background: var(--accent-local);
  border-radius: 2px;
  opacity: 0.6;
}
</style>
