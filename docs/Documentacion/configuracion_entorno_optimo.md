# Configuración de Entorno Óptimo para StockMgr

Para abordar la reconstrucción radical de la PWA hacia TypeScript y Supabase con la máxima eficacia, tu IDE (Cursor / VS Code) y tu equipo de agentes deben estar equipados con las mejores herramientas del ecosistema.

---

## 1. Model Context Protocol (MCP) Recomendados

Los MCPs permiten a los agentes de IA conectarse directamente con tus herramientas externas. Para esta fase, los siguientes son **críticos**:

### 🛠️ Supabase MCP (Prioridad Máxima)
- **Por qué lo necesitas:** En lugar de copiar y pegar esquemas de la base de datos, este MCP permite que el asistente consulte directamente tu proyecto de Supabase.
- **Beneficio Principal:** Permite escribir consultas SQL, generar políticas de seguridad (RLS) sin errores y mapear los tipos de TypeScript directamente desde la DB en tiempo real.

### 📚 NotebookLM / Google Drive MCP (Gestor Documental)
- **Por qué lo necesitas:** Tienes documentos extensos y detallados como la `Guía Técnica.PWA Stock & Identity.md` y el `Informe Ejecutivo.md`.
- **Beneficio Principal:** Almacenar estos documentos en un entorno indexado (como NotebookLM) y conectarlos vía MCP asegura que el agente tenga el contexto arquitectónico y de negocio siempre presente, sin agotar la memoria a corto plazo del chat de Cursor.

### 🤖 GitHub MCP
- **Por qué lo necesitas:** Permite a los agentes hacer pull requests, revisar issues y administrar el repositorio sin salir del chat. Ideal para automatizar la refactorización a TypeScript rama por rama.

---

## 2. Extensiones Clave para el IDE (VS Code / Cursor)

Para mejorar el "Developer Experience" humano y facilitar el análisis estático en tiempo real:

### ⚡ Tipado y Linting
- **Error Lens:** Muestra los errores de TypeScript directamente en la línea de código, sin necesidad de hacer hover. Fundamental para la curva de aprendizaje al migrar a TS.
- **Biome (o ESLint + Prettier):** Biome es un formateador y linter ultrarrápido (escrito en Rust) diseñado para proyectos modernos de TypeScript/JavaScript. Acelera drásticamente el guardado automático comparado con Prettier.

### 🌐 Frontend & PWA
- **Vue / React Tools (Volar etc.):** Dependiendo del framework que elijamos para reemplazar el Vanilla JS con `innerHTML`, la extensión oficial correspondiente es imperativa para tener soporte completo de TSX/Vue.
- **Tailwind CSS IntelliSense:** (Recomendado) Si vamos a refactorizar el CSS corporativo actual, Tailwind facilitará enormemente construir una interfaz dinámica y *Touch-First*.

### 🗄️ Base de Datos Local (Transición)
- **IndexedDB Viewer:** Una extensión para inspeccionar y exportar la base local actual (durante el "Dry-Run" de migración) directamente desde las DevTools del IDE, antes de pasar los datos a Supabase.

---

**Siguiente Paso:** Validando este entorno, esteremos listos para ejecutar la estrategia trazada en el Roadmap definitivo.
