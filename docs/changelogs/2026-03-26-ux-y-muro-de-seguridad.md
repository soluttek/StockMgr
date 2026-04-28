# Registro de Cambios - 26 de Marzo de 2026

## Perfeccionamiento de UX y Muro de Seguridad (Fase 4 - Final)

En esta sesión, nos hemos enfocado en rediseñar por completo la experiencia de acceso (Login) para que sea robusta, profesional y guíe correctamente al usuario en caso de error, mitigando la frustración y protegiendo el sistema.

### 🛡️ Muro de Seguridad Progresivo (Time-Wall)
Se rediseñó la lógica de rate limiting en `LoginView.vue` para aplicar una penalización progresiva en caso de credenciales inválidas:
- **Intentos 1, 2 y 3:** Feedback estándar sin penalización de tiempo.
- **Intento 4:** Bloqueo de **30 segundos**.
- **Intento 5:** Bloqueo de **1 minuto**.
- **Intento 6:** Bloqueo de **3 minutos + Bloqueo Permanente de la Cuenta**, con invitación directa a contactar a soporte. *(Preparado el terreno para futuro disparo automático de alertas al IT)*.

### 🎨 Modal Custom & Feedback Visual
- **Validación Prístina:** Se eliminaron las alertas nativas (HTML5 tooltips) del navegador, sustituyéndolas por un **Modal Premium Custom** con diseño oscuro coherente a la app cuando existen campos vacíos.
- **Microinteracciones:** Agregada animación de vibración (`shake`) a la tarjeta de login al introducir credenciales erróneas.
- **Revelador de Contraseña:** Se instaló el clásico botón "Ojo" temporal, revelando la clave por exactamente **5 segundos** antes de ocultarla otra vez.

### 📑 Flujo de Soporte Inteligente (`/soporte`)
Se creó desde cero el componente `SupportView.vue`:
- **Redirección Contextual:** Enlaces desde el login ("¿Olvidaste tu contraseña?" o "Desbloquear Cuenta") dirigen hacia el nuevo formulario.
- **Filtro de Desplegable:** El input permite elegir un *Asunto* (Olvidó Contraseña, Desbloqueo, Problemas Técnicos, Otros).
- **Control Antispam:** El mensaje está restringido a **500 caracteres** y **solo se activa** si el usuario selecciona una categoría que requiera texto adicional ("Problemas Técnicos.", "Otros..."). En caso contrario, el input se bloquea previniendo ruido innecesario para los agentes de soporte.

### 🛠️ Ajustes Menores
- El banner general de *"Navegación Protegida"* (`App.vue`) se refinó: ahora no subraya el enlace, resalta en **negrita**, y **desaparece ocultándose inteligentemente** si el usuario se encuentra navegando dentro del área de Login o Soporte donde lógicamente no hay sesión que proteger.

---
**Estado:** Listo para saltar a la **Fase 5 (PWA Offline & Sync)**.
