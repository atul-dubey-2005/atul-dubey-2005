document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    /* ==========================================================================
       0. Vengeance UI Preloader Fadeout
       ========================================================================== */
    const preloader = document.getElementById('vengeance-preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                // Trigger decode text after preloader hides
                startDecodeEffect();
            }, 2000); // Wait 2s for aesthetic loading
        });
    }

    /* ==========================================================================
       0.5 Animaster Decode Text Effect (Hacker Effect)
       ========================================================================== */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function startDecodeEffect() {
        const decodeElem = document.querySelector('.decode-text');
        if(!decodeElem || prefersReducedMotion) return;
        
        let iteration = 0;
        const originalText = decodeElem.dataset.value;
        const interval = setInterval(() => {
            decodeElem.innerText = originalText.split("")
                .map((letter, index) => {
                    if(index < iteration) return originalText[index];
                    return letters[Math.floor(Math.random() * 26)];
                }).join("");
            if(iteration >= originalText.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    }

    /* ==========================================================================
       1. Custom Glowing Cursor (Vengeance Tracker)
       ========================================================================== */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    if (cursorDot && cursorOutline && window.innerWidth > 992 && !isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });
    }

    /* ==========================================================================
       2. Skiper UI Magnetic Buttons
       ========================================================================== */
    const magneticWraps = document.querySelectorAll('.skiper-magnetic-wrap');
    if(!isTouchDevice) {
        magneticWraps.forEach(wrap => {
            const magneticEl = wrap.querySelector('.skiper-magnetic');
            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                magneticEl.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            wrap.addEventListener('mouseleave', () => {
                magneticEl.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    /* ==========================================================================
       3. Vengeance Smart Header (Auto Hide/Show)
       ========================================================================== */
    const smartHeader = document.getElementById('smartHeader');
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
    }, { passive: true });

    /* ==========================================================================
       4. Terminal Typist & Scroll Progress
       ========================================================================== */
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress) scrollProgress.style.width = `${(window.pageYOffset / totalHeight) * 100}%`;
    }, { passive: true });

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
    setTimeout(typeTerminal, 2500); // Start after preloader

    /* ==========================================================================
       5. Animaster Staggered Grid Reveal
       ========================================================================== */
    const staggerParents = document.querySelectorAll('.animaster-stagger-parent');
    if (!prefersReducedMotion) {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
        const staggerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.animaster-stagger');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('is-visible');
                        }, index * 100); // Stagger by 100ms
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        staggerParents.forEach(el => staggerObserver.observe(el));
    } else {
        document.querySelectorAll('.animaster-stagger').forEach(el => el.classList.add('is-visible'));
    }

    /* Scroll Reveals (Non-Staggered Elements) */
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

    /* ==========================================================================
       6. 3D Tilt Cards & Mobile Nav
       ========================================================================== */
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

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => { hamburger.classList.remove('active'); navMenu.classList.remove('active'); });
        });
    }

    /* ==========================================================================
       7. APIs: Nodemailer Contact & Supabase Feedback
       ========================================================================== */
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

    const SUPABASE_URL = 'AAPKA_SUPABASE_PROJECT_URL_YAHAN_DALEIN'; 
    const SUPABASE_KEY = 'AAPKI_SUPABASE_ANON_PUBLIC_KEY_YAHAN_DALEIN';
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackList = document.getElementById('feedbackList');
    const ratingInput = document.getElementById('fbRatingValue');

    function escapeHTML(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

    async function loadFeedbacks() {
        if (!feedbackList) return;
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks?select=*`, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
            if (!res.ok) throw new Error('Fetch failed');
            const entries = await res.json();
            if (entries.length === 0) return feedbackList.innerHTML = `<p class="feedback-empty">No feedback yet!</p>`;
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
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Posting...'; btn.disabled = true;
            try {
                await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'return=minimal' }, body: JSON.stringify(newEntry) });
                feedbackForm.reset(); document.querySelectorAll('#starRating .star').forEach(s=>s.classList.add('active')); ratingInput.value = 5;
                loadFeedbacks(); showToast(`Thanks for the feedback, ${newEntry.name}!`);
            } catch (err) { showToast('Failed to save feedback.'); } 
            finally { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Post Feedback'; btn.disabled = false; }
        });
    }
    loadFeedbacks();

    /* Back to Top */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.pageYOffset > 600));
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
