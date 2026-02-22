import db from '../data/db.js';
import { getStockLevel, filterCriticalProducts } from '../modules/alerts.js';
import categoriasData from '../data/categorias.json';
import { createElement } from '../utils/dom.js';

export default async function renderDashboard(container) {
    const productos = await db.productos.toArray();
    const totalItems = productos.length;
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const critical = filterCriticalProducts(productos);
    const categoryCounts = {};

    for (const p of productos) {
        const catName = categoriasData[p.categoria] || p.categoria;
        categoryCounts[catName] = (categoryCounts[catName] || 0) + p.stock;
    }

    container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card stat-card--accent">
        <div class="stat-card__value">${totalItems}</div>
        <div class="stat-card__label">Productos</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${totalStock}</div>
        <div class="stat-card__label">Unidades Total</div>
      </div>
      <div class="stat-card stat-card--danger">
        <div class="stat-card__value">${critical.length}</div>
        <div class="stat-card__label">Stock Crítico</div>
      </div>
      <div class="stat-card stat-card--warning">
        <div class="stat-card__value">${Object.keys(categoryCounts).length}</div>
        <div class="stat-card__label">Categorías</div>
      </div>
    </div>

    <h3 class="section-title">Por Categoría</h3>
    <div class="product-list mb-4" id="categoryBreakdown"></div>

    <h3 class="section-title">⚠️ Stock Crítico</h3>
    <div class="product-list" id="criticalList"></div>
  `;

    const catContainer = container.querySelector('#categoryBreakdown');
    for (const [catName, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
        catContainer.appendChild(createElement('div', { className: 'product-item' }, [
            createElement('div', { className: 'product-item__info' }, [
                createElement('div', { className: 'product-item__name', textContent: catName })
            ]),
            createElement('div', { className: 'stock-badge stock-badge--ok', textContent: String(count) })
        ]));
    }

    const criticalContainer = container.querySelector('#criticalList');
    if (critical.length === 0) {
        criticalContainer.innerHTML = `
      <div class="empty-state">
        <p>✅ No hay productos con stock crítico</p>
      </div>
    `;
        return;
    }

    for (const p of critical.sort((a, b) => a.stock - b.stock)) {
        const level = getStockLevel(p.stock);
        const item = createElement('a', {
            className: `product-item product-item--${level}`,
            href: `#/producto/${p.sku}`
        }, [
            createElement('div', { className: 'product-item__info' }, [
                createElement('div', { className: 'product-item__name', textContent: p.modelo }),
                createElement('div', { className: 'product-item__sku', textContent: p.sku }),
                createElement('div', { className: 'product-item__category', textContent: categoriasData[p.categoria] || p.categoria })
            ]),
            createElement('div', { className: `stock-badge stock-badge--${level}`, textContent: String(p.stock) })
        ]);
        criticalContainer.appendChild(item);
    }
}
