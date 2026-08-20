// ============================================
// LA TRIBU — 3D Viewer
// Real model loading with states, errors, fullscreen
// States: IDLE, LOADING, LOADED, ERROR, FULLSCREEN
// ============================================

var Viewer3D = {

  state: 'IDLE',
  currentProduct: null,
  retryCount: 0,
  MAX_RETRIES: 2,

  // ---- Initialize viewer for a product ----
  init: function(product) {
    this.currentProduct = product;
    this.state = 'IDLE';
    this.retryCount = 0;
    this._updateButtons();
  },

  // ---- Load 3D model ----
  load: function() {
    if (!this.currentProduct || !this.currentProduct.model_glb) return;
    if (this.state === 'LOADING') return;

    var self = this;
    var mv = document.getElementById('productModelViewer');
    var viewer = document.getElementById('productViewer');
    var img = document.getElementById('productImage');
    var controls = document.getElementById('arControls');
    var statusEl = document.getElementById('arStatus');

    if (!mv || !viewer) return;

    this.state = 'LOADING';
    this._updateButtons();
    this._showLoading(true);
    this._hideStatus();

    // Show viewer, hide image
    img.style.display = 'none';
    viewer.style.display = '';
    controls.style.display = '';

    // Set model sources
    var glbPath = this._resolveModelPath(this.currentProduct.model_glb);
    mv.src = glbPath;

    if (this.currentProduct.model_usdz) {
      var usdzPath = this._resolveModelPath(this.currentProduct.model_usdz);
      mv.setAttribute('ios-src', usdzPath);
    }

    // Handle model loaded
    var onLoad = function() {
      self.state = 'LOADED';
      self.retryCount = 0;
      self._showLoading(false);
      self._updateButtons();
      mv.removeEventListener('load', onLoad);
    };

    // Handle model error
    var onError = function(event) {
      self.state = 'ERROR';
      self._showLoading(false);
      self._showError('No pudimos cargar el modelo 3D.');
      mv.removeEventListener('error', onError);
    };

    mv.addEventListener('load', onLoad);
    mv.addEventListener('error', onError);

    // Timeout: if model doesn't load in 15s
    this._loadTimeout = setTimeout(function() {
      if (self.state === 'LOADING') {
        self.state = 'ERROR';
        self._showLoading(false);
        self._showError('El modelo tardó demasiado en cargar.');
        mv.removeEventListener('load', onLoad);
      }
    }, 15000);
  },

  // ---- Unload / Close viewer ----
  close: function() {
    var mv = document.getElementById('productModelViewer');
    var viewer = document.getElementById('productViewer');
    var img = document.getElementById('productImage');
    var controls = document.getElementById('arControls');

    if (mv) mv.src = '';
    if (viewer) viewer.style.display = 'none';
    if (img) img.style.display = '';
    if (controls) controls.style.display = 'none';

    this.state = 'IDLE';
    this._updateButtons();
    this._hideStatus();
    this._showLoading(false);

    if (this._loadTimeout) clearTimeout(this._loadTimeout);
  },

  // ---- Retry loading ----
  retry: function() {
    if (this.retryCount >= this.MAX_RETRIES) {
      this._showError('No se pudo cargar el modelo. Verifica tu conexión.');
      return;
    }
    this.retryCount++;
    this.close();
    var self = this;
    setTimeout(function() { self.load(); }, 300);
  },

  // ---- Reset camera ----
  resetCamera: function() {
    var mv = document.getElementById('productModelViewer');
    if (mv) {
      mv.cameraOrbit = '0deg 75deg 105%';
      mv.fieldOfView = '30deg';
    }
  },

  // ---- Zoom controls ----
  zoomIn: function() {
    var mv = document.getElementById('productModelViewer');
    if (mv && mv.getFieldOfView) {
      mv.fieldOfView = Math.max(10, mv.getFieldOfView() - 5) + 'deg';
    }
  },

  zoomOut: function() {
    var mv = document.getElementById('productModelViewer');
    if (mv && mv.getFieldOfView) {
      mv.fieldOfView = Math.min(90, mv.getFieldOfView() + 5) + 'deg';
    }
  },

  // ---- Fullscreen ----
  openFullscreen: function() {
    if (this.state !== 'LOADED' || !this.currentProduct) return;

    var fs = document.getElementById('fullscreenViewer');
    var mv = document.getElementById('fullscreenModelViewer');
    var title = document.getElementById('fullscreenTitle');

    if (!fs || !mv) return;

    if (title) title.textContent = this.currentProduct.name;

    var glbPath = this._resolveModelPath(this.currentProduct.model_glb);
    mv.src = glbPath;

    if (this.currentProduct.model_usdz) {
      var usdzPath = this._resolveModelPath(this.currentProduct.model_usdz);
      mv.setAttribute('ios-src', usdzPath);
    }

    fs.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeFullscreen: function() {
    var fs = document.getElementById('fullscreenViewer');
    var mv = document.getElementById('fullscreenModelViewer');

    if (fs) fs.classList.remove('active');
    if (mv) mv.src = '';
    document.body.style.overflow = '';
  },

  // ---- Private: Update button states ----
  _updateButtons: function() {
    var btn3D = document.getElementById('btnView3D');
    var btnAR = document.getElementById('btnAR');
    var noModel = document.getElementById('btnNoModel');
    var p = this.currentProduct;

    if (!p) return;

    // Hide all by default
    if (btn3D) btn3D.style.display = 'none';
    if (btnAR) btnAR.style.display = 'none';
    if (noModel) noModel.style.display = 'none';

    // No model available
    if (!p.model_glb) {
      if (noModel) noModel.style.display = '';
      return;
    }

    // Has GLB: show 3D button
    if (btn3D) {
      btn3D.style.display = '';
      if (this.state === 'LOADING') {
        btn3D.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando modelo...';
        btn3D.disabled = true;
      } else if (this.state === 'LOADED') {
        btn3D.innerHTML = '<i class="fa-solid fa-cube"></i> Cerrar visor 3D';
        btn3D.disabled = false;
      } else if (this.state === 'ERROR') {
        btn3D.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reintentar';
        btn3D.disabled = false;
      } else {
        btn3D.innerHTML = '<i class="fa-solid fa-cube"></i> Ver en 3D';
        btn3D.disabled = false;
      }
    }

    // Check AR availability
    if (btnAR) {
      var arAvailable = ARService.isAvailable(p);
      if (arAvailable) {
        btnAR.style.display = '';
        var modeLabel = ARService.getModeLabel(p);
        btnAR.innerHTML = '<i class="fa-solid fa-vr-cardboard"></i> Ver en mi Espacio';
        if (modeLabel) {
          btnAR.title = 'Vía ' + modeLabel;
        }
      }
    }
  },

  // ---- Private: Show/hide loading overlay ----
  _showLoading: function(show) {
    var el = document.getElementById('productViewerLoading');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  },

  // ---- Private: Show error message ----
  _showError: function(message) {
    var statusEl = document.getElementById('arStatus');
    if (!statusEl) return;

    statusEl.style.display = '';
    statusEl.classList.add('ar-status--error');
    statusEl.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> ' + message +
      '<br><button onclick="Viewer3D.retry()" class="btn btn-outline" style="margin-top:12px;padding:8px 20px;font-size:0.7rem;">Reintentar</button>';
  },

  // ---- Private: Hide status ----
  _hideStatus: function() {
    var el = document.getElementById('arStatus');
    if (el) {
      el.style.display = 'none';
      el.classList.remove('ar-status--error', 'ar-status--opening');
    }
  },

  // ---- Private: Resolve model path ----
  _resolveModelPath: function(relative) {
    if (!relative) return '';
    if (relative.indexOf('http') === 0) return relative;
    // Resolve relative to current page
    var base = window.location.pathname.replace(/\/[^\/]*$/, '/');
    return new URL(relative, window.location.origin + base).href;
  }
};

// Global functions for onclick handlers
function toggleViewer3D() {
  if (Viewer3D.state === 'IDLE' || Viewer3D.state === 'ERROR') {
    Viewer3D.load();
  } else if (Viewer3D.state === 'LOADED') {
    Viewer3D.close();
  }
}

function openAR() {
  if (Viewer3D.currentProduct) {
    ARService.openAR(Viewer3D.currentProduct);
  }
}

function resetViewer() {
  Viewer3D.resetCamera();
}

function zoomIn() {
  Viewer3D.zoomIn();
}

function zoomOut() {
  Viewer3D.zoomOut();
}

function toggleFullscreen() {
  Viewer3D.openFullscreen();
}

function closeFullscreen() {
  Viewer3D.closeFullscreen();
}
