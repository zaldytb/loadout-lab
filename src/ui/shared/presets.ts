// src/ui/shared/presets.ts
// User preset management with localStorage persistence

import { RACQUETS, STRINGS } from '../../data/loader.js';
import type { Racquet, StringConfig, StringData } from '../../engine/types.js';

// Type assertion helper for data.js imports
type RacquetData = Racquet & Record<string, unknown>;
type StringDataRaw = StringData & Record<string, unknown>;

// ============================================
// TYPES
// ============================================

export interface UserPreset {
  id: string;
  name: string;
  racquetId: string;
  isHybrid: boolean;
  mainsId: string | null;
  crossesId: string | null;
  mainsTension: number;
  crossesTension: number;
  stringId: string | null;
  tension?: number; // Legacy field for backward compatibility
}

// ============================================
// STORAGE
// ============================================

const STORAGE_KEY = 'tll-presets';

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadPresetsFromStorage(): UserPreset[] | null {
  const store = getStorage();
  if (!store) return null;

  try {
    const stored = store.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed as UserPreset[];
    }
  } catch {
    // Storage blocked or corrupt — ignore
  }
  return null;
}

export function savePresetsToStorage(presets: UserPreset[]): void {
  const store = getStorage();
  if (!store) return;

  try {
    store.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // Storage blocked — ignore
  }
}

// ============================================
// PRESET DETAIL FORMATTING
// ============================================

export function getPresetDetail(preset: UserPreset): string {
  const racquet = RACQUETS.find((r) => r.id === preset.racquetId);
  const rName = racquet ? racquet.name : 'Unknown';

  if (preset.isHybrid) {
    const mains = (STRINGS as unknown as StringData[]).find((s) => s.id === preset.mainsId);
    const crosses = (STRINGS as unknown as StringData[]).find((s) => s.id === preset.crossesId);
    const mName = mains ? mains.name : '?';
    const xName = crosses ? crosses.name : '?';
    return `${mName} M:${preset.mainsTension} / ${xName} X:${preset.crossesTension} on ${rName}`;
  } else {
    const str = (STRINGS as unknown as StringData[]).find((s) => s.id === preset.stringId);
    const sName = str ? str.name : '?';
    const mt = preset.mainsTension ?? preset.tension ?? 55;
    const xt = preset.crossesTension ?? preset.tension ?? 53;
    return `${sName} ${mt === xt ? mt + ' lbs' : 'M:' + mt + ' / X:' + xt} on ${rName}`;
  }
}

export function getPresetName(preset: UserPreset): string {
  return preset.name || 'Unnamed Preset';
}

// ============================================
// PRESET CREATION
// ============================================

export interface CreatePresetOptions {
  racquet: Racquet;
  stringConfig: StringConfig;
  customName?: string;
}

export function createUserPreset(options: CreatePresetOptions): UserPreset {
  const { racquet, stringConfig, customName } = options;

  let presetName = customName || '';
  if (!presetName) {
    if (stringConfig.isHybrid) {
      presetName = `${stringConfig.mains.name}/${stringConfig.crosses.name} on ${racquet.name}`;
    } else {
      presetName = `${stringConfig.string.name} on ${racquet.name}`;
    }
  }

  return {
    id: 'user-' + Date.now(),
    name: presetName,
    racquetId: racquet.id,
    isHybrid: stringConfig.isHybrid,
    mainsId: stringConfig.isHybrid ? stringConfig.mains.id : null,
    crossesId: stringConfig.isHybrid ? stringConfig.crosses.id : null,
    mainsTension: stringConfig.mainsTension,
    crossesTension: stringConfig.crossesTension,
    stringId: stringConfig.isHybrid ? null : stringConfig.string.id,
  };
}

// ============================================
// PRESET RENDERING (HTML GENERATORS)
// ============================================

export interface RenderPresetItemOptions {
  onClick?: (preset: UserPreset, index: number) => void;
  onDelete?: (preset: UserPreset, index: number) => void;
  showDelete?: boolean;
}

export function renderPresetItemHTML(
  preset: UserPreset,
  index: number,
  options: RenderPresetItemOptions = {}
): string {
  const { showDelete = true } = options;

  return `
    <div class="preset-item" data-preset-id="${preset.id}" data-preset-idx="${index}">
      <button class="preset-btn" data-preset-idx="${index}">
        <span class="preset-name">${getPresetName(preset)}</span>
        <span class="preset-detail">${getPresetDetail(preset)}</span>
      </button>
      ${showDelete ? `
        <button class="preset-delete" data-preset-idx="${index}" title="Remove preset">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      ` : ''}
    </div>
  `;
}

