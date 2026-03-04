# 🗺️ ROADMAP CTO ORQUESTADO: Planificación Escalada de StockMgr

**Proyecto:** StockMgr PWA — Rediseño Corporativo
**Emitido por:** CTO (Antigravity Orchestrator)
**Fecha:** 2026-03-02

---

## Fase 1: Cimientos de Datos (DB en Supabase)
**Duración estimada:** 1-2 sesiones

| # | Tarea | Agentes Involucrados | Dependencia |
|:--|:------|:---------------------|:------------|
| 1.1 | Revisión y aprobación del Informe CTO de Arquitectura DB | 👤 **Usuario** | — |
| 1.2 | Creación del Schema SQL definitivo (16 tablas) en Supabase | `supabase-specialist` + `database-architect` | 1.1 |
| 1.3 | Implementación de RLS + Políticas de seguridad | `security-hardening` + `supabase-specialist` | 1.2 |
| 1.4 | Creación de índices de rendimiento | `supabase-postgres-best-practices` | 1.2 |
| 1.5 | Seed Data (datos de prueba mínimos: 3 marcas, 5 modelos, 10 productos) | `supabase-specialist` | 1.3 |
| 1.6 | Generación de tipos TypeScript desde Supabase | `typescript-expert` + `supabase-specialist` | 1.5 |

---

## Fase 2: Identidad y Auth
**Duración estimada:** 1 sesión

| # | Tarea | Agentes Involucrados | Dependencia |
|:--|:------|:---------------------|:------------|
| 2.1 | Configuración de Supabase Auth (Email + Password) | `supabase-specialist` | Fase 1 |
| 2.2 | Implementación de tabla `user_roles` y RBAC | `security-hardening` + `database-architect` | 2.1 |
| 2.3 | Diseño de pantalla Login/Register en Vue | `frontend-design` + `ui-ux-pro-max` | 2.1 |
| 2.4 | Guard de rutas (Vue Router) para proteger vistas según rol | `vue-patterns` + `security-hardening` | 2.2 |

---

## Fase 3: Estructura Vue 3 + TypeScript
**Duración estimada:** 2-3 sesiones

| # | Tarea | Agentes Involucrados | Dependencia |
|:--|:------|:---------------------|:------------|
| 3.1 | Scaffolding del proyecto Vue 3 (Vite + Pinia + Vue Router) | `senior-developer` + `vue-patterns` | Fase 1 |
| 3.2 | Definición de Interfaces TypeScript (`types/`) desde schema | `typescript-expert` | 1.6 |
| 3.3 | Creación de Pinia Stores: `useAuthStore`, `useStockStore`, `useCatalogStore` | `vue-patterns` + `typescript-expert` | 3.2 |
| 3.4 | Conexión de Stores con Supabase Client (`@supabase/supabase-js`) | `supabase-specialist` + `vue-patterns` | 3.3 |

---

## Fase 4: UI Corporativa (Componentes Vue)
**Duración estimada:** 3-4 sesiones

| # | Tarea | Agentes Involucrados | Dependencia |
|:--|:------|:---------------------|:------------|
| 4.1 | Design System (colores, tipografía, espaciados) | `ui-ux-pro-max` + `frontend-design` | Fase 3 |
| 4.2 | Componentes Base: `BottomNav`, `ProductCard`, `StockBadge`, `Toast` | `vue-patterns` + `frontend-design` | 4.1 |
| 4.3 | Vista: Dashboard (KPIs, alertas de bajo stock, resumen) | `senior-developer` + `ui-ux-pro-max` | 4.2 |
| 4.4 | Vista: Inventario (tabla con filtros, búsqueda, paginación) | `senior-developer` + `vue-patterns` | 4.2 |
| 4.5 | Vista: Detalle de Producto + Compatibilidades M:N | `database-architect` + `vue-patterns` | 4.4 |
| 4.6 | Vista: Escáner QR/Barcode (Integración BarcodeDetector API) | `vite-pwa-expert` + `senior-developer` | 4.2 |
| 4.7 | Vista: Gestión de Catálogo (Marcas, Modelos, Categorías) | `vue-patterns` + `frontend-design` | 4.2 |
| 4.8 | Vista: Admin Panel (Gestión de Usuarios y Roles) | `security-hardening` + `ui-ux-pro-max` | 2.4 |

---

## Fase 5: PWA Offline & Sync
**Duración estimada:** 1-2 sesiones

| # | Tarea | Agentes Involucrados | Dependencia |
|:--|:------|:---------------------|:------------|
| 5.1 | Configuración de Service Worker con `vite-plugin-pwa` | `vite-pwa-expert` | Fase 4 |
| 5.2 | Implementación de IndexedDB como caché local (réplica parcial) | `database-architect` + `senior-developer` | 5.1 |
| 5.3 | Cola de sincronización offline (`outbox_movements`) | `vite-pwa-expert` + `supabase-specialist` | 5.2 |
| 5.4 | Resolución de conflictos (`sync_conflicts`) en panel Admin | `security-hardening` + `vue-patterns` | 5.3 |

---

## Fase 6: Testing & CI/CD
**Duración estimada:** 1 sesión

| # | Tarea | Agentes Involucrados | Dependencia |
|:--|:------|:---------------------|:------------|
| 6.1 | Tests unitarios (Vitest): SKU Engine, Stores, Sync Logic | `testing-patterns` + `typescript-expert` | Fase 4 |
| 6.2 | Tests E2E (Playwright): Flujo completo de escaneo y stock | `testing-playwright` | 6.1 |
| 6.3 | Activación de GitHub Actions (`quality.yml`) | `github-actions` + `cto-orchestrator` | 6.2 |

---

## Fase 7: E-Commerce y CRM (Futuro)
**Duración estimada:** Por definir

| # | Tarea | Agentes Involucrados | Dependencia |
|:--|:------|:---------------------|:------------|
| 7.1 | Activación de tablas `customers`, `orders`, `loyalty_tiers` | `supabase-specialist` | Fase 6 |
| 7.2 | Triggers de fidelización (`calculate_loyalty_points`) | `database-architect` | 7.1 |
| 7.3 | Integración con pasarela de pago (Stripe) | `api-design-principles` + `security-hardening` | 7.2 |
| 7.4 | Página de venta online (Frontend público) | `frontend-design` + `ui-ux-pro-max` | 7.3 |

---

## Workflows Asociados

| Workflow | Fases donde se Activa | Descripción |
|:---------|:---------------------|:------------|
| `/quality-check` | Fase 3-6 | Validación de código con Biome + TypeScript |
| `/ui-validation` | Fase 4 | Auditoría touch-first y accesibilidad |
| `/supabase-prep` | Fase 1-2 | Validación de migraciones y RLS en Supabase |

---
*Roadmap generado por el CTO Orchestrator de Antigravity. Cada fase requiere aprobación del Lead Developer antes de proceder.*
