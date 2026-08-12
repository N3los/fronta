/**
 * Radiant Cards Effect
 * Follows mouse and updates CSS variables for spotlight borders
 */
export const initRadiantCards = () => {
  const cards = document.querySelectorAll('.radiant-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
};

// Auto-init for Astro ViewTransitions
document.addEventListener('astro:page-load', initRadiantCards);
