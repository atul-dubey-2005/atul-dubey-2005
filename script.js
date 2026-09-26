document.addEventListener('DOMContentLoaded', () => {

/* ==========================================================================
   1. Custom Glowing Cursor Physics
   ========================================================================== */
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (cursorDot && cursorOutline && window.innerWidth > 992 && !window.matchMedia('(hover: none)').matches) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

/* ==========================================================================
   2. Scroll Progress Indicator
   ========================================================================== */
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.pageYOffset;
    const progressPercentage = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
    if (scrollProgress) {
        scrollProgress.style.width = `${progressPercentage}%`;
    }
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ==========================================================================
   3. Terminal Typist Animation Effect
   ========================================================================== */
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
setTimeout(typeTerminal, 800);

/* ==========================================================================
   4. Scroll-Triggered Reveal Animations & Counter
   ========================================================================== */
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('.stat-number').forEach(num => animateCounter(num, true));
} else {
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => animateCounter(num));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

function animateCounter(counterElement, instant) {
    const target = parseInt(counterElement.getAttribute('data-target'));
    if (instant) {
        counterElement.textContent = counterElement.textContent.includes('%') ? `${target}%` : `${target}+`;
        return;
    }
    let count = 0;
    const increment = Math.ceil(target / 40) || 1;
    const duration = 1500;
    const stepTime = duration / (target / increment || 1);

    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        if (counterElement.textContent.includes('%')) {
            counterElement.textContent = `${count}%`;
        } else {
            counterElement.textContent = `${count}+`;
        }
    }, stepTime);
}

/* ==========================================================================
   5. Project Filter Controller
   ========================================================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.projects-wrapper > div');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === category) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity = '1'; }, 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

/* ==========================================================================
   6. Interactive 3D Card Tilt Effect (disabled on touch devices)
   ========================================================================== */
const tiltCards = document.querySelectorAll('.tilt-card');
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (!isTouchDevice) {
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* ==========================================================================
   7. Navigation & Hamburger Menu
   ========================================================================== */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ==========================================================================
   8. Toast Notification & Contact Form Handler
   ========================================================================== */
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toastNotification');

// NOTE: This form currently just shows a local confirmation toast — nothing
// is actually emailed anywhere. To receive real messages from visitors:
//   1) Create a free form endpoint at https://formspree.io (or use EmailJS).
//   2) Add action="https://formspree.io/f/yourFormId" method="POST" to the
//      <form id="contactForm"> tag in index.html.
//   3) Remove (or adapt) the e.preventDefault() below so the form actually submits.
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name && email && message) {
            showToast(`Message sent successfully, ${name}!`);
            contactForm.reset();
        } else {
            showToast(`Please complete all required form fields.`);
        }
    });
}

function showToast(msg) {
    if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }
}

/* ==========================================================================
   9. Feedback Wall (star rating + localStorage guestbook)
   ========================================================================== */
const FEEDBACK_KEY = 'atuldev_portfolio_feedback';
const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('fbRatingValue');

function getStoredFeedback() {
    try {
        const raw = localStorage.getItem(FEEDBACK_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return [];
    }
}

function saveFeedback(entries) {
    try {
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries));
    } catch (err) {
        console.error('Could not save feedback locally:', err);
    }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderFeedback() {
    if (!feedbackList) return;
    const entries = getStoredFeedback();

    if (entries.length === 0) {
        feedbackList.innerHTML = `<p class="feedback-empty">No feedback yet — be the first to share your thoughts!</p>`;
        return;
    }

    feedbackList.innerHTML = entries.map(entry => `
        <div class="feedback-card">
            <div class="feedback-card-header">
                <div>
                    <span class="feedback-name">${escapeHTML(entry.name)}</span>
                    ${entry.role ? `<span class="feedback-role">${escapeHTML(entry.role)}</span>` : ''}
                </div>
                <span class="feedback-stars">${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}</span>
            </div>
            <p class="feedback-message">${escapeHTML(entry.message)}</p>
            <span class="feedback-date">${entry.date}</span>
        </div>
    `).join('');
}

if (starRating) {
    const stars = starRating.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingInput.value = value;
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= value);
            });
        });
    });
    // Default to 5 stars filled
    stars.forEach(s => s.classList.add('active'));
}

if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('fbName').value.trim();
        const role = document.getElementById('fbRole').value.trim();
        const message = document.getElementById('fbMessage').value.trim();
        const rating = parseInt(ratingInput.value) || 5;

        if (!name || !message) {
            showToast('Please add your name and a message.');
            return;
        }

        const entries = getStoredFeedback();
        entries.unshift({
            name,
            role,
            message,
            rating,
            date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        });

        // Keep the list from growing unbounded in one browser
        saveFeedback(entries.slice(0, 50));
        renderFeedback();
        feedbackForm.reset();
        document.querySelectorAll('#starRating .star').forEach(s => s.classList.add('active'));
        ratingInput.value = 5;
        showToast(`Thanks for the feedback, ${name}!`);
    });
}

renderFeedback();

/* ==========================================================================
   10. Back to Top Button
   ========================================================================== */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 600) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

/* ==========================================================================
   11. Active Nav Link on Scroll
   ========================================================================== */
const sections = document.querySelectorAll('main section[id]');
if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => navObserver.observe(section));
}

});
