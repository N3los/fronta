export function initAnimations() {
  // A map to store observers and avoid creating duplicates for identical configurations
  const observers = new Map();

  const getObserver = (threshold, rootMargin) => {
    const signature = `${threshold}|${rootMargin}`;

    if (!observers.has(signature)) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Legacy Support
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('observed');
            // New Engine Support
            entry.target.classList.add('is-revealed');

            // Standardized: Play once and stay visible
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: parseFloat(threshold),
        rootMargin: rootMargin
      });

      observers.set(signature, observer);
    }

    return observers.get(signature);
  };

  // 1. Legacy reveal script (Default settings)
  document.querySelectorAll('.reveal-on-scroll:not(.observed)').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-1000', 'ease-out', 'observed');
    getObserver(0.1, '0px').observe(el);
  });

  // 2. New Declarative Animation Engine
  document.querySelectorAll('[data-animate]:not(.is-revealed)').forEach(el => {
    // Read custom settings from data attributes, fallback to defaults
    let threshold = parseFloat(el.getAttribute('data-threshold') || '0.1');
    let margin = el.getAttribute('data-margin') || '-50px';

    // SMART CLAMPING: If on mobile, ensure values are reachable
    if (window.innerWidth < 768) {
      // Cap threshold at 0.2 on mobile (50% is often unreachable)
      threshold = Math.min(threshold, 0.2);

      // Cap margin at -50px (deeper margins like -150px often hide triggers on mobile)
      const numericMargin = parseInt(margin);
      if (!isNaN(numericMargin) && numericMargin < -50) {
        margin = '-50px';
      }
    }

    getObserver(threshold.toString(), margin).observe(el);
  });
}

// In Astro, scripts usually run once per page load unless using View Transitions.
document.addEventListener('DOMContentLoaded', initAnimations);
// Astro View Transitions hook (if enabled in the future)
document.addEventListener('astro:page-load', initAnimations);
