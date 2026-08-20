// ============================================
// LA TRIBU — Model 3D Service
// Production API contract for 3D generation
// ============================================

var Model3dService = {
  API_BASE: '/api/3d',
  _pollingIntervals: {},

  // ---- Start 3D generation from image ----
  // Returns: { id, job_id, status: 'pending'|'processing'|'completed'|'error' }
  generate: function(productId, imageUrl) {
    return fetch(this.API_BASE + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, image_url: imageUrl })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Error starting generation: ' + r.status);
      return r.json();
    });
  },

  // ---- Check generation status ----
  // Returns: { id, estado, modelo_glb, modelo_usdz, job_id, error_mensaje }
  getStatus: function(modelId) {
    return fetch(this.API_BASE + '/status/' + modelId)
      .then(function(r) {
        if (!r.ok) throw new Error('Error checking status: ' + r.status);
        return r.json();
      });
  },

  // ---- Regenerate a failed model ----
  regenerate: function(modelId) {
    return fetch(this.API_BASE + '/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: modelId })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('Error regenerating: ' + r.status);
      return r.json();
    });
  },

  // ---- Poll status until completion ----
  // Calls onStatus(status) on each poll, onDone(result) when done, onError(err) on error
  pollUntilDone: function(modelId, onStatus, onDone, onError) {
    var self = this;
    var maxAttempts = 120; // ~60 seconds at 500ms intervals
    var attempt = 0;

    if (this._pollingIntervals[modelId]) {
      clearInterval(this._pollingIntervals[modelId]);
    }

    this._pollingIntervals[modelId] = setInterval(function() {
      attempt++;
      if (attempt > maxAttempts) {
        self.stopPolling(modelId);
        onError(new Error('Generation timed out'));
        return;
      }

      self.getStatus(modelId)
        .then(function(result) {
          if (onStatus) onStatus(result);

          if (result.estado === 'completado' || result.estado === 'completed') {
            self.stopPolling(modelId);
            onDone(result);
          } else if (result.estado === 'error' || result.estado === 'failed') {
            self.stopPolling(modelId);
            onError(new Error(result.error_mensaje || 'Generation failed'));
          }
        })
        .catch(function(err) {
          self.stopPolling(modelId);
          onError(err);
        });
    }, 500);
  },

  // ---- Stop polling ----
  stopPolling: function(modelId) {
    if (this._pollingIntervals[modelId]) {
      clearInterval(this._pollingIntervals[modelId]);
      delete this._pollingIntervals[modelId];
    }
  },

  // ---- Stop all polling ----
  stopAllPolling: function() {
    var self = this;
    Object.keys(this._pollingIntervals).forEach(function(id) {
      self.stopPolling(id);
    });
  }
};
