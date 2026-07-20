/**
 * Micro-interactions & UX Enhancements
 * Magnetic buttons, floating labels, form enhancements, keyboard nav
 */

let isInitialized = false;
export function initInteractions() {
  if (isInitialized) return;
  isInitialized = true;

  // ===== Magnetic Buttons =====
  initMagneticButtons();

  // ===== Floating Labels =====
  initFloatingLabels();

  // ===== Form Enhancements =====
  initFormEnhancements();

  // ===== Card Parallax =====
  initCardParallax();

  // ===== Nav Link Underline =====
  initNavUnderlines();

  // ===== Keyboard Navigation =====
  initKeyboardNav();

  // ===== View Transitions =====
  initViewTransitions();

  // ===== Smooth Scroll for Anchors =====
  initSmoothAnchorScroll();

  // ===== Ripple Effect on Buttons =====
  initRippleEffect();

  // ===== Scroll Progress Bar =====
  initScrollProgress();
}

function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn:not(:disabled)');
  buttons.forEach(btn => {
    let raf = null;
    btn.addEventListener('mousemove', (e) => {
      if (btn.disabled) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.disabled) return;
      btn.style.transform = '';
      btn.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

function initFloatingLabels() {
  document.querySelectorAll('.input').forEach(input => {
    const group = input.closest('.input-group');
    const label = group?.querySelector('.input-label');
    if (!label) return;

    const updateLabel = () => {
      const hasValue = input.value.length > 0;
      const isFocused = document.activeElement === input;
      if (hasValue || isFocused) {
        label.style.transform = 'translateY(-20px) scale(0.85)';
        label.style.transformOrigin = 'left top';
        label.style.color = 'var(--color-navy)';
        label.style.transition = 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        label.style.transform = '';
        label.style.color = '';
      }
    };

    input.addEventListener('focus', updateLabel);
    input.addEventListener('blur', updateLabel);
    input.addEventListener('input', updateLabel);
    updateLabel();
  });
}

function initFormEnhancements() {
  const form = document.getElementById('cotiza-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const statusEl = document.getElementById('cf-status');

  // Real-time validation feedback
  form.querySelectorAll('.input[required]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let message = '';

    if (input.required && !value) {
      isValid = false;
      message = 'Este campo es obligatorio';
    } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      message = 'Correo no válido';
    } else if (input.tagName === 'SELECT' && input.required && !value) {
      isValid = false;
      message = 'Seleccione una opción';
    }

    input.classList.toggle('invalid', !isValid);
    input.classList.toggle('valid', isValid && value.length > 0);

    // Show/hide error message
    let errorEl = input.parentNode.querySelector('.field-error');
    if (!isValid) {
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'font-size: var(--text-xs); color: var(--color-accent); margin-top: var(--space-1); display: block;';
        input.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = message;
    } else if (errorEl) {
      errorEl.remove();
    }

    return isValid;
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    form.querySelectorAll('.input[required]').forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    const turnstile = window.turnstile?.getResponse?.() || '';
    if (!turnstile) {
      if (statusEl) {
        statusEl.textContent = 'Completa el desafío de seguridad (Turnstile).';
        statusEl.style.color = 'var(--color-accent)';
      }
      return;
    }

    if (!allValid) return;

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'ENVIANDO…';
      submitBtn.style.opacity = '0.7';
    }
    if (statusEl) {
      statusEl.textContent = '';
    }

    const formData = new FormData(form);
    formData.append('cf-turnstile-response', turnstile);

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: formData });
      const out = await res.json().catch(() => ({}));

      if (res.ok && out.success) {
        if (statusEl) {
          statusEl.textContent = '✓ Solicitud recibida. Respondemos en 2 horas hábiles.';
          statusEl.style.color = 'var(--color-success)';
        }
        form.reset();
        if (window.turnstile) turnstile.reset();
        if (submitBtn) submitBtn.disabled = true;
      } else {
        if (statusEl) {
          statusEl.textContent = out.error || 'Error. Escríbanos a hola@microfabrica3d.mx';
          statusEl.style.color = 'var(--color-accent)';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText;
          submitBtn.style.opacity = '1';
        }
      }
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = 'Sin conexión. Escríbanos a hola@microfabrica3d.mx';
        statusEl.style.color = 'var(--color-accent)';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText;
        submitBtn.style.opacity = '1';
      }
    }
  });
}

function initCardParallax() {
  const cards = document.querySelectorAll('.card--interactive.group');
  cards.forEach(card => {
    const iconWrapper = card.querySelector('.w-12, .w-14');
    if (!iconWrapper) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 18;
      const y = (e.clientY - rect.top - rect.height / 2) / 18;
      iconWrapper.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
    card.addEventListener('mouseleave', () => {
      iconWrapper.style.transform = '';
    });
  });
}

function initNavUnderlines() {
  document.querySelectorAll('.nav-link').forEach(link => {
    const line = document.createElement('span');
    line.style.cssText = 'position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: var(--color-accent); transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1);';
    link.style.position = 'relative';
    link.appendChild(line);
    link.addEventListener('mouseenter', () => {
      line.style.width = '100%';
      link.style.color = 'var(--color-navy)';
    });
    link.addEventListener('mouseleave', () => {
      line.style.width = '0';
      link.style.color = 'var(--color-text-muted)';
    });
  });
}

function initKeyboardNav() {
  // Make interactive cards focusable
  document.querySelectorAll('.card--interactive').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Focus visible outline is in CSS
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

function initViewTransitions() {
  if (!document.startViewTransition) return;

  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#') || link.target === '_blank') return;

      e.preventDefault();
      document.startViewTransition(async () => {
        // Add a subtle fade
        document.body.style.opacity = '0';
        await new Promise(r => setTimeout(r, 80));
        window.location.href = href;
      });
    });
  });
}

function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

function initRippleEffect() {
  document.querySelectorAll('.btn:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: oklch(100% 0 none / 0.5);
        transform: scale(0);
        animation: ripple 400ms cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        width: ${Math.max(rect.width, rect.height) * 2}px;
        height: ${Math.max(rect.width, rect.height) * 2}px;
        margin-left: ${-Math.max(rect.width, rect.height)}px;
        margin-top: ${-Math.max(rect.width, rect.height)}px;
      `;

      // Add keyframes if not exists
      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes ripple {
            to { transform: scale(2); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    });
  });
}

function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;

  let raf = null;
  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = Math.min(scrollTop / scrollHeight, 1);
    progress.style.transform = `scaleX(${progressValue})`;
    raf = null;
  }

  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
}

// Export for external use
export function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  let valid = true;
  form.querySelectorAll('.input[required]').forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('invalid');
      valid = false;
    }
  });
  return valid;
}

// Auto-init for pages that don't use app.js
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractions);
} else {
  initInteractions();
}