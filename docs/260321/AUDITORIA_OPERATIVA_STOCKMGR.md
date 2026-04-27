# 🔍 Auditoría Operativa — StockMgr PWA

**Fecha:** 2026-03-14  
**Escáner:** Código Fuente Completo (38 archivos `src/`, config, SW, Supabase)  
**Auditor:** Antigravity Multi-Agent (Arquitectura + Seguridad + QA)  
**Severidad:** 🔴 Crítico · 🟡 Alto · 🟠 Medio · ⚪ Bajo

---

## Resumen Ejecutivo

| Categoría | Hallazgos | Severidad Máxima |
|---|---|---|
| Código Muerto / Legacy | 14 archivos (~3600 LOC) | 🔴 Crítico |
| Seguridad | 4 hallazgos | 🟡 Alto |
| Arquitectura / Redundancia | 5 hallazgos | 🟡 Alto |
| CSS Bloat | ~800 líneas huérfanas | 🟠 Medio |
| Bugs Funcionales | 3 hallazgos | 🟡 Alto |
| PWA / Service Worker | 2 hallazgos | 🟠 Medio |

**Veredicto:** La migración de Vanilla JS a Vue 3 dejó un rastro significativo de **código muerto** que no solo infla el bundle sino que genera confusión y posibles conflictos de importación. Hay **vulnerabilidades de seguridad** en la gestión de sesiones y la exposición de datos sensibles. La base es sólida pero necesita una **limpieza quirúrgica**.

---

## 🔴 1. Código Muerto y Legacy (CRÍTICO)

Hemos detectado que la migración ha dejado archivos en dos estados. El "peso muerto" real y archivos que, aunque no se usan, contienen la lógica de negocio que debemos portar a Vue.

### 1.1 Listado para Eliminación Inmediata
Archivos cuya funcionalidad ya está 100% migrada a Vue 3/Pinia.

| Archivo | LOC | Motivo |
|---|---|---|
| [brands.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/brands.js) | ~120 | Reemplazado por [BrandsView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/BrandsView.vue) |
| [dashboard.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/dashboard.js) | ~170 | Reemplazado por [Dashboard.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/Dashboard.vue) |
| [inventory-list.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/inventory-list.js) | ~320 | Reemplazado por [InventoryView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/InventoryView.vue) |
| [login.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/login.js) | 141 | Reemplazado por [LoginView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/LoginView.vue) |
| [product-detail.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/product-detail.js) | ~280 | Reemplazado por [ProductDetailView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/ProductDetailView.vue) |
| [auth.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/auth.js) | 67 | Lógica migrada a [useAuthStore.ts](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/stores/useAuthStore.ts) |
| [alerts.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/alerts.js) | 25 | Lógica migrada a [ProductItem.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/components/ui/ProductItem.vue) |
| [scanner.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/scanner.js) | 67 | Lógica migrada a [ScannerView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/ScannerView.vue) |
| [dom.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/utils/dom.js) | 147 | Innecesario en entorno Vue |

### 1.2 "Cápsulas de Lógica" (PENDIENTE VACIAR)
**NO BORRAR TODAVÍA**. Contienen la lógica que falta por implementar en la nueva arquitectura.

| Archivo | Lógica a Rescatar |
|---|---|
| [add-product.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/add-product.js) | Estructura y validación del formulario de alta. |
| [sku-engine.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/sku-engine.js) | **Crítico:** Generador de SKUs (formato real: **19 caracteres** con guiones). |
| [models.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/models.js) | Gestión de catálogo de modelos y compatibilidades. |
| [crypto.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/crypto.js) | Generación de claves seguras para el futuro Panel Admin. |
| [data/db.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/data/db.js) | Configuración de Dexie para el modo **Offline** (Fase 5). |

> [!IMPORTANT]
> **Impacto:** ~3600 líneas de código que inflan el bundle. El tree-shaking no es 100% efectivo por las dependencias cruzadas (ej. Dexie).

### 1.3 Diccionarios de Datos
Existen archivos [src/data/categorias.json](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/data/categorias.json) y [marcas.json](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/data/marcas.json). Debemos verificar si esta información ya reside completamente en Supabase para darlos de baja definitivamente.


---

## 🟡 2. Seguridad (ALTO)

### 2.1 Leaked Password Protection Deshabilitada 🔴
Supabase reporta que la protección contra contraseñas filtradas (HaveIBeenPwned) está **desactivada**.

