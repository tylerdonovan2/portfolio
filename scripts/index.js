const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Nav: background on scroll, mobile menu, active section ---
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

const updateNavBackground = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
};
updateNavBackground();
window.addEventListener("scroll", updateNavBackground, { passive: true });

navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
    });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((section) => sectionObserver.observe(section));

// --- Reveal sections as they scroll into view ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// --- Typing effect in the hero ---
const typed = document.querySelector(".typed");
if (typed) {
    const words = typed.dataset.words.split("|");
    if (prefersReducedMotion) {
        typed.textContent = words[0];
    } else {
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const tick = () => {
            const word = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            typed.textContent = word.slice(0, charIndex);

            let delay = deleting ? 40 : 80;
            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 1800;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 400;
            }
            setTimeout(tick, delay);
        };
        tick();
    }
}

// --- Count-up stats ---
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        statObserver.unobserve(el);

        if (prefersReducedMotion) {
            el.textContent = target.toFixed(decimals);
            return;
        }

        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}, { threshold: 0.6 });
document.querySelectorAll(".stat-value[data-count]").forEach((el) => statObserver.observe(el));

// --- Cursor glow and card spotlight ---
const glow = document.querySelector(".cursor-glow");
if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", (e) => {
        glow.style.opacity = "1";
        glow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    }, { passive: true });

    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
            card.style.setProperty("--my", `${e.clientY - rect.top}px`);
        });
    });
}

// --- Copy email to clipboard ---
const copyButton = document.querySelector(".copy-email");
if (copyButton) {
    const label = copyButton.querySelector(".copy-label");
    const email = copyButton.dataset.email;
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(email);
            label.textContent = "Copied to clipboard!";
            setTimeout(() => { label.textContent = email; }, 1800);
        } catch {
            window.location.href = "mailto:" + email;
        }
    });
}

// --- Footer year ---
document.querySelector(".year").textContent = new Date().getFullYear();
