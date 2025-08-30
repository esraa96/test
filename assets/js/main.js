// Constants
const COUNTER_STEPS = 100;
const ANIMATION_INTERVAL_MS = 20;
const CARD_WIDTH = 320; // عرض الكارد الأساسي
const CARD_MARGIN = 32; // المسافات بين الكاردات
const CARDS_PER_VIEW = 3; // عدد الكاردات المعروضة

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
    this.setupStatsSlider();
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
        }, 500);
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

  setupStatsSlider() {
    const track = document.querySelector(".stats-slider-track");
    const dots = document.querySelectorAll(".dot-btn");
    const container = document.querySelector(".stats-slider-container");
    const slider = document.querySelector(".stats-slider");

    if (!track || !dots.length || !container || !slider) return;

    const uniqueSlidesCount = 6; // عدد الكروت الأصلية
    let current = 0;
    let timer;
    let cardsToShow = 3;
    const cardWidth = 320;
    const cardMargin = 32;
    const totalCardWidth = cardWidth + cardMargin;
    let isTransitioning = false;

    const updateSliderView = () => {
      if (window.innerWidth < 768) cardsToShow = 1;
      else if (window.innerWidth < 1200) cardsToShow = 2;
      else cardsToShow = 3;

      const visibleWidth = totalCardWidth * cardsToShow - cardMargin;
      slider.style.width = `${visibleWidth}px`;
      slider.style.margin = "0 auto";
      slider.style.overflow = "hidden";
    };

    const moveTo = (index, withTransition = true) => {
      if (withTransition) {
        track.style.transition = "transform 0.5s ease-in-out";
      } else {
        track.style.transition = "none";
      }
      const moveDistance = index * totalCardWidth;
      track.style.transform = `translateX(-${moveDistance}px)`;
      current = index;
    };

    const updateDots = () => {
      const dotIndex = current % uniqueSlidesCount;
      dots.forEach((dot, i) => {
        if (dot) dot.classList.toggle("active", i === dotIndex);
      });
    };

    track.addEventListener("transitionend", () => {
      isTransitioning = false;
      // إذا وصلنا إلى كارت مكرر في النهاية
      if (current >= uniqueSlidesCount) {
        // نعود إلى الكارت الأصلي المقابل بدون حركة انتقالية
        moveTo(current % uniqueSlidesCount, false);
      }
    });

    const next = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      moveTo(current + 1);
      updateDots();
    };

    const auto = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 3000);
      this.timers.push(timer);
    };

    dots.forEach((dot, i) => {
      if (dot) {
        dot.addEventListener("click", () => {
          if (isTransitioning || i >= uniqueSlidesCount) return;
          isTransitioning = true;
          clearInterval(timer);
          moveTo(i);
          updateDots();
          setTimeout(auto, 5000);
        });
      }
    });

    container.addEventListener("mouseenter", () => clearInterval(timer));
    container.addEventListener("mouseleave", auto);
    window.addEventListener("resize", updateSliderView);

    // Initial setup
    updateSliderView();
    updateDots();
    auto();
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

    // Mouse movement parallax effect
    hero.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;

      const lightRays = hero.querySelector(".hero-light-rays");
      const pattern = hero.querySelector(".hero-pattern");

      if (lightRays) {
        lightRays.style.transform = `translate(${xPos}px, ${yPos}px)`;
      }

      if (pattern) {
        pattern.style.transform = `translate(${-xPos * 0.5}px, ${
          -yPos * 0.5
        }px)`;
      }
    });

    // Reset on mouse leave
    hero.addEventListener("mouseleave", () => {
      const lightRays = hero.querySelector(".hero-light-rays");
      const pattern = hero.querySelector(".hero-pattern");

      if (lightRays) {
        lightRays.style.transform = "translate(0px, 0px)";
      }

      if (pattern) {
        pattern.style.transform = "translate(0px, 0px)";
      }
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

    const throttledScroll = this.throttle(() => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width =
          Math.min(100, Math.max(0, scrollPercent)) + "%";
      }

      // Scroll rotate patterns
      this.updateScrollRotate(scrollTop);
    }, 50);

    window.addEventListener("scroll", throttledScroll);
  }

  updateScrollRotate(scrollTop) {
    const patterns = document.querySelectorAll(".scroll-rotate");
    patterns.forEach((pattern) => {
      const rotation = scrollTop * 0.002; // تقليل سرعة الدوران من 0.008 إلى 0.002
      const currentTransform = pattern.style.transform || "";
      const baseRotation = currentTransform.match(/rotateZ\(([^)]+)\)/);
      const baseValue = baseRotation ? parseFloat(baseRotation[1]) : 0;
      pattern.style.transform = `rotateZ(${baseValue + rotation}deg)`;
    });
    
    // Partners background scroll effect
    const partnersBg = document.querySelector('.partners-bg-scroll');
    if (partnersBg) {
      const partnersSection = document.getElementById('partners');
      if (partnersSection) {
        const rect = partnersSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
          const translateY = scrollProgress * 50;
          const scale = 1 + scrollProgress * 0.1;
          partnersBg.style.transform = `translateY(${translateY}px) scale(${scale})`;
        }
      }
    }
    
    // Footer background scroll effect
    const footerBg = document.querySelector('.footer-bg-scroll');
    if (footerBg) {
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
          const translateY = scrollProgress * -30;
          const scale = 1 + scrollProgress * 0.05;
          footerBg.style.transform = `translateY(${translateY}px) scale(${scale})`;
        }
      }
    }
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
