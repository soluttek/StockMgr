# **Informe Ejecutivo: Arquitectura de Gestión de Usuarios y Control de Stock (PWA)**

## **1\. Resumen Ejecutivo**

La solución propuesta evoluciona de un sistema de administración básico a una infraestructura **Offline-First**. El objetivo es garantizar que el flujo de trabajo en el almacén nunca se detenga por falta de conectividad, asegurando la integridad de los datos mediante un sistema de versionado y reconciliación de conflictos. Se prioriza la seguridad biométrica nativa (WebAuthn) y una arquitectura de permisos basada en roles (RBAC) para maximizar la agilidad y el control.

## **2\. Optimización por Rol**

* ![][image1]**Arquitectura de Sesiones:** Implementación de **JWT con rotación de Refresh Tokens**. Dado que es una PWA, el *Access Token* se mantiene en memoria y el *Refresh Token* en una cookie HttpOnly para mitigar ataques XSS.  
* **Estrategia de Caching:** Uso de Service Workers con estrategia Stale-While-Revalidate para recursos estáticos y Network-First para la lógica de permisos de administración.  
* **Sincronización:** Uso de la **Background Sync API** para asegurar que los movimientos registrados en modo offline se disparen automáticamente al detectar red.  
* ![][image2]**Navegación Móvil:** Sustitución de desplegables por una **Bottom Navigation Bar**. Los datos de stock y perfiles se presentan en vistas dedicadas (Tabs), no en menús colapsables, para facilitar el uso con una sola mano.  
* **Feedback de Red:** Inclusión de micro-indicadores visuales (Nube de sincronización) en cada registro de movimiento.  
* **Autenticación:** Implementación de **WebAuthn** para permitir el acceso mediante huella dactilar o reconocimiento facial, eliminando la fricción de contraseñas complejas en el día a día.  
* ![][image3]**Persistencia Local:** Configuración de **IndexedDB** como almacenamiento primario en el cliente, replicando parcialmente el catálogo de productos y los movimientos del usuario actual.  
* **Versionado de Datos:** Implementación de **Bloqueo Optimista** mediante números de versión (version\_id) para prevenir la sobrescritura accidental de stock durante sincronizaciones concurrentes.

## **3\. Diagrama de Flujo: Sincronización Offline**

El siguiente flujo describe cómo se gestiona un movimiento de stock desde que el operario pulsa el botón hasta que se confirma en el servidor.

1. **Registro de Movimiento:** El usuario introduce la cantidad.  
2. **Escritura Local:** Se guarda en **IndexedDB** con status: "pending" y un client\_mutation\_id único.  
3. **Actualización UI:** La interfaz muestra el cambio inmediatamente (Optimistic UI).  
4. **Disparador de Sincronización:**  
   * **Online:** El Service Worker envía el POST inmediatamente.  
   * **Offline:** Se encola en la **Sync Queue** del navegador.  
5. **Reconciliación en Servidor:**  
   * Si version\_id del cliente \== version\_id del servidor \-\> **Éxito**.  
   * Si hay discrepancia \-\> **Conflicto**. El servidor guarda el registro en una tabla de conflictos para revisión manual o aplica la política LWW (Last Write Wins).  
6. **Confirmación:** El cliente recibe el ACK y marca el registro como status: "synced".

## **4\. Plan de Operatividad para Resolución de GAPs**

Para alcanzar la operatividad total, se deben implementar las siguientes soluciones técnicas sobre los GAPs detectados:

* **Solución GAP 01 (Recuperación de Cuentas):**  
  * *Operatividad:* Implementar un microservicio de notificaciones integrado con **SendGrid/Twilio**. Al solicitar recuperación, el backend genera un hash de un solo uso (TTL 15 min) guardado en Redis. La PWA redirige a un componente de "Reset Password" que valida el token contra el hash.  
