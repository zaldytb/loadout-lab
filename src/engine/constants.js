// src/engine/constants.js
// Pure configuration constants — no dependencies on other app code

// ============================================
// GAUGE SYSTEM
// ============================================
// Available gauge options by material type.
// Each string's base data is measured at its refGauge (from the `gauge` field).
// When a different gauge is selected, applyGaugeModifier creates a virtual
// string object with adjusted properties.

export const GAUGE_OPTIONS = {
  // Polyester / Co-Polyester: wide range available
  'Polyester':             [1.15, 1.20, 1.25, 1.30, 1.35],
  'Co-Polyester (elastic)':[1.15, 1.20, 1.25, 1.30, 1.35],
  // Natural Gut: typically 15L-17
  'Natural Gut':           [1.25, 1.30, 1.35, 1.40],
  // Multifilament / Synthetic: 15L-17 common
  'Multifilament':         [1.25, 1.30, 1.35],
  'Synthetic Gut':         [1.25, 1.30, 1.35],
};

export const GAUGE_LABELS = {
  1.15: '18 (1.15mm)',
  1.20: '17 (1.20mm)',
  1.25: '16L (1.25mm)',
  1.30: '16 (1.30mm)',
  1.35: '15L (1.35mm)',
  1.40: '15L (1.40mm)',
};

// ============================================
// STAT DEFINITIONS
// ============================================

export const STAT_KEYS = ['spin', 'power', 'control', 'launch', 'feel', 'comfort', 'stability', 'forgiveness', 'maneuverability', 'durability', 'playability'];
export const STAT_LABELS = ['Spin', 'Power', 'Control', 'Launch', 'Feel', 'Comfort', 'Stability', 'Forgiveness', 'Maneuverability', 'Durability', 'Playability'];
export const STAT_LABELS_FULL = ['Spin', 'Power', 'Control', 'Launch', 'Feel', 'Comfort', 'Stability', 'Forgiveness', 'Maneuverability', 'Durability', 'Playability Duration'];
export const STAT_CSS_CLASSES = ['spin', 'power', 'control', 'launch', 'feel', 'comfort', 'stability', 'forgiveness', 'maneuverability', 'durability', 'playability'];

export const STAT_GROUPS = [
  { label: 'Attack', keys: ['spin', 'power', 'launch'] },
  { label: 'Defense', keys: ['control', 'stability', 'forgiveness'] },
  { label: 'Touch', keys: ['feel', 'comfort', 'maneuverability'] },
  { label: 'Longevity', keys: ['durability', 'playability'] }
];

// ============================================
// OBS (Overall Build Score) SYSTEM
// ============================================

export const OBS_TIERS = [
  { min: 0,  max: 10,  label: 'Delete This' },
  { min: 10, max: 20,  label: 'Hospital Build' },
  { min: 20, max: 30,  label: 'Bruh' },
  { min: 30, max: 40,  label: 'Cooked' },
  { min: 40, max: 50,  label: "This Ain't It" },
  { min: 50, max: 60,  label: 'Mid' },
  { min: 60, max: 70,  label: 'Built Diff' },
  { min: 70, max: 80,  label: 'S Rank' },
  { min: 80, max: 90,  label: 'WTF' },
  { min: 90, max: 100, label: 'Max Aura' },
];

// ============================================
// IDENTITY / CLASSIFICATION SYSTEM
// ============================================

export const WTTN_ATTRS = ['spin','power','control','launch','feel','comfort','stability','forgiveness','durability','playability'];

export const WTTN_ATTR_LABELS = { 
  spin:'Spin', 
  power:'Power', 
  control:'Control', 
  launch:'Launch', 
  feel:'Feel', 
  comfort:'Comfort', 
  stability:'Stability', 
  forgiveness:'Forgiveness', 
  durability:'Durability', 
  playability:'Playability' 
};

export const IDENTITY_FAMILIES = [
  { family: 'spin-control',   test: s => s.spin >= 75 && s.control >= 70 },
  { family: 'control-first',  test: s => s.control >= 72 && s.spin < 75 && s.power < 65 },
  { family: 'power-spin',     test: s => s.spin >= 72 && s.power >= 65 },
  { family: 'power-first',    test: s => s.power >= 70 && s.spin < 72 },
  { family: 'comfort-balanced',test: s => s.comfort >= 68 && s.power >= 55 && s.control >= 55 },
  { family: 'feel-control',   test: s => s.feel >= 70 && s.control >= 65 },
  { family: 'endurance',      test: s => s.playability >= 82 && s.durability >= 78 },
  { family: 'balanced',       test: () => true },
];

// ============================================
// LEADERBOARD STATS
// ============================================

export const LB_STATS = [
  { key: 'obs',            label: 'Best Overall',  icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', desc: 'Highest total build score' },
  { key: 'spin',           label: 'Most Spin',     icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>', desc: 'Maximum topspin potential' },
  { key: 'power',          label: 'Most Power',    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', desc: 'Hardest hitting setups'    },
  { key: 'control',        label: 'Most Control',  icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>', desc: 'Precision & placement'     },
  { key: 'comfort',        label: 'Most Comfort',  icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>', desc: 'Arm-friendly, low vibration'},
  { key: 'feel',           label: 'Best Feel',     icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>', desc: 'Touch & ball connection'   },
  { key: 'maneuverability',label: 'Most Maneuverable', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>', desc: 'Fast swing, reactive' },
  { key: 'stability',      label: 'Most Stable',   icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>', desc: 'Plow-through, twist resist'},
  { key: 'durability',     label: 'Most Durable',  icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', desc: 'Long-lasting strings'      },
];

// ============================================
// DEFAULT PRESETS
// ============================================
// Default stringing presets for the loadout creator

export const DEFAULT_PRESETS = [
  { name: 'Poly-based control',    mode: 'fullbed', material: 'Polyester',            tension: 52, label: 'Competition' },
  { name: 'Maximum spin',          mode: 'fullbed', material: 'Polyester',            tension: 50, label: 'Aggressive' },
  { name: 'Comfort + power',       mode: 'fullbed', material: 'Multifilament',        tension: 55, label: 'Arm-friendly' },
  { name: 'Hybrid: spin/comfort',  mode: 'hybrid',  materialMains: 'Polyester', materialCrosses: 'Natural Gut', tensionMains: 51, tensionCrosses: 53, label: 'Tour setup' },
  { name: 'Hybrid: control/feel',  mode: 'hybrid',  materialMains: 'Polyester', materialCrosses: 'Multifilament', tensionMains: 52, tensionCrosses: 54, label: 'Versatile' },
  { name: 'Maximum comfort',       mode: 'hybrid',  materialMains: 'Natural Gut', materialCrosses: 'Multifilament', tensionMains: 55, tensionCrosses: 56, label: 'Elbow saver' },
];
