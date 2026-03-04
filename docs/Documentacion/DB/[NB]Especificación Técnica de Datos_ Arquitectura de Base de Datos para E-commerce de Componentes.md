# **Especificación Técnica de Datos: Arquitectura de Base de Datos para E-commerce de Componentes**

## **1\. Fundamentos de la Arquitectura Relacional**

En la gestión logística de repuestos técnicos, la integridad referencial no es una sugerencia, sino un imperativo estratégico. La heterogeneidad de los componentes —que varían desde consumibles genéricos hasta módulos electrónicos críticos— exige un modelo relacional robusto que elimine la redundancia y prevenga la corrupción de datos ("datos huérfanos"). Esta arquitectura permite que cada movimiento de stock y cada transacción esté vinculado a entidades maestras inmutables, garantizando la trazabilidad en entornos de alta complejidad.

Para asegurar la escalabilidad operativa, el sistema **debe** fundamentarse en las siguientes 7 tablas clave:

1. **Productos:** Repositorio maestro de atributos técnicos intrínsecos.  
2. **Categorías:** Estructura jerárquica para la navegación y el filtrado por facetas.  
3. **Proveedores:** Registro de orígenes, crucial para la gestión de suministros internacionales.  
4. **Inventario:** Control de existencias físicas, puntos de reorden (ROP) y ubicaciones de almacén.  
5. **Compatibilidad:** Tabla intermedia (junction table) que gestiona la lógica de muchos a muchos (M:N).  
6. **Pedidos:** Registro de cabecera de transacciones comerciales.  
7. **Detalles del Pedido:** Desglose transaccional que preserva la verdad histórica del momento de compra.

**Capa del "So What?":** La normalización exhaustiva de estas entidades minimiza los errores de integridad y optimiza el almacenamiento al evitar la dispersión de datos. A diferencia de esquemas no relacionales, esta estructura garantiza que cualquier cambio en la metadata de un proveedor o categoría se propague instantáneamente, manteniendo la coherencia necesaria para auditorías financieras y operativas.

Esta base estructural es el prerrequisito para la definición precisa de los atributos técnicos que constituyen el ADN del catálogo.

\--------------------------------------------------------------------------------

## 

## **2\. Definición Estructural de Tablas Maestras (Productos y Categorías)**

Los atributos técnicos como el SKU y el MPN operan como los identificadores primarios en el ADN del catálogo digital. Su precisión impacta directamente en la capacidad del usuario para localizar componentes específicos mediante códigos de fabricante, eliminando errores de compra en piezas críticas.

### **Tabla: Productos**

Esta tabla **debe** implementar los siguientes campos y restricciones:

* **ID\_Producto (Primary Key):** Identificador interno único.  
* **SKU (Stock Keeping Unit):** Formato alfanumérico de 6 a 8 dígitos. Se **estipula** el uso de numeración semi-inteligente (ej. prefijo "BAT-" para baterías \+ sufijo contador).  
* **MPN (Manufacturer Part Number):** Identificador del fabricante original; campo obligatorio para la interoperabilidad con sistemas externos.  
* **GTIN/EAN:** Código de barras internacional para logística global.  
* **Condición:** Clasificación técnica obligatoria bajo la siguiente taxonomía:  
  * **Service Pack:** Piezas oficiales. Deben incluir banderas booleanas para verificar "DNA" de autenticidad: altavoz de auricular, rejillas de altavoz y films protectores en caja sellada (etiquetas "Do not accept if seal broken").  
  * **OEM (Original Equipment Manufacturer):** Calidad máxima fabricada por el proveedor original.  
  * **Aftermarket (AFT):** Subclasificación obligatoria entre **Aft OLED** (con soporte técnico para reconocimiento de huella dactilar) y **Aft Incell/TFT** (opción económica, mayor consumo de energía).  
  * **Refurbished (Grade B):** Piezas originales reprocesadas; debe admitir el registro de imperfecciones estéticas.  
* **Dimensiones y Peso:** Atributos mandatorios para el cálculo automatizado de costos de envío (Shipping API).

**Capa del "So What?":** La distinción estricta entre SKU (control interno) y MPN (referencia de fabricante) es la base de la interoperabilidad. Un sistema que confunde estos valores falla en la integración con proveedores globales y compromete la confianza del cliente técnico.

*La precisión en estos datos maestros es el insumo crítico para la lógica de disponibilidad física en la tabla de inventario.*

\--------------------------------------------------------------------------------

## 

## **3\. Lógica de Inventario y Control de Suministro**

La transición de "almacenar productos" a "gestionar activos financieros" requiere un control riguroso de los flujos de capital inmovilizado. El sistema no solo registra existencias, sino que activa comandos lógicos basados en el riesgo financiero y operativo.

### **Tabla: Inventario**

* **Cantidad\_Disponible:** Saldo en tiempo real.  
* **Ubicación\_Almacén:** Coordenadas físicas (Pasillo/Estante) para optimización de picking.  
* **Punto de Reorden (ROP) y Stock de Seguridad (SS):** Niveles calculados para mitigar la variabilidad.

  ### **Comandos de Optimización Logística**

El sistema **debe** integrar las siguientes métricas y fórmulas de la tesis LUT para el cálculo de niveles:

