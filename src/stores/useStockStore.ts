import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { localDb } from '@/lib/localdb'
import type { Inventory, StockMovementInsert } from '@/types'

export const useStockStore = defineStore('stock', () => {
  const inventory = ref<Inventory[]>([])
  const isSyncing = ref(false)
  
  async function fetchInventory(force = false) {
    if (!force && inventory.value.length > 0) return

    console.log('📦 Obteniendo inventario...')
    
    // 1. Intentar desde Supabase (Red)
    if (navigator.onLine) {
      try {
        const { data, error } = await supabase.from('inventory').select('*')
        if (error) throw error
        
        if (data) {
          const typedData = data as Inventory[]
          inventory.value = typedData
          console.log('✅ Inventario online obtenido:', inventory.value.length, 'ítems')
          
          // Guardar en caché local (IndexedDB)
          await localDb.inventory.clear() // Limpiamos caché vieja
          const localItems = typedData.map(item => ({
            id: item.product_id, // Asumimos product_id como PK simplificada para caché local (podría ser compuesto si hay varios almacenes por producto)
            warehouse_id: item.warehouse_id,
            quantity: item.quantity,
            last_updated: new Date().toISOString()
          }))
          await localDb.inventory.bulkAdd(localItems)
          return
        }
      } catch (err) {
        console.warn('⚠️ Error de red/Supabase, cayendo a caché local...', err)
      }
    }

    // 2. Fallback a caché local (Offline)
    console.log('📡 Modo Offline: Cargando desde IndexedDB')
    const cachedData = await localDb.inventory.toArray()
    if (cachedData.length > 0) {
      // Mapeo simple de LocalInventory a Inventory type esperado por la UI
      inventory.value = cachedData.map(c => ({
        product_id: c.id,
        warehouse_id: c.warehouse_id,
        quantity: c.quantity,
      })) as Inventory[]
      console.log('✅ Inventario local (offline) cargado:', inventory.value.length, 'ítems')
    }
  }

  async function syncOutbox() {
    if (!navigator.onLine) return

    const pendingMovements = await localDb.outbox.where('status').equals('PENDING').toArray()
    if (pendingMovements.length === 0) return

    console.log(`🔄 Sincronizando ${pendingMovements.length} movimientos pendientes...`)
    isSyncing.value = true

    for (const mov of pendingMovements) {
      try {
        // Enviar a Supabase mediante el RPC de resolución de conflictos
        const { data, error } = await supabase.rpc('process_offline_movement', {
          p_product_id: mov.product_id,
          p_warehouse_id: mov.warehouse_id,
          p_quantity_change: mov.quantity_change,
          p_reason: mov.reason || '',
          p_client_mutation_id: mov.client_mutation_id,
          p_user_id: mov.user_id
        })
        
        if (error) throw error
        
        const result = data as { status: string } | null
        if (result && result.status === 'ALREADY_PROCESSED') {
          console.warn('⚠️ Movimiento ya había sido procesado previamente:', mov.client_mutation_id)
        }

        // Marcar como SYNCED en local
        await localDb.outbox.update(mov.id!, { status: 'SYNCED' })
      } catch (err: any) {
        console.error('❌ Error sincronizando movimiento:', err)
        await localDb.outbox.update(mov.id!, { 
          status: 'ERROR', 
          error_message: err.message || 'Error de sincronización' 
        })
      }
    }

    isSyncing.value = false
    await fetchInventory(true) // Refrescar inventario post-sync
  }

  async function registerMovement(movement: StockMovementInsert) {
    // Generar un ID único para la mutación offline
    const mutationId = movement.client_mutation_id || `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 1. Guardar en la cola local (Outbox) SIEMPRE primero
    const localId = await localDb.outbox.add({
      product_id: movement.product_id,
      warehouse_id: movement.warehouse_id,
      quantity_change: movement.quantity_change,
      reason: movement.reason || undefined,
      client_mutation_id: mutationId,
      user_id: movement.user_id,
      created_at: new Date().toISOString(),
      status: 'PENDING'
    })

    console.log('💾 Movimiento guardado en Outbox local (ID:', localId, ')')

    // 2. Actualizar la UI inmediatamente (Optimistic UI)
    const invItem = inventory.value.find(i => i.product_id === movement.product_id && i.warehouse_id === movement.warehouse_id)
    if (invItem) {
      invItem.quantity += movement.quantity_change
      // Persistir el optimismo en local
      await localDb.inventory.update([invItem.product_id, invItem.warehouse_id], { quantity: invItem.quantity })
    }

    // 3. Intentar sincronizar en background
    if (navigator.onLine) {
      syncOutbox() // Lo lanzamos sin await
    } else {
      console.log('📶 Sin conexión: El movimiento se sincronizará cuando regrese la red.')
    }
    
    return true
  }


  // Listener para sincronizar automáticamente cuando vuelve la red
  window.addEventListener('online', () => {
    console.log('🌐 Conexión recuperada. Intentando sincronizar...')
    syncOutbox()
  })

  return {
    inventory,
    isSyncing,
    fetchInventory,
    registerMovement,
    syncOutbox
  }
})

