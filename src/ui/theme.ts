// src/ui/theme.ts
// Theme toggle and dark mode management

type Theme = 'dark' | 'light';

interface ThemeCallbacks {
  refreshSlotColors?: () => void;
  refreshRadarChart?: () => void;
  refreshComparison?: () => void;
  refreshSweepChart?: () => void;
}

interface ThemeState {
  currentMode?: string;
  hasSweepChart?: boolean;
}

/**
 * Toggle between light and dark themes.
 * @param callbacks - Object containing callback functions for theme-dependent updates
 * @param state - Object containing current state
 */
export function toggleTheme(callbacks: ThemeCallbacks = {}, state: ThemeState = {}): void {
  const html = document.documentElement;
  const current = html.dataset.theme as Theme | undefined;

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
 * @returns 'dark' or 'light'
 */
export function getTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || 'dark';
}

/**
 * Set theme explicitly
 * @param theme - 'dark' or 'light'
 */
export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/**
 * Initialize theme based on user preference or system preference
 */
export function initTheme(): void {
  const html = document.documentElement;
  // Default to dark if not set
  if (!html.dataset.theme) {
    html.dataset.theme = 'dark';
  }
}
