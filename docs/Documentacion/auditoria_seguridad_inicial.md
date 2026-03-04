# Auditoría de Seguridad y Riesgos Arquitectónicos (OWASP 2025)

**Contexto:** Este reporte analiza el código actual (`src/`) bajo la perspectiva de que es un **prototipo funcional** y su destino es una reconstrucción radical para convertirse en la PWA corporativa final de StockMgr.

El objetivo de este documento no es parchear el prototipo, sino **identificar las lecciones arquitectónicas clave** y los anti-patrones de seguridad que deben ser eliminados en la próxima fase de desarrollo (Migración a TypeScript y Supabase).

---

## 1. Inyección y Manipulación del DOM (OWASP A03: Injection)

### 🚨 El Problema Actual (Prototipo)
El análisis del código revela un uso intensivo y generalizado de la propiedad `innerHTML` para la renderización de casi todas las vistas (ej. `product-detail.js`, `inventory-list.js`, `dashboard.js`, `models.js`). 
- **Riesgo (XSS):** Cualquier dato no sanitizado proveniente de la base de datos local que se inyecte de esta forma puede ejecutar código malicioso en el navegador del usuario (Cross-Site Scripting).

### ✅ Solución Arquitectónica (Rediseño)
- La futura migración debe **abandonar completamente Vanilla JS con `innerHTML`**.
- **Acción:** Adoptar un framework reactivo (como los recomendados: React, Vue, Svelte) que manejen el DOM Virtual y automaticen la sanitización de variables por defecto. Si se decide mantener Vanilla JS, es obligatorio migrar al uso de `document.createElement` o bibliotecas de sanitización ligeras como DOMPurify.

## 2. Autenticación y Control de Acceso (OWASP A01 & A07)

### 🚨 El Problema Actual (Prototipo)
La búsqueda directa de mecanismos de control de acceso (`jwt`, `session`, `auth`, `login`, `role`) confirma que el prototipo opera sin ningún tipo de barrera de autenticación real. 
- **Riesgo:** Un sistema de control de inventarios sin Auth = pérdida de datos, suplantación o exposición pública. 

### ✅ Solución Arquitectónica (Rediseño)
- **Acción:** Integrar **Supabase Auth** como primera piedra del rediseño. 
- Configurar políticas de RLS (Row Level Security) directamente en la base de datos para que la API rechace peticiones no autorizadas, aplicando el principio de *Zero Trust*. Nadie debe poder ver ni modificar el stock sin un JWT válido.

## 3. Manejo de Estado y Datos Locales (OWASP A04: Insecure Design)

### 🚨 El Problema Actual (Prototipo)
El prototipo actual almacena todo el estado e inventario en memoria/local (probablemente a través de IndexedDB/LocalStorage, evidenciado en la carga reactiva en memoria en `add-product.js`). 
- **Riesgo:** Los datos alojados persistentemente en el lado del cliente (frontend) pueden ser manipulados fácilmente a través de las DevTools del navegador. Además, en un entorno multi-usuario, esto generará condiciones de carrera (*Race Conditions*) e inconsistencias masivas del stock.

### ✅ Solución Arquitectónica (Rediseño)
- **Migración a la Nube (Supabase):** La capa de IndexedDB debe pasar a ser *estrictamente offline-first caché*, pero la fuente de verdad (Source of Truth) única y obligatoria debe ser la base de datos remota (Supabase PostgreSQL).
- **Tipado Fuerte:** Adoptar **TypeScript** (nuestro próximo objetivo clave) para garantizar que las estructuras de datos (como el `Diccionario de Modelos.json`) no muten de manera impredecible en el lado del cliente. 

---

> **Resumen Ejecutivo para el Roadmap:** El prototipo ha cumplido su función demostrativa. Para pasar a producción, el uso de `innerHTML` debe eliminarse adoptando un sistema de templates seguro o un framework, se debe instaurar auth de red con Supabase y el estado en el cliente debe tiparse con TypeScript.
