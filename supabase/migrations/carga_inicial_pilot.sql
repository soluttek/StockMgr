-- Limpieza inicial (opcional, el usuario lo hizo antes pero por seguridad)
TRUNCATE public.stock_movements,
public.inventory,
public.products CASCADE;
DO $$
DECLARE v_warehouse_id uuid;
v_admin_id uuid;
BEGIN
SELECT id INTO v_warehouse_id
FROM public.warehouses
WHERE name = 'Almacén Central'
LIMIT 1;
-- Usamos el primer admin encontrado para los logs de auditoría iniciales
SELECT user_id INTO v_admin_id
FROM public.user_roles
WHERE role = 'ADMIN'
LIMIT 1;
-- Si no hay admin aún (Fase 2 no ha empezado), usamos NULL o el id del auth.uid() si estuviéramos en sesión.
-- Como es carga inicial por sistema, puede ir con user_id null.
-- Carga de Productos Pilot
-- Estructura SKU: CAT-MAR-ES-CON-NNNNN
INSERT INTO public.products (
        sku,
        name,
        category_id,
        brand_id,
        quality_grade,
        base_price
    )
VALUES (
        'BAT-SAM-01-AFT-00001',
        'Samsung Galaxy A14 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00002',
        'Samsung Galaxy A21s - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00003',
        'Samsung Galaxy A30s - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00004',
        'Samsung Galaxy A32 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00005',
        'Samsung Galaxy A51 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00006',
        'Samsung Galaxy A13 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00007',
        'Samsung Galaxy A12 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00008',
        'Samsung Galaxy A21 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00009',
        'Samsung Galaxy A33 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00010',
        'Samsung Galaxy A70 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00011',
        'Samsung Galaxy S20 Ultra - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00012',
        'Samsung Galaxy A20s - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00013',
        'Samsung Galaxy J5 Prime - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00014',
        'Samsung Galaxy A710 (A7 2016) - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00015',
        'Samsung Galaxy J4 Core - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00016',
        'Samsung Galaxy A3 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00017',
        'Samsung Galaxy J1 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00018',
        'Samsung Galaxy J8 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-SAM-01-AFT-00019',
        'Samsung Galaxy Note 8 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00020',
        'Motorola G9 Plus - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00021',
        'Motorola G7 Play - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00022',
        'Motorola Moto G8 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00023',
        'Motorola E5 Play - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00024',
        'Motorola E4 / G5 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00025',
        'Motorola X4 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00026',
        'Motorola E5 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00027',
        'Motorola G50 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00028',
        'Motorola G13 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00029',
        'Motorola G8 Power - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00030',
        'Motorola G60s - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00031',
        'Motorola Moto X Style - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-MOT-01-AFT-00032',
        'Motorola G82 5G - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00033',
        'Xiaomi Redmi Note 11 Pro - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00034',
        'Xiaomi Redmi 9s - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00035',
        'Xiaomi Redmi 8 Pro - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00036',
        'Xiaomi Redmi Note 7 Pro - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00037',
        'Xiaomi Mi 4c - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00038',
        'Xiaomi Redmi Note 3 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00039',
        'Xiaomi Mi 9T - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00040',
        'Xiaomi Mi 11+ - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00041',
        'Xiaomi Redmi 9A - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-REA-01-AFT-00042',
        'Realme (Genérico) - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Realme'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-XIO-01-AFT-00043',
        'Xiaomi Poco X3 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-OPP-01-AFT-00044',
        'Oppo Reno 7 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Oppo'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HUA-01-AFT-00045',
        'Huawei P Smart - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HUA-01-AFT-00046',
        'Huawei Mate 10 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HUA-01-AFT-00047',
        'Huawei Y5 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HUA-01-AFT-00048',
        'Huawei P20 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HUA-01-AFT-00049',
        'Huawei Y6 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HIS-01-AFT-00050',
        'Hisense U963 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Hisense'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ASU-01-AFT-00051',
        'Asus (Genérico) - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Asus'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-TCL-01-AFT-00052',
        'TCL (Genérico) - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'TCL'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-GPR-01-AFT-00053',
        'GoPro (Genérico) - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'GoPro'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-LEN-01-AFT-00054',
        'Lenovo Tab - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Lenovo'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ZTE-01-AFT-00055',
        'ZTE Blade A71 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ZTE-01-AFT-00056',
        'ZTE Z988 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ZTE-01-AFT-00057',
        'ZTE A7 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ZTE-01-AFT-00058',
        'ZTE V9 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ZTE-01-AFT-00059',
        'ZTE L210 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ZTE-01-AFT-00060',
        'ZTE L9 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HON-01-AFT-00061',
        'Honor X9B - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Honor'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-HON-01-AFT-00062',
        'Honor X10 5G - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Honor'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ALC-01-AFT-00063',
        'Alcatel (Genérico) - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Alcatel'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ALC-01-AFT-00064',
        'Alcatel A3 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Alcatel'
        ),
        'Aftermarket',
        0
    ),
    (
        'BAT-ALC-01-AFT-00065',
        'Alcatel Pixi 4 - Batería',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Batería'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Alcatel'
        ),
        'Aftermarket',
        0
    ),
    (
        'TJC-SAM-01-OEM-00066',
        'Samsung Galaxy A12 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'TJC-SAM-01-OEM-00067',
        'Samsung Galaxy A03s - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'TJC-SAM-01-OEM-00068',
        'Samsung Galaxy A53 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'TJC-SAM-01-OEM-00069',
        'Samsung Galaxy A04 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'TJC-SAM-01-OEM-00070',
        'Samsung Galaxy Note 9 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'TJC-SAM-01-OEM-00071',
        'Samsung Galaxy A03 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'TJC-ZTE-01-OEM-00072',
        'ZTE ZMax - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'OEM',
        0
    ),
    (
        'TJC-ZTE-01-OEM-00073',
        'ZTE V9 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'OEM',
        0
    ),
    (
        'TJC-ZTE-01-OEM-00074',
        'ZTE A5 Plus - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'OEM',
        0
    ),
    (
        'TJC-ZTE-01-OEM-00075',
        'ZTE 50 Lite - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00076',
        'Motorola E7 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00077',
        'Motorola E5 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00078',
        'Motorola G52 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00079',
        'Motorola One Macro - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00080',
        'Motorola G22 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00081',
        'Motorola G50 5G - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00082',
        'Motorola G9 Plus - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00083',
        'Motorola G5 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-MOT-01-OEM-00084',
        'Motorola X4 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'TJC-LAN-01-OEM-00085',
        'Lanix M9 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Lanix'
        ),
        'OEM',
        0
    ),
    (
        'TJC-HON-01-OEM-00086',
        'Honor 20 Pro - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Honor'
        ),
        'OEM',
        0
    ),
    (
        'TJC-HON-01-OEM-00087',
        'Honor Magic Elite - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Honor'
        ),
        'OEM',
        0
    ),
    (
        'TJC-HON-01-OEM-00088',
        'Honor 20 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Honor'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00089',
        'Xiaomi Note 9 Pro Max - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00090',
        'Xiaomi Note 4X - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00091',
        'Xiaomi Mi A2 Lite - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00092',
        'Xiaomi Mi 4c - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00093',
        'Xiaomi Redmi Note 8 Pro - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00094',
        'Xiaomi Nova 5T - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00095',
        'Xiaomi P40 Lite - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-XIO-01-OEM-00096',
        'Xiaomi Note 9 Pro - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'TJC-OPP-01-OEM-00097',
        'Oppo A15 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Oppo'
        ),
        'OEM',
        0
    ),
    (
        'TJC-OPP-01-OEM-00098',
        'Oppo C11 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Oppo'
        ),
        'OEM',
        0
    ),
    (
        'TJC-OPP-01-OEM-00099',
        'Oppo A54 - Pin de Carga',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Pin de Carga'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Oppo'
        ),
        'OEM',
        0
    ),
    (
        'LOG-XIO-02-OEM-00100',
        'Xiaomi Mi 4c - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'LOG-XIO-02-OEM-00101',
        'Redmi Note X4 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'LOG-XIO-02-OEM-00102',
        'Mi A2 Lite - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Xiaomi'
        ),
        'OEM',
        0
    ),
    (
        'LOG-HUA-02-OEM-00103',
        'Huawei P20 Lite - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'OEM',
        0
    ),
    (
        'LOG-HUA-02-OEM-00104',
        'Huawei P40 Lite - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'OEM',
        0
    ),
    (
        'LOG-HUA-02-OEM-00105',
        'Huawei Y5 2018 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'OEM',
        0
    ),
    (
        'LOG-HUA-02-OEM-00106',
        'Huawei Y5 Pro - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Huawei'
        ),
        'OEM',
        0
    ),
    (
        'LOG-MOT-02-OEM-00107',
        'Motorola Moto E5 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'LOG-MOT-02-OEM-00108',
        'Motorola Moto G8 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'LOG-MOT-02-OEM-00109',
        'Motorola E5 Plus - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'LOG-MOT-02-OEM-00110',
        'Motorola E4 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'LOG-MOT-02-OEM-00111',
        'Motorola G6 Play - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Motorola'
        ),
        'OEM',
        0
    ),
    (
        'LOG-SAM-02-OEM-00112',
        'Samsung A10s - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'LOG-SAM-02-OEM-00113',
        'Samsung A02 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'LOG-SAM-02-OEM-00114',
        'Samsung Note 8 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'LOG-SAM-02-OEM-00115',
        'Samsung A21s - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'LOG-SAM-02-OEM-00116',
        'Samsung A51 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'LOG-SAM-02-OEM-00117',
        'Samsung J7 Pro - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Samsung'
        ),
        'OEM',
        0
    ),
    (
        'LOG-ALC-02-OEM-00118',
        'Alcatel 4047 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Alcatel'
        ),
        'OEM',
        0
    ),
    (
        'LOG-ALC-02-OEM-00119',
        'Alcatel Idol 3 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Alcatel'
        ),
        'OEM',
        0
    ),
    (
        'LOG-ALC-02-OEM-00120',
        'Alcatel 1L Pro - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Alcatel'
        ),
        'OEM',
        0
    ),
    (
        'LOG-ALC-02-OEM-00121',
        'Alcatel X3 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Alcatel'
        ),
        'OEM',
        0
    ),
    (
        'LOG-LAN-02-OEM-00122',
        'Lanix M9 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Lanix'
        ),
        'OEM',
        0
    ),
    (
        'LOG-NIX-02-OEM-00123',
        'Nix Fly - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Nix'
        ),
        'OEM',
        0
    ),
    (
        'LOG-OPP-02-OEM-00124',
        'Oppo A15 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Oppo'
        ),
        'OEM',
        0
    ),
    (
        'LOG-OPP-02-OEM-00125',
        'Oppo A54 4G - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Oppo'
        ),
        'OEM',
        0
    ),
    (
        'LOG-OPP-02-OEM-00126',
        'Oppo C11 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'Oppo'
        ),
        'OEM',
        0
    ),
    (
        'LOG-LGX-02-OEM-00127',
        'LG K25 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'LG'
        ),
        'OEM',
        0
    ),
    (
        'LOG-ZTE-02-OEM-00128',
        'ZTE Axon 50 Lite - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'OEM',
        0
    ),
    (
        'LOG-ZTE-02-OEM-00129',
        'ZTE V Smart - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'OEM',
        0
    ),
    (
        'LOG-ZTE-02-OEM-00130',
        'ZTE A5 - Tarjeta Lógica',
        (
            SELECT id
            FROM public.categories
            WHERE name = 'Tarjeta Lógica'
        ),
        (
            SELECT id
            FROM public.brands
            WHERE name = 'ZTE'
        ),
        'OEM',
        0
    );
