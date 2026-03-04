# Roadmap Estratégico: Radical PWA Upgrade 🚀

Basado en el análisis de seguridad inicial y la disponibilidad del nuevo equipo de especialistas, este es el plan maestro para reescribir la PWA StockMgr desde su estado de prototipo actual hasta su versión cloud de grado corporativo.

---

## 🎯 Fase 3: Refactorización Estructural (Inicio Inmediato)
* **Objetivo:** Abandonar los riesgos de Vanilla JS dinámico y tipar los datos.
* **Acciones:**
  1.  **Fundamentos TypeScript:** Inicializar la configuración de TS (`tsconfig.json`) y adoptar un framework reactivo (ej. React/Vite o Vue) para arrancar de raíz el problema de la inyección vía `innerHTML`.
  2.  **Modelado de Datos (Tipos estáticos):** Transformar el `diccionario de modelos.json` y la estructura de inventario en Interfaces/Tipos strictos de TS.

## 🗄️ Fase 4: Migración Cloud & Simulación ("Dry-Run")
* **Objetivo:** Preparar el terreno para salir del "modo offline/IndexedDB".
* **Acciones:**
  1.  **Auditoría de Esquemas:** Usar el `supabase-specialist` para generar el SQL equivalente a nuestra IndexedDB actual.
  2.  **Dry-Run Local:** Simular la base de datos de Supabase.
  3.  **Seguridad DB (RLS):** Escribir las políticas de nivel de fila para asegurar que, por fin, haya **autenticación** y control de permisos granulares sobre el stock.

## 🎨 Fase 5: Rediseño Pro-Max UI
* **Objetivo:** Ergonomía extrema de almacén y estándares *Touch-First*.
* **Acciones:**
  1.  **Reconstrucción Visual:** Utilizar Tailwind CSS (o equivalente tipado) bajo la dirección del `ui-ux-pro-max`. Botones críticos en la "Thumb zone".
  2.  **Validación de Accesibilidad:** Certificación final con `accessibility-compliance-accessibility-audit` (Contraste 4.5:1, ARIA labels).
  3.  **Seguridad Continua:** Pasaje de todo el nuevo código fuente por el `vulnerability-scanner` antes de dar por cerrada la fase.
