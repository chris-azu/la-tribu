// ============================================
// LA TRIBU — Products Data
// ============================================

const PRODUCTS = [
  {
    id: 1,
    name: "Hamburguesa La Tribu",
    slug: "hamburguesa-la-tribu",
    description: "Doble carne Angus 200g, queso cheddar derretido, cebolla caramelizada, lechuga romana, tomate heirloom y nuestra salsa signature en pan brioche artesanal.",
    short_description: "Doble carne Angus, queso cheddar, cebolla caramelizada",
    price: 12.50,
    category: "comida",
    image: "assets/images/burger.webp",
    model_glb: "assets/models/burger.glb",
    model_usdz: "assets/models/burger.usdz",
    available: true,
    featured: true
  },
  {
    id: 2,
    name: "Tacos Al Pastor",
    slug: "tacos-al-pastor",
    description: "Cerdo marinado 24 horas con achiote y piña, cebolla morada, cilantro fresco y salsa verde en tortilla de maíz artesanal.",
    short_description: "Cerdo marinado con piña, tortilla artesanal",
    price: 9.80,
    category: "comida",
    image: "assets/images/tacos.webp",
    model_glb: "assets/models/tacos.glb",
    model_usdz: "assets/models/tacos.usdz",
    available: true,
    featured: true
  },
  {
    id: 3,
    name: "Lomo Saltado",
    slug: "lomo-saltado",
    description: "Wagyu beef, reducción de soja y balsámico, papas confitadas, ají amarillo ahumado y arroz jazmín.",
    short_description: "Wagyu, reducción soja-balsámico, papas confitadas",
    price: 65.00,
    category: "comida",
    image: "assets/images/lomo.webp",
    model_glb: "assets/models/lomo.glb",
    model_usdz: "assets/models/lomo.usdz",
    available: true,
    featured: true
  },
  {
    id: 4,
    name: "Chicken Wings",
    slug: "chicken-wings",
    description: "Alitas de pollo crujientes en salsa buffalo casera, servidas con aderezo blue cheese y bastones de apio.",
    short_description: "Alitas crujientes, salsa buffalo, blue cheese",
    price: 8.50,
    category: "snacks",
    image: "assets/images/wings.webp",
    model_glb: "assets/models/wings.glb",
    model_usdz: "assets/models/wings.usdz",
    available: true,
    featured: false
  },
  {
    id: 5,
    name: "Guacamole Bowl",
    slug: "guacamole-bowl",
    description: "Guacamole fresco preparado al momento con aguacate Hass, lima, cilantro, jalapeño y totopos de maíz artesanales.",
    short_description: "Guacamole fresco con totopos artesanales",
    price: 8.00,
    category: "snacks",
    image: "assets/images/guacamole.webp",
    model_glb: "assets/models/guacamole.glb",
    model_usdz: "assets/models/guacamole.usdz",
    available: true,
    featured: false
  },
  {
    id: 6,
    name: "Horchata",
    slug: "horchata",
    description: "Bebida tradicional de arroz con canela de Ceilán, vainilla natural y un toque de almendra tostada.",
    short_description: "Bebida de arroz con canela y vainilla",
    price: 3.50,
    category: "bebidas",
    image: "assets/images/horchata.webp",
    model_glb: null,
    model_usdz: null,
    available: true,
    featured: false
  },
  {
    id: 7,
    name: "Churros con Chocolate",
    slug: "churros-chocolate",
    description: "Churros recién hechos, crujientes por fuera, esponjosos por dentro, espolvoreados con azúcar y canela. Servidos con salsa de chocolate belga.",
    short_description: "Churros crujientes con salsa de chocolate belga",
    price: 6.50,
    category: "postres",
    image: "assets/images/churros.webp",
    model_glb: "assets/models/churros.glb",
    model_usdz: "assets/models/churros.usdz",
    available: true,
    featured: true
  },
  {
    id: 8,
    name: "Nachos Supreme",
    slug: "nachos-supreme",
    description: "Tortilla chips dorados con queso cheddar fundido, frijoles negros, pico de gallo, crema agria y jalapeños.",
    short_description: "Chips con queso, frijoles, pico de gallo",
    price: 7.80,
    category: "snacks",
    image: "assets/images/nachos.webp",
    model_glb: "assets/models/nachos.glb",
    model_usdz: "assets/models/nachos.usdz",
    available: true,
    featured: false
  },
  {
    id: 9,
    name: "Agua de Jamaica",
    slug: "agua-de-jamaica",
    description: "Agua fresca de flor de jamaica orgánica con un toque de lima y agave natural. Refrescante y antioxidante.",
    short_description: "Agua fresca de jamaica con lima",
    price: 3.00,
    category: "bebidas",
    image: "assets/images/jamaica.webp",
    model_glb: null,
    model_usdz: null,
    available: true,
    featured: false
  }
];

const CATEGORIES = [
  { id: 1, name: "Comida", slug: "comida", description: "Platos principales", image: "assets/images/cat-comida.webp", active: true },
  { id: 2, name: "Snacks", slug: "snacks", description: "Aperitivos y botanas", image: "assets/images/cat-snacks.webp", active: true },
  { id: 3, name: "Bebidas", slug: "bebidas", description: "Bebidas frescas", image: "assets/images/cat-bebidas.webp", active: true },
  { id: 4, name: "Postres", slug: "postres", description: "Dulces tentaciones", image: "assets/images/cat-postres.webp", active: true }
];
