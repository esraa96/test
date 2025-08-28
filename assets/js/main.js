// Mobile nav toggle
const navToggleButton = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
if (navToggleButton && mobileMenu) {
  navToggleButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Reveal on scroll
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealElements.forEach((el) => revealObserver.observe(el));

// Animated counters
function animateCounter(element, target) {
  const durationMs = 1500;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const value = Math.floor(start + (target - start) * progress);
    element.textContent = value.toLocaleString("ar-EG");
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = Number(el.getAttribute("data-target")) || 0;
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.4 }
);

document
  .querySelectorAll(".counter")
  .forEach((el) => counterObserver.observe(el));

// Dynamic year in footer
const yearSpans = document.querySelectorAll("#year");
yearSpans.forEach((s) => (s.textContent = new Date().getFullYear()));
