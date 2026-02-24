import db from '../data/db.js';
import { createElement, showToast, showCustomModal } from '../utils/dom.js';
import { navigate } from '../router.js';

export default async function renderModels(container, params) {
    const { codigo: marcaCodigo } = params;
    const marca = await db.marcas.where('codigo').equals(marcaCodigo).first();
    const marcaNombre = marca ? marca.nombre : marcaCodigo;

    container.innerHTML = `
        <div class="view-header">
            <button class="back-btn" id="btnBackBrands">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Volver a Marcas
            </button>
            <h2 class="section-title">Modelos de <span class="accent">${marcaNombre}</span></h2>
        </div>

        <div class="card card--premium mb-6">
            <div class="form-group">
                <label>Nuevo Modelo</label>
                <input type="text" id="inputModelName" placeholder="Nombre (ej: Galaxy A14)" class="mb-3">
                <button class="btn btn--primary w-full" id="btnAddModel">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:8px">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Añadir este modelo
                </button>
            </div>
            
            <details class="bulk-collapse mt-4">
                <summary class="text-muted" style="font-size:var(--fs-xs); cursor:pointer">Carga Masiva (Opciones avanzadas)</summary>
                <div class="mt-4">
                    <textarea id="inputBulkModels" placeholder="Un modelo por línea..." rows="3" 
                               style="width:100%; border-radius:var(--radius-md); background:var(--bg-secondary); border:1px solid rgba(255,255,255,0.1); color:white; padding:var(--sp-2); resize:none"></textarea>
                    <button class="btn btn--secondary mt-2 w-full" id="btnAddBulkModels">Procesar Carga Masiva</button>
                </div>
            </details>
        </div>

        <div class="search-bar mt-4">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" id="searchModels" placeholder="Filtrar por nombre o ID...">
        </div>

        <div id="modelsList" class="brand-list clickable-list"></div>
    `;

    const inputName = container.querySelector('#inputModelName');
    const inputBulk = container.querySelector('#inputBulkModels');
    const btnAdd = container.querySelector('#btnAddModel');
    const btnBulk = container.querySelector('#btnAddBulkModels');
    const btnBack = container.querySelector('#btnBackBrands');
    const searchInput = container.querySelector('#searchModels');

    btnBack.addEventListener('click', () => {
        window.location.hash = '/marcas';
    });

    btnAdd.addEventListener('click', async () => {
        const nombre = inputName.value.trim();
        if (!nombre) return showToast('Escribe un nombre de modelo', 'error');

        // Verificar duplicados case-insensitive por nombre
        const exists = await db.modelos
            .where('nombre')
            .equalsIgnoreCase(nombre)
            .first();

        if (exists) {
            return showToast(`⚠️ El modelo "${nombre}" ya existe`, 'error');
        }

        try {
            const nextId = await getNextModelId();
            await db.modelos.add({
                modeloId: nextId,
                nombre,
                marcaCodigo
            });
            showToast(`✅ Modelo ${nombre} agregado`, 'success');
            inputName.value = '';
            await renderModelList(container, marcaCodigo);
        } catch (e) {
            showToast('Error al agregar el modelo', 'error');
        }
    });

    btnBulk.addEventListener('click', async () => {
        const modelsRaw = inputBulk.value.split('\n').map(m => m.trim()).filter(m => m);
        if (modelsRaw.length === 0) return showToast('Escribe al menos un modelo', 'error');

        let added = 0;
        let skipped = 0;

        for (const nombre of modelsRaw) {
            // Verificar duplicados en DB (insensible a mayúsculas)
            const exists = await db.modelos
                .where('nombre')
                .equalsIgnoreCase(nombre)
                .first();

            if (exists) {
                skipped++;
                continue;
            }

            const nextId = await getNextModelId();
            try {
                await db.modelos.add({
                    modeloId: nextId,
                    nombre,
                    marcaCodigo
                });
                added++;
            } catch (e) {
                skipped++;
            }
        }

        showToast(`✅ ${added} modelos agregados${skipped ? `. ⚠️ ${skipped} fallaron/duplicados` : ''}`, added > 0 ? 'success' : 'error');
        inputBulk.value = '';
        await renderModelList(container, marcaCodigo);
    });

    searchInput.addEventListener('input', () => renderModelList(container, marcaCodigo, searchInput.value));

    await renderModelList(container, marcaCodigo);
}

async function renderModelList(container, marcaCodigo, filter = '') {
    const listEl = container.querySelector('#modelsList');
    if (!listEl) return;
    listEl.innerHTML = '';

    const marca = await db.marcas.where('codigo').equals(marcaCodigo).first();
    const marcaNombre = marca ? marca.nombre : '';

    const allModels = await db.modelos.where('marcaCodigo').equals(marcaCodigo).toArray();

    // Obtener conteos de productos reales para esta marca
    const productCounts = await db.productos
        .where('marca')
        .equals(marcaCodigo)
        .toArray();

    const countMap = {};
    productCounts.forEach(p => {
        countMap[p.modeloId] = (countMap[p.modeloId] || 0) + 1;
    });

    const filteredModels = allModels.filter(m =>
        m.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        m.modeloId.includes(filter)
    ).sort((a, b) => a.nombre.localeCompare(b.nombre));

    if (filteredModels.length === 0) {
        listEl.innerHTML = '<div class="text-center text-muted mt-4">No hay modelos registrados</div>';
        return;
    }

    filteredModels.forEach(model => {
        const fullModelName = `${marcaNombre} ${model.nombre}`;
        const item = createElement('div', {
            className: 'brand-item',
            style: 'cursor:pointer; transition:all 0.2s',
            onclick: () => {
                navigate(`/inventario?q=${model.nombre}`);
            }
        }, [
            createElement('span', { className: 'brand-item__code', textContent: model.modeloId }),
            createElement('span', { className: 'brand-item__name', textContent: fullModelName }),
            createElement('span', {
                className: 'brand-item__count',
                textContent: `${countMap[model.modeloId] || 0} prod.`
            }),
            createElement('button', {
                className: 'btn-icon',
                innerHTML: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
                onclick: async (e) => {
                    e.stopPropagation();
                    const confirmed1 = await showCustomModal({
                        title: 'Eliminar Modelo',
                        message: `¿Estás seguro de que deseas eliminar el modelo ${model.nombre}?`,
                        confirmText: 'Siguiente',
                        cancelText: 'Cancelar'
                    });

                    if (confirmed1) {
                        const confirmed2 = await showCustomModal({
                            title: '🚨 Confirmación de Seguridad',
                            message: `¿SEGURO que quieres eliminar este modelo? Esta acción es definitiva y no se puede deshacer.`,
                            confirmText: 'SÍ, ELIMINAR AHORA',
                            cancelText: 'No, esperar'
                        });

                        if (confirmed2) {
                            await db.modelos.delete(model.id);
                            showToast(`Modelo ${model.nombre} eliminado`, 'info');
                            renderModelList(container, marcaCodigo, filter);
                        }
                    }
                }
            })
        ]);
        listEl.appendChild(item);
    });
}

async function getNextModelId() {
    const all = await db.modelos.toArray();
    const productIds = await db.productos.toArray();

    // Extraer todos los IDs numéricos usados tanto en el maestro de modelos como en productos sueltos
    const ids = [
        ...all.map(m => parseInt(m.modeloId)),
        ...productIds.map(p => parseInt(p.modeloId))
    ].filter(n => !isNaN(n));

    if (ids.length === 0) return '0001';

    const max = Math.max(...ids);
    return (max + 1).toString().padStart(4, '0');
}
