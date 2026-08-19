// ============================================
// LA TRIBU — Product Service
// ============================================

var ProductService = {
  API_BASE: '/api/products',

  getAll: function(params) {
    var url = this.API_BASE;
    if (params) {
      var qs = Object.keys(params).map(function(k) {
        return k + '=' + encodeURIComponent(params[k]);
      }).join('&');
      url += '?' + qs;
    }
    return fetch(url)
      .then(function(r) { return r.json(); })
      .catch(function() {
        // Fallback to local data
        return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
      });
  },

  getById: function(id) {
    return fetch(this.API_BASE + '/' + id)
      .then(function(r) { return r.json(); })
      .catch(function() {
        return typeof PRODUCTS !== 'undefined'
          ? PRODUCTS.find(function(p) { return p.id === id; })
          : null;
      });
  },

  create: function(data) {
    return fetch(this.API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
  },

  update: function(id, data) {
    return fetch(this.API_BASE + '/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
  },

  delete: function(id) {
    return fetch(this.API_BASE + '/' + id, {
      method: 'DELETE'
    }).then(function(r) { return r.json(); });
  }
};
