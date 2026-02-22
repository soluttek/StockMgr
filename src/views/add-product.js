import db from '../data/db.js';
import { generateSKU, getCategorias, getMarcas, getEstados, getCondiciones } from '../modules/sku-engine.js';
import { showToast } from '../utils/dom.js';

export default async function renderAddProduct(container) {
  const categorias = getCategorias();
  const marcas = getMarcas();
  const estados = getEstados();
  const condiciones = getCondiciones();

  // Cargar todos los modelos desde IndexedDB para el filtrado reactivo
  const allModelos = await db.modelos.toArray();

  container.innerHTML = `
    <h2 class="section-title">Nuevo Producto</h2>

    <div class="sku-preview" id="skuPreview">--------------</div>

    <div class="form-group">
      <label>Categoría</label>
      <select id="selCategoria">
        <option value="">Seleccionar...</option>
        ${categorias.map(c => `<option value="${c.codigo}">${c.codigo} — ${c.nombre}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label>Marca</label>
      <select id="selMarca">
        <option value="">Seleccionar...</option>
        ${marcas.map(m => `<option value="${m.codigo}">${m.codigo} — ${m.nombre}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label>Estado</label>
      <select id="selEstado">
        ${estados.map(e => `<option value="${e.codigo}">${e.codigo} — ${e.nombre}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label>Condición</label>
      <select id="selCondicion">
        ${condiciones.map(c => `<option value="${c.codigo}">${c.codigo} — ${c.nombre}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label>Modelo</label>
      <select id="selModelo">
        <option value="">Seleccionar marca primero...</option>
      </select>
    </div>

    <div class="form-group">
      <label>Stock Inicial</label>
      <input type="number" id="inputStock" value="1" min="0" max="9999">
    </div>

    <button class="btn btn--primary" id="btnGuardar">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
      </svg>
      Guardar Producto
    </button>

    <div id="errorMsg" class="mt-2 text-center" style="color:var(--stock-critical);font-size:var(--fs-sm);display:none"></div>
  `;

  const selCategoria = container.querySelector('#selCategoria');
  const selMarca = container.querySelector('#selMarca');
  const selEstado = container.querySelector('#selEstado');
  const selCondicion = container.querySelector('#selCondicion');
  const selModelo = container.querySelector('#selModelo');
  const inputStock = container.querySelector('#inputStock');
  const preview = container.querySelector('#skuPreview');
  const errorMsg = container.querySelector('#errorMsg');

  /**
   * Actualiza el dropdown de modelos basado en la marca seleccionada.
   */
  function updateModelsDropdown() {
    const brandCode = selMarca.value;
    selModelo.innerHTML = '<option value="">Seleccionar modelo...</option>';

    if (!brandCode) {
      selModelo.innerHTML = '<option value="">Seleccionar marca primero...</option>';
      return;
    }

    // Filtrar modelos vinculados a la marca (usando marcaCodigo inferido en db.js)
    const filtered = allModelos.filter(m => m.marcaCodigo === brandCode);

    if (filtered.length === 0) {
      // Si no hay modelos detectados para esa marca, mostrar una opción genérica o todos
      selModelo.innerHTML += '<option value="">Sin modelos vinculados</option>';
    }

    filtered.forEach(m => {
      const option = document.createElement('option');
      option.value = m.modeloId;
      option.textContent = `${m.modeloId} — ${m.nombre}`;
      selModelo.appendChild(option);
    });

    updatePreview();
  }

  function updatePreview() {
    const cat = selCategoria.value || '___';
    const mar = selMarca.value || '___';
    const est = selEstado.value || '__';
    const con = selCondicion.value || '___';
    const mod = selModelo.value || '___';
    preview.textContent = `${cat}${mar}${est}${con}${mod}`;

    if (cat !== '___' && mar !== '___' && mod !== '___') {
      preview.style.borderColor = 'var(--accent)';
    } else {
      preview.style.borderColor = 'rgba(255,255,255,0.1)';
    }
  }

  // Listeners para reactividad
  selMarca.addEventListener('change', updateModelsDropdown);

  [selCategoria, selEstado, selCondicion, selModelo].forEach(el => {
    el.addEventListener('change', updatePreview);
  });

  container.querySelector('#btnGuardar').addEventListener('click', async () => {
    errorMsg.style.display = 'none';

    try {
      const sku = generateSKU({
        categoria: selCategoria.value,
        marca: selMarca.value,
        estado: selEstado.value,
        condicion: selCondicion.value,
        modeloId: selModelo.value
      });

      const exists = await db.productos.get(sku);
      if (exists) {
        errorMsg.textContent = `⚠️ SKU ya existe: ${sku}. El producto ya está registrado.`;
        errorMsg.style.display = 'block';
        return;
      }

      // Obtener el nombre del modelo desde nuestra lista cargada
      const modeloObj = allModelos.find(m => m.modeloId === selModelo.value);
      const modeloNombre = modeloObj ? modeloObj.nombre : 'Modelo desconocido';
      const stock = parseInt(inputStock.value) || 1;

      await db.productos.add({
        sku,
        modelo: modeloNombre,
        categoria: selCategoria.value,
        marca: selMarca.value,
        estado: selEstado.value,
        condicion: selCondicion.value,
        modeloId: selModelo.value,
        detalle: container.querySelector('#selCategoria option:checked')?.textContent.split('—')[1]?.trim() || '',
        compatibilidad: '[N/A]',
        stock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      showToast(`✅ Producto guardado: ${sku}`, 'success');
      window.location.hash = `/producto/${sku}`;
    } catch (e) {
      errorMsg.textContent = `❌ ${e.message}`;
      errorMsg.style.display = 'block';
    }
  });
}
