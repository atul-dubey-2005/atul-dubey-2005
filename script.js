/* =========================================================
   ATUL DUBEY PORTFOLIO — MODERN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENT REFERENCES
       ===================================================== */

    const body = document.body;

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    const progressBar = document.querySelector(".scroll-progress");

    const header = document.querySelector(".site-header");

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    const terminalOutput =
        document.querySelector("#terminal-output");

    const contactForm =
        document.querySelector("#contact-form");

    /* =====================================================
       CUSTOM CURSOR
       ===================================================== */

    if (
        cursorDot &&
        cursorOutline &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let outlineX = mouseX;
        let outlineY = mouseY;

        document.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {

            outlineX += (mouseX - outlineX) * 0.14;
            outlineY += (mouseY - outlineY) * 0.14;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        const interactiveElements =
            document.querySelectorAll(
                "a, button, input, textarea, .project-card, .skill-card, .stat-card"
            );

        interactiveElements.forEach((element) => {

            element.addEventListener("mouseenter", () => {
                cursorOutline.classList.add("hover");
            });

            element.addEventListener("mouseleave", () => {
                cursorOutline.classList.remove("hover");
            });
        });
    }

    /* =====================================================
       SCROLL PROGRESS
       ===================================================== */

    function updateScrollProgress() {

        if (!progressBar) return;

        const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressBar.style.width = `${percentage}%`;
    }

    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener(
        "scroll",
        () => {
            updateScrollProgress();
            updateHeader();
        },
        { passive: true }
    );

    updateScrollProgress();
    updateHeader();

    /* =====================================================
       TERMINAL TYPING
       ===================================================== */

    const terminalText = `{
  "developer": "Atul Dubey",
  "focus": [
    "Java",
    "Python",
    "Spring Boot",
    "Flask",
    "MySQL"
  ],
  "status": "Open to Software Roles"
}`;

    if (terminalOutput) {

        let currentIndex = 0;

        function typeTerminal() {

            if (currentIndex >= terminalText.length) {
                return;
            }

            terminalOutput.textContent +=
                terminalText[currentIndex];

            currentIndex++;

            const currentCharacter =
                terminalText[currentIndex - 1];

            let speed = 16;

            if (currentCharacter === "\n") {
                speed = 70;
            }

            if (
                currentCharacter === "{" ||
                currentCharacter === "}" ||
                currentCharacter === "["
            ) {
                speed = 35;
            }

            setTimeout(typeTerminal, speed);
        }

        const terminalObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    if (entries[0].isIntersecting) {

                        typeTerminal();

                        observer.disconnect();
                    }
                },
                {
                    threshold: 0.3
                }
            );

        terminalObserver.observe(terminalOutput);
    }

    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal-on-scroll");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    /* =====================================================
       STAT COUNTERS
       ===================================================== */

    const statNumbers =
        document.querySelectorAll(".stat-number");

    const animateCounter = (element) => {

        const target =
            Number(element.dataset.target || 0);

        const suffix =
            element.dataset.suffix || "";

        const duration = 1300;

        const startTime = performance.now();

        function updateCounter(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            /* ease-out cubic */
            const eased =
                1 - Math.pow(1 - progress, 3);

            const currentValue =
                Math.round(target * eased);

            element.textContent =
                `${currentValue}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    };

    if (statNumbers.length) {

        const statsObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (
                            entry.isIntersecting &&
                            !entry.target.dataset.animated
                        ) {

                            entry.target.dataset.animated =
                                "true";

                            animateCounter(
                                entry.target
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });
                },
                {
                    threshold: 0.5
                }
            );

        statNumbers.forEach((stat) => {
            statsObserver.observe(stat);
        });
    }

    /* =====================================================
       PROJECT FILTER
       ===================================================== */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const projectCards =
        document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter =
                button.dataset.filter || "all";

            projectCards.forEach((card) => {

                const category =
                    card.dataset.category || "";

                const shouldShow =
                    filter === "all" ||
                    category.includes(filter);

                if (shouldShow) {

                    card.style.display = "";

                    requestAnimationFrame(() => {

                        card.style.opacity = "1";
                        card.style.transform =
                            "translateY(0)";
                    });

                } else {

                    card.style.opacity = "0";
                    card.style.transform =
                        "translateY(10px)";

                    setTimeout(() => {

                        card.style.display = "none";

                    }, 250);
                }
            });
        });
    });

    /* =====================================================
       3D TILT EFFECT
       ===================================================== */

    const tiltCards =
        document.querySelectorAll(".tilt-card");

    if (window.matchMedia("(pointer:fine)").matches) {

        tiltCards.forEach((card) => {

            card.addEventListener("mousemove", (event) => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -3.5;

                const rotateY =
                    ((x - centerX) / centerX) * 3.5;

                card.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;
            });

            card.addEventListener("mouseleave", () => {

                card.style.transform =
                    "";
            });
        });
    }

    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            navLinks.classList.toggle("open");

            const isOpen =
                navLinks.classList.contains("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            const icon =
                menuToggle.querySelector("i");

            if (icon) {

                icon.className =
                    isOpen
                        ? "fa-solid fa-xmark"
                        : "fa-solid fa-bars";
            }
        });

        /* close menu after clicking link */

        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const icon =
                    menuToggle.querySelector("i");

                if (icon) {
                    icon.className =
                        "fa-solid fa-bars";
                }
            });
        });

        /* close menu with Escape */

        document.addEventListener("keydown", (event) => {

            if (
                event.key === "Escape" &&
                navLinks.classList.contains("open")
            ) {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const icon =
                    menuToggle.querySelector("i");

                if (icon) {
                    icon.className =
                        "fa-solid fa-bars";
                }
            }
        });
    }

    /* =====================================================
       ACTIVE NAVIGATION LINK
       ===================================================== */

    const sections =
        document.querySelectorAll("section[id]");

    const navigationLinks =
        document.querySelectorAll(
            '.nav-links a[href^="#"]'
        );

    if (sections.length && navigationLinks.length) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            const id =
                                entry.target.getAttribute(
                                    "id"
                                );

                            navigationLinks.forEach(
                                (link) => {

                                    link.classList.toggle(
                                        "active",
                                        link.getAttribute(
                                            "href"
                                        ) === `#${id}`
                                    );
                                }
                            );
                        }
                    });
                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px"
                }
            );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    /* =====================================================
       SMOOTH ANCHOR SCROLL
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    15;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            });
        });

    /* =====================================================
       CONTACT FORM
       ===================================================== */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const name =
                    contactForm.querySelector(
                        '[name="name"]'
                    )?.value.trim();

                const email =
                    contactForm.querySelector(
                        '[name="email"]'
                    )?.value.trim();

                const message =
                    contactForm.querySelector(
                        '[name="message"]'
                    )?.value.trim();

                if (!name || !email || !message) {

                    showToast(
                        "Please fill in all fields."
                    );

                    return;
                }

                const subject =
                    encodeURIComponent(
                        `Portfolio Contact — ${name}`
                    );

                const body =
                    encodeURIComponent(
                        `Name: ${name}\n` +
                        `Email: ${email}\n\n` +
                        `Message:\n${message}`
                    );

                /*
                    Replace this email with your
                    actual portfolio email if required.
                */

                const emailAddress =
                    "atuldubey0214@gmail.com";

                window.location.href =
                    `mailto:${emailAddress}` +
                    `?subject=${subject}` +
                    `&body=${body}`;

                showToast(
                    "Opening your email client..."
                );

                contactForm.reset();
            }
        );
    }

    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        let toast =
            document.querySelector(".toast");

        if (!toast) {

            toast =
                document.createElement("div");

            toast.className = "toast";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(
            window.portfolioToastTimer
        );

        window.portfolioToastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3200);
    }

    /* =====================================================
       IMAGE LOADING EFFECT
       ===================================================== */

    const profileImage =
        document.querySelector(".profile-image");

    if (profileImage) {

        if (profileImage.complete) {

            profileImage.classList.add("loaded");

        } else {

            profileImage.addEventListener(
                "load",
                () => {
                    profileImage.classList.add(
                        "loaded"
                    );
                }
            );
        }
    }

    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    document
        .querySelectorAll("[data-current-year]")
        .forEach((element) => {

            element.textContent =
                new Date().getFullYear();
        });

});