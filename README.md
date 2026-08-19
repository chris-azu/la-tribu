# LA TRIBU

Fast food premium con Realidad Aumentada.

## Inicio rápido

### Requisitos
- Python 3.8+
- MySQL 8.0+ (opcional, funciona con datos mock)
- Navegador moderno (Chrome, Safari, Firefox)

### Frontend (sin backend)

```bash
# Desde la raíz del proyecto
python -m http.server 8000

# Abrir http://localhost:8000
```

### Con backend Flask

```bash
# 1. Instalar dependencias
cd backend
pip install -r requirements.txt

# 2. Configurar base de datos (opcional)
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Iniciar servidor
python app.py

# Abrir http://localhost:5000
```

### Desde teléfono

```bash
# 1. Verificar IP local
ipconfig  # Windows
ifconfig  # macOS/Linux

# 2. Desde el teléfono, abrir
# http://192.168.1.X:5000
```

## Estructura

```
/
├── index.html          ← Home
├── pages/              ← Food, About, Gallery, Contact
├── admin/              ← Panel administrativo
├── css/                ← Estilos (global, responsive, componentes, admin, 3d)
├── js/                 ← JavaScript vanilla
├── data/               ← Datos mock
├── assets/             ← Imágenes, modelos 3D, iconos
├── backend/            ← Flask + MySQL
└── docs/               ← Documentación
```

## Funcionalidades

- **Menú interactivo** con filtros por categoría
- **Visor 3D** con model-viewer (rotación, zoom, auto-rotate)
- **Realidad Aumentada** real:
  - iPhone: Quick Look (.usdz)
  - Android: Scene Viewer (.glb)
- **WhatsApp** integrado para pedidos
- **Panel administrativo** para gestionar productos
- **Diseño responsive** mobile-first
- **Estética editorial** de restaurante de lujo

## Documentación

- [Testing en presentación](docs/presentation-testing.md)
- [Testing de AR](docs/ar-testing.md)

## Tecnologías

- HTML5, CSS3, JavaScript Vanilla
- Python, Flask
- MySQL
- Google Model Viewer
- Font Awesome
- Cormorant Garamond + Montserrat
