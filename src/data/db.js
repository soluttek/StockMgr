import Dexie from 'dexie';

const db = new Dexie('StockManagerDB');

db.version(6).stores({
    productos: '&sku, modelo, categoria, marca, estado, condicion, modeloId, stock, detalle, compatibilidad, createdAt, updatedAt',
    marcas: '++id, &codigo, nombre',
    modelos: '++id, modeloId, nombre, marcaCodigo',
    categorias: '++id, &codigo, nombre',
    movimientos: '++id, sku, tipo, cantidad, timestamp',
    syncQueue: '++id, action, payload, timestamp'
});

export default db;

export async function seedIfEmpty(marcasData, modelosData, categoriasData) {
    // Comprobación de integridad agresiva
    const sampleProducts = await db.productos.limit(50).toArray();
    const isCorrupt = sampleProducts.some(p =>
        p.sku.length !== 15 ||
        p.modelo.includes('\ufffd') ||
        p.modelo.toLowerCase().includes('genrico')
    );

    if (isCorrupt) {
        console.warn('⚠️ Detectada base de datos incompatible o corrupta. Ejecutando purga total de emergencia...');
        await Promise.all([
            db.productos.clear(),
            db.marcas.clear(),
            db.modelos.clear(),
            db.categorias.clear()
        ]);
    }

    const marcasCount = await db.marcas.count();
    if (marcasCount === 0 && marcasData) {
        const entries = Object.entries(marcasData).map(([codigo, nombre]) => ({ codigo, nombre }));
        await db.marcas.bulkAdd(entries);
    }

    const modelosCount = await db.modelos.count();
    if (modelosCount === 0 && modelosData) {
        const entries = Object.entries(modelosData).map(([modeloId, data]) => ({
            modeloId,
            nombre: data.nombre,
            marcaCodigo: data.marca
        }));
        await db.modelos.bulkAdd(entries);
    }

    const categoriasCount = await db.categorias.count();
    if (categoriasCount === 0 && categoriasData) {
        const entries = Object.entries(categoriasData).map(([codigo, nombre]) => ({ codigo, nombre }));
        await db.categorias.bulkAdd(entries);
    }
}

export async function importInventoryFromCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const header = lines[0];
    const rows = lines.slice(1).filter(l => l.trim());

    const fixEncoding = (str) => {
        if (!str) return '';
        let clean = str.replace(/\ufffd/g, '');
        return clean
            .replace(/Gen\s*rico/gi, 'Genérico')
            .replace(/Bater\s*a/gi, 'Batería')
            .replace(/L\s*gica/gi, 'Lógica')
            .replace(/C\s*mara/gi, 'Cámara')
            .replace(/M\s*dulo/gi, 'Módulo')
            .trim();
    };

    const productos = rows.map(line => {
        const parts = line.split(',');
        const sku = parts[0]?.trim();
        // Soportar legacy (14) y nuevo (15)
        if (!sku || (sku.length !== 14 && sku.length !== 15)) return null;

        const isOldFormat = sku.length === 14;

        return {
            sku: isOldFormat ? `${sku.substring(0, 11)}0${sku.substring(11, 14)}` : sku,
            modelo: fixEncoding(parts[1]),
            detalle: fixEncoding(parts[2]),
            compatibilidad: parts[3]?.trim() || '[N/A]',
            stock: parseInt(parts[4]?.trim()) || 0,
            categoria: sku.substring(0, 3),
            marca: sku.substring(3, 6),
            estado: sku.substring(6, 8),
            condicion: sku.substring(8, 11),
            modeloId: isOldFormat ? `0${sku.substring(11, 14)}` : sku.substring(11, 15),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }).filter(Boolean);

    await db.productos.bulkPut(productos);
    return productos.length;
}

export async function registrarMovimiento(sku, tipo, cantidad = 1) {
    const producto = await db.productos.get(sku);
    if (!producto) throw new Error(`SKU no encontrado: ${sku} `);

    const nuevoStock = tipo === 'entrada'
        ? producto.stock + cantidad
        : Math.max(0, producto.stock - cantidad);

    await db.productos.update(sku, {
        stock: nuevoStock,
        updatedAt: new Date().toISOString()
    });

    await db.movimientos.add({
        sku,
        tipo,
        cantidad,
        stockAnterior: producto.stock,
        stockNuevo: nuevoStock,
        timestamp: new Date().toISOString()
    });

    return nuevoStock;
}
