-- ============================================
-- LA TRIBU — Seed Data
-- ============================================

USE la_tribu;

-- Categorias
INSERT INTO categorias (nombre, slug, descripcion, orden, activa) VALUES
('Comida', 'comida', 'Platos principales', 1, TRUE),
('Snacks', 'snacks', 'Aperitivos y botanas', 2, TRUE),
('Bebidas', 'bebidas', 'Bebidas frescas', 3, TRUE),
('Postres', 'postres', 'Dulces tentaciones', 4, TRUE);

-- Productos
INSERT INTO productos (nombre, slug, descripcion, descripcion_corta, precio, categoria_id, imagen, modelo_glb, modelo_usdz, modelo_status, modelo_provider, disponible, destacado, deleted_at) VALUES
('Hamburguesa La Tribu', 'hamburguesa-la-tribu', 'Doble carne Angus 200g, queso cheddar derretido, cebolla caramelizada, lechuga romana, tomate heirloom y nuestra salsa signature en pan brioche artesanal.', 'Doble carne Angus, queso cheddar, cebolla caramelizada', 12.50, 1, 'assets/images/burger.webp', 'assets/models/burger.glb', 'assets/models/burger.usdz', 'completado', NULL, TRUE, TRUE, NULL),
('Tacos Al Pastor', 'tacos-al-pastor', 'Cerdo marinado 24 horas con achiote y piña, cebolla morada, cilantro fresco y salsa verde en tortilla de maíz artesanal.', 'Cerdo marinado con piña, tortilla artesanal', 9.80, 1, 'assets/images/tacos.webp', 'assets/models/tacos.glb', 'assets/models/tacos.usdz', 'completado', NULL, TRUE, TRUE, NULL),
('Lomo Saltado', 'lomo-saltado', 'Wagyu beef, reducción de soja y balsámico, papas confitadas, ají amarillo ahumado y arroz jazmín.', 'Wagyu, reducción soja-balsámico, papas confitadas', 65.00, 1, 'assets/images/lomo.webp', 'assets/models/lomo.glb', 'assets/models/lomo.usdz', 'completado', NULL, TRUE, TRUE, NULL),
('Chicken Wings', 'chicken-wings', 'Alitas de pollo crujientes en salsa buffalo casera, servidas con aderezo blue cheese y bastones de apio.', 'Alitas crujientes, salsa buffalo, blue cheese', 8.50, 2, 'assets/images/wings.webp', 'assets/models/wings.glb', 'assets/models/wings.usdz', 'completado', NULL, TRUE, FALSE, NULL),
('Guacamole Bowl', 'guacamole-bowl', 'Guacamole fresco preparado al momento con aguacate Hass, lima, cilantro, jalapeño y totopos de maíz artesanales.', 'Guacamole fresco con totopos artesanales', 8.00, 2, 'assets/images/guacamole.webp', 'assets/models/guacamole.glb', 'assets/models/guacamole.usdz', 'completado', NULL, TRUE, FALSE, NULL),
('Horchata', 'horchata', 'Bebida tradicional de arroz con canela de Ceilán, vainilla natural y un toque de almendra tostada.', 'Bebida de arroz con canela y vainilla', 3.50, 3, 'assets/images/horchata.webp', NULL, NULL, NULL, NULL, TRUE, FALSE, NULL),
('Churros con Chocolate', 'churros-chocolate', 'Churros recién hechos, crujientes por fuera, esponjosos por dentro, espolvoreados con azúcar y canela. Servidos con salsa de chocolate belga.', 'Churros crujientes con salsa de chocolate belga', 6.50, 4, 'assets/images/churros.webp', 'assets/models/churros.glb', 'assets/models/churros.usdz', 'completado', NULL, TRUE, TRUE, NULL),
('Nachos Supreme', 'nachos-supreme', 'Tortilla chips dorados con queso cheddar fundido, frijoles negros, pico de gallo, crema agria y jalapeños.', 'Chips con queso, frijoles, pico de gallo', 7.80, 2, 'assets/images/nachos.webp', 'assets/models/nachos.glb', 'assets/models/nachos.usdz', 'completado', NULL, TRUE, FALSE, NULL),
('Agua de Jamaica', 'agua-de-jamaica', 'Agua fresca de flor de jamaica orgánica con un toque de lima y agave natural.', 'Agua fresca de jamaica con lima', 3.00, 3, 'assets/images/jamaica.webp', NULL, NULL, NULL, NULL, TRUE, FALSE, NULL);

-- Configuracion
INSERT INTO configuracion (clave, valor) VALUES
('restaurant_name', 'La Tribu'),
('whatsapp_number', '5491123456789'),
('address', 'Av. Corrientes 1234, Barrio Norte'),
('city', 'Buenos Aires, Argentina'),
('hours', 'Mar - Dom: 19:00 - 01:00'),
('closed_day', 'Lunes: Cerrado'),
('instagram', 'https://instagram.com/latribu'),
('facebook', 'https://facebook.com/latribu');
