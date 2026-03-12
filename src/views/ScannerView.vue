<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useCatalogStore } from '@/stores/useCatalogStore'
import { useStockStore } from '@/stores/useStockStore'
import ProductItem from '@/components/ui/ProductItem.vue'
import type { Product } from '@/types'

const catalog = useCatalogStore()
const stock = useStockStore()

const scanner = ref<Html5QrcodeScanner | null>(null)
const scannedResult = ref<string | null>(null)
const detectedProduct = ref<Product | null>(null)
const isProcessing = ref(false)

const onScanSuccess = async (decodedText: string) => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  scannedResult.value = decodedText
  
  // Buscar producto por SKU o GTIN/EAN
  const product = catalog.products.find(p => p.sku === decodedText || p.gtin_ean === decodedText)
  
  if (product) {
    detectedProduct.value = product
    // Vibración suave si el dispositivo lo soporta
    if (window.navigator.vibrate) window.navigator.vibrate(100)
  } else {
    detectedProduct.value = null
  }
  
  isProcessing.value = false
}

const onScanError = (err: any) => {
  // Errores de escaneo comunes (ignoramos para no saturar)
  // console.warn(`Scan error: ${err}`)
}

const resetScanner = () => {
  scannedResult.value = null
  detectedProduct.value = null
}

onMounted(() => {
  scanner.value = new Html5QrcodeScanner(
    "reader",
    { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    },
    /* verbose= */ false
  )
  scanner.value.render(onScanSuccess, onScanError)
})

onUnmounted(() => {
  if (scanner.value) {
    scanner.value.clear().catch(error => {
       console.error("Failed to clear html5QrcodeScanner. ", error);
    });
  }
})
</script>

<template>
  <div class="scanner page-container">
    <header class="page-header">
      <h2 class="text-gradient">Escáner</h2>
      <p class="text-secondary">Apunta al código SKU o EAN</p>
    </header>

    <div class="scanner-container">
      <div id="reader" :class="{ 'has-result': scannedResult }"></div>
      
      <div v-if="scannedResult" class="scan-overlay-result">
        <div class="result-header">
          <span class="sku-preview">{{ scannedResult }}</span>
          <button @click="resetScanner" class="btn-close">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div v-if="detectedProduct" class="detected-box">
          <p class="match-text">¡Producto Encontrado!</p>
          <ProductItem 
            :product="{
              ...detectedProduct,
              current_stock: stock.inventory.find(i => i.product_id === detectedProduct!.id)?.quantity ?? 0,
              reorder_point: stock.inventory.find(i => i.product_id === detectedProduct!.id)?.reorder_point ?? 5
            }"
            :brand-name="catalog.brands.find(b => b.id === detectedProduct!.brand_id)?.name"
          />
          
          <div class="quick-stock-actions">
            <button class="btn btn-entrada">+ Entrada</button>
            <button class="btn btn-salida">- Salida</button>
          </div>
        </div>

        <div v-else class="not-found-box">
          <div class="not-found-icon">❓</div>
          <p>Producto no registrado</p>
          <router-link to="/agregar" class="link-add">Registrar nuevo producto</router-link>
        </div>
      </div>
    </div>
    
    <div class="scanner-tips">
      <div class="tip">
        <span>💡</span>
        <p>Asegúrate de tener buena iluminación para mayor rapidez.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scanner-container {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: black;
  min-height: 350px;
}

#reader {
  width: 100% !important;
  border: none !important;
}

#reader :deep(img) {
  display: none; /* Hide html5-qrcode's ugly icon */
}

#reader.has-result :deep(video) {
  filter: blur(10px) brightness(0.5);
}

.scan-overlay-result {
  position: absolute;
  inset: 0;
  z-index: 10;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.sku-preview {
  font-family: var(--font-mono);
  background: var(--accent);
  color: var(--bg-primary);
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.9rem;
}

.btn-close {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.match-text {
  color: var(--stock-ok);
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.quick-stock-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-entrada { background: var(--entrada-bg); color: var(--entrada); border: 1px solid var(--entrada); }
.btn-salida { background: var(--salida-bg); color: var(--salida); border: 1px solid var(--salida); }

.not-found-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.not-found-icon { font-size: 3rem; margin-bottom: 1rem; }
.not-found-box p { font-weight: 600; margin-bottom: 0.5rem; }
.link-add { color: var(--accent); font-size: 0.85rem; font-weight: 700; text-decoration: none; }

.scanner-tips {
  margin-top: 2rem;
}

.tip {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--text-secondary);
}
</style>
