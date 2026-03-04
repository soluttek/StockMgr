# **Manual Operativo de Inventario: Clasificación Técnica y Verificación de Calidad**

Este manual establece el marco estratégico y operativo para la gestión de repuestos electrónicos y componentes tecnológicos de alta precisión. En un ecosistema de suministros globalizado, la estandarización de la nomenclatura y la integridad de los datos no son meros requisitos administrativos, sino imperativos logísticos. Una clasificación técnica rigurosa previene errores críticos de compatibilidad, optimiza los niveles de inmovilizado financiero y garantiza que el componente instalado preserve la integridad del activo original.

\--------------------------------------------------------------------------------

## **1\. Marco Taxonómico: Clasificación por Condición del Producto**

La diferenciación precisa de los componentes según su origen y estado es fundamental para alinear las expectativas de calidad con los costes operativos. La estandarización de estas categorías permite una arquitectura de suministro donde el riesgo técnico está perfectamente calculado.

### **Categorías de Producto según Origen y Calidad**

* **OEM (Original Equipment Manufacturer):** Componentes fabricados por el productor original. Representan el estándar de oro en fidelidad técnica, aunque suponen el mayor impacto en el coste de adquisición.  
* **Service Pack:** Se prescribe como la opción prioritaria para centros de servicio. Son piezas nuevas y originales en embalaje oficial sellado, garantizando el cumplimiento de todas las tolerancias de fábrica.  
* **Aftermarket (AFT):** Componentes producidos por terceros. Su rendimiento es variable y requiere una validación técnica estricta antes de su integración en el inventario.  
* **Reacondicionado (Refurbished):** Piezas originales con defectos estéticos o mecánicos menores que han sido procesadas en fábrica para restaurar su funcionalidad a niveles OEM.  
* **Grade B:** Repuestos (usualmente reacondicionados) con imperfecciones estéticas visibles pero funcionalmente estables. **Uso Estratégico:** Se prescriben para el mantenimiento de flotas internas o reparaciones económicas donde la estética es secundaria frente al ahorro de costes.

  ### **Análisis de Tecnología Aftermarket y Estructura de Montaje**

En el segmento Aftermarket, la elección tecnológica dictamina no solo la calidad visual, sino la compatibilidad con sensores biométricos y la eficiencia térmica.

| Característica | Aft OLED (AMOLED) | Aft Incell (TFT/IPS) | Impacto Logístico / Coste |
| :---- | :---- | :---- | :---- |
| **Calidad de Imagen** | Superior (Contraste infinito) | Estándar (Brillo limitado) | OLED: \+40% coste unitario |
| **Soporte Biométrico** | Compatible con huella | Sin soporte (generalmente) | OLED: Requerido para gama alta |
| **Eficiencia Energética** | Alta (Píxeles independientes) | Baja (Retroiluminación activa) | Incell: Mayor tasa de retorno |
| **Lead Time Promedio** | 65 días (Importación Asia) | 7-15 días (Distribución local) | OLED requiere SS más robusto |

**Factor de Decisión: Con Marco (With Frame) vs. Sin Marco (No Frame)** Es imperativo evaluar la adquisición de pantallas "With Frame". Aunque el coste de la pieza es superior, **reduce drásticamente el tiempo de mano de obra y el riesgo de daños por adhesivos** durante la instalación, optimizando el ciclo de rotación en el taller técnico.

\--------------------------------------------------------------------------------

## **2\. Arquitectura de Identificación: SKUs Inteligentes y Códigos QR**

La integridad de los datos es el pilar de la escalabilidad. Un sistema de identificación robusto previene la redundancia y asegura que la información técnica sea procesable por algoritmos de reaprovechamiento y logística internacional.

### **Estructura de la Tabla Maestra de Productos**

Para una gestión profesional, se prescribe la inclusión obligatoria de los siguientes campos:

* **ID\_Producto:** Clave primaria autoincremental única.  
* **SKU Interno:** **Se prescribe un formato de 6 a 8 dígitos.** Esta longitud estandarizada garantiza uniformidad en la base de datos y facilita la lectura por escáneres portátiles.  
* **MPN (Manufacturer Part Number):** Código de parte del fabricante original para trazabilidad cruzada.  
* **GTIN/EAN:** Identificador global para procesos de importación y aduanas.  
* **Dimensiones y Peso:** Campos obligatorios para el **cálculo de peso volumétrico** en logística internacional y optimización de costes de última milla.

  ### **Esquema de Identificadores Inteligentes**

Se mandata el uso de números de parte semi-inteligentes: prefijos por categoría (ej. `BAT-` para baterías) seguidos de sufijos contadores.

* **Regla de Integridad de Datos:** Queda estrictamente prohibido el uso de ceros a la izquierda. Esta medida previene la corrupción de datos en softwares de gestión que truncan automáticamente los valores iniciales, rompiendo la referencialidad.

\--------------------------------------------------------------------------------

## **3\. Protocolo de Verificación de Autenticidad ("Legit Check")**

La verificación física es la última línea de defensa contra la infiltración de piezas falsificadas que comprometen la reputación operativa y la seguridad del usuario final.

