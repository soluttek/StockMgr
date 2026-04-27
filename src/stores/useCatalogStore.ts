import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Product, Brand, Category, DeviceModel, Warehouse } from '@/types'

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref<Product[]>([])
  const brands = ref<Brand[]>([])
  const categories = ref<Category[]>([])
  const models = ref<DeviceModel[]>([])
  const warehouses = ref<Warehouse[]>([])
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCatalog(force = false) {
    if (!force && products.value.length > 0) return

    isLoading.value = true
    error.value = null

    try {
      console.log('📡 Sincronizando catálogo...')
      const [productsRes, brandsRes, categoriesRes, modelsRes, warehousesRes] = await Promise.all([
        supabase.from('products').select('*').limit(1000),
        supabase.from('brands').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('device_models').select('*'),
        supabase.from('warehouses').select('*')
      ])

      if (productsRes.error) throw productsRes.error
      if (brandsRes.error) throw brandsRes.error
      if (categoriesRes.error) throw categoriesRes.error
      if (modelsRes.error) throw modelsRes.error
      if (warehousesRes.error) throw warehousesRes.error

      products.value = productsRes.data as Product[]
      brands.value = brandsRes.data as Brand[]
      categories.value = categoriesRes.data as Category[]
      models.value = modelsRes.data as DeviceModel[]
      warehouses.value = warehousesRes.data as Warehouse[]
      console.log('✅ Catálogo sincronizado:', products.value.length, 'productos')
      
    } catch (err: any) {
      console.error('❌ Error sincronizando catálogo:', err)
      error.value = err.message || 'Error loading catalog'
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    brands,
    categories,
    models,
    warehouses,
    isLoading,
    error,
    fetchCatalog
  }
})
