# **TECHNICAL ANALISYS: INITIAL PROPOSAL**

> [!WARNING]
> **DOCUMENTO DE ANÁLISIS INICIAL.**
> Este archivo fue la propuesta estratégica. Para ver la **Arquitectura Real Implementada**, consulta: [ESQUEMA_DB_REAL_V2.md](./ESQUEMA_DB_REAL_V2.md).

**Módulo:** E-Commerce Componentes & Refacciones Móviles (Stock \+ CRM)

**Destinatario:** Asesor de Antigravity / DBAs / Agente 3 (Lead Dev)

## **1\. INSTRUCTIONS (STEP-BY-STEP)**

1. **Análisis de Entidades:** Se identificaron las entidades Core: products (refacciones), device\_models (modelos de celular), brands (marcas), inventory (stock por almacén), orders (transacciones) y customers (CRM/Fidelización).  
2. **Normalización (3NF):** Se segregaron las tablas para evitar redundancias. La relación Muchos-a-Muchos entre products y device\_models se resolvió con la tabla pivote product\_compatibilities. Las métricas de inventario se separaron a la tabla inventory vinculada a warehouses.  
3. **Validación Cruce:** Un product (ej. Pantalla OLED) puede tener compatibilidad con varios device\_models. El rastreo físico se ubica en inventory mediante warehouse\_id y quantity.  
4. **Restricción de Integridad:** Se emplean uuid para las claves primarias (PK), previniendo enumeración. El campo sku se define como varchar (evitando ceros a la izquierda que se corrompen en numéricos).  
5. **Generación de Plano:** Se ha estructurado el modelo relacional para ingesta vía MCP y el script SQL para despliegue directo en Supabase.

## **2\. ANÁLISIS DE BRECHAS (GAP ANALYSIS)**

* **Gap Detectado 1 (Fidelización):** La documentación provista abarca extensamente el inventario y compatibilidad de refacciones (OEM, Aftermarket), pero omite la lógica del CRM y fidelidad.  
  * **Propuesta de Arquitecto:** Implementación de un modelo loyalty\_tiers (Bronce, Plata, Oro) basado en puntos acumulados por compras. Se integra la tabla customers vinculada 1:1 con auth.users.  
* **Gap Detectado 2 (Trazabilidad de Calidad):** Se menciona OEM, Service Pack, Ori, Aftermarket.  
  * **Propuesta de Arquitecto:** Integración del campo quality\_grade en la tabla products con un CHECK constraint para forzar la estandarización del inventario.  
* **Gap Detectado 3 (SKU & Leading Zeros):** La literatura alerta sobre pérdida de ceros a la izquierda.  
  * **Propuesta de Arquitecto:** El campo sku en products será estrictamente de tipo text con un índice único (UNIQUE INDEX).

## **4\. DIAGRAMA DE ENTIDAD-RELACIÓN Y FLUJO**

