import { describe, expect, it } from "vitest";
import { generateSku, parseSku, validateSku } from "../../utils/skuEngine";

describe("SKU Engine Integrity", () => {
	it("debe generar un SKU válido en formato de 20 caracteres (CAT-MAR-ES-CON-00001)", () => {
		const parts = {
			category: "001",
			brand: "APP",
			state: "01",
			condition: "NEW",
			correlative: "00001"
		};

		const sku = generateSku(parts);
		expect(sku).toBe("001-APP-01-NEW-00001");
	});

	it("debe validar un SKU correcto", () => {
		expect(validateSku("PAN-SAM-01-OEM-00023")).toBe(true);
		expect(validateSku("PANSAM01OEM00023")).toBe(false); // faltan guiones
	});

	it("debe extraer correctamente las partes", () => {
		const parsed = parseSku("PAN-SAM-01-OEM-00023");
		expect(parsed).toEqual({
			category: "PAN",
			brand: "SAM",
			state: "01",
			condition: "OEM",
			correlative: "00023"
		});
	});
});
