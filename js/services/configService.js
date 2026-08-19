// ============================================
// LA TRIBU — Config Service
// ============================================

var ConfigService = {
  API_BASE: '/api/config',

  get: function() {
    return fetch(this.API_BASE)
      .then(function(r) { return r.json(); })
      .catch(function() {
        return typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
      });
  },

  update: function(data) {
    return fetch(this.API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
  }
};
