import categoriasData from "../data/categorias.json";
import db from "../data/db.js";
import marcasData from "../data/marcas.json";
import { getStockLevel } from "../modules/alerts.js";
import { createElement, setupDragScroll } from "../utils/dom.js";

let currentFilter = { categoria: "", marca: "", search: "", exactMode: false };

export default async function renderInventoryList(container, params = {}) {
	// Resetear filtros al entrar para evitar estados "fantasma"
	currentFilter = {
		categoria: "",
		marca: params.marca || "",
		search: (params.q || "").toLowerCase(),
		exactMode: false,
	};

	container.innerHTML = `
    <div class="search-header">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" id="searchInput" placeholder="Buscar por modelo o SKU..." autocomplete="off">
      </div>
      <div class="search-controls">
         <label class="search-toggle">
            <input type="checkbox" id="exactSearchToggle">
            <span class="toggle-track"></span>
            <span class="toggle-text">Búsqueda Exacta</span>
         </label>
      </div>
    </div>

    <div class="filter-chips" id="categoryFilters"></div>
    <div class="filter-chips mb-4" id="brandFilters"></div>

    <div class="product-list" id="productList"></div>
  `;

	const categorias = Object.entries(categoriasData);
	const marcas = Object.entries(marcasData);
	const catContainer = container.querySelector("#categoryFilters");
	const brandContainer = container.querySelector("#brandFilters");

	catContainer.appendChild(
		createElement("button", {
			className: "chip active",
			textContent: "Todas",
			onClick: () => setFilter("categoria", ""),
		}),
	);

	for (const [code, name] of categorias) {
		catContainer.appendChild(
			createElement("button", {
				className: "chip",
				textContent: name,
				"data-code": code,
				onClick: () => setFilter("categoria", code),
			}),
		);
	}

	brandContainer.appendChild(
		createElement("button", {
			className: "chip active",
			textContent: "Todas",
			onClick: () => setFilter("marca", ""),
		}),
	);

	for (const [code, name] of marcas) {
		brandContainer.appendChild(
			createElement("button", {
				className: "chip",
				textContent: name,
				"data-code": code,
				onClick: () => setFilter("marca", code),
			}),
		);
	}

	const searchInput = container.querySelector("#searchInput");
	searchInput.value = currentFilter.search;

	const exactToggle = container.querySelector("#exactSearchToggle");
	exactToggle.checked = currentFilter.exactMode;

	// Habilitar arrastre con ratón (Desktop UX)
	setupDragScroll(catContainer);
	setupDragScroll(brandContainer);

	let debounce;
	searchInput.addEventListener("input", (e) => {
		clearTimeout(debounce);
		debounce = setTimeout(() => {
			currentFilter.search = e.target.value.toLowerCase();
			refreshProductList(container);
		}, 200);
	});

	exactToggle.addEventListener("change", (e) => {
		currentFilter.exactMode = e.target.checked;
		refreshProductList(container);
	});

	await refreshProductList(container);

	// Si venimos con una marca pre-filtrada por URL, marcamos el chip correspondiente
	if (currentFilter.marca) {
		brandContainer
			.querySelectorAll(".chip")
			.forEach((c) => c.classList.remove("active"));
		brandContainer
			.querySelector(`[data-code="${currentFilter.marca}"]`)
			?.classList.add("active");
	}

	function setFilter(type, value) {
		currentFilter[type] = value;
		const parent = type === "categoria" ? catContainer : brandContainer;
		parent
			.querySelectorAll(".chip")
			.forEach((c) => c.classList.remove("active"));
		if (value === "") {
			parent.querySelector(".chip").classList.add("active");
		} else {
			parent.querySelector(`[data-code="${value}"]`)?.classList.add("active");
		}
		refreshProductList(container);
	}
}

