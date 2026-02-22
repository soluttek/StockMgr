import db from '../data/db.js';
import { createElement, showToast } from '../utils/dom.js';

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

        <div class="add-form">
            <div class="form-row">
                <input type="text" id="inputModelName" placeholder="Nombre del modelo (ej: Galaxy A14)" style="flex:1">
                <input type="text" id="inputModelId" placeholder="ID (Auto)" maxlength="3" readonly style="max-width:80px; text-align:center; font-family:var(--font-mono); background:var(--bg-secondary)">
                <button class="btn btn--primary" id="btnAddModel" style="white-space:nowrap">Añadir</button>
            </div>
            <div class="form-row mt-2">
                <textarea id="inputBulkModels" placeholder="Carga masiva (un modelo por línea)" rows="2" style="width:100\%; padding:var(--sp-2); border-radius:var(--radius-md); background:var(--bg-elevated); color:var(--text-primary); border:1px solid rgba(255,255,255,0.1); outline:none; font-family:inherit; resize:none"></textarea>
                <button class="btn btn--secondary" id="btnAddBulkModels" style="height:auto">Carga Masiva</button>
            </div>
        </div>

        <div class="search-bar mt-4">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" id="searchModels" placeholder="Buscar modelos...">
        </div>

        <div id="modelsList" class="brand-list"></div>
    `;

    const inputName = container.querySelector('#inputModelName');
    const inputId = container.querySelector('#inputModelId');
    const inputBulk = container.querySelector('#inputBulkModels');
    const btnAdd = container.querySelector('#btnAddModel');
    const btnBulk = container.querySelector('#btnAddBulkModels');
    const btnBack = container.querySelector('#btnBackBrands');
    const searchInput = container.querySelector('#searchModels');

    // Auto-generación de ID al escribir nombre
    inputName.addEventListener('input', async () => {
        if (!inputName.value.trim()) {
            inputId.value = '';
            return;
        }
        if (!inputId.value) {
            inputId.value = await getNextModelId();
        }
    });

    btnBack.addEventListener('click', () => {
        window.location.hash = '/marcas';
    });

    btnAdd.addEventListener('click', async () => {
        const nombre = inputName.value.trim();
        const modeloId = inputId.value;

        if (!nombre) return showToast('Escribe un nombre de modelo', 'error');

        // Verificar duplicados case-insensitive
        const exists = await db.modelos
            .where('nombre')
            .equalsIgnoreCase(nombre)
            .first();

        if (exists) {
            return showToast(`⚠️ El modelo "${nombre}" ya existe`, 'error');
        }

        try {
            await db.modelos.add({
                modeloId,
                nombre,
                marcaCodigo
            });
            showToast(`✅ Modelo ${nombre} agregado`, 'success');
            inputName.value = '';
            inputId.value = '';
            await renderModelList(container, marcaCodigo);
        } catch (e) {
            showToast('Error: El ID de modelo ya existe o es inválido', 'error');
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
    listEl.innerHTML = '';

    const allModels = await db.modelos.where('marcaCodigo').equals(marcaCodigo).toArray();
    const filteredModels = allModels.filter(m =>
        m.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        m.modeloId.includes(filter)
    ).sort((a, b) => a.nombre.localeCompare(b.nombre));

    if (filteredModels.length === 0) {
        listEl.innerHTML = '<div class="text-center text-muted mt-4">No hay modelos registrados</div>';
        return;
    }

    filteredModels.forEach(model => {
        const item = createElement('div', { className: 'brand-item' }, [
            createElement('span', { className: 'brand-item__code', textContent: model.modeloId }),
            createElement('span', { className: 'brand-item__name', textContent: model.nombre }),
            createElement('button', {
                className: 'btn-icon',
                innerHTML: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
                onclick: async (e) => {
                    e.stopPropagation();
                    if (confirm(`¿Eliminar el modelo ${model.nombre}?`)) {
                        await db.modelos.delete(model.id);
                        renderModelList(container, marcaCodigo, filter);
                    }
                }
            })
        ]);
        listEl.appendChild(item);
    });
}

async function getNextModelId() {
    const all = await db.modelos.toArray();
    if (all.length === 0) return '001';

    const ids = all.map(m => parseInt(m.modeloId)).filter(n => !isNaN(n));
    if (ids.length === 0) return '001';

    const max = Math.max(...ids);
    return (max + 1).toString().padStart(3, '0');
}
