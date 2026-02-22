---
description: Flujo para validar que el código cumpla con los estándares de limpieza y arquitectura del proyecto.
---

Este flujo debe ejecutarse antes de dar por terminada cualquier tarea de desarrollo o refactorización.

1. **Revisión de Nomenclatura**:
   - Verificar que las funciones sigan el patrón `verboSustantivo` (ej: `fetchProducts`, `updateStock`).
   - Validar que las variables sean descriptivas y no usen abreviaturas crípticas.

2. **Validación de Estructura (Clean Code)**:
   - Identificar funciones de más de 50 líneas y proponer su subdivisión.
   - Reemplazar anidamientos profundos (`if/else` anidados) por **Early Returns**.
   - Asegurar que no existan "Magic Numbers"; usar constantes nombradas en su lugar.

3. **Verificación de Tipado e Inmutabilidad**:
   - Confirmar que los cambios de estado en JavaScript utilicen el operador spread (`...`) para mantener la inmutabilidad de los objetos.
   - Validar el manejo de errores en llamadas asíncronas (`try/catch`).

// turbo
4. **Ejecución de Lints**:
   - Ejecutar `npm run lint` (si está configurado) o revisar manualmente los avisos del IDE.

5. **Documentación JSDoc**:
   - Añadir comentarios descriptivos en funciones públicas o complejas siguiendo el estándar definido en `skills/coding-standards`.
