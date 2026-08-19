// ============================================
// LA TRIBU — Model 3D Service
// ============================================

var Model3dService = {
  API_BASE: '/api/3d',

  generate: function(productId, imageUrl) {
    return fetch(this.API_BASE + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, image_url: imageUrl })
    }).then(function(r) { return r.json(); });
  },

  getStatus: function(id) {
    return fetch(this.API_BASE + '/status/' + id)
      .then(function(r) { return r.json(); });
  },

  regenerate: function(id) {
    return fetch(this.API_BASE + '/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    }).then(function(r) { return r.json(); });
  }
};
