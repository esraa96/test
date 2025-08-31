// Constants
const COUNTER_STEPS = 100;
const ANIMATION_INTERVAL_MS = 20;

// Main Application
class CharityWebsite {
  constructor() {
    this.observers = [];
    this.timers = [];
    this.animatedCounters = new Set();
    this.init();
  }

  init() {
    this.setCurrentYear();
    this.setupLoading();
    this.setupScrollAnimations();
    this.setupCounters();
    this.setupMobileMenu();
    this.setupImageHovers();
    this.setupSmoothScroll();
    this.setupScrollProgress();
    this.setupParticles();
    this.setupButtons();
  }

  setCurrentYear() {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  setupLoading() {
    window.addEventListener("load", () => {
      const loadingOverlay = document.querySelector(".loading-overlay");
      if (loadingOverlay) {
        setTimeout(() => {
          loadingOverlay.classList.add("hidden");
          setTimeout(() => loadingOverlay.remove(), 300);
        }, 250);
      }
    });
  }

  setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("show"), index * 100);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    this.observers.push(observer);

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll(".stagger-item");
            items.forEach((item, index) => {
              setTimeout(() => item.classList.add("show"), index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".stagger-container")
      .forEach((el) => staggerObserver.observe(el));
    this.observers.push(staggerObserver);
  }

  setupCounters() {
    const counters = document.querySelectorAll(".counter");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !this.animatedCounters.has(entry.target)
          ) {
            this.animatedCounters.add(entry.target);
            const targetAttr = entry.target.getAttribute("data-target");
            if (!targetAttr || isNaN(targetAttr)) return;

            const target = parseInt(targetAttr);
            let current = 0;
            const increment = target / COUNTER_STEPS;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                entry.target.textContent = this.formatNumber(target);
                clearInterval(timer);
              } else {
                entry.target.textContent = this.formatNumber(
                  Math.floor(current)
                );
              }
            }, ANIMATION_INTERVAL_MS);

            this.timers.push(timer);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
    this.observers.push(observer);
  }

  formatNumber(num) {
    if (isNaN(num) || num < 0) return "0";
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(".0", "") + "M+";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K+";
    return num.toString();
  }



  setupMobileMenu() {
    const navToggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!navToggle || !mobileMenu) return;

    const icon = navToggle.querySelector("svg");

    navToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      if (icon) {
        icon.style.transform = mobileMenu.classList.contains("hidden")
          ? "rotate(0deg)"
          : "rotate(90deg)";
      }
    });

    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add("hidden");
        if (icon) icon.style.transform = "rotate(0deg)";
      }
    });
  }

  setupImageHovers() {
    document.querySelectorAll(".image-hover").forEach((container) => {
      const img = container.querySelector("img");
      if (img) {
        container.addEventListener("mouseenter", () => {
          img.style.transform = "scale(1.1) rotate(2deg)";
        });
        container.addEventListener("mouseleave", () => {
          img.style.transform = "scale(1) rotate(0deg)";
        });
      }
    });

    // Hero Section Interactive Effects
    this.setupHeroInteractions();
  }

  setupHeroInteractions() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    // Cache DOM elements to avoid repeated queries
    const lightRays = hero.querySelector(".hero-light-rays");
    const pattern = hero.querySelector(".hero-pattern");
    let animationId;
    
    // Throttle mouse movement for better performance
    const throttledMouseMove = this.throttle((e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPos = (clientX / innerWidth - 0.5) * 10;
      const yPos = (clientY / innerHeight - 0.5) * 10;

      // Cancel previous animation frame
      if (animationId) cancelAnimationFrame(animationId);
      
      animationId = requestAnimationFrame(() => {
        if (lightRays) {
          lightRays.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        if (pattern) {
          pattern.style.transform = `translate3d(${-xPos * 0.3}px, ${-yPos * 0.3}px, 0)`;
        }
      });
    }, 32); // Reduced to 30fps for better performance

    // Mouse movement parallax effect with throttling
    hero.addEventListener("mousemove", throttledMouseMove);

    // Reset on mouse leave
    hero.addEventListener("mouseleave", () => {
      if (animationId) cancelAnimationFrame(animationId);
      
      animationId = requestAnimationFrame(() => {
        if (lightRays) {
          lightRays.style.transform = "translate3d(0px, 0px, 0)";
        }

        if (pattern) {
          pattern.style.transform = "translate3d(0px, 0px, 0)";
        }
      });
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const href = this.getAttribute("href");
        if (href && href !== "#") {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
  }

  setupScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

    // Cache scroll rotate patterns
    const scrollRotatePatterns = document.querySelectorAll(".scroll-rotate");
    let scrollAnimationId;

    const throttledScroll = this.throttle(() => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      
      // Cancel previous animation frame
      if (scrollAnimationId) cancelAnimationFrame(scrollAnimationId);
      
      scrollAnimationId = requestAnimationFrame(() => {
        if (scrollHeight > 0) {
          const scrollPercent = (scrollTop / scrollHeight) * 100;
          progressBar.style.width =
            Math.min(100, Math.max(0, scrollPercent)) + "%";
        }

        // Update scroll rotate patterns
        const rotation = scrollTop * 0.004;
        scrollRotatePatterns.forEach((pattern) => {
          pattern.style.transform = `rotateZ(${rotation}deg)`;
        });
      });
    }, 32); // Reduced to 30fps

    window.addEventListener("scroll", throttledScroll, { passive: true });
  }



  setupParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (canvas) {
      new ParticleBackground(canvas);
    }
  }

  setupButtons() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        btn.style.transform = "translateY(-2px) scale(1.02)";
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translateY(0) scale(1)";
      });

      btn.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
        ripple.classList.add("ripple");

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Cleanup method
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.timers.forEach((timer) => clearInterval(timer));
    this.observers = [];
    this.timers = [];
    this.animatedCounters.clear();
    window.removeEventListener("scroll", this.throttledScroll);

    // Clean up hero interactions
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.removeEventListener("mousemove", this.heroMouseMove);
      hero.removeEventListener("mouseleave", this.heroMouseLeave);
    }
  }
}

// Particle Background
class ParticleBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 50;
    this.animationId = null;

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener("resize", () => {
      this.resize();
      this.repositionParticles();
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  repositionParticles() {
    this.particles.forEach((particle) => {
      if (particle.x > this.canvas.width) particle.x = this.canvas.width;
      if (particle.y > this.canvas.height) particle.y = this.canvas.height;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(193, 145, 44, ${particle.opacity})`;
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// CSS for ripple effect and scroll progress
const dynamicCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: #c1912c;
    z-index: 9999;
    transition: width 0.1s ease;
}

.dot-btn.active {
    background-color: #c1912c !important;
}
`;

const style = document.createElement("style");
style.textContent = dynamicCSS;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CharityWebsite();
});