### **Indicadores de Autenticidad en "Service Packs"**

Al recibir componentes etiquetados como Service Pack, la inspección debe validar:

1. **Embalaje de Seguridad:** Cajas selladas con precintos industriales *"Do not accept if seal broken"*.  
2. **Integración de Periféricos:** Las pantallas Service Pack deben incluir de fábrica altavoces, mallas de protección y láminas protectoras de alta densidad.  
3. **Etiquetado Interno:** Presencia obligatoria del **SKU interno del fabricante** (ej. códigos internos de Samsung) impresos directamente en el componente.

   ### **El Protocolo de la Tríada de Verificación**

Cualquier pieza admitida en stock debe superar la validación cruzada de tres puntos:

1. **SKU del Sistema:** Coincidencia exacta con la orden de compra.  
2. **QR/Serial Físico:** El código QR en la pieza debe dirigir al número de serie único registrado por el fabricante.  
3. **Etiquetado de Origen:** Verificación de sellos de control de calidad y códigos internos del fabricante presentes en el chasis.

**Criterios de Rechazo (Red Flags):**

* **Líneas de Antena:** Variaciones cromáticas en las líneas de antena en los marcos (chasis) comparadas con el estándar original. Este es un indicador crítico de moldes de baja calidad.  
* **Ausencia de SKU de Fabricante:** Piezas que se reclaman OEM pero carecen de la codificación interna grabada con láser.

\--------------------------------------------------------------------------------

## **4\. Control de Inventario y Gestión de la Demanda**

La optimización financiera del stock exige equilibrar el coste de mantenimiento con el nivel de servicio. La gestión debe ser diferenciada según el impacto de cada pieza.

### **Modelo ABC Multicriterio y Lead Times**

Se implementará una clasificación que integre:

1. **Valor de Uso:** (Demanda Anual x Coste Unitario).  
2. **Criticidad (VED):** Vital (parada total), Essential (reducción de eficiencia), Desirable (impacto mínimo).  
3. **MTTF (Mean Time To Failure):** Priorización de piezas con mayor tasa de fallo estadística.  
4. **Sincronización de Lead Times:** Se deben distinguir los productos de **importación asiática (LT: 65 días)** de los de **distribución local (LT: 7 días)**.

**Política Estratégica:** Los ítems Clase A con un Lead Time de 65 días requieren un **factor de servicio (Z) significativamente más alto** para mitigar el riesgo de un desabastecimiento de dos meses.

### **Fórmulas de Control Operativo**

* **EOQ (Economic Order Quantity):** Determina cuánto pedir minimizando costes totales. EOQ \= \\sqrt{\\frac{2 \\cdot D \\cdot C\_n}{h \\cdot C}} *Donde D es la demanda anual, C\_n el coste de pedido, C el coste del componente y h el coeficiente de mantenimiento de inventario.*  
* **Punto de Reorden (ROP):** Determina cuándo disparar la compra. ROP \= SS \+ (LT \\cdot d) *Es mandatorio sincronizar las unidades: si el Lead Time (LT) es en días, la demanda (d) debe ser la demanda promedio diaria.*  
* **Stock de Seguridad (SS):** SS \= Z \\cdot \\sigma\_d \\cdot \\sqrt{LT} *Donde Z es el nivel de servicio deseado y \\sigma\_d la desviación estándar de la demanda.*

\--------------------------------------------------------------------------------

## 

## **5\. Estructura de la Base de Datos Relacional**

La normalización es la salvaguarda contra la "pesadilla de mantenimiento" de datos redundantes, asegurando que el sistema sea escalable y eficiente en consultas de alta concurrencia.

### **Modelo de Compatibilidad Muchos-a-Muchos (M:N)**

Un solo repuesto (ej. Batería Mod-X) puede ser compatible con 50 modelos de dispositivos. Es imperativo utilizar una **Tabla Intermedia de Compatibilidad** que vincule el `ID_Dispositivo` con el `ID_Repuesto`.

* **Justificación Estratégica:** Este diseño evita actualizar 50 registros individuales cada vez que fluctúa el precio o la ficha técnica de un componente. Se actualiza una vez en la tabla maestra y se refleja en todas las compatibilidades.  
* **Campo "Nota de Instalación":** Se incluye para documentar requerimientos técnicos (ej. "Requiere adhesivo térmico específico"), guiando al personal operativo directamente desde la consulta de stock.

  ### **Estructura de Tablas Críticas**

* **Tabla Inventario/Stock:** Contiene `Cantidad_Disponible`, `Ubicación_Almacén` (Pasillo/Estante), y el `ROP` (campo calculado para disparar alertas automáticas).  
* **Integridad y Rendimiento:** Se prescribe el uso estricto de **Claves Foráneas (FK)** e **Índices** en todas las columnas de búsqueda (especialmente en tablas de compatibilidad) para garantizar tiempos de respuesta óptimos en entornos eCommerce.

La disciplina en el registro de datos y la verificación técnica constituyen la base de la rentabilidad operativa y la excelencia en el servicio al cliente.

