/* =========================================================
   MAIN JS
   - Nav background darkens on scroll
   - Fade-in elements when they enter viewport
   ========================================================= */

(() => {
  // ---------- NAV SCROLL ----------
  const nav = document.getElementById('nav') || document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        nav.style.background = 'rgba(10, 14, 26, 0.85)';
      } else {
        nav.style.background = 'rgba(10, 14, 26, 0.6)';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- FADE-IN OBSERVER ----------
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeEls.forEach((el) => io.observe(el));
  }

  // ---------- MOBILE DRAWER ----------
  const menuBtn = document.querySelector('.nav__menu-btn');
  const drawer = document.querySelector('.nav__drawer');
  if (menuBtn && drawer) {
    const toggleDrawer = (force) => {
      const willOpen = force !== undefined ? force : !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', willOpen);
      menuBtn.classList.toggle('is-open', willOpen);
      menuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      // Lock page scroll while drawer is open
      document.body.style.overflow = willOpen ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => toggleDrawer());
    // Close drawer when any drawer link is clicked
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => toggleDrawer(false));
    });
    // Esc closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) toggleDrawer(false);
    });
  }
})();
