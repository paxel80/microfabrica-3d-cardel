/**
 * M3D Industrial - Main Application Entry Point
 * Orchestrates all modules: Three.js Hero, GSAP Animations, Interactions
 */

import { initHeroScene } from './three-hero.js';
import { initScrollAnimations, refreshScrollTriggers } from './scroll-animations.js';
import { initInteractions } from './interactions.js';

// Global state
const state = {
  heroCleanup: null,
  initialized: false
};

// Initialize all modules
async function init() {
  if (state.initialized) return;

  try {
    // Initialize hero Three.js scene
    state.heroCleanup = await initHeroScene();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize interactions
    initInteractions();

    // Mobile menu
    initMobileMenu();

    // Newsletter form
    initNewsletter();

    state.initialized = true;
    console.log('[M3D] App initialized successfully');

  } catch (err) {
    console.error('[M3D] Initialization failed:', err);
  }
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !expanded);
    mobileNav.classList.toggle('hidden');
    menuBtn.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

function initNewsletter() {
  const forms = document.querySelectorAll('footer form[onsubmit]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        // Show success toast
        showToast('Gracias por suscribirte. Recibirás el deck y avances de la Fase 2.');
        input.value = '';
      }
    });
  });
}

function showToast(message) {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--color-navy);
    color: white;
    padding: 16px 24px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 360px;
  `;

  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 300ms cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause heavy animations
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.animationPlayState = 'running';
    });
    refreshScrollTriggers();
  }
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[M3D] SW registered:', reg.scope))
      .catch(err => console.log('[M3D] SW registration failed:', err));
  });
}

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.M3DApp = {
  init,
  refreshScrollTriggers,
  showToast
};