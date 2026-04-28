# Guía de Creación de Changelogs 📝

Este documento establece el estándar de calidad y estructura para todos los archivos `.md` que registren las jornadas y fases de desarrollo del proyecto. Todos los changelogs futuros **deben** seguir estrictamente este formato para garantizar un historial profesional, rastreable y transparente.

---

## 🏗️ Estructura del Documento

Todo Changelog debe constar de las siguientes 4 secciones principales:

### 1. Cabecera y Resumen
Debe incluir el número de fase, la fecha y un breve párrafo resumen del objetivo principal alcanzado durante la jornada.

```markdown
# Changelog: Fase [X] - [Título Descriptivo] 🚀
**Fecha:** [DD de mes de YYYY]

---

## 🌟 Resumen de la Jornada
Hoy se ha completado la **Fase [X]** del proyecto, enfocada en [objetivo principal]. Además, se realizaron acciones de [mencionar si hubo refactorización, despliegue, limpieza, etc.].
```

### 2. Hitos de la Fase (Detalle Técnico)
**Crucial:** Esta sección **debe coincidir exactamente con la tabla de hitos oficial** que se esté trabajando. Cada sub-punto (ej. 6.1, 6.2) debe estar claramente numerado, indicando su estado y detallando técnicamente qué se hizo y qué impacto tiene.

```markdown
## 🛠️ Hitos de la Fase [X] (Detalle Técnico)

### Hito [X.1] - [Nombre exacto del hito según la tabla] ✅
*   **Acción:** [Descripción técnica de lo que se implementó. Ej: Sincronización completa de los tipos...]
*   **Resultado/Cobertura:** [El impacto real en el proyecto. Ej: Eliminación de múltiples casts de tipo `any`...]

### Hito [X.2] - [Nombre exacto del hito según la tabla] ✅
*   **Acción:** [...]
*   **Resultado/Cobertura:** [...]
```

### 3. Tareas Adicionales y Troubleshooting (Si aplica)
Aquí se registran todos los obstáculos técnicos superados que no formaban parte directa de un hito, pero fueron necesarios para el avance del proyecto (ej. problemas de entorno, refactorizaciones, dependencias, etc.).

```markdown
## 🧹 Consolidación, Limpieza y Troubleshooting (Opcional)

### Resolución de Conflictos y Despliegue
*   **[Problema/Acción 1]:** [Ej: Limpieza masiva de node_modules del historial de git...]
*   **[Problema/Acción 2]:** [Ej: Corrección de error de permisos en Vercel...]
```

### 4. Gestión del Repositorio y Ramas
Documentar siempre el flujo de control de versiones ejecutado durante la jornada para mantener el rastro de la integración continua.

```markdown
### Gestión de Ramas
*   **Fusión a `[rama destino, ej: main]`:** Consolidación de todo el progreso en la rama principal.
*   **Limpieza:** Eliminación de ramas de características ya fusionadas (`feat/nombre-rama`) para mantener el entorno limpio.
```

---

## 💡 Reglas de Oro para el Agente AI
1. **Nunca inventes hitos:** Cíñete estrictamente a la tabla de entregables proporcionada por el usuario. Si se hizo trabajo extra, ponlo en la sección de "Tareas Adicionales".
2. **Nivel de Detalle:** Sé técnico pero comprensible. Menciona tecnologías específicas (Vitest, Playwright, Pinia) y métricas si las hay (ej: 30+ archivos modificados).
3. **Formato:** Usa Markdown, emojis de forma moderada para separar secciones, y listas con viñetas para facilitar la lectura rápida.
