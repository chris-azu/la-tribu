# AR Testing — LA TRIBU

Guía específica para probar la funcionalidad de Realidad Aumentada.

---

## Stack tecnológico

| Tecnología | Dispositivo | Formato | Requisitos |
|-----------|------------|---------|------------|
| Apple Quick Look | iPhone/iPad | .usdz | iOS 12+, Safari |
| Scene Viewer | Android | .glb | Android 8+, Chrome, Play Services |
| WebXR | Desktop/Mobile | .glb | Chrome, HTTPS, flag habilitado |

---

## Detección automática

El archivo `js/arService.js` detecta automáticamente:

```javascript
ARService.detect()
// Retorna:
{
  isIOS: true/false,
  isAndroid: true/false,
  isMobile: true/false,
  quickLook: true/false,    // iOS + Safari
  sceneViewer: true/false,  // Android + Chrome
  webXR: true/false,        // Chrome con flag
  supported: true/false     // Al menos iOS o Android
}
```

---

## Flujo por dispositivo

### iPhone (Safari)

```
Usuario abre La Tribu en Safari
  → Food → Selecciona Hamburguesa
  → Toca "Ver en 3D" → Modelo carga en <model-viewer>
  → Toca "Ver en mi Espacio"
  → model-viewer detecta iOS + .usdz
  → Abre Quick Look nativo
  → Usuario coloca hamburguesa sobre la mesa
  → Puede girar, escalar, caminar alrededor
  → Cierra Quick Look → regresa a la web
```

**Archivo necesario:** `burger.usdz`

### Android (Chrome)

```
Usuario abre La Tribu en Chrome
  → Food → Selecciona Hamburguesa
  → Toca "Ver en 3D" → Modelo carga en <model-viewer>
  → Toca "Ver en mi Espacio"
  → model-viewer abre Scene Viewer vía intent
  → Scene Viewer abre cámara
  → Detecta superficie
  → Coloca modelo
  → Usuario puede interactuar
```

**Archivo necesario:** `burger.glb`

---

## Configuración de model-viewer

```html
<model-viewer
  src="burger.glb"
  ios-src="burger.usdz"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  shadow-intensity="0.8"
  environment-image="neutral"
  touch-action="pan-y"
>
</model-viewer>
```

**Atributos clave:**
- `ar`: habilita el botón AR
- `ar-modes`: orden de prioridad para experiencia AR
- `ios-src`: archivo USDZ para Quick Look en iOS
- `src`: archivo GLB para Scene Viewer y WebXR

---

## Formatos de modelo

### GLB (Binary glTF)
- Usado por: Scene Viewer, WebXR, model-viewer
- Tamaño recomendado: <10MB
- Texturas embebidas
- Optimizar con: gltf-pipeline, gltf-transform

### USDZ (Universal Scene Description)
- Usado por: Apple Quick Look
- Solo funciona en iOS/iPadOS/macOS
- Paquete sin compresión ZIP
- Crear con: Reality Converter, usdzconvert

---

## Obtener modelos 3D de prueba

### Opción 1: Modelos gratuitos
- https://sketchfab.com (formato GLB)
- https://market.pmnd.rs (modelos para web)
- https://discoverthreejs.com/models/

### Opción 2: Generar con IA
- Meshy.ai (API disponible en el backend)
- Tripo3D
- Rodin (by Hyper)

### Opción 3: Crear propios
- Blender → exportar como GLB
- Reality Converter → convertir a USDZ

---

## Troubleshooting

### "El botón AR no aparece"
1. Verificar que `ar` attribute está presente en `<model-viewer>`
2. Verificar que el dispositivo es iOS o Android
3. Verificar consola del navegador para errores
4. En desktop: habilitar flag WebXR en `chrome://flags`

### "Quick Look no se abre" (iPhone)
1. Verificar que el archivo .usdz existe y es accesible
2. Verificar que se usa Safari (no Chrome en iOS)
3. Verificar que iOS >= 12
4. Probar directamente: abrir .usdz en Safari

### "Scene Viewer no se abre" (Android)
1. Verificar que el archivo .glb existe
2. Verificar que Google Play Services está actualizado
3. Verificar que Chrome es el navegador por defecto
4. Verificar permisos de cámara

### "WebXR no funciona"
1. Requiere HTTPS (no funciona en localhost sin certificado)
2. Habilitar flag en `chrome://flags/#webxr`
3. Verificar compatibilidad de hardware
4. Usar `ngrok` o `mkcert` para HTTPS local

### "Modelo no se ve"
1. Verificar ruta del archivo .glb/.usdz
2. Verificar que el archivo no está corrupto
3. Abrir directamente .glb en https://gltf-viewer.donmccurdy.com/
4. Verificar tamaño del archivo (<10MB recomendado)

---

## Limitaciones conocidas

1. **localhost**: WebXR no funciona sin HTTPS
2. **iOS Chrome**: No soporta Quick Look (usar Safari)
3. **Android sin Play Services**: Scene Viewer no disponible
4. **Modelos grandes**: Pueden causar lentitud en móviles antiguos
5. **Conexión lenta**: Los modelos .glb tardan en cargar
6. **Permisos cámara**: El usuario debe conceder permiso manualmente

---

## Test en dispositivo real

```bash
# 1. Asegurar que Flask está corriendo
cd backend && python app.py

# 2. Verificar IP local
ipconfig  # Windows

# 3. Desde el teléfono, abrir:
# http://192.168.1.X:5000

# 4. Navegar a Food → Producto con modelo 3D
# 5. Verificar "Ver en 3D" → modelo visible
# 6. Verificar "Ver en mi Espacio" → AR se abre
```

---

## Pre-requisitos para demo AR completa

- [ ] Al menos 1 archivo .glb en `assets/models/`
- [ ] Al menos 1 archivo .usdz en `assets/models/`
- [ ] iPhone con Safari para probar Quick Look
- [ ] Android con Chrome para probar Scene Viewer
- [ ] Ambos dispositivos en la misma red WiFi
- [ ] Flask ejecutándose en `0.0.0.0:5000`
