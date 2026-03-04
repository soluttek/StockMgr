# 📔 Manual Maestro: Configuración Operativa StockMgr (Stack Corporativo)

Este manual documenta el proceso paso a paso para configurar un entorno de desarrollo de alto rendimiento utilizando **Antigravity**, integrando herramientas de IA, bases de datos en la nube y control de versiones profesional.

---

## 🏗️ Fase 1: El Taller - Base de Operaciones

### 1. Sistema de Habilidades (Skills)
Antigravity se nutre de bibliotecas especializadas.
1.  **Sincronización:** Se descargan las últimas habilidades desde repositorios globales.
2.  **Organización:** Clasificar las habilidades por categorías (`Programming`, `Security`, `WebDesign`, `Marketing`).
3.  **Localización:** Traer los especialistas necesarios a la carpeta `.agent/skills/` del proyecto para asegurar rapidez y autonomía.

### 2. Extensiones de IDE (VS Code / Cursor)
Indispensables para que el humano y la IA hablen el mismo idioma técnico:
- **Vue - Official:** Soporte completo para el stack elegido (Vue 3).
- **Error Lens:** Muestra errores de código en tiempo real (vital para TypeScript).
- **Biome:** Formateador y linter ultrarrápido para mantener el código uniforme.

---

## ☁️ Fase 2: Conectividad (Model Context Protocol - MCP)

Los MCPs permiten que la IA "salga" del chat y manipule tus herramientas.

### 🗄️ Supabase MCP (La Base de Datos)
1.  **Token:** Generar un *Access Token* en el dashboard de Supabase.
2.  **Conexión:**
    ```bash
    npx -y @supabase/mcp-server-supabase --access-token TU_TOKEN --project-ref TU_REF
    ```

### 🐙 GitHub MCP (El Repositorio)
1.  **Token:** Generar un *Personal Access Token (classic)* con permisos de `repo` y `workflow`.
2.  **Conexión:**
    - Guardar en entorno: `$env:GITHUB_PERSONAL_ACCESS_TOKEN = "TU_TOKEN"`
    - Arrancar: `npx -y @modelcontextprotocol/server-github`

---

## 🌟 Fase 3: Estándares de Oro (Nivel Master)

Para que un proyecto pase de ser un prototipo a una herramienta invencible:

### 1. Gestión Segura de Secretos (`.env.local`)
**Nunca** escribas tokens directamente en el código o comandos públicos.
- Usar archivos `.env.local` para guardar las llaves de Supabase y GitHub.
- Asegurar que `.gitignore` excluya estos archivos para evitar fugas de seguridad.

### 2. Pipeline de Calidad (CI/CD)
Automatizar la validación con **GitHub Actions**.
- Cada "Push" al repositorio debe disparar un escaneo de seguridad (`vulnerability-scanner`) y pruebas de tipado.

### 3. Estrategia de Testing (Vitest + Playwright)
- **Vitest:** Para probar que la lógica (matemáticas de stock, SKUs) sea perfecta.
- **Playwright:** Para probar que la interfaz (el escáner, los botones) funcione en móviles y tablets.

### 4. Arquitectura Vue 3 + TypeScript
- **TypeScript:** Obligatorio para definir "Interfaces". Si dices que un producto tiene "SKU", TS garantiza que nunca falte ese dato.
- **Pinia:** El almacén de memoria central para que todos los componentes vean el mismo stock en tiempo real.

---

## 🛠️ Fase 4: Implementación Técnica (Operativa)

Esta sección contiene los comandos y archivos necesarios para activar el Nivel Master en cualquier proyecto.

### 1. Gestión de Secretos
Crear un archivo `.env` (privado) y un `.env.example` (público):
```env
# Supabase
SUPABASE_PROJECT_REF=tu_id
SUPABASE_ACCESS_TOKEN=tu_token
# GitHub
GITHUB_PERSONAL_ACCESS_TOKEN=tu_token
```

### 2. Automatización CI/CD
Ubicar en `.github/workflows/quality.yml`:
- Dispara `npm audit` para seguridad.
- Ejecuta `vitest` para lógica.
- Valida con `biome` el formato.

### 3. Comandos Master de Terminal
- `npm install`: Instala el motor (Vue, TS, Vite).
- `npm run dev`: Arranca el taller local (Vite).
- `npm run test:unit`: Ejecuta la red de seguridad (Vitest).
- `npm run build`: Genera la PWA final lista para producción.

---

---

## 🚀 Cómo usar este Manual
1.  **Repetir el Setup:** Sigue los pasos de la Fase 1 y 2 en cualquier proyecto nuevo.
2.  **Invocación de Agentes:** Consulta el archivo `EQUIPO_ESPECIALISTA.md` para saber a quién llamar en cada paso.
3.  **Crecimiento:** Si el proyecto crece, añade nuevas skills desde la "Reserva Global".

---
*Este manual es un documento vivo. Actualícese tras cada fase crítica del proyecto.*
