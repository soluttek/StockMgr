import db, { registrarMovimiento } from '../data/db.js';
import { parseSKU } from '../modules/sku-engine.js';
import { getStockLevel } from '../modules/alerts.js';
import { showToast } from '../utils/dom.js';

export default async function renderProductDetail(container, sku) {
    const producto = await db.productos.get(sku);

    if (!producto) {
        container.innerHTML = `
      <button class="back-btn" onclick="history.back()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver
      </button>
      <div class="empty-state">
        <p>Producto no encontrado: ${sku}</p>
      </div>
    `;
        return;
    }

    const parsed = parseSKU(sku);
    const level = getStockLevel(producto.stock);

    container.innerHTML = `
    <button class="back-btn" id="backBtn">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Volver
    </button>

    <div class="detail-header">
      <div class="detail-header__model">${producto.modelo}</div>
      <div class="detail-header__sku">${sku}</div>
    </div>

    <div class="detail-meta">
      <div class="detail-meta__item">
        <div class="detail-meta__label">Categoría</div>
        <div class="detail-meta__value">${parsed.categoriaNombre}</div>
      </div>
      <div class="detail-meta__item">
        <div class="detail-meta__label">Marca</div>
        <div class="detail-meta__value">${parsed.marcaNombre}</div>
      </div>
      <div class="detail-meta__item">
        <div class="detail-meta__label">Estado</div>
        <div class="detail-meta__value">${parsed.estadoNombre}</div>
      </div>
      <div class="detail-meta__item">
        <div class="detail-meta__label">Condición</div>
        <div class="detail-meta__value">${parsed.condicionNombre}</div>
      </div>
    </div>

    <div class="card">
      <h3 class="section-title">Ajustar Stock</h3>
      <div class="stock-adjust">
        <button class="stock-adjust__btn stock-adjust__btn--minus" id="btnMinus">−</button>
        <div class="stock-adjust__value stock-badge--${level}" id="stockDisplay">${producto.stock}</div>
        <button class="stock-adjust__btn stock-adjust__btn--plus" id="btnPlus">+</button>
      </div>
    </div>

    <div class="mt-4">
      <h3 class="section-title">Detalle</h3>
      <div class="card">
        <p><strong>Pieza:</strong> ${producto.detalle || 'N/A'}</p>
        <p class="mt-2"><strong>Compatibilidad:</strong> ${producto.compatibilidad || 'N/A'}</p>
        <p class="mt-2 text-muted" style="font-size:var(--fs-xs)">Modelo ID: ${parsed.modeloId}</p>
      </div>
    </div>

    <div class="mt-4">
      <h3 class="section-title">Movimientos Recientes</h3>
      <div id="movimientos" class="product-list"></div>
    </div>
  `;

    const stockDisplay = container.querySelector('#stockDisplay');

    container.querySelector('#backBtn').addEventListener('click', () => history.back());

    container.querySelector('#btnPlus').addEventListener('click', async () => {
        try {
            const newStock = await registrarMovimiento(sku, 'entrada', 1);
            updateStockDisplay(stockDisplay, newStock);
            showToast(`+1 entrada → Stock: ${newStock}`, 'success');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    container.querySelector('#btnMinus').addEventListener('click', async () => {
        try {
            const currentProduct = await db.productos.get(sku);
            if (currentProduct.stock <= 0) {
                showToast('Stock ya está en 0', 'error');
                return;
            }
            const newStock = await registrarMovimiento(sku, 'salida', 1);
            updateStockDisplay(stockDisplay, newStock);
            showToast(`-1 salida → Stock: ${newStock}`, 'success');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    await loadMovimientos(container.querySelector('#movimientos'), sku);
}

function updateStockDisplay(el, stock) {
    el.textContent = stock;
    const level = getStockLevel(stock);
    el.className = `stock-adjust__value stock-badge--${level}`;
}

async function loadMovimientos(container, sku) {
    const movimientos = await db.movimientos
        .where('sku').equals(sku)
        .reverse()
        .limit(10)
        .toArray();

    if (movimientos.length === 0) {
        container.innerHTML = '<p class="text-muted" style="font-size:var(--fs-sm);padding:var(--sp-3)">Sin movimientos registrados</p>';
        return;
    }

    container.innerHTML = '';
    for (const m of movimientos) {
        const isEntrada = m.tipo === 'entrada';
        const date = new Date(m.timestamp);
        const timeStr = date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

        container.innerHTML += `
      <div class="product-item">
        <div class="product-item__info">
          <div class="product-item__name" style="color:${isEntrada ? 'var(--entrada)' : 'var(--salida)'}">
            ${isEntrada ? '↑ Entrada' : '↓ Salida'} ×${m.cantidad}
          </div>
          <div class="product-item__sku">${timeStr}</div>
        </div>
        <div class="stock-badge" style="font-size:var(--fs-xs);color:var(--text-muted)">
          ${m.stockAnterior ?? '?'} → ${m.stockNuevo ?? '?'}
        </div>
      </div>
    `;
    }
}
