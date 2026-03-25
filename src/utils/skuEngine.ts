/**
 * SKU Engine
 * Formato Maestro: CAT-MAR-ES-CON-00001 (20 caracteres)
 */

export interface SKUParts {
  category: string;     // 3 caracteres (ej. PAN, BAT)
  brand: string;        // 3 caracteres (ej. SAM, MOT)
  state: string;        // 2 caracteres (ej. 01 = Nuevo)
  condition: string;    // 3 caracteres (ej. OEM, SVP, AFT)
  correlative: string;  // 5 caracteres (ej. 00001)
}

/**
 * Genera un SKU formateado con guiones
 */
export function generateSku(parts: SKUParts): string {
  const { category, brand, state, condition, correlative } = parts;
  
  if (!category || category.length !== 3) throw new Error(`Categoría inválida: ${category}`);
  if (!brand || brand.length !== 3) throw new Error(`Marca inválida: ${brand}`);
  if (!state || state.length !== 2) throw new Error(`Estado inválido: ${state}`);
  if (!condition || condition.length !== 3) throw new Error(`Condición inválida: ${condition}`);
  if (!correlative || correlative.length !== 5) throw new Error(`Correlativo inválido: ${correlative} (se esperan 5 dígitos)`);
  
  return `${category.toUpperCase()}-${brand.toUpperCase()}-${state}-${condition.toUpperCase()}-${correlative}`;
}

/**
 * Extrae las partes de un SKU formateado
 */
export function parseSku(sku: string): SKUParts | null {
  if (!sku || sku.length !== 20) return null;
  
  const parts = sku.split('-');
  if (parts.length !== 5) return null;
  
  return {
    category: parts[0],
    brand: parts[1],
    state: parts[2],
    condition: parts[3],
    correlative: parts[4]
  };
}

/**
 * Generador de prefijos de 3 letras a partir de un nombre
 */
export function generatePrefix(name: string): string {
  if (!name) return 'XXX';
  // Quitar acentos y mayúsculas
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  // Quitar palabras de conexión comunes
  const words = normalized.split(/[\s-]+/).filter(w => !['DE', 'EL', 'LA', 'LOS', 'LAS'].includes(w));
  
  if (words.length === 0) return 'XXX';
  
  // Si la primera palabra tiene 3 o más letras, usar sus primeras 3 letras
  if (words[0].length >= 3) {
    return words[0].substring(0, 3);
  }
  
  // Si tiene menos de 3 letras, combinar con la siguiente palabra
  return normalized.replace(/[^A-Z0-9]/g, '').substring(0, 3).padEnd(3, 'X');
}

/**
 * Valida estrictamente un SKU contra el formato de 20 caracteres
 */
export function validateSku(sku: string): boolean {
  const regex = /^[A-Z0-9]{3}-[A-Z0-9]{3}-\d{2}-[A-Z0-9]{3}-\d{5}$/i;
  return regex.test(sku) && sku.length === 20;
}
