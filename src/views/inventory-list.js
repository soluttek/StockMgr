import db from '../data/db.js';
import { getStockLevel } from '../modules/alerts.js';
import categoriasData from '../data/categorias.json';
import marcasData from '../data/marcas.json';
import { createElement, setupDragScroll } from '../utils/dom.js';

let currentFilter = { categoria: '', marca: '', search: '' };

export default async function renderInventoryList(container) {
    // Resetear filtros al entrar para evitar estados "fantasma"
    currentFilter = { categoria: '', marca: '', search: '' };

    container.innerHTML = `
    <div class="search-bar">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" id="searchInput" placeholder="Buscar por modelo o SKU..." autocomplete="off">
    </div>

    <div class="filter-chips" id="categoryFilters"></div>
    <div class="filter-chips mb-4" id="brandFilters"></div>

    <div class="product-list" id="productList"></div>
  `;

    const categorias = Object.entries(categoriasData);
    const marcas = Object.entries(marcasData);
    const catContainer = container.querySelector('#categoryFilters');
    const brandContainer = container.querySelector('#brandFilters');

    catContainer.appendChild(createElement('button', {
        className: 'chip active',
        textContent: 'Todas',
        onClick: () => setFilter('categoria', '')
    }));

    for (const [code, name] of categorias) {
        catContainer.appendChild(createElement('button', {
            className: 'chip',
            textContent: name,
            'data-code': code,
            onClick: () => setFilter('categoria', code)
        }));
    }

    brandContainer.appendChild(createElement('button', {
        className: 'chip active',
        textContent: 'Todas',
        onClick: () => setFilter('marca', '')
    }));

    for (const [code, name] of marcas) {
        brandContainer.appendChild(createElement('button', {
            className: 'chip',
            textContent: name,
            'data-code': code,
            onClick: () => setFilter('marca', code)
        }));
    }

    const searchInput = container.querySelector('#searchInput');

    // Habilitar arrastre con ratón (Desktop UX)
    setupDragScroll(catContainer);
    setupDragScroll(brandContainer);

    let debounce;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            currentFilter.search = e.target.value.toLowerCase();
            refreshProductList(container);
        }, 200);
    });

    await refreshProductList(container);

    function setFilter(type, value) {
        currentFilter[type] = value;
        const parent = type === 'categoria' ? catContainer : brandContainer;
        parent.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        if (value === '') {
            parent.querySelector('.chip').classList.add('active');
        } else {
            parent.querySelector(`[data-code="${value}"]`)?.classList.add('active');
        }
        refreshProductList(container);
    }
}

async function refreshProductList(container) {
    const listEl = container.querySelector('#productList');
    let products = await db.productos.toArray();

    // Filtrado reactivo (Clean Code: Early exit si no hay productos)
    if (products.length === 0) {
        listEl.innerHTML = renderEmptyState('No hay productos en la base de datos');
        return;
    }

    // Aplicar filtros
    if (currentFilter.categoria) {
        products = products.filter(p => p.categoria === currentFilter.categoria);
    }
    if (currentFilter.marca) {
        products = products.filter(p => p.marca === currentFilter.marca);
    }
    if (currentFilter.search) {
        const keywords = currentFilter.search.toLowerCase().split(' ').filter(word => word.length > 0);
        products = products.filter(p => {
            const productText = `${p.modelo} ${p.sku} ${p.detalle || ''}`.toLowerCase();
            // Todas las palabras clave deben estar presentes en cualquier orden
            return keywords.every(kw => productText.includes(kw));
        });
    }

    // Ordenar por stock (Prioridad operacional)
    products.sort((a, b) => a.stock - b.stock);

    if (products.length === 0) {
        listEl.innerHTML = renderEmptyState('No se encontraron coincidencias');
        return;
    }

    listEl.innerHTML = '';
    products.forEach(p => {
        listEl.appendChild(createProductItem(p));
    });
}

function renderEmptyState(message) {
    return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
      <p>${message}</p>
    </div>
  `;
}

function createProductItem(p) {
    const level = getStockLevel(p.stock);
    const catName = categoriasData[p.categoria] || p.categoria;

    return createElement('a', {
        className: `product-item product-item--${level === 'ok' ? '' : level}`.trim(),
        href: `#/producto/${p.sku}`
    }, [
        createElement('div', { className: 'product-item__info' }, [
            createElement('div', { className: 'product-item__name', textContent: p.modelo }),
            createElement('div', { className: 'product-item__sku', textContent: p.sku }),
            createElement('div', { className: 'product-item__category', textContent: `${catName} · ${p.detalle || ''}` })
        ]),
        createElement('div', { className: `stock-badge stock-badge--${level}`, textContent: String(p.stock) })
    ]);
}
