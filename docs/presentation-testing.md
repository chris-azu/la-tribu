# Presentation Testing — LA TRIBU

Guía completa para probar la aplicación en dispositivos reales.

---

## 1. Iniciar MySQL

```bash
# Windows
net start mysql80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

## 2. Crear base de datos

```bash
mysql -u root -p < backend/schema.sql
mysql -u root -p < backend/seed.sql
```

## 3. Instalar dependencias del backend

```bash
cd backend
pip install -r requirements.txt
```

## 4. Configurar .env

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

## 5. Iniciar Flask

```bash
cd backend
python app.py
```

El servidor arranca en: `http://localhost:5000`

## 6. Frontend standalone (sin Flask)

```bash
# Desde la raíz del proyecto
python -m http.server 8000
```

Abrir: `http://localhost:8000`

## 7. Encontrar IP local

```bash
# Windows
ipconfig

# Buscar: Dirección IPv4 (ej: 192.168.1.100)

# macOS / Linux
ifconfig
# o
ip addr
```

## 8. Conectar teléfono a la misma red

1. Asegurar que el teléfono y la computadora estén en la misma red WiFi
2. En el teléfono, abrir el navegador
3. Navegar a `http://192.168.1.X:5000` (reemplazar X con tu IP)

## 9. Probar iPhone (Safari)

1. Abrir Safari en el iPhone
2. Navegar a `http://192.168.1.X:5000`
3. Ir a **Food** → seleccionar un producto
4. Tocar **"Ver en 3D"**
5. El modelo 3D se carga y permite rotar/zoom
6. Si hay USDZ disponible: tocar **"Ver en mi Espacio"**
7. Quick Look se abre nativamente
8. Colocar el modelo en una superficie real

**Requisitos iPhone:**
- iOS 12+
- Safari (no Chrome en iOS para Quick Look)
- Modelo .usdz disponible

## 10. Probar Android (Chrome)

1. Abrir Chrome en el Android
2. Navegar a `http://192.168.1.X:5000`
3. Ir a **Food** → seleccionar un producto
4. Tocar **"Ver en 3D"**
5. Tocar **"Ver en mi Espacio"**
6. Scene Viewer se abre nativamente
7. Colocar el modelo en una superficie real

**Requisitos Android:**
- Android 8.0+
- Google Chrome
- Google Play Services (para Scene Viewer)
- Modelo .glb disponible

## 11. Probar visor 3D (cualquier dispositivo)

1. Abrir la web
2. Ir a **Food** → cualquier producto con modelo 3D
3. Tocar **"Ver en 3D"**
4. El modelo se carga en `<model-viewer>`
5. Rotar: deslizar con un dedo
6. Zoom: pellizcar con dos dedos
7. Auto-rotate activado por defecto

## 12. Probar AR

### Quick Look (iPhone)
1. Necesita HTTPS o servidor local en red
2. Abrir en Safari
3. Seleccionar producto con USDZ
4. "Ver en mi Espacio" → abre Quick Look
5. Mover el teléfono para colocar el modelo

### Scene Viewer (Android)
1. Abrir en Chrome
2. Seleccionar producto con GLB
3. "Ver en mi Espacio" → abre Scene Viewer
4. Apuntar a una superficie
5. El modelo se coloca automáticamente

### WebXR (Chrome desktop)
1. Abrir `chrome://flags`
2. Habilitar "WebXR Device API"
3. Reiniciar Chrome
4. Si hay soporte, el botón AR aparece en el visor

## 13. Si AR no aparece

- Verificar que el dispositivo soporta AR
- Verificar que el producto tiene modelo 3D (.glb o .usdz)
- En localhost, AR puede no funcionar (se requiere HTTPS para WebXR)
- Quick Look y Scene Viewer funcionan por intents (no necesitan HTTPS)
- Verificar que Chrome tiene Play Services actualizados (Android)

## 14. Si el navegador bloquea una función

- **Cámara**: conceder permisos cuando el navegador lo solicite
- **WebXR**: requiere contexto seguro (HTTPS)
- **Archivos grandes**: verificar conexión WiFi estable
- **Modelos 3D**: los modelos .glb/.usdz deben estar en el servidor

## 15. HTTPS local (opcional)

Para probar WebXR u otras APIs que requieren HTTPS:

### Opción 1: mkcert
```bash
# Instalar mkcert
choco install mkcert  # Windows
brew install mkcert   # macOS

# Crear certificado local
mkcert -install
mkcert localhost 192.168.1.X

# Usar con Flask
cd backend
export SSL_CERT_FILE=localhost+1.pem
export SSL_KEY_FILE=localhost+1-key.pem
python -c "
from app import app
app.run(host='0.0.0.0', port=5000, ssl_context=('localhost+1.pem', 'localhost+1-key.pem'))
"
```

### Opción 2: ngrok
```bash
ngrok http 5000
```

Usar la URL proporcionada por ngrok (es HTTPS automáticamente).

---

## Notas importantes

- Los modelos 3D (.glb, .usdz) deben existir en `assets/models/` o `uploads/models/`
- Sin modelos reales, la función AR mostrará fallback a visor 3D
- Las imágenes placeholder mostrarán errores visuales hasta que se agreguen fotos reales
- El número de WhatsApp es configurable en `backend/.env` y `data/config.js`
- La generación 3D por IA requiere API key de Meshy u otro proveedor
