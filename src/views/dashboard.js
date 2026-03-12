import categoriasData from "../data/categorias.json";
import db from "../data/db.js";
import { filterCriticalProducts, getStockLevel } from "../modules/alerts.js";
import { createElement } from "../utils/dom.js";

let activeCategoryFilter = null;

export default async function renderDashboard(container) {
	const productos = await db.productos.toArray();
	const totalItems = productos.length;
	const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
	const critical = filterCriticalProducts(productos);
	const categoryCountsArr = [];

	const counts = {};
	for (const p of productos) {
		counts[p.categoria] = (counts[p.categoria] || 0) + p.stock;
	}

	for (const [catId, count] of Object.entries(counts)) {
		categoryCountsArr.push({
			id: catId,
			nombre: categoriasData[catId] || catId,
			count,
		});
	}

	container.innerHTML = `
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card stat-card--accent">
        <div class="stat-card__value">${totalItems}</div>
        <div class="stat-card__label">Productos</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${totalStock}</div>
        <div class="stat-card__label">Unidades Total</div>
      </div>
      <div class="stat-card stat-card--danger" style="cursor:pointer" id="btnShowAllCritical">
        <div class="stat-card__value">${critical.length}</div>
        <div class="stat-card__label">Stock Crítico</div>
      </div>
      <div class="stat-card stat-card--warning">
        <div class="stat-card__value">${categoryCountsArr.length}</div>
        <div class="stat-card__label">Categorías</div>
      </div>
    </div>

    <h3 class="section-title">Por Categoría <span style="text-transform:none; font-weight:400; font-size:10px; opacity:0.6; margin-left:8px">(Toca para filtrar)</span></h3>
    <div class="category-grid" id="categoryBreakdown"></div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--sp-2)">
        <h3 class="section-title" style="margin-bottom:0">⚠️ Stock Crítico</h3>
        <span id="activeFilterLabel" style="font-size:var(--fs-xs); color:var(--accent); font-weight:600"></span>
    </div>
    <div class="product-list" id="criticalList"></div>
  `;

	const catContainer = container.querySelector("#categoryBreakdown");
	const criticalContainer = container.querySelector("#criticalList");
	const filterLabel = container.querySelector("#activeFilterLabel");

	// Listener para el card de Stock Crítico para resetear filtro
	container.querySelector("#btnShowAllCritical").onclick = () => {
		activeCategoryFilter = null;
		renderDashboard(container);
	};

	// Función para renderizar la lista crítica filtrada
	const renderCriticalItems = () => {
		criticalContainer.innerHTML = "";
		const filtered = activeCategoryFilter
			? critical.filter((p) => p.categoria === activeCategoryFilter)
			: critical;

		if (activeCategoryFilter) {
			const catName =
				categoriasData[activeCategoryFilter] || activeCategoryFilter;
			filterLabel.textContent = `${catName} (${filtered.length})`;
		} else {
			filterLabel.textContent = "Todos";
		}

		if (filtered.length === 0) {
			criticalContainer.innerHTML = `
                <div class="empty-state">
                    <p>✅ Sin productos críticos ${activeCategoryFilter ? "en esta categoría" : ""}</p>
                </div>
            `;
			return;
		}

		for (const p of filtered.sort((a, b) => a.stock - b.stock)) {
			const level = getStockLevel(p.stock);
			const item = createElement(
				"a",
				{
					className: `product-item product-item--${level}`,
					href: `#/producto/${p.sku}`,
				},
				[
					createElement("div", { className: "product-item__info" }, [
						createElement("div", {
							className: "product-item__name",
							textContent: p.modelo,
						}),
						createElement("div", {
							className: "product-item__sku",
							textContent: p.sku,
						}),
						createElement("div", {
							className: "product-item__category",
							textContent: categoriasData[p.categoria] || p.categoria,
						}),
					]),
					createElement("div", {
						className: `stock-badge stock-badge--${level}`,
						textContent: String(p.stock),
					}),
				],
			);
			criticalContainer.appendChild(item);
		}
	};

	// Renderizar botones de categoría
	for (const cat of categoryCountsArr.sort((a, b) => b.count - a.count)) {
		const card = createElement(
			"div",
			{
				className: `category-card ${activeCategoryFilter === cat.id ? "active" : ""}`,
				onclick: () => {
					activeCategoryFilter =
						activeCategoryFilter === cat.id ? null : cat.id;
					renderDashboard(container);
				},
			},
			[
				createElement("span", {
					className: "category-card__name",
					textContent: cat.nombre,
				}),
				createElement("span", {
					className: "category-card__count",
					textContent: String(cat.count),
				}),
			],
		);
		catContainer.appendChild(card);
	}

	renderCriticalItems();
}
