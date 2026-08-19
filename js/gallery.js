// ============================================
// LA TRIBU — Gallery + Lightbox
// ============================================

(function() {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function getImages() {
    if (window._galleryImages) return window._galleryImages;
    if (typeof SITE_CONFIG !== 'undefined') return SITE_CONFIG.gallery_images;
    return [];
  }

  function openLightbox(index) {
    var images = getImages();
    if (!images.length || !lightbox) return;
    currentIndex = index;
    updateImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateImage() {
    var images = getImages();
    if (!images.length || !lightboxImg) return;
    var img = images[currentIndex];
    lightboxImg.src = '../' + img.src;
    lightboxImg.alt = img.alt;
  }

  function prevImage() {
    var images = getImages();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  }

  function nextImage() {
    var images = getImages();
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe support
  var touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
})();
