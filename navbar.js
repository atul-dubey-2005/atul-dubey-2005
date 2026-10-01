/* PC navbar: icons, GSAP sliding pill (CSS fallback), scrolled state, section rail. Load LAST (after analytics.js and advanced.js). */
(() => {
  const header = document.querySelector('header'), menu = document.getElementById('navMenu');
  if (!header || !menu) return;
  const ICONS = [[/about/, 'user'], [/skill/, 'layer-group'], [/service/, 'briefcase'], [/project/, 'diagram-project'], [/github/, 'code-branch'], [/analytic/, 'chart-line'], [/timeline/, 'clock-rotate-left'], [/feedback/, 'comment-dots'], [/contact/, 'envelope'], [/faq/, 'circle-question'], [/achiev/, 'trophy']];
  menu.querySelectorAll('.nav-link').forEach((a) => {
    const t = a.textContent.trim(), id = a.getAttribute('href').slice(1), ic = (ICONS.find(([re]) => re.test(id)) || [0, 'circle-dot'])[1];
    a.dataset.label = t; a.innerHTML = `<i class="fa-solid fa-${ic}"></i><span>${t}</span>`;
  });

  const pill = document.createElement('span'); pill.className = 'nav-pill' + (window.gsap ? ' g' : ''); menu.prepend(pill);
  const active = () => menu.querySelector('.nav-link.active');
  const to = (el, instant) => {
    const on = el && matchMedia('(min-width: 901px)').matches;
    if (window.gsap) return gsap.to(pill, on ? { x: el.offsetLeft, width: el.offsetWidth, autoAlpha: 1, duration: instant ? 0 : .6, ease: 'power3.out', overwrite: true } : { autoAlpha: 0, duration: .2 });
    if (on) Object.assign(pill.style, { transform: `translateX(${el.offsetLeft}px)`, width: el.offsetWidth + 'px', opacity: 1 }); else pill.style.opacity = 0;
  };
  menu.addEventListener('pointerover', (e) => { const a = e.target.closest('.nav-link'); if (a) to(a); });
  menu.addEventListener('pointerleave', () => to(active()));
  new MutationObserver((ms) => ms.some((m) => m.target.classList.contains('nav-link')) && to(active())).observe(menu, { subtree: true, attributes: true, attributeFilter: ['class'] });
  new ResizeObserver(() => to(active())).observe(menu);
  document.fonts?.ready.then(() => to(active(), true));

  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // Section progress rail (shown >=1500px, uses the free side margin)
  const secs = [...document.querySelectorAll('main section.section[id]')];
  const rail = document.createElement('nav'); rail.className = 'side-rail'; rail.setAttribute('aria-label', 'Section progress');
  rail.innerHTML = secs.map((s) => `<a href="#${s.id}" data-label="${(s.querySelector('.section-title')?.textContent || s.id).replace(/^\s*\d+\.\s*/, '').trim()}"></a>`).join('');
  document.body.append(rail);
  const dots = [...rail.children];
  const io = new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting && dots.forEach((d) => d.classList.toggle('active', d.getAttribute('href') === '#' + en.target.id))), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => io.observe(s));
})();
