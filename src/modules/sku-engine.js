import marcasData from '../data/marcas.json';
import categoriasData from '../data/categorias.json';
import db from '../data/db.js';

const VALID_ESTADOS = { '01': 'Nuevo', '02': 'Usado' };
const VALID_CONDICIONES = { 'OEM': 'Original', 'AFT': 'Aftermarket', 'GEN': 'Genérico' };

export function generateSKU({ categoria, marca, estado, condicion, modeloId }) {
    if (!categoria || categoria.length !== 3) throw new Error(`Categoría inválida: ${categoria}`);
    if (!marca || marca.length !== 3) throw new Error(`Marca inválida: ${marca}`);
    if (!estado || estado.length !== 2) throw new Error(`Estado inválido: ${estado}`);
    if (!condicion || condicion.length !== 3) throw new Error(`Condición inválida: ${condicion}`);
    if (!modeloId || modeloId.length !== 3) throw new Error(`ID Modelo inválido: ${modeloId}`);

    if (!categoriasData[categoria]) throw new Error(`Categoría no existe en diccionario: ${categoria}`);
    if (!marcasData[marca]) throw new Error(`Marca no existe en diccionario: ${marca}`);
    if (!VALID_ESTADOS[estado]) throw new Error(`Estado no válido: ${estado}. Usar: ${Object.keys(VALID_ESTADOS).join(', ')}`);
    if (!VALID_CONDICIONES[condicion]) throw new Error(`Condición no válida: ${condicion}. Usar: ${Object.keys(VALID_CONDICIONES).join(', ')}`);

    const sku = `${categoria}${marca}${estado}${condicion}${modeloId}`;

    if (sku.length !== 14) throw new Error(`SKU generado con longitud incorrecta: ${sku.length} (esperado: 14)`);

    return sku;
}

export function parseSKU(sku) {
    if (!sku || sku.length !== 14) return null;
    return {
        categoria: sku.substring(0, 3),
        categoriaNombre: categoriasData[sku.substring(0, 3)] || 'Desconocida',
        marca: sku.substring(3, 6),
        marcaNombre: marcasData[sku.substring(3, 6)] || 'Desconocida',
        estado: sku.substring(6, 8),
        estadoNombre: VALID_ESTADOS[sku.substring(6, 8)] || 'Desconocido',
        condicion: sku.substring(8, 11),
        condicionNombre: VALID_CONDICIONES[sku.substring(8, 11)] || 'Desconocida',
        modeloId: sku.substring(11, 14)
    };
}

export async function skuExists(sku) {
    const producto = await db.productos.get(sku);
    return !!producto;
}

export function getEstados() {
    return Object.entries(VALID_ESTADOS).map(([codigo, nombre]) => ({ codigo, nombre }));
}

export function getCondiciones() {
    return Object.entries(VALID_CONDICIONES).map(([codigo, nombre]) => ({ codigo, nombre }));
}

export function getCategorias() {
    return Object.entries(categoriasData).map(([codigo, nombre]) => ({ codigo, nombre }));
}

export function getMarcas() {
    return Object.entries(marcasData).map(([codigo, nombre]) => ({ codigo, nombre }));
}
