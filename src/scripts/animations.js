export function initAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Target all elements with reveal class that haven't been revealed yet
  document.querySelectorAll('.reveal-on-scroll:not(.observed)').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-1000', 'ease-out', 'observed');
    observer.observe(el);
  });
}

// In Astro, scripts usually run once per page load unless using View Transitions.
document.addEventListener('DOMContentLoaded', initAnimations);
// Astro View Transitions hook (if enabled in the future)
document.addEventListener('astro:page-load', initAnimations);
