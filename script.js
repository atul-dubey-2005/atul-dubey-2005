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
   5. Interactive 3D Card Tilt Effect (disabled on touch devices)
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
   6. Navigation & Hamburger Menu
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
   7. Toast Notification Handler
   ========================================================================== */
const toast = document.getElementById('toastNotification');

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
   8. Contact Form Handler (Connecting to Vercel API via Nodemailer)
   ========================================================================== */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        if (!name || !email || !message) {
            showToast('Please fill out all fields.');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                showToast(`Thanks ${name}, message sent successfully!`);
                contactForm.reset();
            } else {
                showToast('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error("Error sending email:", error);
            showToast('Network error. Check your connection.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

/* ==========================================================================
   9. Feedback Wall (Supabase Integration + Random Selection)
   ========================================================================== */
// IMPORTANT: Yahan apna Supabase URL aur public key update karein!
const SUPABASE_URL = 'AAPKA_SUPABASE_PROJECT_URL_YAHAN_DALEIN'; 
const SUPABASE_KEY = 'AAPKI_SUPABASE_ANON_PUBLIC_KEY_YAHAN_DALEIN';

const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('fbRatingValue');

// Utility to escape HTML and prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Supabase se fetch karke 3 random feedbacks dikhana
async function loadFeedbacks() {
    if (!feedbackList) return;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch from Supabase');
        
        const entries = await response.json();

        if (entries.length === 0) {
            feedbackList.innerHTML = `<p class="feedback-empty">No feedback yet — be the first to share your thoughts!</p>`;
            return;
        }

        // Randomly mix array and select top 3
        const randomFeedbacks = entries.sort(() => 0.5 - Math.random()).slice(0, 3);

        feedbackList.innerHTML = randomFeedbacks.map(entry => `
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
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        feedbackList.innerHTML = `<p class="feedback-empty">Could not load feedback at this time.</p>`;
    }
}

// Star UI interactions
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
    // Default 5 stars filled
    stars.forEach(s => s.classList.add('active'));
}

// Naya Feedback Supabase me bhejna
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('fbName').value.trim();
        const role = document.getElementById('fbRole').value.trim();
        const message = document.getElementById('fbMessage').value.trim();
        const rating = parseInt(ratingInput.value) || 5;

        if (!name || !message) {
            showToast('Please add your name and a message.');
            return;
        }

        const newEntry = {
            name, 
            role, 
            message, 
            rating,
            date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        };

        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Posting...';
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal' 
                },
                body: JSON.stringify(newEntry)
            });

            if(!res.ok) throw new Error('Network response was not ok');

            feedbackForm.reset();
            document.querySelectorAll('#starRating .star').forEach(s => s.classList.add('active'));
            ratingInput.value = 5;
            
            // Reload the UI to show fresh random feedback
            loadFeedbacks();
            showToast(`Thanks for the feedback, ${name}!`);
        } catch (error) {
            console.error("Error saving feedback:", error);
            showToast('Failed to save feedback. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Page Load par function call karein
loadFeedbacks();

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
