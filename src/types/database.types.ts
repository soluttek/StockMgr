export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          points: number
          tier_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          points?: number
          tier_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          points?: number
          tier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "loyalty_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      device_models: {
        Row: {
          brand_id: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          product_id: string
          quantity: number
          reorder_point: number
          safety_stock: number
          updated_at: string | null
          version_id: number
          warehouse_id: string
        }
        Insert: {
          product_id: string
          quantity?: number
          reorder_point?: number
          safety_stock?: number
          updated_at?: string | null
          version_id?: number
          warehouse_id: string
        }
        Update: {
          product_id?: string
          quantity?: number
          reorder_point?: number
          safety_stock?: number
          updated_at?: string | null
          version_id?: number
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_tiers: {
        Row: {
          created_at: string | null
          discount_multiplier: number
          id: string
          min_points: number
          name: string
        }
        Insert: {
          created_at?: string | null
          discount_multiplier?: number
          id?: string
          min_points?: number
          name: string
        }
        Update: {
          created_at?: string | null
          discount_multiplier?: number
          id?: string
          min_points?: number
          name?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          historical_price: number
          id: string
          order_id: string | null
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          historical_price: number
          id?: string
          order_id?: string | null
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          historical_price?: number
          id?: string
          order_id?: string | null
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          status: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          status?: string | null
          total_amount?: number
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_compatibilities: {
        Row: {
          device_model_id: string
          difficulty_level: number | null
          fingerprint_support: boolean | null
          product_id: string
          required_tools: string | null
        }
        Insert: {
          device_model_id: string
          difficulty_level?: number | null
          fingerprint_support?: boolean | null
          product_id: string
          required_tools?: string | null
        }
        Update: {
          device_model_id?: string
          difficulty_level?: number | null
          fingerprint_support?: boolean | null
          product_id?: string
          required_tools?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_compatibilities_device_model_id_fkey"
            columns: ["device_model_id"]
            isOneToOne: false
            referencedRelation: "device_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_compatibilities_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          brand_id: string
          category_id: string
          created_at: string | null
          dimensions: string | null
          gtin_ean: string | null
          id: string
          mpn: string | null
          name: string
          quality_grade: string
          sku: string
          supplier_id: string | null
          weight_grams: number | null
        }
        Insert: {
          base_price?: number
          brand_id: string
          category_id: string
          created_at?: string | null
          dimensions?: string | null
          gtin_ean?: string | null
          id?: string
          mpn?: string | null
          name: string
          quality_grade: string
          sku: string
          supplier_id?: string | null
          weight_grams?: number | null
        }
        Update: {
          base_price?: number
          brand_id?: string
          category_id?: string
          created_at?: string | null
          dimensions?: string | null
          gtin_ean?: string | null
          id?: string
          mpn?: string | null
          name?: string
          quality_grade?: string
          sku?: string
          supplier_id?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          client_mutation_id: string
          created_at: string | null
          id: string
          product_id: string
          quantity_change: number
          reason: string | null
          status: string | null
          user_id: string
          warehouse_id: string
        }
        Insert: {
          client_mutation_id: string
          created_at?: string | null
          id?: string
          product_id: string
          quantity_change: number
          reason?: string | null
          status?: string | null
          user_id: string
          warehouse_id: string
        }
        Update: {
          client_mutation_id?: string
          created_at?: string | null
          id?: string
          product_id?: string
          quantity_change?: number
          reason?: string | null
          status?: string | null
          user_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          avg_lead_time_days: number | null
          contact_email: string | null
          country: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          avg_lead_time_days?: number | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          avg_lead_time_days?: number | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      sync_conflicts: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          expected_version: number
          id: string
          movement_id: string | null
          resolved: boolean | null
          server_version: number
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          expected_version: number
          id?: string
          movement_id?: string | null
          resolved?: boolean | null
          server_version: number
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          expected_version?: number
          id?: string
          movement_id?: string | null
          resolved?: boolean | null
          server_version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sync_conflicts_movement_id_fkey"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "stock_movements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_operator: { Args: never; Returns: boolean }
      process_offline_movement: {
        Args: {
          p_client_mutation_id: string
          p_product_id: string
          p_quantity_change: number
          p_reason: string
          p_user_id: string
          p_warehouse_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