erDiagram  
    USERS ||--o| CUSTOMERS : "1:1 extends"  
    CUSTOMERS }o--|| LOYALTY\_TIERS : "belongs to"  
    CUSTOMERS ||--o{ ORDERS : "places"  
      
    BRANDS ||--o{ DEVICE\_MODELS : "manufactures"  
    CATEGORIES ||--o{ PRODUCTS : "groups"  
      
    PRODUCTS ||--o{ PRODUCT\_COMPATIBILITIES : "has"  
    DEVICE\_MODELS ||--o{ PRODUCT\_COMPATIBILITIES : "compatible with"  
      
    PRODUCTS ||--o{ INVENTORY : "stocked in"  
    WAREHOUSES ||--o{ INVENTORY : "holds"  
      
    PRODUCTS ||--o{ STOCK\_MOVEMENTS : "tracks"  
    WAREHOUSES ||--o{ STOCK\_MOVEMENTS : "occurs at"  
      
    ORDERS ||--o{ ORDER\_ITEMS : "contains"  
    PRODUCTS ||--o{ ORDER\_ITEMS : "included in"

    %% Flujo de Fidelización y Stock  
    CUSTOMERS {  
        uuid id PK  
        int points  
        uuid tier\_id FK  
    }  
    PRODUCTS {  
        uuid id PK  
        string sku "UNIQUE"  
        string quality\_grade  
    }  
    INVENTORY {  
        uuid product\_id PK,FK  
        uuid warehouse\_id PK,FK  
        int quantity  
        int reorder\_point  
    }

## **5\. ROADMAP DE IMPLEMENTACIÓN (PASO A PASO)**

* **Fase 1: Estructura Core (DDL):** Ejecución del Schema definido abajo en el SQL Editor de Supabase.  
* **Fase 2: Lógica de Negocio (Triggers):** \* Crear función calculate\_loyalty\_points() que se dispare (AFTER INSERT) en orders para actualizar los points del cliente.  
  * Crear función update\_stock() que reste el inventario (AFTER INSERT en order\_items) e inserte un registro en stock\_movements.  
* **Fase 3: Optimización:** Creación de INDEX en sku y columnas usadas frecuentemente en RLS (ej. customer\_id).

**Instrucción:** Copia el Schema de abajo (con 5 comillas) e ingrésalo en el **Asesor de Antigravity** para que configure la Base de Datos. Luego, pásale las variables de entorno al Agente 3 (Lead Dev).

\-- \==========================================  
\-- 1\. SCHEMA DEFINITION: SUPABASE (SQL)  
\-- \==========================================

\-- Habilitar extensión UUID  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\-- 1\. CRM & FIDELIDAD  
CREATE TABLE public.loyalty\_tiers (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  name text NOT NULL,  
  min\_points integer NOT NULL DEFAULT 0,  
  discount\_multiplier numeric(3,2) NOT NULL DEFAULT 1.00,  
  created\_at timestamptz DEFAULT now()  
);

CREATE TABLE public.customers (  
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,  
  full\_name text NOT NULL,  
  points integer DEFAULT 0,  
  tier\_id uuid REFERENCES public.loyalty\_tiers(id),  
  created\_at timestamptz DEFAULT now(),  
  updated\_at timestamptz DEFAULT now()  
);

\-- 2\. CATÁLOGO DE PRODUCTOS  
CREATE TABLE public.brands (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  name text UNIQUE NOT NULL,  
  created\_at timestamptz DEFAULT now()  
);

CREATE TABLE public.categories (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  name text UNIQUE NOT NULL,  
  created\_at timestamptz DEFAULT now()  
);

CREATE TABLE public.device\_models (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  brand\_id uuid REFERENCES public.brands(id) ON DELETE CASCADE,  
  name text NOT NULL,  
  created\_at timestamptz DEFAULT now()  
);

CREATE TABLE public.products (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  sku text UNIQUE NOT NULL,  
  name text NOT NULL,  
  category\_id uuid REFERENCES public.categories(id),  
  brand\_id uuid REFERENCES public.brands(id),  
  quality\_grade text CHECK (quality\_grade IN ('OEM', 'Service Pack', 'Aftermarket', 'Ori')),  
  base\_price numeric(10,2) NOT NULL,  
  created\_at timestamptz DEFAULT now(),  
  updated\_at timestamptz DEFAULT now()  
);

CREATE TABLE public.product\_compatibilities (  
  product\_id uuid REFERENCES public.products(id) ON DELETE CASCADE,  
  device\_model\_id uuid REFERENCES public.device\_models(id) ON DELETE CASCADE,  
  PRIMARY KEY (product\_id, device\_model\_id)  
);

\-- 3\. INVENTARIO & STOCK  
CREATE TABLE public.warehouses (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  name text NOT NULL,  
  location text,  
  created\_at timestamptz DEFAULT now()  
);

CREATE TABLE public.inventory (  
  product\_id uuid REFERENCES public.products(id) ON DELETE CASCADE,  
  warehouse\_id uuid REFERENCES public.warehouses(id) ON DELETE CASCADE,  
  quantity integer NOT NULL DEFAULT 0,  
  reorder\_point integer NOT NULL DEFAULT 5,  
  safety\_stock integer NOT NULL DEFAULT 2,  
  updated\_at timestamptz DEFAULT now(),  
  PRIMARY KEY (product\_id, warehouse\_id)  
);

CREATE TABLE public.stock\_movements (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  product\_id uuid REFERENCES public.products(id),  
  warehouse\_id uuid REFERENCES public.warehouses(id),  
  quantity\_change integer NOT NULL,  
  reason text NOT NULL,  
  created\_at timestamptz DEFAULT now()  
);

\-- 4\. PEDIDOS (ORDERS)  
CREATE TABLE public.orders (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  customer\_id uuid REFERENCES public.customers(id),  
  total\_amount numeric(10,2) NOT NULL,  
  status text DEFAULT 'PENDING',  
  created\_at timestamptz DEFAULT now()  
);

CREATE TABLE public.order\_items (  
  id uuid DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  order\_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,  
  product\_id uuid REFERENCES public.products(id),  
  quantity integer NOT NULL,  
  historical\_price numeric(10,2) NOT NULL  
);

\-- \==========================================  
\-- RLS SECURITY (Zero Trust by Default)  
\-- \==========================================

\-- Denegar acceso por defecto (Safe by Default)  
ALTER TABLE public.loyalty\_tiers ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.device\_models ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.product\_compatibilities ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.stock\_movements ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.order\_items ENABLE ROW LEVEL SECURITY;

\-- Políticas de Soberanía de Datos (Prohibido USING (true) en datos sensibles)

\-- Customers: Solo el propio usuario puede ver/editar su perfil  
CREATE POLICY "Customer Own Profile" ON public.customers FOR ALL USING (auth.uid() \= id);

\-- Pedidos: Solo el propio usuario puede ver sus pedidos  
CREATE POLICY "Customer Own Orders" ON public.orders FOR SELECT USING (auth.uid() \= customer\_id);  
CREATE POLICY "Customer Own Order Items" ON public.order\_items FOR SELECT USING (  
  order\_id IN (SELECT id FROM public.orders WHERE customer\_id \= auth.uid())  
);

\-- Catálogo (Products, Brands, Categories, Models): Lectura protegida, solo usuarios autenticados  
CREATE POLICY "Authenticated Read Products" ON public.products FOR SELECT USING (auth.uid() IS NOT NULL);  
CREATE POLICY "Authenticated Read Categories" ON public.categories FOR SELECT USING (auth.uid() IS NOT NULL);  
CREATE POLICY "Authenticated Read Brands" ON public.brands FOR SELECT USING (auth.uid() IS NOT NULL);  
CREATE POLICY "Authenticated Read Models" ON public.device\_models FOR SELECT USING (auth.uid() IS NOT NULL);  
CREATE POLICY "Authenticated Read Compatibilities" ON public.product\_compatibilities FOR SELECT USING (auth.uid() IS NOT NULL);

\-- Inventario y Movimientos: Solo lectura para autenticados  
CREATE POLICY "Authenticated Read Inventory" ON public.inventory FOR SELECT USING (auth.uid() IS NOT NULL);  
CREATE POLICY "Authenticated Read Warehouses" ON public.warehouses FOR SELECT USING (auth.uid() IS NOT NULL);

\-- NOTA: Las operaciones de escritura (INSERT/UPDATE/DELETE) en productos, stock y status de órdenes   
\-- deben ejecutarse exclusivamente vía Backend (n8n) utilizando la SERVICE\_ROLE\_KEY, la cual bypassa RLS.

\-- Creación de Índices de Rendimiento  
CREATE INDEX idx\_products\_sku ON public.products(sku);  
CREATE INDEX idx\_orders\_customer ON public.orders(customer\_id);  
CREATE INDEX idx\_inventory\_product ON public.inventory(product\_id);

## **2\. Seed Data (Mock Data)**

*Datos estructurados bajo "The Golden Envelope" para el Agente 3 (Lead Dev)*

{  
  "success": true,  
  "data": {  
    "product": {  
      "id": "uuid-product-123",  
      "sku": "SCR-OLED-IP13-OEM",  
      "name": "Pantalla OLED iPhone 13",  
      "quality\_grade": "OEM",  
      "base\_price": 125.50,  
      "compatibilities": \["iPhone 13", "iPhone 13 Pro"\],  
      "inventory": {  
        "warehouse": "Bodega Central MX",  
        "quantity": 45,  
        "reorder\_point": 10  
      }  
    }  
  },  
  "error": null  
}

## **3\. Environment Variables (.env.example)**

(Copia este bloque y guárdalo como .env.example en la raíz)

\# \--- DATABASE (Supabase) \---  
DB\_CONNECTION\_STRING="postgresql://postgres.\[YOUR-PROJECT\]:\[PASSWORD\]@\[aws-0-us-east-1.pooler.supabase.com:6543/postgres\](https://aws-0-us-east-1.pooler.supabase.com:6543/postgres)" \# Privado (Para Agente 4 \- Automation)

\# \--- AUTH & DB (Frontend Public) \---  
PUBLIC\_SUPABASE\_URL="\[https://your-project.supabase.co\](https://your-project.supabase.co)"  \# Público  
SUPABASE\_KEY="eyJ..."                                   \# Público (Anon Key)

\# \--- FRONTEND BRIDGE (Para Agente 3 \- Lead Dev) \---  
\# Estas variables conectan el Frontend con n8n  
VITE\_API\_BASE\_URL="\[https://n8n.tu-dominio.com/webhook\](https://n8n.tu-dominio.com/webhook)"    
VITE\_API\_KEY="\[INSERTA\_TU\_API\_KEY\_AQUI\]"                \# Copiar esto en n8n como API\_GATEWAY\_SECRET

\# \--- EXTERNAL INTEGRATIONS \---  
VITE\_STRIPE\_PUBLIC\_KEY="pk\_test\_..."

\# \--- SECURITY (Backend Private) \---  
SERVICE\_ROLE\_KEY="eyJ..."                               \# CRÍTICO (Solo Backend/n8n \- NO EXPORTAR A FRONTEND)

### **⚠️ ADVERTENCIA DE SEGURIDAD PARA EL HUMANO**

1. **Generación de Secretos:** Para generar la VITE\_API\_KEY o cualquier llave criptográfica (como las de cifrado AES-256 para los backups mencionados en el plan de recuperación), abre tu terminal local y ejecuta:  
   openssl rand \-base64 32  
2. **Copia este valor directamente en tu .env y NO lo pegues en este chat.** Tienes prohibido generar llaves privadas, IVs o secretos dentro de esta ventana para evitar que queden en el historial del modelo de lenguaje.  
3. **Custodia de Llaves (Human Escrow):** Debes resguardar las llaves maestras fuera del sistema. En caso de pérdida de las llaves, los agentes no podrán recuperar los backups de tu base de datos, resultando en **pérdida total de datos inalterable**.