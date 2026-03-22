# Changelog — 21 de Marzo, 2026

## 🚀 Fase A: Limpieza Profunda y Depuración de Código Legacy
Se ha realizado una limpieza estructural de la aplicación para eliminar rastros de la arquitectura anterior (Vanilla JS) y reducir el peso del bundle.

- **Preservación de Lógica (Logic Extraction)**: Se ha movido el código con lógica de negocio pendiente de migrar a la nueva carpeta `src/legacy/`:
    - `sku-engine.js`: Motor de generación de SKUs de 19 caracteres (formato real con guiones).
    - `add-product.js`: Estructura y validaciones de formularios de alta.
    - `models.js`: Catálogo de modelos y compatibilidades.
    - `crypto.js`: Generador de contraseñas seguras para el Admin.
    - `db.js`: Esquema Dexie para el futuro soporte Offline.
- **Eliminación de Código Muerto**: Se han eliminado 9 archivos `.js` correspondientes a vistas ya migradas a Vue (Dashboard, Inventory, Login, Auth, etc.).
- **Limpieza PWA**: Eliminamos `sw.js` manual y `manifest.json` en favor del sistema automático de Vite-PWA.
- **Optimización CSS**: Poda de ~800 líneas de estilos huérfanos en `app.css`. Reducción del bundle de estilos en un **18%**.

## 🔒 Fase B: Fortalecimiento de Seguridad
Implementación de las primeras medidas críticas detectadas en la auditoría operativa.

- **Rate Limiting Visual**: Añadido control de intentos en el Login (máximo 5 intentos) con bloqueo y contador de espera de 30 segundos.
- **Validación de Entorno**: Implementada verificación estricta de variables de entorno de Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) al inicio de la app.
- **Verificación Técnica**: Cada cambio ha sido validado mediante builds exitosos (`npm run build`) para garantizar estabilidad.

---
*Próximos Pasos: Fase C (Estabilidad y Robustez)*
