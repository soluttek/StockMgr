/**
 * @vitest-environment jsdom
 */

import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { localDb } from "../../lib/localdb";
import { supabase } from "../../lib/supabase";
import { useStockStore } from "../../stores/useStockStore";

// Mocks
vi.mock("../../lib/supabase", () => ({
	supabase: {
		from: vi.fn(() => ({
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
		})),
		rpc: vi.fn(),
	},
}));

vi.mock("../../lib/localdb", () => ({
	localDb: {
		inventory: {
			clear: vi.fn(),
			bulkAdd: vi.fn(),
			toArray: vi.fn().mockResolvedValue([]),
			update: vi.fn(),
		},
		outbox: {
			add: vi.fn(),
			where: vi.fn().mockReturnThis(),
			equals: vi.fn().mockReturnThis(),
			toArray: vi.fn().mockResolvedValue([]),
			update: vi.fn(),
		},
	},
}));

describe("Stock Store", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();

		// Mock navigator.onLine
		Object.defineProperty(navigator, "onLine", {
			configurable: true,
			value: true,
			writable: true,
		});
	});

	it("debe inicializar con inventario vacío", () => {
		const store = useStockStore();
		expect(store.inventory).toEqual([]);
		expect(store.isSyncing).toBe(false);
	});

	it("fetchInventory debe obtener datos de Supabase si hay conexión", async () => {
		const mockData = [{ product_id: "1", warehouse_id: "W1", quantity: 10 }];

		vi.mocked(supabase.from).mockReturnValue({
			select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
		} as any);

		const store = useStockStore();
		await store.fetchInventory();

		expect(supabase.from).toHaveBeenCalledWith("inventory");
		expect(store.inventory).toEqual(mockData);
		expect(localDb.inventory.bulkAdd).toHaveBeenCalled();
	});

	it("registerMovement debe guardar en outbox y actualizar UI inmediatamente (Optimistic UI)", async () => {
		const store = useStockStore();
		store.inventory = [
			{ product_id: "P1", warehouse_id: "W1", quantity: 10 } as any,
		];

		const movement = {
			product_id: "P1",
			warehouse_id: "W1",
			quantity_change: -2,
			user_id: "user1",
			client_mutation_id: "mut1",
		} as any;

		await store.registerMovement(movement);

		expect(store.inventory[0].quantity).toBe(8);
		expect(localDb.outbox.add).toHaveBeenCalled();
		expect(localDb.inventory.update).toHaveBeenCalled();
	});

	it("syncOutbox debe llamar al RPC de Supabase para movimientos pendientes", async () => {
		const pendingMov = {
			id: 1,
			product_id: "P1",
			warehouse_id: "W1",
			quantity_change: 5,
			client_mutation_id: "mut1",
			user_id: "user1",
			status: "PENDING",
		} as any;

		// Mock chaining: localDb.outbox.where('status').equals('PENDING').toArray()
		vi.mocked(localDb.outbox.where as any).mockReturnThis();
		vi.mocked((localDb.outbox as any).equals as any).mockReturnThis();
		vi.mocked((localDb.outbox as any).toArray as any).mockResolvedValue([
			pendingMov,
		]);

		vi.mocked(supabase.rpc).mockResolvedValue({
			data: { status: "OK" },
			error: null,
		} as any);

		const store = useStockStore();
		await store.syncOutbox();

		expect(supabase.rpc).toHaveBeenCalledWith(
			"process_offline_movement",
			expect.any(Object),
		);
		expect(localDb.outbox.update).toHaveBeenCalledWith(1, { status: "SYNCED" });
	});
});
