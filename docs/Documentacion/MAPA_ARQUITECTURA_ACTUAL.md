# 🗺️ Blueprint: Mapa de Arquitectura Actual (Prototipo V1)

Este documento sirve como "radiografía" del estado actual del código de StockMgr. Su propósito es guiar la demolición controlada y la reconstrucción hacia la arquitectura final (Vue 3 + TypeScript + Supabase) sin perder las funcionalidades de negocio actuales.

---

## 1. Inventario de Estructuras (El "Mapa de Habitaciones")

Actualmente, el proyecto está estructurado usando Vanilla JS con Inyección Directa en el DOM (el método peligroso `innerHTML`). 

### Vistas Principales (`src/views/`)
- **`dashboard.js`**: Home. Muestra el estado global, alertas de bajo stock y gráficas.
- **`inventory-list.js`**: Tabla completa del inventario (probablemente la vista más pesada y candidata ideal para paginación/carga infinita con Vue).
- **`add-product.js`**: Formulario de creación/modificación de stock.
- **`product-detail.js`**: Ficha técnica individual de cada producto.
- **`brands.js` & `models.js`**: Vistas de catálogo para gestión de marcas y sus submodelos vinculados.

### Componentes Reutilizables (Virtuales)
En el rediseño, las siguientes áreas visuales del prototipo deberán extraerse a componentes de Vue independientes (Ej: `src/components/`):
- `BottomNavigation.vue` (Menú inferior táctil).
- `ProductCard.vue` (Ficha resumida de un item).
- `ScannerOverlay.vue` (Interfaz completa del lector QR/Barcode).
- `ToastNotification.vue` (Mensajes de éxito/error).

---

## 2. Esquema de Datos Vitales (Los "Cimientos")

Actualmente, los datos viven exclusivamente en el navegador del usuario utilizando `Dexie.js` (una envoltura sobre IndexedDB). Para la migración a Supabase, este es el molde que usaremos.

### Tablas y Colecciones Actuales
1.  **`productos`**: La tabla maestra. 
    - *Campos clave:* `sku` (PK), `modelo`, `categoria`, `marca`, `estado`, `condicion`, `modeloId`, `stock`, `detalle`, `compatibilidad`.
    - *Nota Técnica:* El SKU tiene una lógica de negocio intrínseca (Ej: los primeros dígitos indican categoría/marca).
2.  **`marcas`**: Catálogo base. (`codigo`, `nombre`).
3.  **`modelos`**: Subcatálogo. (`id`, `modeloId`, `nombre`, `marcaCodigo`).
4.  **`categorias`**: (`codigo`, `nombre`).
5.  **`movimientos`**: Historial de auditoría. (`sku`, `tipo` [entrada/salida], `cantidad`, `timestamp`).

> **💡 Oportunidad para TypeScript:** Estos 5 esquemas se transformarán en Interfaces estrictas (`IProduct`, `IBrand`, etc.) en el nuevo proyecto.

---

## 3. Flujos de Usuario Críticos (Los "Pasillos")

Estos son los caminos que no podemos romper durante la reconstrucción:

1.  **Flujo de Escaneo Rápido:** `Click FAB -> Abre Escáner -> Lee QR/Barcode -> Busca SKU en DB -> Muestra Resultado Visual -> Permite Botones (+1 Entrada / -1 Salida)`.
    - *Riesgo actual:* Lógica acoplada a la vista (`setupScanner` en `main.js`). En Vue, será un módulo dedicado.
2.  **Flujo de Formación de SKU:** En la vista de "Añadir Producto", el SKU se forma concatenando códigos (Categoría + Marca + Estado + Condición + Modelo). *Esta es la inteligencia principal del negocio.*
3.  **Detección Offline:** El prototipo detecta si hay internet y enciende un LED visual. (Se mantendrá para la experiencia PWA).

---

## 4. Definición del Stack Final (Los "Metales Nuevos")

- **UI Framework:** Vue 3 (Composition API usando `<script setup>`). Elegido por su elegancia, estructura estricta y bajo coste de mantenimiento.
- **Lenguaje:** TypeScript (Tipado estricto obligado).
- **Herramienta de Construcción:** Vite (Alta velocidad e integración PWA nativa con `vite-plugin-pwa`).
- **Estado/Gestión:** Pinia (El estándar oficial de Vue para sustituir la gestión de estado que ahora se hace leyendo repetidamente IndexedDB).
- **Base de Datos / Backend:** Supabase (Sustituto de `Dexie.js`, asumiendo el rol de "Fuente de la Verdad" con políticas RLS de seguridad).

---
**Estado del Blueprint:** FINALIZADO y LISTO para proceder con la Demolición Fase 1 (Inicialización del entorno Vue/TypeScript).
