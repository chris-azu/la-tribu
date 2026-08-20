// ============================================
// LA TRIBU — AR Service
// Real device detection, AR modes, fallback
// States: AR_AVAILABLE, AR_UNAVAILABLE, LOADING, OPENING_AR, ERROR
// ============================================

var ARService = {

  // ---- Device Detection ----
  detect: function() {
    var ua = navigator.userAgent || '';
    var isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/.test(ua);
    var isMobile = isIOS || isAndroid;
    var isSafari = isIOS && /^((?!chrome|android).)*safari/i.test(ua);
    var isChrome = /Chrome/.test(ua) && !/Edge/.test(ua);
    var hasWebXR = typeof navigator !== 'undefined' && 'xr' in navigator;

    // Quick Look = iOS Safari + has USDZ
    // Scene Viewer = Android Chrome + has GLB
    // WebXR = Chrome with flag + HTTPS

    return {
      isIOS: isIOS,
      isAndroid: isAndroid,
      isMobile: isMobile,
      isSafari: isSafari,
      isChrome: isChrome,
      quickLook: isIOS,         // Potential — needs USDZ to confirm
      sceneViewer: isAndroid,    // Potential — needs GLB to confirm
      webXR: hasWebXR,
      supported: isMobile || hasWebXR
    };
  },

  // ---- Determine best AR mode for product ----
  getBestMode: function(product) {
    var cap = this.detect();

    // iOS + USDZ = Quick Look
    if (cap.isIOS && product.model_usdz) {
      return 'quick-look';
    }

    // Android + GLB = Scene Viewer
    if (cap.isAndroid && product.model_glb) {
      return 'scene-viewer';
    }

    // WebXR compatible + GLB
    if (cap.webXR && product.model_glb) {
      return 'webxr';
    }

    // No AR possible
    return null;
  },

  // ---- Check if AR is available for this product ----
  isAvailable: function(product) {
    if (!product) return false;
    var mode = this.getBestMode(product);
    return mode !== null;
  },

  // ---- Get human-readable AR mode name ----
  getModeLabel: function(product) {
    var mode = this.getBestMode(product);
    var labels = {
      'quick-look': 'Apple Quick Look',
      'scene-viewer': 'Google Scene Viewer',
      'webxr': 'WebXR'
    };
    return labels[mode] || null;
  },

  // ---- Open AR experience ----
  openAR: function(product) {
    var cap = this.detect();
    var mode = this.getBestMode(product);
    var self = this;

    if (!mode) {
      this._showStatus('no-ar', 'Tu dispositivo no admite realidad aumentada. Explora el plato en el visor 3D.');
      return;
    }

    this._showStatus('opening', 'Abriendo experiencia AR...');

    if (mode === 'quick-look' && product.model_usdz) {
      // iOS: opening .usdz URL triggers Quick Look natively
      // Must be an absolute URL for the intent to work
      var usdzUrl = this._resolveUrl(product.model_usdz);
      window.location.href = usdzUrl;
      return;
    }

    if (mode === 'scene-viewer' && product.model_glb) {
      // Android: Scene Viewer intent
      var glbUrl = this._resolveUrl(product.model_glb);
      // Try Scene Viewer via intent URI
      var intentUrl = 'intent://arvr.google.com/scene-viewer/1.0' +
        '?file=' + encodeURIComponent(glbUrl) +
        '&mode=ar_preferred' +
        '#Intent;scheme=https;package=com.google.ar.core;end';

      // Fallback: try direct model-viewer AR trigger
      var link = document.createElement('a');
      link.href = intentUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // If still on page after 3s, model-viewer may handle it
      setTimeout(function() {
        self._showStatus('error', 'No se pudo abrir Scene Viewer. Intenta con Chrome.');
      }, 3000);
      return;
    }

    if (mode === 'webxr') {
      // WebXR: trigger model-viewer's AR feature
      this._triggerModelViewerAR();
      return;
    }
  },

  // ---- Trigger AR via model-viewer component ----
  _triggerModelViewerAR: function() {
    var mv = document.getElementById('productModelViewer');
    if (mv && mv.canActivateAR) {
      mv.activateAR();
    } else {
      this._showStatus('error', 'WebXR no disponible. Prueba desde tu teléfono.');
    }
  },

  // ---- Resolve relative URL to absolute ----
  _resolveUrl: function(relative) {
    if (!relative) return '';
    if (relative.indexOf('http') === 0) return relative;
    var base = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
    return new URL(relative, base).href;
  },

  // ---- UI Status Management ----
  _showStatus: function(type, message) {
    var el = document.getElementById('arStatus');
    if (!el) return;

    el.style.display = '';
    el.classList.remove('ar-status--error', 'ar-status--info', 'ar-status--opening');

    var icons = {
      'no-ar': '<i class="fa-solid fa-circle-info"></i> ',
      'opening': '<i class="fa-solid fa-spinner fa-spin"></i> ',
      'error': '<i class="fa-solid fa-triangle-exclamation"></i> ',
      'info': ''
    };

    el.innerHTML = (icons[type] || '') + message;

    if (type === 'no-ar' || type === 'error') {
      el.classList.add('ar-status--error');
    } else if (type === 'opening') {
      el.classList.add('ar-status--opening');
    }
  },

  // ---- Get AR instructions for user ----
  getInstructions: function() {
    var cap = this.detect();
    if (cap.isIOS) {
      return 'Apunta tu cámara hacia una superficie plana.';
    }
    if (cap.isAndroid) {
      return 'Apunta tu cámara hacia una superficie. El modelo se colocará automáticamente.';
    }
    return 'Explora el modelo 3D en el visor.';
  }
};
