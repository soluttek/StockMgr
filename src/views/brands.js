import db from "../data/db.js";
import marcasData from "../data/marcas.json";
import { createElement, showToast } from "../utils/dom.js";

export default async function renderBrands(container) {
	container.innerHTML = `
    <h2 class="section-title">Gestión de Marcas</h2>

    <div class="add-form">
      <input type="text" id="inputCodigo" placeholder="Código (3 chars)" maxlength="3" style="max-width:100px;text-transform:uppercase;font-family:var(--font-mono)">
      <input type="text" id="inputNombre" placeholder="Nombre de marca">
      <button class="btn btn--primary" id="btnAddBrand" style="padding:var(--sp-3) var(--sp-4)">Añadir</button>
    </div>

    <div id="brandList" class="brand-list"></div>
  `;

	await renderBrandList(container);

	container
		.querySelector("#btnAddBrand")
		.addEventListener("click", async () => {
			const codigo = container
				.querySelector("#inputCodigo")
				.value.toUpperCase()
				.trim();
			const nombre = container.querySelector("#inputNombre").value.trim();

			if (!codigo || codigo.length !== 3) {
				showToast("El código debe tener exactamente 3 caracteres", "error");
				return;
			}

			if (!nombre) {
				showToast("El nombre no puede estar vacío", "error");
				return;
			}

			if (/[^A-Z]/.test(codigo)) {
				showToast("El código solo puede contener letras (A-Z)", "error");
				return;
			}

			const existsInJSON = marcasData[codigo];
			const existsInDB = await db.marcas.where("codigo").equals(codigo).first();

			if (existsInJSON || existsInDB) {
				showToast(
					`⚠️ La marca "${codigo}" ya existe: ${existsInJSON || existsInDB.nombre}`,
					"error",
				);
				return;
			}

			const existingName = await db.marcas
				.where("nombre")
				.equalsIgnoreCase(nombre)
				.first();
			if (existingName) {
				showToast(
					`⚠️ Ya existe una marca con nombre "${existingName.nombre}" (${existingName.codigo})`,
					"error",
				);
				return;
			}

			await db.marcas.add({ codigo, nombre });
			marcasData[codigo] = nombre;

			container.querySelector("#inputCodigo").value = "";
			container.querySelector("#inputNombre").value = "";

			showToast(`✅ Marca ${codigo} - ${nombre} agregada`, "success");
			await renderBrandList(container);
		});
}

async function renderBrandList(container) {
	const listEl = container.querySelector("#brandList");
	listEl.innerHTML = "";

	const allBrands = [];

	for (const [codigo, nombre] of Object.entries(marcasData)) {
		const count = await db.productos.where("marca").equals(codigo).count();
		allBrands.push({ codigo, nombre, count, source: "json" });
	}

	const dbBrands = await db.marcas.toArray();
	for (const brand of dbBrands) {
		if (!marcasData[brand.codigo]) {
			const count = await db.productos
				.where("marca")
				.equals(brand.codigo)
				.count();
			allBrands.push({
				codigo: brand.codigo,
				nombre: brand.nombre,
				count,
				source: "db",
			});
		}
	}

	allBrands.sort((a, b) => a.nombre.localeCompare(b.nombre));

	for (const brand of allBrands) {
		const item = createElement(
			"div",
			{
				className: "brand-item",
				style: "cursor:pointer",
			},
			[
				createElement("span", {
					className: "brand-item__code",
					textContent: brand.codigo,
				}),
				createElement("span", {
					className: "brand-item__name",
					textContent: brand.nombre,
				}),
				createElement("span", {
					className: "brand-item__count",
					textContent: `${brand.count} prod.`,
				}),
			],
		);

		item.addEventListener("click", () => {
			window.location.hash = `/marcas/${brand.codigo}/modelos`;
		});

		listEl.appendChild(item);
	}
}
