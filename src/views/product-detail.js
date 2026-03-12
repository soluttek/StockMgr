import db, { registrarMovimiento } from "../data/db.js";
import { getStockLevel } from "../modules/alerts.js";
import { parseSKU } from "../modules/sku-engine.js";
import { showCustomModal, showToast } from "../utils/dom.js";

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

    <div class="card card--adjust">
      <div class="adjust-header">
        <h3 class="section-title">Control de Inventario</h3>
        <div class="current-stock-badge stock-badge--${level}">
          <span class="label">STOCK:</span>
          <span class="value" id="currentStockDisplay">${producto.stock}</span>
        </div>
      </div>

      <div class="batch-adjust-card">
        <div class="qty-control">
          <button class="qty-btn" id="btnStepMinus" aria-label="Disminuir unidad">−</button>
          <div class="qty-input-wrapper">
             <input type="number" id="inputAdjustQty" value="1" min="1" max="999">
             <span class="qty-label">UNIDADES</span>
          </div>
          <button class="qty-btn" id="btnStepPlus" aria-label="Aumentar unidad">+</button>
        </div>

        <div class="action-buttons-grid">
          <button class="btn-batch btn-batch--salida" id="btnConfirmSalida">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
               <path d="M7 10l5 5 5-5M12 15V3m9 18H3"/>
            </svg>
            Retirar
          </button>
          <button class="btn-batch btn-batch--entrada" id="btnConfirmEntrada">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
               <path d="M7 11l5-5 5 5M12 6v12M3 21h18"/>
            </svg>
            Ingresar
          </button>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="section-title">Detalles Técnicos</h3>
      <div class="card detail-info-card">
        <div class="info-row">
          <span class="info-label">Pieza:</span>
          <span class="info-value">${producto.detalle || "N/A"}</span>
        </div>
        <div class="info-row mt-2">
          <span class="info-label">Compatibilidad:</span>
          <span class="info-value">${producto.compatibilidad || "N/A"}</span>
        </div>
        <div class="info-row mt-3 pt-3 border-top">
           <span class="info-label">Interno:</span>
           <span class="sku-mono">${parsed.modeloId}</span>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="section-title">Historial de Movimientos</h3>
      <div id="movimientos" class="movements-list"></div>
    </div>
  `;

	const stockDisplay = container.querySelector("#currentStockDisplay");
	const inputQty = container.querySelector("#inputAdjustQty");

	container
		.querySelector("#backBtn")
		.addEventListener("click", () => history.back());

	container.querySelector("#btnStepPlus").addEventListener("click", () => {
		inputQty.value = parseInt(inputQty.value) + 1;
	});

	container.querySelector("#btnStepMinus").addEventListener("click", () => {
		inputQty.value = Math.max(1, parseInt(inputQty.value) - 1);
	});

	container
		.querySelector("#btnConfirmEntrada")
		.addEventListener("click", async () => {
			const qty = parseInt(inputQty.value) || 0;
			if (qty <= 0) return;

			const confirmed = await showCustomModal({
				title: "Confirmar Ingreso",
				message: `¿Deseas AGREGAR ${qty} unidades al stock de ${producto.modelo}?`,
				confirmText: "Confirmar Ingreso",
				cancelText: "Cancelar",
			});

			if (confirmed) {
				try {
					const newStock = await registrarMovimiento(sku, "entrada", qty);
					updateStockDisplay(stockDisplay, newStock);
					showToast(`✅ +${qty} unidades agregadas`, "success");
					await loadMovimientos(container.querySelector("#movimientos"), sku);
					inputQty.value = 1;
				} catch (e) {
					showToast(e.message, "error");
				}
			}
		});

	container
		.querySelector("#btnConfirmSalida")
		.addEventListener("click", async () => {
			const qty = parseInt(inputQty.value) || 0;
			if (qty <= 0) return;

			const currentProduct = await db.productos.get(sku);
			if (currentProduct.stock < qty) {
				return showToast(
					`Stock insuficiente. Solo hay ${currentProduct.stock} disponibles.`,
					"error",
				);
			}

			const confirmed = await showCustomModal({
				title: "Confirmar Salida",
				message: `¿Deseas RETIRAR ${qty} unidades del stock de ${producto.modelo}?`,
				confirmText: "Confirmar Retiro",
				cancelText: "Cancelar",
			});

			if (confirmed) {
				try {
					const newStock = await registrarMovimiento(sku, "salida", qty);
					updateStockDisplay(stockDisplay, newStock);
					showToast(`✅ -${qty} unidades retiradas`, "info");
					await loadMovimientos(container.querySelector("#movimientos"), sku);
					inputQty.value = 1;
				} catch (e) {
					showToast(e.message, "error");
				}
			}
		});

	await loadMovimientos(container.querySelector("#movimientos"), sku);
}

function updateStockDisplay(el, stock) {
	el.textContent = stock;
	const level = getStockLevel(stock);
	const badge = el.closest(".current-stock-badge");
	if (badge) {
		badge.className = `current-stock-badge stock-badge--${level}`;
	}
}

async function loadMovimientos(container, sku) {
	const movimientos = await db.movimientos
		.where("sku")
		.equals(sku)
		.reverse()
		.limit(10)
		.toArray();

	if (movimientos.length === 0) {
		container.innerHTML =
			'<p class="text-muted" style="font-size:var(--fs-sm);padding:var(--sp-3)">Sin movimientos registrados</p>';
		return;
	}

	container.innerHTML = "";
	for (const m of movimientos) {
		const isEntrada = m.tipo === "entrada";
		const date = new Date(m.timestamp);
		const timeStr = date.toLocaleDateString("es-MX", {
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});

		container.innerHTML += `
      <div class="product-item">
        <div class="product-item__info">
          <div class="product-item__name" style="color:${isEntrada ? "var(--entrada)" : "var(--salida)"}">
            ${isEntrada ? "↑ Entrada" : "↓ Salida"} ×${m.cantidad}
          </div>
          <div class="product-item__sku">${timeStr}</div>
        </div>
        <div class="stock-badge" style="font-size:var(--fs-xs);color:var(--text-muted)">
          ${m.stockAnterior ?? "?"} → ${m.stockNuevo ?? "?"}
        </div>
      </div>
    `;
	}
}