* **Solución GAP 02 (Gestión de Sesiones Remotas):**  
  * *Operatividad:* Crear una tabla active\_sessions vinculada al Refresh Token. El Admin tendrá un endpoint DELETE /sessions/:userId que invalida todos los tokens en la BBDD. El Service Worker, mediante un mensaje de control (SSE), forzará el borrado del Access Token en memoria del cliente.  
* **Solución GAP 03 (Integración de Hardware):**  
  * *Operatividad:* Integrar la librería **Zxing** o la API nativa **BarcodeDetector**. El flujo UI activará la cámara trasera con un overlay de escaneo; al detectar el código, se consultará automáticamente en IndexedDB para mostrar la ficha del artículo instantáneamente.  
* **Solución GAP 04 (Inmutabilidad de Auditoría):**  
  * *Operatividad:* Configurar triggers en SQL que impidan sentencias DELETE o UPDATE en la tabla stock\_movements. Cualquier "corrección" de stock debe registrarse como un nuevo movimiento de tipo 'ajuste' con referencia al ID original.  
* **Solución GAP 05 (Notificaciones Proactivas):**  
  * *Operatividad:* Suscribir al Administrador a un Service Worker con capacidad de **Push API**. Cuando un usuario no-admin guarde un cambio de perfil en change\_requests, el servidor disparará un payload de notificación push que el navegador del Admin mostrará incluso con la app cerrada.  
* **Solución GAP 06 (Seguridad en Reposo):**  
  * *Operatividad:* Al iniciar sesión, se deriva una clave de cifrado simétrico (AES-GCM) utilizando **Web Crypto API**. Los datos guardados en IndexedDB se cifran antes de persistir. La clave nunca se guarda en disco; se pierde al cerrar la pestaña o expirar la sesión.

## **5\. Esquema de Base de Datos (Gestión de Conflictos y Stock)**

Este diseño permite rastrear el origen de cada cambio y resolver colisiones de datos cuando varios operarios trabajan sobre el mismo stock.

