import { describe, it, expect } from 'vitest';
import { generateSKU, parseSKU } from './sku-engine.js';

describe('SKU Engine (15-character format)', () => {
    const validData = {
        categoria: 'BAT',
        marca: 'SAM',
        estado: '01',
        condicion: 'OEM',
        modeloId: '0001'
    };

    it('should generate a valid 15-character SKU', () => {
        const sku = generateSKU(validData);
        expect(sku).toBe('BATSAM01OEM0001');
        expect(sku.length).toBe(15);
    });

    it('should throw error for invalid categoria length', () => {
        expect(() => generateSKU({ ...validData, categoria: 'BA' })).toThrow(/Categoría inválida/);
    });

    it('should throw error for invalid modeloId length (3 digits)', () => {
        expect(() => generateSKU({ ...validData, modeloId: '001' })).toThrow(/ID Modelo inválido/);
    });

    it('should parse a valid 15-character SKU correctly', () => {
        const sku = 'BATSAM01OEM0001';
        const parsed = parseSKU(sku);
        expect(parsed).toEqual({
            categoria: 'BAT',
            categoriaNombre: 'Batería',
            marca: 'SAM',
            marcaNombre: 'Samsung',
            estado: '01',
            estadoNombre: 'Nuevo',
            condicion: 'OEM',
            condicionNombre: 'Original',
            modeloId: '0001'
        });
    });

    it('should return null when parsing invalid length SKU', () => {
        expect(parseSKU('BATSAM01OEM001')).toBeNull();
    });
});
