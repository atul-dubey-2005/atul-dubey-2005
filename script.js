document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis Smooth Scroll Initialization
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // 2. Preloader & Decoder Effect
    const preloader = document.getElementById('vengeance-preloader');
    if (preloader) {
        window.addEventListener('load', () => setTimeout(() => { preloader.classList.add('fade-out'); startDecodeEffect(); }, 2000));
    } else startDecodeEffect();

    function startDecodeEffect() {
        const decodeElem = document.querySelector('.decode-text');
        if(!decodeElem || prefersReducedMotion) return;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let iteration = 0;
        const originalText = decodeElem.dataset.value;
        const interval = setInterval(() => {
            decodeElem.innerText = originalText.split("").map((l, i) => i < iteration ? originalText[i] : letters[Math.floor(Math.random() * 26)]).join("");
            if(iteration >= originalText.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    }

    // 3. Dynamic Theme Switcher
    const themeBtn = document.getElementById('themeToggleBtn');
    const themes = ['default', 'cyberpunk', 'monochrome'];
    let currentThemeIdx = 0;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('atul_theme');
    if(savedTheme && themes.includes(savedTheme)) {
        currentThemeIdx = themes.indexOf(savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
    }

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentThemeIdx = (currentThemeIdx + 1) % themes.length;
            const newTheme = themes[currentThemeIdx];
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('atul_theme', newTheme);
        });
    }

    // 4. Custom Glowing Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    if (cursorDot && cursorOutline && !isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });
    }

    // 5. Project Hover Image Reveal
    const floatPreview = document.getElementById('projectPreviewFloat');
    const floatImg = floatPreview?.querySelector('img');
    if (!isTouchDevice && floatPreview) {
        document.querySelectorAll('.hover-reveal').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const imgUrl = card.getAttribute('data-image');
                if(imgUrl) { floatImg.src = imgUrl; floatPreview.classList.add('show'); }
            });
            card.addEventListener('mousemove', (e) => {
                floatPreview.style.left = `${e.clientX + 20}px`;
                floatPreview.style.top = `${e.clientY + 20}px`;
            });
            card.addEventListener('mouseleave', () => floatPreview.classList.remove('show'));
        });
    }

    // 6. Magnetic Buttons
    if(!isTouchDevice) {
        document.querySelectorAll('.skiper-magnetic-wrap').forEach(wrap => {
            const el = wrap.querySelector('.skiper-magnetic');
            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                el.style.transform = `translate(${(e.clientX - rect.left - rect.width/2) * 0.3}px, ${(e.clientY - rect.top - rect.height/2) * 0.3}px)`;
            });
            wrap.addEventListener('mouseleave', () => el.style.transform = `translate(0px, 0px)`);
        });
    }

    // 7. Smart Header & Progress
    const smartHeader = document.getElementById('smartHeader');
    const scrollProgress = document.getElementById('scrollProgress');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) smartHeader.classList.add('header-scrolled');
        else smartHeader.classList.remove('header-scrolled');
        if (window.scrollY > lastScrollY && window.scrollY > 150) smartHeader.classList.add('header-hidden');
        else smartHeader.classList.remove('header-hidden');
        lastScrollY = window.scrollY;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress) scrollProgress.style.width = `${(window.pageYOffset / totalHeight) * 100}%`;
    }, { passive: true });

    // 8. Dual Project Filter
    const techBtns = document.querySelectorAll('.filter-btn');
    const statusBtns = document.querySelectorAll('.filter-btn-status');
    const projectCards = document.querySelectorAll('.projects-wrapper > div');
    let currentTech = 'all', currentStatus = 'all';

    function applyFilters() {
        projectCards.forEach(card => {
            const tMatch = (currentTech === 'all' || currentTech === card.dataset.category);
            const sMatch = (currentStatus === 'all' || currentStatus === card.dataset.status);
            if (tMatch && sMatch) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
            } else {
                card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
                setTimeout(() => { card.style.display = 'none'; }, 350); 
            }
        });
    }
    techBtns.forEach(btn => btn.addEventListener('click', () => {
        techBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); currentTech = btn.dataset.filter; applyFilters();
    }));
    statusBtns.forEach(btn => btn.addEventListener('click', () => {
        statusBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); currentStatus = btn.dataset.status; applyFilters();
    }));

    // 9. Fetch Dev.to Blog API
    async function fetchBlogs() {
        const blogList = document.getElementById('blogList');
        if(!blogList) return;
        try {
            // Fetching generic trending JS/Java articles as placeholder (You can replace with username API if you have a dev.to account)
            const res = await fetch('https://dev.to/api/articles?tag=javascript&top=1&per_page=2');
            const articles = await res.json();
            if(articles.length > 0) {
                blogList.innerHTML = articles.map(a => `
                    <a href="${a.url}" target="_blank" class="blog-card skiper-magnetic-wrap">
                        <div class="skiper-magnetic" style="flex-direction:column; align-items:flex-start;">
                            <h4>${a.title}</h4>
                            <span>❤️ ${a.public_reactions_count} reactions • ${new Date(a.published_at).toLocaleDateString()}</span>
                        </div>
                    </a>
                `).join('');
            } else blogList.innerHTML = '<p class="text-muted">No recent articles.</p>';
        } catch(err) { blogList.innerHTML = '<p class="text-muted">Unable to load feed.</p>'; }
    }
    fetchBlogs();

    // 10. Hidden Easter Egg (Konami Style: Type "BGMI")
    let keyBuffer = '';
    const secretCode = 'bgmi';
    const overlay = document.getElementById('easterEggOverlay');
    
    window.addEventListener('keydown', (e) => {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > secretCode.length) keyBuffer = keyBuffer.slice(1);
        if (keyBuffer === secretCode) {
            overlay.classList.add('active');
            setTimeout(() => { overlay.classList.remove('active'); keyBuffer = ''; }, 3000);
        }
    });

    // 11. Staggered Reveals
    const staggerParents = document.querySelectorAll('.animaster-stagger-parent');
    if (!prefersReducedMotion) {
        const staggerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.animaster-stagger').forEach((child, index) => {
                        setTimeout(() => child.classList.add('is-visible'), index * 100); 
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        staggerParents.forEach(el => staggerObserver.observe(el));
    } else document.querySelectorAll('.animaster-stagger').forEach(el => el.classList.add('is-visible'));

    // 12. Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));
    }

    // 13. Supabase & Nodemailer Logic (kept from previous code)
    // Please inject your exact API keys in the Supabase logic as previously provided.
    // ...
});
