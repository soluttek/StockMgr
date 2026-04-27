# Registro de Cambios - 26 de Abril de 2026
## Fase 5: PWA Offline & Sincronización Robusta

Hoy hemos completado los cimientos de la arquitectura **Offline-First** para StockMgr, asegurando que la aplicación sea operativa en entornos sin conectividad (como sótanos o almacenes blindados) y que los datos se sincronicen de forma inteligente al recuperar la red.

### 🚀 Logros Principales

#### 1. Configuración PWA & Service Worker
*   Activación del registro del Service Worker en `main.ts`.
*   Cacheo automático de activos estáticos (HTML, JS, CSS) para carga instantánea sin red.

#### 2. Persistencia Local (IndexedDB)
*   Implementación de `src/lib/localdb.ts` utilizando **Dexie.js**.
*   Diseño de esquema con **Claves Primarias Compuestas** `[id + warehouse_id]` para evitar colisiones de inventario entre diferentes almacenes.
*   Creación de la tabla `outbox` para encolar movimientos realizados sin conexión.

#### 3. Lógica de Sincronización (Outbox Pattern)
*   Refactorización de `useStockStore.ts` para integrar la caché local.
*   **Lectura Híbrida:** Prioriza Supabase pero cae automáticamente a IndexedDB si la red falla.
*   **Escritura Optimista:** Los movimientos se guardan instantáneamente en local y actualizan la UI antes de intentar la subida al servidor.

#### 4. Resolución de Conflictos (Opción A: Additive Merge)
*   Creación de la función RPC en Postgres `process_offline_movement`.
*   Implementación de **Idempotencia** mediante `client_mutation_id` para evitar duplicados en reintentos de red.
*   Lógica de **Suma Algebraica:** Los cambios se suman/restan al stock actual del servidor independientemente del orden de llegada.
*   Detección automática de **Stock Negativo** con registro en la tabla `sync_conflicts` para auditoría administrativa.

#### 5. Interfaz de Usuario (UX de Red)
*   Nuevo indicador visual en el `BottomNav`:
    *   🟢 **En Línea:** Confirmación de conexión activa.
    *   🔴 **Desconectado:** Aviso parpadeante de "Guardando en local".
*   Corrección de placeholder en Login y reseteo de credenciales admin para pruebas.

### 🩹 Hotfixes & Ajustes de Estabilidad
*   **Corrección de Build (Vercel):** Implementación de *type casting* en `useStockStore.ts` para el llamado al RPC. Esto resuelve el error de compilación en producción causado por el desfase entre los tipos generados de Supabase y las funciones creadas manualmente en SQL.
*   **Limpieza de Git:** Eliminación del archivo `node_modules/.vite/deps/_metadata.json` del historial de rastreo de Git y refuerzo de su ignorancia para evitar ruidos en el control de código fuente.
*   **Estabilidad de Layout:** Reversión de la estructura del contenedor en `BottomNav.vue` para restaurar el centrado perfecto de la barra de navegación original, manteniendo el indicador de red como un elemento flotante independiente.

### 🛠️ Detalles Técnicos
*   **Rama:** `feat/pwa-offline-sync`
*   **Tecnologías:** Dexie.js, Supabase RPC, Vite PWA Plugin.
*   **Estado:** Fase 5 Core completada y verificada.

---
*Documentación generada por Antigravity - Advanced Agentic Coding.*
