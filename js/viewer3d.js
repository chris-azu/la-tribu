// ============================================
// LA TRIBU — 3D Viewer
// Model Viewer wrapper
// ============================================

(function() {
  // Home viewer - load on click
  var homePoster = document.getElementById('homeViewerPoster');
  var homeModelViewer = document.getElementById('homeModelViewer');
  var homeLoading = document.getElementById('homeViewerLoading');

  if (homePoster && homeModelViewer) {
    homePoster.addEventListener('click', function() {
      homePoster.classList.add('hidden');
      homeLoading.classList.remove('hidden');

      // Load a featured product model
      var featured = (typeof PRODUCTS !== 'undefined')
        ? PRODUCTS.find(function(p) { return p.featured && p.model_glb; })
        : null;

      if (featured) {
        homeModelViewer.src = featured.model_glb;
        if (featured.model_usdz) {
          homeModelViewer.setAttribute('ios-src', featured.model_usdz);
        }
      } else {
        // Fallback: load burger
        homeModelViewer.src = 'assets/models/burger.glb';
      }

      homeModelViewer.addEventListener('load', function onLoad() {
        homeLoading.classList.add('hidden');
        homeModelViewer.removeEventListener('load', onLoad);
      });
    });
  }
})();
