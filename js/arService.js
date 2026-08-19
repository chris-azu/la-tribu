// ============================================
// LA TRIBU — AR Service
// Device detection + AR fallback
// ============================================

var ARService = {
  detect: function() {
    var ua = navigator.userAgent || '';
    var isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/.test(ua);
    var isMobile = isIOS || isAndroid;

    return {
      isIOS: isIOS,
      isAndroid: isAndroid,
      isMobile: isMobile,
      quickLook: isIOS,
      sceneViewer: isAndroid,
      webXR: typeof navigator !== 'undefined' && 'xr' in navigator,
      supported: isMobile
    };
  },

  openAR: function(product) {
    var capability = this.detect();

    if (capability.quickLook && product.model_usdz) {
      // iOS: opening .usdz triggers Quick Look natively
      window.location.href = product.model_usdz;
    } else if (capability.sceneViewer && product.model_glb) {
      // Android: Scene Viewer intent
      var fileUrl = product.model_glb;
      var intent = 'intent://arvr.google.com/scene-viewer/1.0?file=' +
        encodeURIComponent(fileUrl) +
        '#Intent;scheme=https;package=com.google.ar.core;end';
      window.location.href = intent;
    } else if (capability.webXR) {
      // WebXR fallback — handled by model-viewer
      this._showWebXRMessage();
    } else {
      // No AR support
      this._showFallback();
    }
  },

  _showWebXRMessage: function() {
    var status = document.getElementById('arStatus');
    if (status) {
      status.style.display = '';
      status.textContent = 'WebXR disponible. Pulsa el botón AR en el visor 3D.';
      status.classList.remove('error');
    }
  },

  _showFallback: function() {
    var status = document.getElementById('arStatus');
    if (status) {
      status.style.display = '';
      status.innerHTML = '<strong>Tu dispositivo no admite realidad aumentada.</strong><br>Puedes explorar el plato en el visor 3D.';
      status.classList.add('error');
    }
  }
};