1. **Lead Times (LT):** La base de datos debe manejar rangos específicos de **7, 8, 9, 10, 15 y 65 días**. El valor de 65 días (proveedores asiáticos) debe disparar automáticamente un aumento en el cálculo del Stock de Seguridad.  
2. **Fórmula EOQ (Economic Order Quantity):** EOQ \= \\sqrt{\\frac{2 \\cdot D \\cdot C\_n}{h \\cdot C}} *(Donde D es demanda anual, C\_n costo de pedido, C precio de la pieza y h coeficiente de holding cost).*  
3. **Fórmula ROP (Re-order Point):** ROP \= SS \+ (LT \\cdot Q\_{avg}).  
4. **Z-Score:** Se establece un factor de seguridad Z \= 1.645 para garantizar un nivel de servicio del 95%.

**Capa del "So What?":** Un inventario excesivo drena la liquidez mediante costos de oportunidad y almacenamiento, mientras que un ROP mal calculado resulta en pérdida de ventas y paradas de producción. El uso de fórmulas activas transforma la base de datos de un registro estático a un motor de decisión logística.

\--------------------------------------------------------------------------------

## 

## **4\. Gestión de Relaciones Muchos a Muchos (M:N) y Compatibilidad**

Vincular un repuesto único (ej. pantalla de Note 9\) con múltiples modelos de dispositivos representa una complejidad de cardinalidad que solo se resuelve mediante una tabla intermedia de unión.

### **Tabla: Compatibilidad**

* **ID\_Producto\_Principal (FK):** Referencia al dispositivo (Smartphone).  
* **ID\_Repuesto\_Accesorio (FK):** Referencia al componente compatible.  
* **Atributos Técnicos Adicionales:**  
  * `Difficulty_Level`: Escala numérica del 1 al 5\.  
  * `Required_Tools`: Lista de herramientas necesarias (ventosas, destornilladores de precisión).  
  * `Fingerprint_Support`: Boolean (específico para validación de compatibilidad en pantallas Aft OLED).

**Regla de Integridad y Rendimiento:** Es obligatorio establecer una **Clave Primaria Compuesta** entre ambos IDs para evitar duplicados. Además, se **deben** implementar índices B-Tree en ambas claves foráneas para mitigar el problema de "Slow Search" en consultas bidireccionales.

**Capa del "So What?":** Esta estructura permite resolver en milisegundos consultas críticas: "¿Qué piezas son compatibles con este modelo?" y "¿A qué dispositivos sirve este repuesto?". Sin esta tabla y su correcta indexación, el motor de búsqueda del eCommerce colapsaría bajo carga.

\--------------------------------------------------------------------------------

## 

## **5\. Arquitectura de Transacciones y Detalles de Pedido**

La arquitectura de transacciones debe proteger la verdad histórica contra la volatilidad de los datos maestros. Un pedido es una instantánea legal y financiera que debe permanecer inalterada.

### **Tabla: Detalles del Pedido**

Este componente **debe** incluir:

* `Precio_Venta_Histórico`: Captura del precio al momento del checkout.  
* `Cantidad_Comprada`: Snapshot de las unidades transaccionadas.

**Patrón de Datos Temporales:** El campo `Precio_Venta_Histórico` representa una **excepción de denormalización** obligatoria por diseño. Si el precio del producto cambia en la tabla maestra, el registro del pedido no debe alterarse. Este patrón es vital para auditorías fiscales y gestión de garantías.

**Capa del "So What?":** El uso de JOINs con GROUP BY sobre subconsultas ineficientes es la práctica estándar para reportes de ventas. Esta arquitectura asegura que los análisis de rentabilidad se realicen sobre datos reales capturados en el tiempo, no sobre valores actuales de catálogo.

\--------------------------------------------------------------------------------

## 

## **6\. Estrategias de Optimización, Indexación y Mejores Prácticas**

La velocidad de respuesta es un atributo de calidad tan importante como la integridad de los datos. En un entorno de alto tráfico, la base de datos debe estar optimizada para latencia mínima.

### **Directrices Técnicas Obligatorias:**

* **Uso de Índices:** El esquema **debe** implementar índices en todas las Claves Foráneas (FK) y columnas de búsqueda frecuente (SKU, MPN, GTIN).  
* **Regla de "No Leading Zeros":** Queda prohibido el uso de ceros a la izquierda en identificadores numéricos. Esta restricción previene la corrupción de datos durante exportaciones a CSV o Excel, donde los ceros iniciales suelen ser truncados por el software de hoja de cálculo.  
* **Cálculo de Criticidad:** Para la priorización de inventario, se implementará la lógica: Criticality \= \\sqrt{machine \\times spare}.

**Capa del "So What?":** Estas prácticas transforman una base de datos lenta en una infraestructura de alto rendimiento. La indexación estratégica y el diseño de identificadores robustos aseguran que las consultas de compatibilidad y los cálculos de ROP se ejecuten en tiempo real, permitiendo que la plataforma escale sin degradación de servicio.

La robustez técnica de este marco garantiza la integridad absoluta de los activos digitales y la eficiencia total de la cadena de suministro del eCommerce.

