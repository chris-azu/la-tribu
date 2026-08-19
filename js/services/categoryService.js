// ============================================
// LA TRIBU — Category Service
// ============================================

var CategoryService = {
  API_BASE: '/api/categories',

  getAll: function() {
    return fetch(this.API_BASE)
      .then(function(r) { return r.json(); })
      .catch(function() {
        return typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
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