\-- Tabla Principal de Stock con Versionado  
CREATE TABLE stock\_items (  
    id UUID PRIMARY KEY,  
    sku VARCHAR(50) UNIQUE NOT NULL,  
    nombre VARCHAR(255) NOT NULL,  
    cantidad\_actual INT NOT NULL DEFAULT 0,  
    version\_id INT NOT NULL DEFAULT 1, \-- Incrementado en cada escritura exitosa  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- Tabla de Movimientos (Historial y Sincronización)  
CREATE TABLE stock\_movements (  
    id UUID PRIMARY KEY,  
    item\_id UUID REFERENCES stock\_items(id),  
    user\_id UUID NOT NULL,  
    tipo\_movimiento ENUM('entrada', 'salida', 'ajuste') NOT NULL,  
    cantidad INT NOT NULL,  
    client\_mutation\_id VARCHAR(100) UNIQUE, \-- ID generado por la PWA para evitar duplicados  
    server\_version\_at\_time INT, \-- La versión que el cliente creía que existía  
    status ENUM('pending', 'synced', 'conflict') DEFAULT 'synced',  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- Tabla de Resolución de Conflictos  
CREATE TABLE sync\_conflicts (  
    id UUID PRIMARY KEY,  
    movement\_id UUID REFERENCES stock\_movements(id),  
    valor\_esperado INT, \-- Lo que el cliente intentó cambiar  
    valor\_actual\_servidor INT, \-- Lo que realmente había en el servidor  
    resuelto BOOLEAN DEFAULT FALSE,  
    admin\_notes TEXT,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlwAAABJCAYAAADomPixAAAKsUlEQVR4Xu3db4hdRxnH8busguK/1hpjs5s7ZzeroUQUibZaqpVq1VBTY1KxUhHBFxXpqy42WAq2SN8I/mEVlFIpvhBfpFChBKsWWY1ocaGt0m1FGkhLTCChBEoTtGk3Pr8zz3N37uy9d/tqm9x8PzDce2bmzJkzd+E8zJlzttMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALi5TU1OXpZQur5MVTdZ1X0eT6lPTNJ+0zyvqwvPRzMzM5hhLfa/La+XY23leUpcDAIALmF3gz1o6NyL9zdIN9X4byY6/q+jPrrr8fFSPY11e2rZt27ur+mfqOgAA4AK3ffv2t/mF/lBdZnlXWzpl6Xu2OVGXb5Rut7tffdy0adNb67LzlfV3V9M0v1e/7fNNdblY/lV2bo8MG38AADAm7EJ/hV/wF+oysfzbFHRt3br1/XXZRrHjH1Qf6/zzmfX3Xgumvqt+2+eldblY2QEr+/yo8QcAAGNAgYGlF9KQ9VEpry1SQPCrumyj2LFXLB2v889XU1NT09bffyW/HWpB1c66zvT09JxuJzZNc+uo8QcAABe4zZs3v8Uu9I9aWhx2u64IuBbrMt0q08yXBwt9C+21WLxeMG6Bx6fUXpkX1JaV3zQo8Bh2/GD77dC+9a27ubm5t1v+7o73bXZ29h3Wp8/s3LnzjWW9oHwLhN5r5/Thqs6kgiaNlzZ0HC3iH9aO1f209fcJ7WOfp1O19kz7WdnP7esbrOzBUeMvXn+H+l+XieW/z8+zpbbUP0tNZ8StYLWp8ajzazpfq3elHrKoy0oaO6u7px4XjUN5HPXNtj9R1gEAYGwpEPBgZm9dFoo6vRmulG8zvqoLrLb9acfHi/I/KDjwYGNZeVu2bHmXt/Nc1DMT3tZS1da9UcHyp7SfBUE3ru6WWf4zlk51PKiw7z9RXS9WMHObgo+UZ8hOKADzeo9bOlm0c4Ol0xYIfFRtKWCw7YfUhsot/8/er3Mpn/ec+qvtMtAJln/Q9rnVyi6170uW7qzKf6s2rPwa+3520LmJj+EBa+vrtjlhn1epn5YORzCroKlo65h9/inOs+vrw4omW2pT59FZHTe1ea4OkH2mbsn7p99qn/azdEhr/6Ke9rdjPa86vv2QpQf13fKv97Hb6/s+7YHZPweNHQAAYyfl24nn0oBZpRB17OK437N04dVC8H9HHc2AWN5BfddF2y7QH/d91XYbcPm2FuD3Ai5r8w7VsX1S5HlbvfVM3TxbdNw+ZyNPtE/KF/B9Rd02gPEgTWvTZjzoUT/ui3p2jF8qL7a9HQVuPeqD+tLxoNDz1M5p/36/pRX1r9zPy5bVl5hB1PGKYgVO39QXBWXe5sDxV5+9nzFLFTNiCuja2Tz/XSZ8nNTW0PMUDyb1+/048rzNNYv71fdyf3/A4lAqfp+Ug7BT9ntcWeQtqI+d3K8HPO/2lINaBY0aO/1NrRk7AADGjl30jpcX1JrfLlSQ9JjfzlLw8dOU1xx9zC6YN3nQ9F/7/Jr2iYt2ygHPWQUe0Z5t35lWL9Zt4Ka2dLFWW/b9CbWlsmgr5QXzvRkvz79Z+9rn58p86+9HLP+MtbU7btHZ9i2WljXDFvVSDhp03u0smKVXrK093odvpRyA3eXVdTtyspihuyXaGSbl2Z12dizlc26P77NtB4p6y96PNXx2S8drZ4rE+jebcvAZgcqEBZfv7KwGYn3jZNtHyva9zcfK/nk9/R2sxLbnKaLV8cvgt71Far/XB72Oxk6/wx7/W9HYLVq6y28rTmp2y8dO57ru2AEAMHb8gjrwgi/FBfVmbXdXb5G9bN+ft/Qb+/79emZEmjx7s6R9Ii/l4Km96HpbOn6vLQUSZVs+U3WkvuWWfEamDKI8X8GVZk7KIE+zLbod2lvLlFYDzQhUFGAdTXlGZ2HQWikPNtZd3O5B4u2x7X1qZ+jsc97K7ynK2vegxXZJ56AyjWORp1msFY1LWTfGKVVrxVRX5xXb3ubZss2i3pEqrx3LcuwjL37T5L+DjqHf0D4XugNuE/rY6bblyLEDAGDs+GyLLpYD3/9U3Hrq3TpMeQH9c7rwlnVrvvbn6IBA6ded1ZmfWIw/tK1u8f4tnzGJNULqw5pAJeU1Xb1bcCnPsr2gma+qno571MdgMVUzQwO0t8bSa3h1g4KimWItlAcbOt6+ajwU7Cl/scjr8XPvrdWSVLweowxMy3GKPO2nPAXLqmvpkqhXtukBYnvLOOp5vm5H1mu1+mbk1Pdyexgfu3XrAQAwdtLo929N2gX3O1Z2Uk/sRaZfxA8PmsWIJ/gkZjT0GXmaNbLt62M7AoJBbSlg02fyGRR9V7BS3CY8POgC7udzrNjWQu2+mbA4rqX5WGOlYCPKQxngdVdn9oYGhyHl4K28XReB5T/Kp/eKfgwa/wii+p5eTMWtPz9O5PfGKSjQsrxn/Dhah6fZpzWBWTfPvK108+yZ6rXt+vf61qNmqdo1bL7dt8Yr6Dzt+E1spzx2a+oBADC2dLHt5lco6C3oWmO1X9tKtv0N+/ydfb7aFIuqS1b2IUtPRlDUycGZnjh7IOpMT0+/2eo8bHlf1baVf9a2/xLlIeX1YU8W29eprQje4oKup/CqeurDKeVr24KKD6Q8u9X3b4iSr9WyftxhmxPW9pdTfspQ655aPht3YsbXJamebf9Rx446qbqVNsCkBYTbfD/V+5Jtb1FB4zNIzepCeb3+YnfKQVI7/v66hb7XN/iTfe0icx/PH1r6X8q3Pvfq94u6aidV7ylLHmD5TOV9+lSbtt/f1abXUZtq76jGQW1GMObH1N/BVyxda9+fTjlAvD+O4WOnoK43dv5b6EGB90Q9328ptgEAGHuNP7k2Ij213vuWrM6zyddepRwEXNdZGzDoYqz2jqV8sV6zfscv5M+qHW/rKW8ryhWoaVZFgdl8ua8vkI+1V69Y+kVZLimvuVIwcsLTS5a+XddTEKK2vA8vKcjoFO8Vs+170ogZGgUcVv6i6hRpMcrt+8MKYPTd2rq7qqfUu9Vasvy/pnyOZ1Jeizbv9Y/P9D8VqDy9xqLH+6TzPVmuSbPjN96mxm2h+NdOfU8aio3Hjyz/ZR+fL3q9vlk+vQOsaE/H+0+neieb7/eDMg8AAKxv0i6gl9sFOo16YafP0lzdqS7AFc2QXau26gKxMr10s+/9UEF90L71izaDX+iX1YbqDqtnJtRXfz9Uu4appBk368P2On8DtP0qx1j90/mUlSww2lHnicZtUPDsv0vvBbRqs9wepJtvE7+oQK4uU3tWfs2gsRON3YixBwAAFyrd/lPA1VRP5GF9NnY/S8VrIjQ7Z3mP2FjeXVQDAAAXO5+R6XsPGF4bzWQpWO34beKuv6C2WLcHAAAudk3TfKHrDwIolU9QYn26vWhp3te0Pap1Wp1qjR4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHj9/B/2CEiAkUn81wAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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>