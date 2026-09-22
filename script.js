document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Custom Glowing Cursor Physics
       ========================================================================== */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline && window.innerWidth > 992) {
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

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.pageYOffset;
        const progressPercentage = (currentScroll / totalHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${progressPercentage}%`;
        }
    });

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

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger number counter if inside stat-section
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => animateCounter(num));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    function animateCounter(counterElement) {
        const target = parseInt(counterElement.getAttribute('data-target'));
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
            } else if (counterElement.textContent.includes('ms')) {
                counterElement.textContent = `${count}ms`;
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
       6. Interactive 3D Card Tilt Effect
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');

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

    /* ==========================================================================
       7. Navigation & Hamburger Menu
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       8. Toast Notification & Contact Form Handler
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toastNotification');

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
});
