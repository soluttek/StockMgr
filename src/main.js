import './app.css';
import db, { seedIfEmpty, importInventoryFromCSV } from './data/db.js';
import marcasData from './data/marcas.json';
import modelosData from './data/modelos.json';
import categoriasData from './data/categorias.json';
import { registerRoute, initRouter, navigate } from './router.js';
import { startScanner, stopScanner } from './modules/scanner.js';
import { showToast } from './utils/dom.js';

import renderDashboard from './views/dashboard.js';
import renderInventoryList from './views/inventory-list.js';
import renderProductDetail from './views/product-detail.js';
import renderAddProduct from './views/add-product.js';
import renderBrands from './views/brands.js';
import renderModels from './views/models.js';

/**
 * Punto de entrada principal para inicializar la aplicación.
 */
async function initializeApplication() {
    await seedIfEmpty(marcasData, modelosData, categoriasData);
    await importInitialData();

    const viewContainer = document.getElementById('viewContainer');

    // Registro de rutas estáticas y dinámicas
    registerRoute('/', (container) => renderDashboard(container));
    registerRoute('/inventario', (container) => renderInventoryList(container));
    registerRoute('/agregar', (container) => renderAddProduct(container));
    registerRoute('/marcas', (container) => renderBrands(container));
    registerRoute('/marcas/:codigo/modelos', (container, params) => renderModels(container, params));

    initRouter(viewContainer);

    // Configuración de listeners globales
    window.addEventListener('hashchange', () => {
        updateActiveNav();
        handleDynamicRoutes(viewContainer);
    });

    // Ejecución inicial
    updateActiveNav();
    handleDynamicRoutes(viewContainer);

    setupScanner();
    setupOfflineDetection();
    registerServiceWorker();
}

/**
 * Importa los datos del CSV de inventario si la base de datos está vacía.
 */
async function importInitialData() {
    const productsCount = await db.productos.count();
    if (productsCount > 0) return;

    try {
        const res = await fetch('/src/data/inventario.csv');
        if (!res.ok) return;

        const csv = await res.text();
        const importedCount = await importInventoryFromCSV(csv);

        if (importedCount > 0) {
            showToast(`${importedCount} productos importados`, 'success');
        }
    } catch (error) {
        console.error('Error al importar CSV inicial:', error);
    }
}

/**
 * Maneja las rutas dinámicas basadas en el hash de la URL (ej: /producto/SKU).
 * @param {HTMLElement} container - El contenedor de la vista.
 */
async function handleDynamicRoutes(container) {
    const hash = window.location.hash.slice(1);
    const productMatch = hash.match(/^\/producto\/(.+)$/);

    if (!productMatch) return;

    container.innerHTML = '';
    await renderProductDetail(container, productMatch[1]);
}

/**
 * Actualiza el estado activo de la navegación inferior.
 */
function updateActiveNav() {
    const hash = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.bottom-nav__item').forEach(item => {
        const route = item.getAttribute('data-route');
        item.classList.toggle('active', route === hash);
    });
}

/**
 * Configura la funcionalidad del escáner y sus eventos.
 */
function setupScanner() {
    const fab = document.getElementById('fabScan');
    const overlay = document.getElementById('scanOverlay');
    const closeBtn = document.getElementById('closeScan');
    const scanResult = document.getElementById('scanResult');
    const scannerView = document.getElementById('scannerView');

    fab.addEventListener('click', async () => {
        overlay.classList.remove('hidden');
        scanResult.classList.add('hidden');
        scannerView.innerHTML = '<div id="qr-reader" style="width:100%"></div>';

        try {
            await startScanner('qr-reader', async (code) => {
                await stopScanner();
                await handleScannedCode(code);
            });
        } catch (err) {
            showToast(err.message, 'error');
            overlay.classList.add('hidden');
        }
    });

    closeBtn.addEventListener('click', async () => {
        await stopScanner();
        overlay.classList.add('hidden');
    });

    document.getElementById('btnEntrada')?.addEventListener('click', async () => {
        const sku = document.getElementById('scanProductSKU').textContent;
        try {
            const { registrarMovimiento } = await import('./data/db.js');
            const newStock = await registrarMovimiento(sku, 'entrada', 1);
            document.getElementById('scanProductStock').textContent = newStock;
            showToast(`+1 entrada → Stock: ${newStock}`, 'success');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    document.getElementById('btnSalida')?.addEventListener('click', async () => {
        const sku = document.getElementById('scanProductSKU').textContent;
        try {
            const producto = await db.productos.get(sku);
            if (producto.stock <= 0) {
                showToast('Stock ya está en 0', 'error');
                return;
            }
            const { registrarMovimiento } = await import('./data/db.js');
            const newStock = await registrarMovimiento(sku, 'salida', 1);
            document.getElementById('scanProductStock').textContent = newStock;
            showToast(`-1 salida → Stock: ${newStock}`, 'success');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });
}

/**
 * Procesa un código escaneado para buscar el producto.
 * @param {string} code - El SKU escaneado.
 */
async function handleScannedCode(code) {
    const scanResult = document.getElementById('scanResult');
    const producto = await db.productos.get(code);

    if (!producto) {
        showToast(`SKU no encontrado: ${code}`, 'error');
        scanResult.classList.add('hidden');
        return;
    }

    document.getElementById('scanProductName').textContent = producto.modelo;
    document.getElementById('scanProductSKU').textContent = producto.sku;
    document.getElementById('scanProductStock').textContent = producto.stock;
    scanResult.classList.remove('hidden');
}

/**
 * Detecta cambios en el estado de conexión y actualiza la UI.
 */
function setupOfflineDetection() {
    const statusDot = document.querySelector('.status-dot');
    const statusLabel = document.querySelector('.status-label');

    function updateStatus() {
        if (navigator.onLine) {
            statusDot.className = 'status-dot status-dot--online';
            statusLabel.textContent = 'Online';
        } else {
            statusDot.className = 'status-dot';
            statusLabel.textContent = 'Offline';
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

/**
 * Registra el Service Worker para capacidades PWA.
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
        } catch (err) {
            console.log('SW registration failed:', err);
        }
    }
}

// Inicializar la aplicación
initializeApplication();