export function renderPresetListHTML(
  presets: UserPreset[],
  options: RenderPresetItemOptions = {}
): string {
  if (presets.length === 0) {
    return '<p class="preset-empty">No saved presets yet.</p>';
  }

  return presets
    .map((preset, idx) => renderPresetItemHTML(preset, idx, options))
    .join('');
}

// ============================================
// PRESET DATA EXTRACTION
// ============================================

export interface ExtractedPresetData {
  racquet: Racquet | null;
  stringConfig: StringConfig | null;
  mainsTension: number;
  crossesTension: number;
}

export function extractPresetData(preset: UserPreset): ExtractedPresetData {
  const racquet = (RACQUETS as unknown as Racquet[]).find((r) => r.id === preset.racquetId) || null;

  const mt = preset.mainsTension ?? preset.tension ?? 55;
  const xt = preset.crossesTension ?? preset.tension ?? 53;

  if (!racquet) {
    return { racquet: null, stringConfig: null, mainsTension: mt, crossesTension: xt };
  }

  if (preset.isHybrid) {
    const mains = STRINGS.find((s) => s.id === preset.mainsId);
    const crosses = STRINGS.find((s) => s.id === preset.crossesId);

    if (!mains || !crosses) {
      return { racquet, stringConfig: null, mainsTension: mt, crossesTension: xt };
    }

    return {
      racquet: racquet as unknown as Racquet,
      stringConfig: {
        isHybrid: true,
        mains: mains as unknown as StringData,
        crosses: crosses as unknown as StringData,
        mainsTension: mt,
        crossesTension: xt,
      },
      mainsTension: mt,
      crossesTension: xt,
    };
  } else {
    const str = STRINGS.find((s) => s.id === preset.stringId);

    if (!str) {
      return { racquet, stringConfig: null, mainsTension: mt, crossesTension: xt };
    }

    return {
      racquet: racquet as Racquet,
      stringConfig: {
        isHybrid: false,
        string: str as unknown as StringData,
        mainsTension: mt,
        crossesTension: xt,
      },
      mainsTension: mt,
      crossesTension: xt,
    };
  }
}

// ============================================
// COMPARISON SLOT PRESET LOADING
// ============================================

export interface ComparisonSlotData {
  racquetId: string;
  isHybrid: boolean;
  mainsId: string;
  crossesId: string;
  mainsTension: number;
  crossesTension: number;
  stringId: string;
}

export function loadPresetIntoComparisonSlot(
  preset: UserPreset,
  slot: ComparisonSlotData
): void {
  slot.racquetId = preset.racquetId;
  slot.isHybrid = preset.isHybrid;

  if (preset.isHybrid) {
    slot.mainsId = preset.mainsId || '';
    slot.crossesId = preset.crossesId || '';
    slot.mainsTension = preset.mainsTension;
    slot.crossesTension = preset.crossesTension;
    slot.stringId = '';
  } else {
    slot.stringId = preset.stringId || '';
    slot.mainsTension = preset.mainsTension ?? preset.tension ?? 55;
    slot.crossesTension = preset.crossesTension ?? preset.tension ?? 53;
    slot.mainsId = '';
    slot.crossesId = '';
  }
}

// ============================================
// PRESET MANAGER CLASS
// ============================================

export class PresetManager {
  private presets: UserPreset[];
  private listeners: Set<(presets: UserPreset[]) => void>;

  constructor(initialPresets: UserPreset[] = []) {
    const stored = loadPresetsFromStorage();
    this.presets = stored || initialPresets;
    this.listeners = new Set();
  }

  getAll(): UserPreset[] {
    return [...this.presets];
  }

  getById(id: string): UserPreset | undefined {
    return this.presets.find((p) => p.id === id);
  }

  add(preset: UserPreset): void {
    this.presets.push(preset);
    this.save();
  }

  remove(id: string): boolean {
    const idx = this.presets.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.presets.splice(idx, 1);
    this.save();
    return true;
  }

  removeAtIndex(index: number): boolean {
    if (index < 0 || index >= this.presets.length) return false;
    this.presets.splice(index, 1);
    this.save();
    return true;
  }

  update(id: string, updates: Partial<UserPreset>): boolean {
    const preset = this.presets.find((p) => p.id === id);
    if (!preset) return false;
    Object.assign(preset, updates);
    this.save();
    return true;
  }

  private save(): void {
    savePresetsToStorage(this.presets);
    this.notify();
  }

  subscribe(listener: (presets: UserPreset[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener([...this.presets]));
  }
}
