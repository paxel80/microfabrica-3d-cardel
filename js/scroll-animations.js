// ===== GSAP SCROLL ANIMATIONS =====
// M3D Industrial - Scroll-triggered animations with GSAP (uses global GSAP/ScrollTrigger)

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isInitialized = false;
export function initScrollAnimations() {
  if (isInitialized) return;
  isInitialized = true;

  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Wait for GSAP to be available with 1.5s timeout fallback
  let gsapAttempts = 0;
  const waitForGSAP = () => {
    if (window.gsap && window.ScrollTrigger) {
      initAnimations();
    } else if (gsapAttempts < 30) {
      gsapAttempts++;
      setTimeout(waitForGSAP, 50);
    } else {
      console.warn('[M3D] GSAP timeout, revealing content with CSS fallback');
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }
  };
  waitForGSAP();

  function initAnimations() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // ===== Counter animations for metrics =====
    const counters = document.querySelectorAll('.counter[data-target]');
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const isCurrency = counter.dataset.format === 'currency';
      const suffix = isCurrency ? '' : (counter.dataset.suffix || '');
      const prefix = isCurrency ? '$' : '';

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: () => animateCounter(counter, target, prefix, suffix, isCurrency),
        once: true
      });
    });

    // ===== Hero: Immediate aggressive animation (no ScrollTrigger) =====
    const heroSection = document.querySelector('section.section:first-of-type, .hero, [data-hero]');
    if (heroSection) {
      const heroReveals = heroSection.querySelectorAll('.reveal, .reveal--stagger > *');
      gsap.fromTo(heroReveals,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power4.out',
          stagger: 0.1,
          delay: 0.1,
          onComplete: () => heroReveals.forEach(el => el.classList.add('is-visible'))
        }
      );
    }

    // ===== Reveal animations (non-hero) =====
    const revealElements = document.querySelectorAll('.reveal:not(.reveal--stagger > *)');
    revealElements.forEach((el, i) => {
      // Skip hero elements already animated
      if (heroSection && heroSection.contains(el)) return;
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleClass: { targets: el, className: 'is-visible' },
            once: true
          }
        }
      );
    });

    // ===== Stagger reveals for grids =====
    const staggerContainers = document.querySelectorAll('.reveal--stagger');
    staggerContainers.forEach(container => {
      const children = Array.from(container.children);
      gsap.fromTo(children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleClass: { targets: container, className: 'is-visible' },
            once: true
          }
        }
      );
    });

    // ===== Section header animations =====
    gsap.utils.toArray('.section-header').forEach(header => {
      const label = header.querySelector('.label');
      const title = header.querySelector('h2, .h2');
      const desc = header.querySelector('p');

      gsap.fromTo([label, title, desc],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // ===== Card entrance animations =====
    gsap.utils.toArray('.card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          delay: i * 0.03,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true
          }
        }
      );
    });

    // ===== Timeline/roadmap progress line =====
    const timeline = document.getElementById('timeline');
    if (timeline) {
      const line = timeline.querySelector('.timeline-line');
      if (line) {
        gsap.fromTo(line,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: timeline,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: 0.8
            }
          }
        );
      }
    }

    // ===== Parallax for hero background =====
    const heroBg = document.querySelector('#inicio .absolute.inset-0.-z-10');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#inicio',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }

    // ===== Competitive matrix row highlight =====
    gsap.utils.toArray('.matrix-table tbody tr').forEach((row, i) => {
      gsap.fromTo(row,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'expo.out',
          delay: i * 0.05,
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            once: true
          }
        }
      );
    });

    // ===== Refresh ScrollTrigger on font load =====
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }
}

function animateCounter(el, target, prefix, suffix, isCurrency) {
  const duration = 1.4;
  const startTime = performance.now();
  const startValue = 0;

  function update(time) {
    const elapsed = (time - startTime) / 1000;
    const progress = Math.min(elapsed / 1.4, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = startValue + (target - startValue) * eased;

    let displayValue;
    if (isCurrency) {
      displayValue = prefix + current.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else {
      displayValue = current.toFixed(target % 1 !== 0 ? 1 : 0) + suffix;
    }
    el.textContent = displayValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString('en-US', { maximumFractionDigits: 0 }) + suffix;
    }
  }

  requestAnimationFrame(update);
}

// Export for manual triggering
export function refreshScrollTriggers() {
  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
}

// Auto-init for pages that don't use app.js
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}