import type { Database } from './database.types';

type Tables = Database['public']['Tables'];

// 1. MÓDULO IDENTIDAD Y ROLES
export type UserRole = Tables['user_roles']['Row'];
export type Role = UserRole['role'];

// 2. MÓDULO CORE: CATÁLOGO
export type Brand = Tables['brands']['Row'];
export type Category = Tables['categories']['Row'];
export type DeviceModel = Tables['device_models']['Row'];
export type Product = Tables['products']['Row'];
export type ProductCompatibility = Tables['product_compatibilities']['Row'];
export type QualityGrade = Product['quality_grade'];

// 3. MÓDULO LOGÍSTICA & ALMACÉN
export type Supplier = Tables['suppliers']['Row'];
export type Warehouse = Tables['warehouses']['Row'];
export type Inventory = Tables['inventory']['Row'];
export type StockMovement = Tables['stock_movements']['Row'];
export type SyncConflict = Tables['sync_conflicts']['Row'];

// 4. MÓDULO CRM & E-COMMERCE (FUTURO)
export type LoyaltyTier = Tables['loyalty_tiers']['Row'];
export type Customer = Tables['customers']['Row'];
export type Order = Tables['orders']['Row'];
export type OrderItem = Tables['order_items']['Row'];

// Tipos para Inserciones (Omiten id generado, created_at, etc.)
export type ProductInsert = Tables['products']['Insert'];
export type InventoryInsert = Tables['inventory']['Insert'];
export type StockMovementInsert = Tables['stock_movements']['Insert'];
