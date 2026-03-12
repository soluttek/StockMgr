import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Inventory, StockMovementInsert } from '@/types'

export const useStockStore = defineStore('stock', () => {
  const inventory = ref<Inventory[]>([])
  const isSyncing = ref(false)
  
  // En el futuro, aquí manejaremos la 'Cola de transacciones offline (outbox)' para sincronizar a supabase con Background Sync API

  async function fetchInventory() {
    const { data, error } = await supabase.from('inventory').select('*')
    if (!error && data) {
      inventory.value = data as Inventory[]
    }
  }

  async function registerMovement(movement: StockMovementInsert) {
    isSyncing.value = true
    try {
      // 1. Insert Movement Track
      const { error: moveError } = await supabase
        .from('stock_movements')
        .insert(movement as any)
        
      if (moveError) throw moveError

      // 2. Aquí dependerá si aplicamos logic DB trigger o si re-fetcheamos inventario
      await fetchInventory()
      
      return true
    } catch (err) {
      console.error('Error in stock movement:', err)
      throw err
    } finally {
      isSyncing.value = false
    }
  }

  return {
    inventory,
    isSyncing,
    fetchInventory,
    registerMovement
  }
})
