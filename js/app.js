// ============================================
// LA TRIBU — App Init
// Conditional 3D/AR buttons based on model data
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // Render featured products on home
  var featuredGrid = document.getElementById('featuredProducts');
  if (featuredGrid && typeof PRODUCTS !== 'undefined') {
    var featured = PRODUCTS.filter(function(p) { return p.featured && !p.deleted_at; });
    featuredGrid.innerHTML = featured.map(function(p) {
      var has3D = !!p.model_glb;
      var hasAR = has3D && typeof ARService !== 'undefined' && ARService.isAvailable(p);

      return '<div class="product-card">' +
        '<img class="product-card-image" src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
        '<div class="product-card-body">' +
          '<h3 class="product-card-name">' + p.name + '</h3>' +
          '<p class="product-card-desc">' + p.short_description + '</p>' +
          '<div class="product-card-footer">' +
            '<span class="product-card-price">$' + p.price.toFixed(2) + ' USD</span>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
              (has3D
                ? '<a href="pages/producto.html?id=' + p.id + '" class="product-card-btn"><i class="fa-solid fa-cube"></i> Ver en 3D</a>'
                : '') +
              (hasAR
                ? '<a href="pages/producto.html?id=' + p.id + '" class="product-card-btn"><i class="fa-solid fa-vr-cardboard"></i> AR</a>'
                : '') +
              '<button class="product-card-btn" onclick="sendWhatsApp(\'' + p.name + '\', ' + p.price + ')">Pedir</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Render categories on home
  var categoriesGrid = document.getElementById('homeCategories');
  if (categoriesGrid && typeof CATEGORIES !== 'undefined') {
    categoriesGrid.innerHTML = CATEGORIES.map(function(c) {
      return '<a href="pages/comida.html?category=' + c.slug + '" class="category-card">' +
        '<img class="category-card-image" src="' + c.image + '" alt="' + c.name + '" loading="lazy">' +
        '<div class="category-card-overlay">' +
          '<span class="category-card-name">' + c.name + '</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }
});