**Remedio:** [Habilitar en Dashboard de Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

### 2.2 LoginView sin Rate Limiting 🟡
[LoginView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/LoginView.vue) no implementa:
- **Límite de intentos** (un atacante puede hacer brute-force ilimitado).
- **Delay progresivo** tras intentos fallidos.
- **CAPTCHA** o verificación humana.

### 2.3 Service Worker Obsoleto con Rutas Incorrectas 🟡
[sw.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/sw.js) referencia archivos que ya no existen:
```javascript
"/src/main.js",        // Ahora es main.ts compilado por Vite
"/icons/icon-192.png", // Movido a /pwa-192x192.png
"/icons/icon-512.png", // Movido a /pwa-512x512.png
```
Esto provoca que el SW intente cachear archivos inexistentes, fallando silenciosamente y dejando la app sin caché offline real.

### 2.4 Supabase Anon Key Expuesta en [.env](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/.env) sin Validación 🟠
El cliente Supabase en [supabase.ts](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/lib/supabase.ts) hace un `as string` sin verificar que las variables de entorno realmente existan:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
```
Si [.env](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/.env) falta o la variable es `undefined`, el cliente se inicializa con `undefined` y todas las llamadas fallan silenciosamente.

---

## 🟡 3. Arquitectura y Redundancia (ALTO)

### 3.1 Doble Capa de Datos: Dexie vs Supabase 🟡
El proyecto mantiene **dos capas de datos paralelas**:
- **Supabase** (activa): Usada por los stores Pinia (`useCatalogStore`, `useStockStore`).
- **Dexie/IndexedDB** (muerta): Definida en [db.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/data/db.js) con esquema, seeders y lógica de movimientos.

Ambas definen las mismas entidades (productos, marcas, modelos, movimientos) pero con esquemas diferentes. Esto es una bomba de tiempo si alguien importa accidentalmente [db.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/data/db.js).

### 3.2 Doble Sistema de Auth 🟡
- [useAuthStore.ts](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/stores/useAuthStore.ts) (Vue/Pinia) — **activo**
- [modules/auth.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/auth.js) (Vanilla) — **muerto**

Ambos llaman a `supabase.auth` con interfaces diferentes. El archivo legacy importa desde `../lib/supabase.js` (extensión [.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/sw.js), no [.ts](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/main.ts)), lo que puede causar errores de resolución.

### 3.3 Scanner Duplicado 🟠
- [ScannerView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/ScannerView.vue) usa `Html5QrcodeScanner` directamente en el componente.
- [modules/scanner.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/scanner.js) envuelve `Html5Qrcode` (clase diferente: `Html5Qrcode` vs `Html5QrcodeScanner`).

Dos implementaciones incompatibles del mismo escáner.

### 3.4 Botones de Stock sin Funcionalidad 🟡
En [ScannerView.vue L101-102](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/ScannerView.vue#L101-L102), los botones `+ Entrada` y `- Salida` **no tienen `@click` handler**. Son botones decorativos sin acción.

### 3.5 Ruta Rota en Scanner 🟠
En [ScannerView.vue L109](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/ScannerView.vue#L109), el link `"Registrar nuevo producto"` apunta a `/agregar`, pero esa ruta **no está registrada** en el router. Generará un warning de Vue Router.

---

## 🟡 4. Bugs Funcionales (ALTO)

### 4.1 Auth Guard Race Condition 🟡
En [router/index.ts L42-44](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/router/index.ts#L42-L44):
```typescript
if (auth.isInitializing) {
   await auth.initialize()
}
```
Si [App.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/App.vue) ya llamó `auth.initialize()` y aún está en progreso (`isInitializing = true`), este código llama [initialize()](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/stores/useAuthStore.ts#31-56) **una segunda vez**, creando suscripciones duplicadas a [onAuthStateChange](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/modules/auth.js#39-47) y potencialmente una carrera de condiciones.

### 4.2 Sincronización Innecesariamente Repetida 🟠
[Dashboard.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/Dashboard.vue) y [InventoryView.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/InventoryView.vue) ambos llaman `catalog.fetchCatalog()` y `stock.fetchInventory()` en su `onMounted`. Si el usuario navega entre Dashboard e Inventario, los datos se re-descargan cada vez (130 productos × 2 por cada navegación). No hay caché ni verificación de "ya cargado".

### 4.3 Falta de Tipado en ProductItem Props 🟠
[ProductItem.vue](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/components/ui/ProductItem.vue) recibe `product` como prop que es un objeto construido ad-hoc en cada vista (spread + find), en lugar de un tipo definido. Esto dificulta el mantenimiento y puede causar errores silenciosos si la forma del objeto cambia.

---

## 🟠 5. CSS Bloat (MEDIO)

### 5.1 Análisis de [app.css](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/app.css) (1592 líneas)

| Categoría | Líneas Est. | Estado |
|---|---|---|
| Variables, Reset, Typography | ~200 | ✅ Activo |
| Layout (header, nav, view-container) | ~150 | ✅ Activo |
| Cards, Search, Badges | ~200 | ✅ Activo |
| **Estilos Vanilla Legacy** | ~800 | 🔴 Huérfano |

**Selectores huérfanos principales** (usados solo por las vistas [.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/sw.js) que ya no se renderizan):
- `.sku-preview`, `.form-group` (del [add-product.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/add-product.js) legacy)
- `.brand-item`, `.brand-item__code`, `.brand-item__name` (del [brands.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/brands.js))
- `.stock-adjust`, `.qty-control`, `.qty-btn`, `.batch-adjust-card` (del [product-detail.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/product-detail.js))
- `.detail-header`, `.detail-meta`, `.info-row` (del [product-detail.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/views/product-detail.js))
- `.modal-overlay`, `.modal-card`, `.modal-btn` (del `dom.js/showCustomModal`)
- `.toast`, `.toast--visible`, `.toast--success` (del `dom.js/showToast`)
- Utilidades no usadas: `.mt-2`, `.mb-0` a `.mb-6`, `.w-full`, `.hidden`, `.border-top`, `.pt-3`, `.mt-6`

> [!TIP]
> **Recomendación:** Después de eliminar el código legacy, ejecutar un análisis de CSS coverage con Chrome DevTools para identificar selectores no utilizados con precisión.

---

## 🟠 6. PWA / Service Worker (MEDIO)

### 6.1 Doble Configuración PWA
El proyecto tiene **dos configuraciones PWA** en conflicto:
1. [vite.config.ts](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/vite.config.ts) → `vite-plugin-pwa` (genera SW automáticamente con Workbox).
2. [sw.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/sw.js) → Service Worker manual escrito a mano.

Ambos compiten por el registro. El SW manual referencia archivos obsoletos y el de Vite-PWA genera uno automático. Solo uno debe existir.

### 6.2 Manifest Dual
- [public/manifest.json](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/public/manifest.json) → Escrito manualmente.
- `vite.config.ts → VitePWA({ manifest: {...} })` → Genera otro manifiesto.

Vite-PWA genera su propio manifiesto en build, sobrescribiendo el manual. Los iconos en ambos apuntan a rutas diferentes.

---

## 📋 Plan de Acción Priorizado

### Fase A — Limpieza Urgente (1-2h)
1. **Eliminar solo los 9 archivos legacy 100% migrados** (sección 1.1)
2. **Mover los 5 archivos "Cápsulas de Lógica"** (sección 1.2) a una carpeta `src/legacy/` para evitar confusiones.
3. **Eliminar [sw.js](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/sw.js)** (el de vite-plugin-pwa lo reemplaza)
4. **Eliminar [public/manifest.json](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/public/manifest.json)** (vite-plugin-pwa lo genera)
5. **Purgar CSS huérfano** (~800 líneas de [app.css](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/app.css))

### Fase B — Seguridad (30min)
1. Habilitar **Leaked Password Protection** en Supabase Dashboard
2. Añadir validación de env vars en [supabase.ts](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/src/lib/supabase.ts) 
3. Implementar **rate limiting visual** en LoginView (max 5 intentos, cooldown de 30s)

### Fase C — Estabilidad (1h)
1. Corregir **race condition** del Auth Guard (usar un flag `initialized` / Promise compartida)
2. Añadir **caché de datos** en los stores (no re-fetch si ya hay datos)
3. Conectar los botones `+ Entrada` / `- Salida` del Scanner a la lógica de stock
4. Registrar la ruta `/agregar` o actualizar el enlace del Scanner

### Fase D — Optimización (1h)
1. Unificar el sistema de iconos PWA en [vite.config.ts](file:///c:/Users/3lio/Documents/Proyectos%20Web/Ivan/MercadoLibre/Stock/vite.config.ts)
2. Crear un tipo `EnrichedProduct` compartido para las props de `ProductItem`
3. Lazy-load de `html5-qrcode` solo cuando se accede al Scanner

---

> [!CAUTION]
> **Antes de ejecutar cualquier eliminación**, se recomienda crear una rama `cleanup/legacy-removal` y verificar que `npm run build` pase sin errores después de cada eliminación.
