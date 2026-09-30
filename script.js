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
    } else {
        startDecodeEffect();
    }

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
            cursorDot.style.left = `${e.clientX}px`; 
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });
    }

    // 5. Project Hover Image Reveal
    const floatPreview = document.getElementById('projectPreviewFloat');
    const floatImg = floatPreview?.querySelector('img');
    if (!isTouchDevice && floatPreview) {
        document.querySelectorAll('.hover-reveal').forEach(card => {
            card.addEventListener('mouseenter', () => {
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
            if(!el) return;
            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                el.style.transform = `translate(${(e.clientX - rect.left - rect.width/2) * 0.3}px, ${(e.clientY - rect.top - rect.height/2) * 0.3}px)`;
            });
            wrap.addEventListener('mouseleave', () => el.style.transform = `translate(0px, 0px)`);
        });
    }

    // 7. Smart Header & Scroll Progress
    const smartHeader = document.getElementById('smartHeader');
    const scrollProgress = document.getElementById('scrollProgress');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) smartHeader.classList.add('header-scrolled');
        else smartHeader.classList.remove('header-scrolled');

        if (window.scrollY > lastScrollY && window.scrollY > 150) {
            smartHeader.classList.add('header-hidden');
        } else {
            smartHeader.classList.remove('header-hidden');
        }
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

    if (techBtns.length > 0) {
        techBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                techBtns.forEach(b => b.classList.remove('active')); 
                btn.classList.add('active'); 
                currentTech = btn.dataset.filter; 
                applyFilters();
            });
        });
    }

    if (statusBtns.length > 0) {
        statusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                statusBtns.forEach(b => b.classList.remove('active')); 
                btn.classList.add('active'); 
                currentStatus = btn.dataset.status; 
                applyFilters();
            });
        });
    }

    // 9. Fetch Dev.to Blog API (Updated to fetch full 5 articles without restriction)
    async function fetchBlogs() {
        const blogList = document.getElementById('blogList');
        if(!blogList) return;

        const fallbackArticles = [
            {
                title: "Left-pad incident explained: how 11 lines of JavaScript broke npm",
                url: "https://dev.to",
                public_reactions_count: 42,
                published_at: "2026-03-15"
            },
            {
                title: "Building Scalable Microservices with Spring Boot & Docker",
                url: "https://dev.to",
                public_reactions_count: 38,
                published_at: "2026-03-10"
            },
            {
                title: "Optimizing Frontend Performance in Single Page Applications",
                url: "https://dev.to",
                public_reactions_count: 29,
                published_at: "2026-02-28"
            },
            {
                title: "Getting Started with Python Data Stack for Machine Learning",
                url: "https://dev.to",
                public_reactions_count: 55,
                published_at: "2026-02-14"
            },
            {
                title: "Secure Authentication Patterns: JWT vs Session Cookies",
                url: "https://dev.to",
                public_reactions_count: 31,
                published_at: "2026-02-01"
            }
        ];

        try {
            const res = await fetch('https://dev.to/api/articles?tag=javascript&per_page=5');
            if (!res.ok) throw new Error('Network response was not ok');
            const articles = await res.json();

            if(articles && articles.length > 0) {
                blogList.innerHTML = articles.map(a => `
                    <a href="${a.url}" target="_blank" class="blog-card skiper-magnetic-wrap">
                        <div class="skiper-magnetic" style="flex-direction:column; align-items:flex-start;">
                            <h4>${a.title}</h4>
                            <span>❤️ ${a.public_reactions_count || 0} reactions • ${new Date(a.published_at).toLocaleDateString()}</span>
                        </div>
                    </a>
                `).join('');
            } else {
                throw new Error('No articles found');
            }
        } catch(err) { 
            blogList.innerHTML = fallbackArticles.map(a => `
                <a href="${a.url}" target="_blank" class="blog-card skiper-magnetic-wrap">
                    <div class="skiper-magnetic" style="flex-direction:column; align-items:flex-start;">
                        <h4>${a.title}</h4>
                        <span>❤️ ${a.public_reactions_count} reactions • ${new Date(a.published_at).toLocaleDateString()}</span>
                    </div>
                </a>
            `).join('');
        }
    }
    fetchBlogs();

    // 10. Hidden BGMI Easter Egg
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

    // 11. Staggered Reveals & 3D Tilt
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
    } else {
        document.querySelectorAll('.animaster-stagger').forEach(el => el.classList.add('is-visible'));
    }

    if (!isTouchDevice) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const rotX = ((e.clientY - r.top - r.height/2) / (r.height/2)) * -5;
                const rotY = ((e.clientX - r.left - r.width/2) / (r.width/2)) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
        });
    }

    // 12. Terminal Typist Animation
    const typingOutput = document.getElementById('typingOutput');
    const jsonText = '{\n  "developer": "Atul Dubey",\n  "skills": ["JavaScript ES6+", "HTML5", "CSS Grid", "REST APIs"],\n  "status": "Ready for Hire"\n}';
    let charIndex = 0;
    function typeTerminal() {
        if (typingOutput && charIndex < jsonText.length) {
            typingOutput.textContent += jsonText.charAt(charIndex);
            charIndex++;
            setTimeout(typeTerminal, 35);
        }
    }
    setTimeout(typeTerminal, 2500); 

    // 13. Regular Scroll Reveals
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => animateCounter(num));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal-on-scroll:not(.animaster-stagger-parent):not(.animaster-stagger)').forEach(el => revealObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        let count = 0, increment = Math.ceil(target / 40) || 1;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) { count = target; clearInterval(timer); }
            el.textContent = el.textContent.includes('%') ? `${count}%` : `${count}+`;
        }, 1500 / (target / increment || 1));
    }

    // 14. Hamburger Menu & Click Outside to Close
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // 15. Form Submissions & Toasts
    const toast = document.getElementById('toastNotification');
    function showToast(msg) {
        if(toast) { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 4500); }
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const btn = contactForm.querySelector('button[type="submit"]');

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; btn.disabled = true;
            try {
                const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) });
                if (res.ok) { showToast(`Thanks ${name}, message sent!`); contactForm.reset(); } 
                else showToast('Failed to send message. Try again.');
            } catch (err) { showToast('Network error.'); } 
            finally { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; btn.disabled = false; }
        });
    }

    // 16. Secure Feedback Logic via Vercel Backend API (`/api/feedback`)
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackList = document.getElementById('feedbackList');
    const ratingInput = document.getElementById('fbRatingValue');

    function escapeHTML(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

    async function loadFeedbacks() {
        if (!feedbackList) return;
        try {
            const res = await fetch('/api/feedback');
            if (!res.ok) throw new Error('Fetch failed');
            const entries = await res.json();
            if (!Array.isArray(entries) || entries.length === 0) return feedbackList.html = `<p class="feedback-empty">No feedback yet!</p>`;

            feedbackList.innerHTML = entries.sort(()=>0.5-Math.random()).slice(0,3).map(e => `
                <div class="feedback-card">
                    <div class="feedback-card-header">
                        <div><span class="feedback-name">${escapeHTML(e.name)}</span> ${e.role ? `<span class="feedback-role">${escapeHTML(e.role)}</span>`:''}</div>
                        <span class="feedback-stars">${'★'.repeat(e.rating)}${'☆'.repeat(5-e.rating)}</span>
                    </div>
                    <p class="feedback-message">${escapeHTML(e.message)}</p><span class="feedback-date">${e.date}</span>
                </div>`).join('');
        } catch (err) { feedbackList.innerHTML = `<p class="feedback-empty">Could not load feedback.</p>`; }
    }

    if (document.getElementById('starRating')) {
        const stars = document.querySelectorAll('#starRating .star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                ratingInput.value = star.dataset.value;
                stars.forEach(s => s.classList.toggle('active', s.dataset.value <= star.dataset.value));
            });
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = feedbackForm.querySelector('button[type="submit"]');
            const newEntry = {
                name: document.getElementById('fbName').value.trim(), 
                role: document.getElementById('fbRole').value.trim(), 
                message: document.getElementById('fbMessage').value.trim(), 
                rating: parseInt(ratingInput.value)||5,
                date: new Date().toLocaleDateString()
            };
            btn.innerHTML = '<p><i class="fa-solid fa-spinner fa-spin"></i> Posting...</p>'; btn.disabled = true;
            try {
                const res = await fetch('/api/feedback', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(newEntry) 
                });
                if (!res.ok) throw new Error('Post failed');

                feedbackForm.reset(); 
                document.querySelectorAll('#starRating .star').forEach(s=>s.classList.add('active')); 
                ratingInput.value = 5;
                loadFeedbacks(); 
                showToast(`Thanks for the feedback, ${newEntry.name}!`);
            } catch (err) { showToast('Failed to save feedback.'); } 
            finally { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Post Feedback'; btn.disabled = false; }
        });
    }
    loadFeedbacks();

    // 17. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.pageYOffset > 600));
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
