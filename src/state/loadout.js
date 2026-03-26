// src/state/loadout.js
// Loadout state management — pure functions and data operations

import { RACQUETS, STRINGS } from '../data/loader.js';
import { applyGaugeModifier } from '../engine/string-profile.js';
import { predictSetup, computeCompositeScore, generateIdentity } from '../engine/composite.js';
import { buildTensionContext } from '../engine/tension.js';

// In-memory state (mirrors app.js state)
let activeLoadout = null;
let savedLoadouts = [];

// Getter functions
export function getActiveLoadout() { return activeLoadout; }
export function getSavedLoadouts() { return savedLoadouts; }

// Setter functions
export function setActiveLoadout(loadout) { activeLoadout = loadout; }
export function setSavedLoadouts(loadouts) { savedLoadouts = loadouts; }

// Persistence helper
const _store = (function() { 
  try { return window['local' + 'Storage']; } catch(e) { return null; }
})();

/**
 * Create a new loadout from frame, string, and tension settings
 */
export function createLoadout(frameId, stringId, tension, opts) {
  opts = opts || {};
  const racquet = RACQUETS.find(r => r.id === frameId);
  const rawStringData = STRINGS.find(s => s.id === stringId);
  if (!racquet || !rawStringData) return null;

  // Apply gauge modifiers to string data before prediction
  let stringData = rawStringData;
  if (!opts.isHybrid && opts.gauge) {
    stringData = applyGaugeModifier(rawStringData, opts.gauge);
  }

  let mainsData = opts.isHybrid ? STRINGS.find(s => s.id === opts.mainsId) : undefined;
  let crossesData = opts.isHybrid ? STRINGS.find(s => s.id === opts.crossesId) : undefined;
  if (mainsData && opts.mainsGauge) mainsData = applyGaugeModifier(mainsData, opts.mainsGauge);
  if (crossesData && opts.crossesGauge) crossesData = applyGaugeModifier(crossesData, opts.crossesGauge);

  const cfg = {
    isHybrid: opts.isHybrid || false,
    string: opts.isHybrid ? undefined : stringData,
    mains: mainsData,
    crosses: crossesData,
    mainsTension: tension,
    crossesTension: opts.crossesTension || tension
  };

  const stats = predictSetup(racquet, cfg);
  const tCtx = stats ? buildTensionContext(cfg, racquet) : null;
  const obs = stats ? computeCompositeScore(stats, tCtx) : 0;
  const identity = stats ? generateIdentity(stats, racquet, cfg) : null;

  // Build name
  let loName = opts.name;
  if (!loName) {
    if (opts.isHybrid && mainsData && crossesData) {
      loName = mainsData.name + ' / ' + crossesData.name + ' on ' + racquet.name;
    } else {
      loName = rawStringData.name + ' on ' + racquet.name;
    }
  }

  return {
    id: opts.id || 'lo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    name: loName,
    frameId: frameId,
    stringId: opts.isHybrid ? null : stringId,
    isHybrid: opts.isHybrid || false,
    mainsId: opts.mainsId || null,
    crossesId: opts.crossesId || null,
    mainsTension: tension,
    crossesTension: opts.crossesTension || tension,
    gauge: opts.gauge || null,
    mainsGauge: opts.mainsGauge || null,
    crossesGauge: opts.crossesGauge || null,
    stats: stats,
    obs: +obs.toFixed(1),
    identity: identity ? identity.name : '',
    source: opts.source || 'manual',
    _dirty: false
  };
}

/**
 * Persist saved loadouts to localStorage
 */
export function persistSavedLoadouts() {
  try {
    if (_store) _store.setItem('tll-loadouts', JSON.stringify(savedLoadouts));
  } catch(e) {}
}

/**
 * Load saved loadouts from localStorage
 */
export function loadSavedLoadouts() {
  try {
    if (!_store) return [];
    const stored = _store.getItem('tll-loadouts');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch(e) {}
  return [];
}

/**
 * Save a loadout to the saved list
 */
export function saveLoadout(loadout) {
  if (!loadout) return;
  const copy = Object.assign({}, loadout);
  delete copy._dirty;
  const existing = savedLoadouts.findIndex(l => l.id === copy.id);
  if (existing >= 0) {
    savedLoadouts[existing] = copy;
  } else {
    savedLoadouts.push(copy);
  }
  persistSavedLoadouts();
}

/**
 * Remove a loadout by ID
 */
export function removeLoadout(loadoutId) {
  savedLoadouts = savedLoadouts.filter(l => l.id !== loadoutId);
  persistSavedLoadouts();
}

/**
 * Switch to a saved loadout by ID
 */
export function switchToLoadout(loadoutId) {
  const lo = savedLoadouts.find(l => l.id === loadoutId);
  if (lo) {
    const copy = Object.assign({}, lo);
    copy._dirty = false;
    return copy;
  }
  return null;
}

/**
 * Get setup from a loadout object
 */
export function getSetupFromLoadout(loadout) {
  if (!loadout) return null;
  const racquet = RACQUETS.find(r => r.id === loadout.frameId);
  if (!racquet) return null;

  let string, mains, crosses;
  if (loadout.isHybrid) {
    mains = STRINGS.find(s => s.id === loadout.mainsId);
    crosses = STRINGS.find(s => s.id === loadout.crossesId);
    if (loadout.mainsGauge && mains) mains = applyGaugeModifier(mains, loadout.mainsGauge);
    if (loadout.crossesGauge && crosses) crosses = applyGaugeModifier(crosses, loadout.crossesGauge);
  } else {
    string = STRINGS.find(s => s.id === loadout.stringId);
    if (loadout.gauge && string) string = applyGaugeModifier(string, loadout.gauge);
  }

  const stringConfig = loadout.isHybrid
    ? { isHybrid: true, mains, crosses, mainsTension: loadout.mainsTension, crossesTension: loadout.crossesTension }
    : { isHybrid: false, string, mainsTension: loadout.mainsTension, crossesTension: loadout.crossesTension };

  return { racquet, stringConfig, loadout };
}

/**
 * Export loadouts to JSON string
 */
export function exportLoadouts() {
  return JSON.stringify(savedLoadouts, null, 2);
}

/**
 * Import loadouts from JSON string
 * @returns {number} number of loadouts imported
 */
export function importLoadouts(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) return 0;
    
    let imported = 0;
    parsed.forEach(lo => {
      if (lo && lo.id && lo.frameId) {
        const existing = savedLoadouts.findIndex(l => l.id === lo.id);
        if (existing >= 0) {
          savedLoadouts[existing] = lo;
        } else {
          savedLoadouts.push(lo);
        }
        imported++;
      }
    });
    
    persistSavedLoadouts();
    return imported;
  } catch(e) {
    return 0;
  }
}

// Initialize savedLoadouts from storage
savedLoadouts = loadSavedLoadouts();
