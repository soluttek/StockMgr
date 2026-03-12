# 🗄️ Fuente de Verdad: Esquema de Base de Datos Real (V2)

Este documento es el **único "Mapa de Verdad"** de StockMgr. Refleja lo que está implementado físicamente en Supabase en este momento y los campos extendidos que usaremos para la migración a TypeScript.

---

## 1. Módulo Core: Catálogo y Stock
Este es el corazón de la PWA. Los datos están normalizados en 3NF.

### `public.products` (Maestro de Artículos)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Generado por `uuid_generate_v4()` |
| `sku` | TEXT (Unique) | Formato: `CAT-BRA-MOD-QUAL-ID` |
| `mpn` | TEXT | Manufacturer Part Number (opcional) |
| `gtin_ean` | TEXT | Código de barras estándar (opcional) |
| `name` | TEXT | Nombre descriptivo |
| `category_id` | UUID (FK) | Relación con `categories` |
| `brand_id` | UUID (FK) | Relación con `brands` |
| `supplier_id` | UUID (FK) | Relación con `suppliers` (Novedad V2) |
| `quality_grade` | TEXT (Enum) | OEM, Service Pack, Aftermarket, Ori, Refurbished |
| `base_price` | NUMERIC | Precio base de venta |
| `weight_grams` | NUMERIC | Para logística futura |

### `public.inventory` (Stock por Almacén)
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `product_id` | UUID (PK, FK) | |
| `warehouse_id` | UUID (PK, FK) | |
| `quantity` | INTEGER | Saldo actual |
| `reorder_point` | INTEGER | Punto de pedido (Alerta bajo stock) |
| `safety_stock` | INTEGER | Stock de seguridad |
| `version_id` | INTEGER | **Bloqueo Optimista** para Sync Offline |
| `updated_at` | TIMESTAMPTZ | |

---

## 2. Módulo de Identidad y Roles (Identity)
Blindado con políticas RLS (Row Level Security).

### `public.user_roles`
Extiende `auth.users` para manejar permisos granulares.
- **Roles:** `ADMIN`, `WAREHOUSE_OPERATOR`.

### `public.stock_movements` (Auditoría e Historial)
- Registra cada entrada/salida vinculada a un `user_id` y un `client_mutation_id` (para evitar duplicados en sync offline).

---

## 3. Módulo CRM y Fidelización (Futuro Cercano)
Tablas ya preparadas pero en espera de activación de lógica UI.
- `public.customers` (Relación 1:1 con `auth.users`)
- `public.loyalty_tiers` (Bronce, Plata, Oro)
- `public.orders` y `public.order_items`

---

## 4. Evolución: Del Análisis a la Realidad
Comparativa con el documento anterior (`Database Schema.md`):

| Diferencia | Estado | Razón Técnica |
| :--- | :--- | :--- |
| **Tabla `suppliers`** | ✅ Implementada | Necesaria para trazabilidad de garantía. |
| **Campos MPN/GTIN** | ✅ Implementados | Compatibilidad con escáneres universales. |
| **Compatibilidad Extendida**| ✅ Implementada | Incluimos `difficulty_level` y `required_tools` en la tabla pivote. |
| **Sync Status** | ✅ Implementada | Tabla `sync_conflicts` lista para reconciliar desvíos offline. |

---

## 5. Próximos Pasos Técnicos
1. **Generación de Tipos TS:** Usar esta estructura real para generar el archivo `src/types/database.ts`.
2. **Políticas RLS:** Mantener el blindaje de las funciones `SET search_path = public` como estándar en cada actualización.

*Documento auditado y validado contra el esquema actual de Supabase (SZMQUK)*
