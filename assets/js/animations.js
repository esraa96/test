// Advanced Animations and Interactions for Charity Website

class ChartityWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoading();
    this.setupScrollAnimations();
    this.setupCounters();
    this.setupParallax();
    this.setupNavigation();
    this.setupScrollProgress();
    this.setupTypingAnimation();
    this.setupImageHovers();
    this.setupSmoothScroll();
    this.setupMobileMenu();
  }

  // Loading Animation
  setupLoading() {
    window.addEventListener("load", () => {
      const loadingOverlay = document.querySelector(".loading-overlay");
      if (loadingOverlay) {
        setTimeout(() => {
          loadingOverlay.classList.add("hidden");
          setTimeout(() => {
            loadingOverlay.remove();
          }, 300);
        }, 500);
      }
    });
  }

  // Scroll Animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 100);
        }
      });
    }, observerOptions);

    // Observe reveal elements
    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    // Stagger animation for cards
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const staggerItems = entry.target.querySelectorAll(".stagger-item");
          staggerItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("show");
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    document.querySelectorAll(".stagger-container").forEach((el) => {
      staggerObserver.observe(el);
    });
  }

  // Counter Animation
  setupCounters() {
    const counters = document.querySelectorAll(".counter");
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        // Format numbers in English with appropriate suffixes
        element.textContent = this.formatNumber(Math.floor(current));
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = this.formatNumber(target);
      }
    };

    updateCounter();
  }

  // Format numbers with English digits and appropriate suffixes
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(".0", "") + "M+";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K+";
    } else {
      return num.toString();
    }
  }

  // Parallax Effect
  setupParallax() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".parallax");

      parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Navigation Effects
  setupNavigation() {
    const header = document.querySelector(".header");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      // Add scrolled class
      if (currentScrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Hide/show header on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScrollY = currentScrollY;
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });
  }

  // Scroll Progress Bar
  setupScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = scrollPercent + "%";
    });
  }

  // Typing Animation
  setupTypingAnimation() {
    const typingElements = document.querySelectorAll(".typing-text");

    typingElements.forEach((element) => {
      const text = element.textContent;
      element.textContent = "";
      element.style.width = "0";

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.typeText(element, text);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(element);
    });
  }

  typeText(element, text) {
    let index = 0;
    element.style.width = "auto";

    const typeInterval = setInterval(() => {
      element.textContent = text.slice(0, index + 1);
      index++;

      if (index >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }, 100);
  }

  // Image Hover Effects
  setupImageHovers() {
    const imageHovers = document.querySelectorAll(".image-hover");

    imageHovers.forEach((container) => {
      const img = container.querySelector("img");

      container.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.1) rotate(2deg)";
      });

      container.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1) rotate(0deg)";
      });
    });
  }

  // Smooth Scroll
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Mobile Menu
  setupMobileMenu() {
    const navToggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (navToggle && mobileMenu) {
      navToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        mobileMenu.classList.toggle("open");

        // Animate hamburger icon
        const icon = navToggle.querySelector("svg");
        icon.style.transform = mobileMenu.classList.contains("open")
          ? "rotate(90deg)"
          : "rotate(0deg)";
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.add("hidden");
          mobileMenu.classList.remove("open");
          const icon = navToggle.querySelector("svg");
          icon.style.transform = "rotate(0deg)";
        }
      });
    }
  }

  // Utility Functions
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Particle Background Effect
class ParticleBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 50;

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
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

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ChartityWebsite();

  // Initialize particle background if canvas exists
  const particleCanvas = document.getElementById("particleCanvas");
  if (particleCanvas) {
    new ParticleBackground(particleCanvas);
  }
});

// Add some interactive elements
document.addEventListener("DOMContentLoaded", () => {
  // Add hover sound effect (optional)
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      // Could add subtle sound effect here
      btn.style.transform = "translateY(-2px) scale(1.02)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add ripple effect to buttons
  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add CSS for ripple effect
const rippleCSS = `
.btn {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`;

const style = document.createElement("style");
style.textContent = rippleCSS;
document.head.appendChild(style);
