// ============================================
// LA TRIBU — Navigation
// Mobile menu, sidebar, active states
// ============================================

(function() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('closeBtn');

  if (!hamburger || !mobileNav) return;

  function openMenu() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    if (closeBtn) closeBtn.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    if (closeBtn) closeBtn.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    if (mobileNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a link
  mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
