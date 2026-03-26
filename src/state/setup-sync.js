// src/state/setup-sync.js
// Setup synchronization between active loadout and editor DOM

import { activeLoadout, savedLoadouts, switchToLoadout, saveLoadout } from './loadout.js';
import { RACQUETS, STRINGS } from '../data/loader.js';
import { applyGaugeModifier } from '../engine/string-profile.js';

/**
 * Get current setup — reads from activeLoadout when available,
 * falls back to DOM editor for creation form / no-loadout state.
 * This is the primary function to get the current build.
 */
export function getCurrentSetup() {
  if (activeLoadout) {
    return getSetupFromLoadout(activeLoadout);
  }
  return null; // Would need DOM access for _getSetupFromEditorDOM
}

/**
 * Get setup from a loadout object (pure function)
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
 * Sync compendium with active loadout state
 * Returns the racquet ID that should be selected
 */
export function syncCompendiumWithActiveLoadout() {
  if (!activeLoadout) return null;
  return activeLoadout.frameId;
}

/**
 * Sync string compendium with active loadout
 * Returns string configuration for injection
 */
export function syncStringCompendiumWithActiveLoadout() {
  if (!activeLoadout) return null;
  
  return {
    frameId: activeLoadout.frameId,
    stringId: activeLoadout.stringId,
    isHybrid: activeLoadout.isHybrid,
    mainsId: activeLoadout.mainsId,
    crossesId: activeLoadout.crossesId,
    mainsTension: activeLoadout.mainsTension,
    crossesTension: activeLoadout.crossesTension,
    gauge: activeLoadout.gauge,
    mainsGauge: activeLoadout.mainsGauge,
    crossesGauge: activeLoadout.crossesGauge
  };
}
