# 📦 StockMgr — Gestión de Inventario Industrial

**StockMgr** es una aplicación web progresiva (PWA) diseñada para la gestión rápida y eficiente de inventario de repuestos de celulares en entornos de almacén. Enfocada en la velocidad de escaneo, la precisión del SKU y una estética industrial de alta visibilidad.

![Aesthetic: Industrial Utilitarian](https://img.shields.io/badge/Aesthetic-Industrial%20Utilitarian-06b6d4?style=for-the-badge)
![Tech: Vite + Dexie.js](https://img.shields.io/badge/Tech-Vite%20%2B%20Dexie.js-646cff?style=for-the-badge)

## 🚀 Características Principales

- **📱 Interfaz Touch-First**: Botones de gran formato (>44px) y navegación ergonómica optimizada para uso con una sola mano.
- **🔍 Búsqueda Inteligente**: Motor de búsqueda con soporte para múltiples palabras clave independientes (Fuzzy Search). Encuentra "Samsung A14" buscando simplemente "sam a14".
- **📸 Escáner de SKU integrado**: Escaneo rápido de códigos de barras para entradas y salidas de stock inmediatas.
- **🛠️ Motor de SKU Robusto**: Generación y validación automática de SKUs basados en estructura técnica (Categoría, Marca, Estado, Condición, Modelo).
- **💾 Almacenamiento Local (Offline First)**: Utiliza IndexedDB (vía Dexie.js) para garantizar que los datos estén disponibles incluso sin conexión a internet.
- **✨ Limpieza de Codificación**: Corrección automática de caracteres corruptos y tildes en la importación de datos.

## 🛠️ Tecnologías

- **Frontend**: Vanilla JavaScript (ES6+).
- **Estilos**: Custom CSS con variables dinámicas y diseño resiliente (estilos críticos inyectados).
- **Base de Datos**: Dexie.js (IndexedDB).
- **Build Tool**: Vite.
- **PWA**: Service Workers para soporte offline y manifiesto de instalación.

## 📦 Instalación y Desarrollo

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/eliobug/StockMgr.git
   cd StockMgr
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📋 Estructura de Datos

El sistema se basa en un diccionario maestro para la generación de SKUs:
- `marcas.json`: Mapeo de códigos de marca.
- `modelos.json`: Listado de modelos compatibles por marca.
- `categorias.json`: Definición de tipos de piezas.

## 📝 Licencia

Este proyecto es para uso privado de gestión de stock.

---
Desarrollado con ❤️ para una gestión de almacén impecable.
