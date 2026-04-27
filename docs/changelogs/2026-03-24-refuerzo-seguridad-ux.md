# Registro de Cambios - 24 de Marzo de 2026

## Refuerzo de Seguridad y UX (Post-Fase 4)

En esta sesión, nos enfocamos en resolver la confusión del usuario derivada de la seguridad de la base de datos (RLS) y en blindar el sistema de navegación.

### 🛡️ Seguridad y Control de Acceso
- **Reactivación de Auth Guard:** Se ha restaurado la protección de rutas en `src/router/index.ts`. La aplicación ahora redirige obligatoriamente al login (`/login`) si no hay una sesión activa, impidiendo el acceso a vistas sensibles.
- **Transparencia de Datos (RLS):** Se documentó y explicó el funcionamiento del *Row Level Security* de Supabase, que oculta registros en lugar de lanzar errores cuando no hay autenticación.

### 🎨 Experiencia de Usuario (UX)
- **Nuevo Banner de Navegación Protegida:** Se implementó un componente visual en `App.vue` que se activa en situaciones de bypass o sesión comprometida.
    - Indica claramente que el usuario está en modo "solo lectura" o con datos bloqueados por seguridad.
    - Utiliza un diseño de alerta (ámbar) para diferenciarlo de errores de sistema.
    - Incluye un enlace directo al futuro formulario de **Soporte Técnico**.
- **Jerarquía de Texto:** Se ajustó el formato del mensaje del banner a "punto y aparte" para mejorar la legibilidad del contacto de soporte.

### 🛠️ Mantenimiento
- Limpieza de código en `App.vue` eliminando redundancias en la lógica de visualización ante ausencia de usuario.

---
**Estado Final:** Sistema funcional, seguro y con feedback preventivo para evitar interpretaciones de "datos vacíos" como errores de software.
