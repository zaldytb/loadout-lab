// src/ui/theme.js
// Theme toggle and dark mode management

/**
 * Toggle between light and dark themes.
 * @param {Object} callbacks - Object containing callback functions for theme-dependent updates
 * @param {Function} callbacks.refreshSlotColors - Function to refresh slot colors
 * @param {Function} callbacks.refreshRadarChart - Function to refresh radar chart
 * @param {Function} callbacks.refreshComparison - Function to refresh comparison view
 * @param {Function} callbacks.refreshSweepChart - Function to refresh sweep chart
 * @param {Object} state - Object containing current state
 * @param {string} state.currentMode - Current app mode
 * @param {boolean} state.hasSweepChart - Whether sweep chart exists
 */
export function toggleTheme(callbacks = {}, state = {}) {
  const html = document.documentElement;
  const current = html.dataset.theme;

  // Wave 2: Smooth color crossfade
  html.classList.add('theme-transitioning');
  html.dataset.theme = current === 'dark' ? 'light' : 'dark';
  setTimeout(() => html.classList.remove('theme-transitioning'), 450);

  // Refresh theme-dependent colors
  if (callbacks.refreshSlotColors) {
    callbacks.refreshSlotColors();
  }

  // Update charts
  if (callbacks.refreshRadarChart) {
    callbacks.refreshRadarChart();
  }
  
  if (callbacks.refreshComparison) {
    callbacks.refreshComparison();
  }

  // Refresh sweep chart if tune mode is open
  if (state.currentMode === 'tune' && state.hasSweepChart && callbacks.refreshSweepChart) {
    callbacks.refreshSweepChart();
  }
}

/**
 * Get current theme
 * @returns {string} 'dark' or 'light'
 */
export function getTheme() {
  return document.documentElement.dataset.theme || 'dark';
}

/**
 * Set theme explicitly
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * Initialize theme based on user preference or system preference
 */
export function initTheme() {
  const html = document.documentElement;
  // Default to dark if not set
  if (!html.dataset.theme) {
    html.dataset.theme = 'dark';
  }
}
