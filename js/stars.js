/* =========================================================
   STARS — Generate random twinkling stars in hero sky
   ========================================================= */

(() => {
  const container = document.querySelector('.hero__stars');
  if (!container) return;

  const STAR_COUNT = 90;
  const accentRate = 0.08; // 8% chance of cyan or orange star

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('span');
    star.className = 'hero__star';

    // 8% cyan, 4% orange, rest white
    const r = Math.random();
    if (r < 0.04) star.classList.add('hero__star--orange');
    else if (r < 0.04 + accentRate) star.classList.add('hero__star--cyan');

    // Random position
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 70 + '%'; // upper 70% of hero only

    // Random size (1-3px)
    const size = 0.8 + Math.random() * 2;
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    // Random animation timing — staggered twinkle
    star.style.animationDelay = (Math.random() * 4) + 's';
    star.style.animationDuration = (3 + Math.random() * 4) + 's';

    // Random base opacity
    star.style.opacity = 0.4 + Math.random() * 0.5;

    container.appendChild(star);
  }
})();
