// src/ui/nav.js
// Navigation and mode switching

// Mode constants
export const MODES = {
  OVERVIEW: 'overview',
  TUNE: 'tune',
  COMPARE: 'compare',
  OPTIMIZE: 'optimize',
  COMPENDIUM: 'compendium',
  HOWITWORKS: 'howitworks'
};

// Scroll positions for each mode
const scrollPositions = {};

/**
 * Get current scroll position for a mode
 */
export function getScrollPosition(mode) {
  return scrollPositions[mode] || 0;
}

/**
 * Save scroll position for a mode
 */
export function saveScrollPosition(mode, position) {
  scrollPositions[mode] = position;
}

/**
 * Initialize navigation
 * @param {Object} callbacks - Callbacks for mode initialization
 */
export function initNav(callbacks = {}) {
  // Wire up mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (callbacks.onModeSwitch) {
        callbacks.onModeSwitch(mode);
      }
    });
  });

  // Wire up mobile tab buttons
  document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (callbacks.onModeSwitch) {
        callbacks.onModeSwitch(mode);
      }
    });
  });
}

/**
 * Get mode display name
 */
export function getModeLabel(mode) {
  const labels = {
    [MODES.OVERVIEW]: 'Overview',
    [MODES.TUNE]: 'Tune',
    [MODES.COMPARE]: 'Compare',
    [MODES.OPTIMIZE]: 'Optimize',
    [MODES.COMPENDIUM]: 'Explore',
    [MODES.HOWITWORKS]: 'How It Works'
  };
  return labels[mode] || mode;
}
