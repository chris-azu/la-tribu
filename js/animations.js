// ============================================
// LA TRIBU — Scroll Animations
// Intersection Observer fade-in
// ============================================

(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  function observeElements() {
    var elements = document.querySelectorAll('.fade-in, .fade-in-only, .stagger');
    elements.forEach(function(el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
  } else {
    observeElements();
  }
})();
