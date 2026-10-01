/* Analytics: Chart.js charts built from the page's own projects + live GitHub data. Load AFTER Chart.js, BEFORE advanced.js and navbar.js. */
(() => {
  const github = document.getElementById('github');
  if (!github) return;
  const $ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Data taken from the page itself, so it stays in sync when you add projects
  const cards = $('#projects .bento-card[data-status]');
  const live = cards.filter((c) => c.dataset.status === 'live').length;
  const tally = {};
  $('#projects .tech-pills span').forEach((s) => s.textContent.replace(/\(.*?\)/g, '').split(/\s*[\/+]\s*/).forEach((t) => { t = t.trim().replace(/\s+(\d[\d.]*|API)$/i, ''); if (t) tally[t] = (tally[t] || 0) + 1; }));
  const all = Object.entries(tally).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const multi = all.filter((e) => e[1] > 1);
  const tech = (multi.length >= 3 ? multi : all).slice(0, 8);
  const gh = fetch('https://api.github.com/users/atul-dubey-2005/repos?per_page=100').then((r) => (r.ok ? r.json() : null)).catch(() => null);

  // One entry per animation style: easing, duration and (cascade) per-item delay
  const STYLES = {
    smooth: { duration: 1400, easing: 'easeOutQuart' },
    bounce: { duration: 1600, easing: 'easeOutBounce' },
    elastic: { duration: 1900, easing: 'easeOutElastic' },
    cascade: { duration: 900, easing: 'easeOutCubic', delay: (c) => (c.type === 'data' && c.mode === 'default' ? c.dataIndex * 140 : 0) },
  };

  const sec = document.createElement('section');
  sec.id = 'analytics'; sec.className = 'section'; sec.dataset.anim = 'smooth';
  sec.innerHTML = `<h2 class="section-title is-visible"><span class="title-number">00.</span> Analytics</h2>
    <div class="an-head"><p class="an-note">Computed from the projects above, plus live GitHub data.</p>
      <div class="an-controls" role="group" aria-label="Chart animation style">${Object.keys(STYLES).map((k, i) => `<button type="button" data-anim="${k}" class="${i ? '' : 'active'}">${k}</button>`).join('')}<button type="button" aria-label="Replay animation"><i class="fa-solid fa-rotate-right"></i></button></div></div>
    <div class="an-grid"></div>`;
  github.after(sec);
  const grid = sec.querySelector('.an-grid'), note = sec.querySelector('.an-note');

  const li = document.createElement('li'); li.innerHTML = '<a href="#analytics" class="nav-link">Analytics</a>';
  document.querySelector('.nav-menu a[href="#github"]')?.parentElement.after(li);
  $('.section-title .title-number').forEach((n, i) => (n.textContent = String(i + 1).padStart(2, '0') + '.'));

  const charts = [];
  const count = (el) => {
    const to = +el.dataset.count, t0 = performance.now();
    const tick = (t) => { const p = reduce ? 1 : Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const play = () => {
    charts.forEach((c) => { c.options.animation = STYLES[sec.dataset.anim]; c.reset(); c.update(); });
    $('[data-count]', sec).forEach(count);
  };

  const build = (data) => {
    if (!window.Chart) { grid.innerHTML = '<p class="an-empty" style="grid-column:1/-1">Charts could not load (Chart.js is blocked or offline).</p>'; return; }
    const repos = Array.isArray(data) ? data.filter((r) => !r.fork) : null;
    const stars = repos ? repos.reduce((n, r) => n + r.stargazers_count, 0) : null;
    const kpi = (n, l) => `<div class="an-card an-kpi glass-panel"><b ${n == null ? '' : `data-count="${n}"`}>${n == null ? '–' : 0}</b><span>${l}</span></div>`;
    const card = (t, id, ok = true) => `<div class="an-card an-w6 glass-panel"><h3>${t}</h3>${ok ? `<div class="an-canvas"><canvas id="${id}"></canvas></div>` : '<p class="an-empty">GitHub data is unavailable right now (rate limit or offline).</p>'}</div>`;
    grid.innerHTML = kpi(cards.length, 'Projects built') + kpi(live, 'Live apps') + kpi(repos && repos.length, 'Public repos') + kpi(stars, 'GitHub stars')
      + card('Projects by status', 'anStatus') + card('GitHub languages', 'anLang', !!repos) + card('Tech used across projects', 'anTech') + card('Repo growth', 'anGrowth', !!repos);
    note.textContent = repos ? 'Computed from the projects above, plus live GitHub data.' : 'Computed from the projects above. GitHub data could not be loaded.';

    const s = getComputedStyle(document.documentElement), g = (n, d) => s.getPropertyValue(n).trim() || d;
    const C = { cy: g('--accent-cyan', '#38bdf8'), ind: g('--accent-indigo', '#6366f1'), vio: g('--accent-violet', '#a855f7'), gold: g('--accent-gold', '#fbbf24') };
    const PAL = [C.cy, C.ind, C.vio, C.gold, '#10b981', '#f472b6'];
    Chart.defaults.color = g('--text-muted', '#94a3b8'); Chart.defaults.borderColor = g('--panel-border', 'rgba(255,255,255,.08)');
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    if (reduce) Chart.defaults.animation = false;
    const base = { responsive: true, maintainAspectRatio: false, animation: STYLES[sec.dataset.anim] };
    const legend = { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } };
    const mk = (id, cfg) => { const el = document.getElementById(id); if (el) charts.push(new Chart(el, cfg)); };
    const ring = (labels, data) => ({ type: 'doughnut', data: { labels, datasets: [{ data, backgroundColor: PAL, borderWidth: 0, hoverOffset: 10 }] }, options: { ...base, cutout: '68%', plugins: { legend } } });

    mk('anStatus', ring(['Live apps', 'Source only'], [live, cards.length - live]));
    mk('anTech', { type: 'bar', data: { labels: tech.map((t) => t[0]), datasets: [{ data: tech.map((t) => t[1]), backgroundColor: C.ind, borderRadius: 8, maxBarThickness: 22 }] }, options: { ...base, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { precision: 0 } }, y: { grid: { display: false } } } } });
    if (repos) {
      const lang = {}; repos.forEach((r) => r.language && (lang[r.language] = (lang[r.language] || 0) + 1));
      const top = Object.entries(lang).sort((a, b) => b[1] - a[1]).slice(0, 6);
      mk('anLang', ring(top.map((t) => t[0]), top.map((t) => t[1])));
      const m = {}; repos.forEach((r) => { const k = r.created_at.slice(0, 7); m[k] = (m[k] || 0) + 1; });
      let n = 0; const ks = Object.keys(m).sort();
      mk('anGrowth', { type: 'line', data: { labels: ks, datasets: [{ data: ks.map((k) => (n += m[k])), borderColor: C.cy, backgroundColor: /^#[0-9a-f]{6}$/i.test(C.cy) ? C.cy + '26' : C.cy, fill: true, tension: .35, pointRadius: 4, pointBackgroundColor: C.cy }] }, options: { ...base, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } } } });
    }
    $('[data-count]', sec).forEach(count);
  };

  let started = false;
  new IntersectionObserver((es, o) => {
    if (!es[0].isIntersecting) return;
    o.disconnect(); started = true;
    Promise.race([gh, new Promise((r) => setTimeout(r, 2500, null))]).then(build);
  }, { threshold: .1 }).observe(sec);

  sec.addEventListener('click', (e) => {
    const b = e.target.closest('.an-controls button'); if (!b || !started) return;
    if (b.dataset.anim) { sec.dataset.anim = b.dataset.anim; $('.an-controls button[data-anim]', sec).forEach((x) => x.classList.toggle('active', x === b)); }
    play();
  });
})();