async function refreshProductList(container) {
	const listEl = container.querySelector("#productList");
	let products = await db.productos.toArray();

	if (products.length === 0) {
		listEl.innerHTML = renderEmptyState("No hay productos en la base de datos");
		return;
	}

	// Aplicar filtros
	if (currentFilter.categoria) {
		products = products.filter((p) => p.categoria === currentFilter.categoria);
	}
	if (currentFilter.marca) {
		products = products.filter((p) => p.marca === currentFilter.marca);
	}

	const query = (currentFilter.search || "").toLowerCase();
	if (query) {
		// Obtenemos palabras significativas (evitamos "galaxy", "huawei", "moto" etc si buscamos algo más específico)
		const commonWords = [
			"galaxy",
			"samsung",
			"huawei",
			"motorola",
			"moto",
			"xiaomi",
			"redmi",
			"poco",
			"honor",
			"oppo",
		];
		let keywords = query.split(" ").filter((word) => word.length > 0);

		// Si hay varias palabras, intentamos no filtrar solo por la marca
		if (keywords.length > 1) {
			keywords = keywords.filter((w) => !commonWords.includes(w));
		}

		products = products.filter((p) => {
			const modelName = p.modelo.toLowerCase();
			const sku = p.sku.toLowerCase();
			const detalle = (p.detalle || "").toLowerCase();

			if (currentFilter.exactMode) {
				// MODO EXACTO INTELIGENTE: Coincidencia total o sufijo exacto precedido por espacio
				// (ej: "A3" debe encontrar "Samsung Galaxy A3" pero no "A30")
				const isExactModel =
					modelName === query || modelName.endsWith(" " + query);
				return isExactModel || sku === query;
			} else {
				// MODO FAMILIA/EXPANSIVO (OR Inteligente):
				// Queremos encontrar cualquier producto que coincida con ALGUNA de las palabras clave en el modelo
				// Ej: "Y5 2018" -> encuentra "Y5", "Y5 Pro", "Y5 2018"

				// Calculamos un "score" de coincidencia
				let matchScore = 0;

				keywords.forEach((kw) => {
					const inModel = modelName.includes(kw);
					if (inModel) matchScore += 2; // Las coincidencias en modelo valen más
				});

				// Si no hay coincidencias directas en el modelo, probamos el SKU/Detalle como último recurso
				if (matchScore === 0) {
					const hasAnyMatch = keywords.some((kw) => {
						// Protegemos el SKU del ruido si la palabra es muy corta (<3 letras)
						const inSku = kw.length >= 3 && sku.includes(kw);
						const inDetalle = detalle.includes(kw);
						return inSku || inDetalle;
					});
					if (hasAnyMatch) matchScore += 1;
				}

				// Guardamos el score temporalmente para la ordenación
				if (matchScore > 0) p._searchScore = matchScore;

				return matchScore > 0;
			}
		});
	}

	// Ordenar por relevancia (A3 antes que A30s)
	products.sort((a, b) => {
		if (query) {
			const nameA = a.modelo.toLowerCase();
			const nameB = b.modelo.toLowerCase();

			// 0. Prioridad Total: Switch de modo exacto
			if (currentFilter.exactMode) return 0; // El filtro ya hizo todo el trabajo duro

			// 1. Prioridad: Coincidencia de string idéntico (ignorando prefijos)
			const exactSufA = nameA === query || nameA.endsWith(" " + query);
			const exactSufB = nameB === query || nameB.endsWith(" " + query);
			if (exactSufA && !exactSufB) return -1;
			if (!exactSufA && exactSufB) return 1;

			// 2. Prioridad: Score de búsqueda (más palabras coincidentes = arriba)
			const scoreA = a._searchScore || 0;
			const scoreB = b._searchScore || 0;
			if (scoreA !== scoreB) {
				return scoreB - scoreA; // Orden descendente (mayor score primero)
			}

			// 3. Prioridad: Empieza por
			const startsA = nameA.startsWith(query);
			const startsB = nameB.startsWith(query);
			if (startsA && !startsB) return -1;
			if (!startsA && startsB) return 1;

			// 4. Prioridad: Longitud de cadena (más corto = más específico/base, ej: Y5 antes que Y5 Pro)
			if (nameA.length !== nameB.length) {
				return nameA.length - nameB.length;
			}
		}

		// 5. Prioridad: Stock
		return a.stock - b.stock;
	});

	// Limpiamos los scores temporales
	if (query && !currentFilter.exactMode) {
		products.forEach((p) => delete p._searchScore);
	}

	if (products.length === 0) {
		listEl.innerHTML = renderEmptyState("No se encontraron coincidencias");
		return;
	}

	listEl.innerHTML = "";
	products.forEach((p) => {
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

	return createElement(
		"a",
		{
			className:
				`product-item product-item--${level === "ok" ? "" : level}`.trim(),
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
					textContent: `${catName} · ${p.detalle || ""}`,
				}),
			]),
			createElement("div", {
				className: `stock-badge stock-badge--${level}`,
				textContent: String(p.stock),
			}),
		],
	);
}
