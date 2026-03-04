# **Guía de Implementación Técnica: PWA Gestión de Stock e Identidad**

**Referencia:** PWA-STOCK-SEC-001

**Estado:** Optimizado para Agentes Antigravity

**Objetivo:** Especificación de arquitectura Offline-First y protocolos de seguridad biométrica.

## **1\. Especificaciones de Arquitectura de Identidad**

### **Protocolo de Autenticación**

* **Estándar:** OAuth 2.0 \+ OpenID Connect (OIDC).  
* **Transporte de Sesión:** \- *Access Token:* JWT de vida corta (15 min) almacenado en memoria (State).  
  * *Refresh Token:* Almacenado en Cookie HttpOnly, Secure, SameSite=Strict.  
* **MFA:** Integración nativa de **WebAuthn** para biometría (FIDO2) en dispositivos móviles.

### **Autorización (RBAC)**

* **Roles:** ADMIN, WAREHOUSE\_OPERATOR.  
* **Validación:** Los *scopes* de permisos deben validarse tanto en el Service Worker (para UI selectiva) como en el API Gateway (validación forzosa).

## **2\. Protocolo de Sincronización Offline-First**

### **Almacenamiento Local (Cliente)**

* **Motor:** IndexedDB.  
* **Estructura:** Réplica parcial de stock\_items y cola de mensajes outbox\_movements.

### **Flujo de Reconciliación**

1. **Escritura local:** Persistencia en IndexedDB con status: "pending".  
2. **Registro de Sincronización:** Uso de ServiceWorker.registration.sync.register('sync-stock').  
3. **Resolución en Servidor:**  
   * El servidor compara el version\_id recibido con el actual.  
   * **Éxito:** Retorna 201 Created \+ Nuevo version\_id.  
   * **Conflicto:** Retorna 409 Conflict si la versión base ha cambiado. El registro se mueve a sync\_conflicts.

## **3\. Hoja de Ruta Operativa (Resolución de GAPs)**

| GAP | Solución Técnica | Componente Crítico |
| :---- | :---- | :---- |
| **Recuperación de Cuenta** | Hash de un solo uso en Redis (TTL 15m). | Microservicio de Notificaciones. |
| **Gestión de Sesiones** | Tabla de revocación de tokens activos. | Middleware de Auth. |
| **Integración Hardware** | Implementación de BarcodeDetector API. | Módulo de Cámara PWA. |
| **Inmutabilidad** | Triggers SQL para bloqueo de DELETE/UPDATE. | Engine de Base de Datos. |
| **Notificaciones** | Web Push API (VAPID Keys). | Service Worker. |
| **Seguridad en Reposo** | Cifrado AES-GCM vía Web Crypto API. | Persistencia IndexedDB. |

## **4\. Esquema de Datos Optimizado (SQL)**

\-- Entidad de Inventario con Bloqueo Optimista  
CREATE TABLE stock\_items (  
    id UUID PRIMARY KEY,  
    sku VARCHAR(50) UNIQUE NOT NULL,  
    nombre VARCHAR(255) NOT NULL,  
    cantidad\_actual INT NOT NULL DEFAULT 0,  
    version\_id INT NOT NULL DEFAULT 1,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- Registro de Auditoría y Movimientos  
CREATE TABLE stock\_movements (  
    id UUID PRIMARY KEY,  
    item\_id UUID REFERENCES stock\_items(id),  
    user\_id UUID NOT NULL,  
    tipo\_movimiento ENUM('entrada', 'salida', 'ajuste') NOT NULL,  
    cantidad INT NOT NULL,  
    client\_mutation\_id VARCHAR(100) UNIQUE,  
    server\_version\_at\_time INT,  
    status ENUM('pending', 'synced', 'conflict') DEFAULT 'synced',  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- Gestión de Colisiones de Datos  
CREATE TABLE sync\_conflicts (  
    id UUID PRIMARY KEY,  
    movement\_id UUID REFERENCES stock\_movements(id),  
    valor\_esperado INT,  
    valor\_actual\_servidor INT,  
    resuelto BOOLEAN DEFAULT FALSE,  
    admin\_notes TEXT,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

## **5\. Directrices de UI/UX para Agentes**

* **Patrón de Navegación:** Bottom Tabs para accesibilidad móvil.  
* **Optimistic UI:** Actualización de contadores de stock antes de recibir confirmación del servidor.  
* **Indicadores de Estado:** Iconografía obligatoria para representar estados de red (Online/Offline/Syncing).