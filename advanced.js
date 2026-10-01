/* Animaster · Skiper · Vengeance: advanced layer. Load AFTER script.js (reuses its tilt, magnetic, decode, cursor, stagger) */
(() => {
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => [...document.querySelectorAll(s)];

  // Start hero entrance once the preloader has faded
  const pre = document.getElementById('vengeance-preloader');
  const ready = () => document.body.classList.add('is-ready');
  if (!pre) ready();
  else { new MutationObserver((_, o) => { if (pre.classList.contains('fade-out')) { ready(); o.disconnect(); } }).observe(pre, { attributes: true, attributeFilter: ['class'] }); setTimeout(ready, 3200); }

  // Vengeance spotlight follows the pointer on glass panels
  if (!touch) $('.glass-panel').forEach((p) => {
    p.addEventListener('pointermove', (e) => { const r = p.getBoundingClientRect(); p.style.setProperty('--mx', e.clientX - r.left + 'px'); p.style.setProperty('--my', e.clientY - r.top + 'px'); p.style.setProperty('--spot', 1); });
    p.addEventListener('pointerleave', () => p.style.setProperty('--spot', 0));
  });

  // Skiper tech marquee under the stats panel
  const items = [['java', 'Java'], ['python', 'Python'], ['js', 'JavaScript'], ['react', 'React'], ['node-js', 'Node.js'], ['git-alt', 'Git'], ['docker', 'Docker'], ['figma', 'Figma']].map(([i, t]) => [`fa-brands fa-${i}`, t])
    .concat([['fa-solid fa-leaf', 'Spring Boot'], ['fa-solid fa-database', 'MySQL / PostgreSQL'], ['fa-solid fa-chart-line', 'Pandas / R Shiny']]);
  const row = items.map(([c, t]) => `<span><i class="${c}"></i>${t}</span>`).join('');
  const strip = document.createElement('div');
  strip.className = 'tech-marquee'; strip.setAttribute('aria-hidden', 'true');
  strip.innerHTML = `<div class="marquee-track">${row}${row}</div>`;
  document.querySelector('.stats-section')?.append(strip);

  // Scroll-spy for the nav
  const links = $('.nav-link');
  const spy = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $('main section[id]').forEach((s) => spy.observe(s));

  // Interactive cursor + sphere parallax
  if (!touch) document.addEventListener('pointerover', (e) => document.body.classList.toggle('cursor-hover', !!e.target.closest('a, button, summary')));
  if (!reduce) { const s = $('.glow-sphere'); addEventListener('scroll', () => s.forEach((el, i) => el.style.setProperty('--py', -scrollY * (0.04 + i * 0.03) + 'px')), { passive: true }); }
})();