-- Carga de Inventario y Movimientos de Stock
-- Basado en las cantidades del CSV piloto
-- Usamos un cursor o insert directo relacionando por SKU
INSERT INTO public.inventory (product_id, warehouse_id, quantity)
SELECT id,
    v_warehouse_id,
    CASE
        WHEN sku = 'BAT-SAM-01-AFT-00001' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00002' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00003' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00004' THEN 2
        WHEN sku = 'BAT-SAM-01-AFT-00005' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00006' THEN 2
        WHEN sku = 'BAT-SAM-01-AFT-00007' THEN 3
        WHEN sku = 'BAT-SAM-01-AFT-00008' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00009' THEN 2
        WHEN sku = 'BAT-SAM-01-AFT-00010' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00011' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00012' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00013' THEN 3
        WHEN sku = 'BAT-SAM-01-AFT-00014' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00015' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00016' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00017' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00018' THEN 1
        WHEN sku = 'BAT-SAM-01-AFT-00019' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00020' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00021' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00022' THEN 2
        WHEN sku = 'BAT-MOT-01-AFT-00023' THEN 2
        WHEN sku = 'BAT-MOT-01-AFT-00024' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00025' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00026' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00027' THEN 2
        WHEN sku = 'BAT-MOT-01-AFT-00028' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00029' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00030' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00031' THEN 1
        WHEN sku = 'BAT-MOT-01-AFT-00032' THEN 1
        WHEN sku = 'BAT-XIO-01-AFT-00033' THEN 2
        WHEN sku = 'BAT-XIO-01-AFT-00034' THEN 2
        WHEN sku = 'BAT-XIO-01-AFT-00035' THEN 1
        WHEN sku = 'BAT-XIO-01-AFT-00036' THEN 1
        WHEN sku = 'BAT-XIO-01-AFT-00037' THEN 1
        WHEN sku = 'BAT-XIO-01-AFT-00038' THEN 1
        WHEN sku = 'BAT-XIO-01-AFT-00039' THEN 2
        WHEN sku = 'BAT-XIO-01-AFT-00040' THEN 1
        WHEN sku = 'BAT-XIO-01-AFT-00041' THEN 1
        WHEN sku = 'BAT-REA-01-AFT-00042' THEN 1
        WHEN sku = 'BAT-XIO-01-AFT-00043' THEN 1
        WHEN sku = 'BAT-OPP-01-AFT-00044' THEN 1
        WHEN sku = 'BAT-HUA-01-AFT-00045' THEN 1
        WHEN sku = 'BAT-HUA-01-AFT-00046' THEN 1
        WHEN sku = 'BAT-HUA-01-AFT-00047' THEN 1
        WHEN sku = 'BAT-HUA-01-AFT-00048' THEN 1
        WHEN sku = 'BAT-HUA-01-AFT-00049' THEN 1
        WHEN sku = 'BAT-HIS-01-AFT-00050' THEN 2
        WHEN sku = 'BAT-ASU-01-AFT-00051' THEN 1
        WHEN sku = 'BAT-TCL-01-AFT-00052' THEN 1
        WHEN sku = 'BAT-GPR-01-AFT-00053' THEN 1
        WHEN sku = 'BAT-LEN-01-AFT-00054' THEN 1
        WHEN sku = 'BAT-ZTE-01-AFT-00055' THEN 1
        WHEN sku = 'BAT-ZTE-01-AFT-00056' THEN 1
        WHEN sku = 'BAT-ZTE-01-AFT-00057' THEN 1
        WHEN sku = 'BAT-ZTE-01-AFT-00058' THEN 1
        WHEN sku = 'BAT-ZTE-01-AFT-00059' THEN 1
        WHEN sku = 'BAT-ZTE-01-AFT-00060' THEN 1
        WHEN sku = 'BAT-HON-01-AFT-00061' THEN 1
        WHEN sku = 'BAT-HON-01-AFT-00062' THEN 1
        WHEN sku = 'BAT-ALC-01-AFT-00063' THEN 1
        WHEN sku = 'BAT-ALC-01-AFT-00064' THEN 1
        WHEN sku = 'BAT-ALC-01-AFT-00065' THEN 1
        WHEN sku = 'TJC-SAM-01-OEM-00066' THEN 1
        WHEN sku = 'TJC-SAM-01-OEM-00067' THEN 2
        WHEN sku = 'TJC-SAM-01-OEM-00068' THEN 1
        WHEN sku = 'TJC-SAM-01-OEM-00069' THEN 1
        WHEN sku = 'TJC-SAM-01-OEM-00070' THEN 1
        WHEN sku = 'TJC-SAM-01-OEM-00071' THEN 1
        WHEN sku = 'TJC-ZTE-01-OEM-00072' THEN 1
        WHEN sku = 'TJC-ZTE-01-OEM-00073' THEN 1
        WHEN sku = 'TJC-ZTE-01-OEM-00074' THEN 1
        WHEN sku = 'TJC-ZTE-01-OEM-00075' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00076' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00077' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00078' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00079' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00080' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00081' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00082' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00083' THEN 1
        WHEN sku = 'TJC-MOT-01-OEM-00084' THEN 1
        WHEN sku = 'TJC-LAN-01-OEM-00085' THEN 1
        WHEN sku = 'TJC-HON-01-OEM-00086' THEN 1
        WHEN sku = 'TJC-HON-01-OEM-00087' THEN 1
        WHEN sku = 'TJC-HON-01-OEM-00088' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00089' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00090' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00091' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00092' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00093' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00094' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00095' THEN 1
        WHEN sku = 'TJC-XIO-01-OEM-00096' THEN 1
        WHEN sku = 'TJC-OPP-01-OEM-00097' THEN 2
        WHEN sku = 'TJC-OPP-01-OEM-00098' THEN 1
        WHEN sku = 'TJC-OPP-01-OEM-00099' THEN 1
        WHEN sku = 'LOG-XIO-02-OEM-00100' THEN 1
        WHEN sku = 'LOG-XIO-02-OEM-00101' THEN 1
        WHEN sku = 'LOG-XIO-02-OEM-00102' THEN 1
        WHEN sku = 'LOG-HUA-02-OEM-00103' THEN 1
        WHEN sku = 'LOG-HUA-02-OEM-00104' THEN 1
        WHEN sku = 'LOG-HUA-02-OEM-00105' THEN 1
        WHEN sku = 'LOG-HUA-02-OEM-00106' THEN 1
        WHEN sku = 'LOG-MOT-02-OEM-00107' THEN 2
        WHEN sku = 'LOG-MOT-02-OEM-00108' THEN 2
        WHEN sku = 'LOG-MOT-02-OEM-00109' THEN 1
        WHEN sku = 'LOG-MOT-02-OEM-00110' THEN 1
        WHEN sku = 'LOG-MOT-02-OEM-00111' THEN 1
        WHEN sku = 'LOG-SAM-02-OEM-00112' THEN 1
        WHEN sku = 'LOG-SAM-02-OEM-00113' THEN 1
        WHEN sku = 'LOG-SAM-02-OEM-00114' THEN 1
        WHEN sku = 'LOG-SAM-02-OEM-00115' THEN 1
        WHEN sku = 'LOG-SAM-02-OEM-00116' THEN 1
        WHEN sku = 'LOG-SAM-02-OEM-00117' THEN 1
        WHEN sku = 'LOG-ALC-02-OEM-00118' THEN 1
        WHEN sku = 'LOG-ALC-02-OEM-00119' THEN 2
        WHEN sku = 'LOG-ALC-02-OEM-00120' THEN 1
        WHEN sku = 'LOG-ALC-02-OEM-00121' THEN 1
        WHEN sku = 'LOG-LAN-02-OEM-00122' THEN 1
        WHEN sku = 'LOG-NIX-02-OEM-00123' THEN 1
        WHEN sku = 'LOG-OPP-02-OEM-00124' THEN 2
        WHEN sku = 'LOG-OPP-02-OEM-00125' THEN 1
        WHEN sku = 'LOG-OPP-02-OEM-00126' THEN 1
        WHEN sku = 'LOG-LGX-02-OEM-00127' THEN 1
        WHEN sku = 'LOG-ZTE-02-OEM-00128' THEN 1
        WHEN sku = 'LOG-ZTE-02-OEM-00129' THEN 1
        WHEN sku = 'LOG-ZTE-02-OEM-00130' THEN 1
        ELSE 0
    END as stock
FROM public.products;
-- Registrar movimientos iniciales para trazabilidad
INSERT INTO public.stock_movements (
        product_id,
        warehouse_id,
        user_id,
        quantity_change,
        reason,
        status
    )
SELECT id,
    v_warehouse_id,
    v_admin_id,
    (
        SELECT quantity
        FROM public.inventory
        WHERE product_id = products.id
            AND warehouse_id = v_warehouse_id
    ),
    'Carga inicial Pilot Project',
    'synced'
FROM public.products;
END $$;