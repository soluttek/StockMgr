---
description: Preparación de la capa de datos para la futura migración a Supabase.
---

Flujo para asegurar que la persistencia local sea compatible con el backend en la nube.

1. **Validación de Schema**:
   - Verificar que los nombres de tablas y columnas estén en minúsculas (preferencia de PostgreSQL/Supabase).
   - Asegurar que cada tabla tenga columnas `created_at` y `updated_at`.

2. **Integridad Referencial**:
   - Validar que las operaciones de inserción realicen las comprobaciones de llaves foráneas lógicas (ej: no permitir SKU con marca inexistente).

3. **Preparación de Exportación**:
   - Validar que los datos de IndexedDB puedan exportarse limpiamente a JSON.

// turbo
4. **Verificación de Seed**:
   - Comprobar que la función de semilla (`seedIfEmpty`) en `db.js` cargue correctamente los diccionarios de Marcas y Modelos desde los archivos locales.
