// src/state/store.ts
// Centralized state store for active and saved loadouts

import type { Loadout } from '../engine/types.js';

// ─── State ───────────────────────────────────────
let _activeLoadout: Loadout | null = null;
let _savedLoadouts: Loadout[] = [];

// ─── Getters ─────────────────────────────────────
export function getActiveLoadout(): Loadout | null {
  return _activeLoadout;
}

export function getSavedLoadouts(): Loadout[] {
  return _savedLoadouts;
}

// ─── Setters ─────────────────────────────────────
export function setActiveLoadout(lo: Loadout | null): void {
  _activeLoadout = lo;
  _notify('activeLoadout');
}

export function setSavedLoadouts(arr: Loadout[]): void {
  _savedLoadouts = arr;
  _notify('savedLoadouts');
}

// ─── Convenience mutators ────────────────────────
export function addSavedLoadout(lo: Loadout): void {
  _savedLoadouts = [..._savedLoadouts, lo];
  _notify('savedLoadouts');
}

export function removeSavedLoadout(id: string): void {
  _savedLoadouts = _savedLoadouts.filter(lo => lo.id !== id);
  _notify('savedLoadouts');
}

export function updateSavedLoadout(id: string, updates: Partial<Loadout>): void {
  _savedLoadouts = _savedLoadouts.map(lo =>
    lo.id === id ? { ...lo, ...updates } : lo
  );
  _notify('savedLoadouts');
}

// ─── Pub/Sub ─────────────────────────────────────
type Listener = () => void;
const _listeners: Map<string, Listener[]> = new Map();

export function subscribe(key: 'activeLoadout' | 'savedLoadouts', fn: Listener): () => void {
  if (!_listeners.has(key)) _listeners.set(key, []);
  _listeners.get(key)!.push(fn);
  // Return unsubscribe function
  return () => {
    const arr = _listeners.get(key);
    if (arr) {
      const idx = arr.indexOf(fn);
      if (idx !== -1) arr.splice(idx, 1);
    }
  };
}

function _notify(key: string): void {
  const arr = _listeners.get(key);
  if (arr) arr.forEach(fn => fn());
}
