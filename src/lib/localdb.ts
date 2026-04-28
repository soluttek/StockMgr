import Dexie, { type Table } from "dexie";

export interface LocalInventory {
	id: string; // product_id o combinación
	warehouse_id: string;
	quantity: number;
	last_updated: string;
}

export interface OutboxMovement {
	id?: number; // ID local autoincremental
	product_id: string;
	warehouse_id: string;
	quantity_change: number;
	reason?: string;
	client_mutation_id: string;
	user_id: string;
	created_at: string;
	status: "PENDING" | "SYNCED" | "ERROR";
	error_message?: string;
}

export class StockMgrDatabase extends Dexie {
	inventory!: Table<LocalInventory, [string, string]>;
	outbox!: Table<OutboxMovement, number>;

	constructor() {
		super("StockMgrDB");
		this.version(1).stores({
			inventory: "[id+warehouse_id]", // Clave primaria compuesta
			outbox: "++id, status, created_at", // ID autoincremental, e índices para búsquedas
		});
	}
}

export const localDb = new StockMgrDatabase();
