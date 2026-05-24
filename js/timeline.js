/* =========================================================
   TIMELINE — Scroll-driven active state
   The row whose marker is closest to viewport center gets
   .is-active applied, lighting up the circle and panel.
   ========================================================= */

(() => {
  const rows = document.querySelectorAll('.tl-row');
  if (!rows.length) return;

  const updateActive = () => {
    const vh = window.innerHeight;
    const targetY = vh * 0.45; // slightly above center feels natural
    let bestRow = null;
    let bestDist = Infinity;

    rows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const rowMid = rect.top + rect.height / 2;
      const dist = Math.abs(rowMid - targetY);
      if (dist < bestDist) {
        bestDist = dist;
        bestRow = row;
      }
    });

    rows.forEach((row) => {
      if (row === bestRow) row.classList.add('is-active');
      else row.classList.remove('is-active');
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateActive();
})();
