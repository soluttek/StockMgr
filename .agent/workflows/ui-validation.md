---
description: Auditoría de interfaz para asegurar ergonomía de almacén (Touch-First) y estética premium.
---

Este flujo se activa siempre que se cree o modifique un componente de la interfaz de usuario.

1. **Ergonomía Táctica (Thumb Zone)**:
   - Validar que los botones críticos estén en la zona inferior de la pantalla.
   - Confirmar que el `touch-target` de elementos interactivos sea de al menos **44x44px**.

2. **Consistencia Visual (Pro Max Standards)**:
   - Verificar el uso de la paleta oficial: Fondo `#0f172a`, Neutros `#1e293b`, Acento `#06b6d4`.
   - Asegurar que no se usen emojis como iconos; utilizar exclusivamente SVGs compatibles.

3. **Interacción y Feedback**:
   - Añadir `cursor: pointer` a todo elemento clicable.
   - Validar que las transiciones de hover/active tengan una duración de entre **150ms y 300ms**.
   - Revisar que los `inputs` y `selects` tengan `appearance: none` para consistencia móvil.

4. **Accesibilidad**:
   - Comprobar que el contraste de texto sea de al menos 4.5:1.
   - Asegurar que todos los campos de formulario tengan etiquetas descriptivas visibles o ARIA labels.
