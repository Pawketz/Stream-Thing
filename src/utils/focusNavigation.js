// utils/focusNavigation.js
// Modular focus navigation utility for scalable keyboard/wheel navigation across any set of interactive elements.

/**
 * Moves focus among a list of interactive elements.
 * @param {Array<HTMLElement>} elements - Array of focusable elements.
 * @param {'next'|'prev'} direction - Direction to move focus.
 */
export function focusElement(elements, direction) {
  if (!elements || elements.length === 0) return;
  const active = document.activeElement;
  const currentIndex = elements.findIndex(el => el === active);
  let nextIndex = currentIndex;
  if (direction === 'next') {
    nextIndex = (currentIndex + 1) % elements.length;
  } else if (direction === 'prev') {
    nextIndex = (currentIndex - 1 + elements.length) % elements.length;
  }
  elements[nextIndex]?.focus();
}

/**
 * Returns all focusable elements within a container.
 * @param {HTMLElement} container - The container to search within.
 * @returns {Array<HTMLElement>} Array of focusable elements.
 */
export function getFocusableElements(container = document) {
  return Array.from(
    (container instanceof Document ? container.body : container).querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}
