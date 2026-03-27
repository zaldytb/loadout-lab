// src/ui/components/dock-create.ts
// Dock create form handlers

import { RACQUETS, STRINGS } from '../../data/loader.js';
import { getActiveLoadout, getSavedLoadouts } from '../../state/store.js';

// Globals from app.js
declare const activeLoadout: Loadout | null;
declare const savedLoadouts: Loadout[];
declare const currentMode: string;

import type { Loadout } from '../../engine/types.js';

// Module-level state
let _cfCreatingNew = false;

// External functions from app.js (called via window)
interface WindowExt extends Window {
  createLoadout?: (frameId: string, stringId: string, tension: number, opts?: Record<string, unknown>) => Loadout | null;
  activateLoadout?: (loadout: Loadout) => void;
  saveLoadout?: (loadout: Loadout) => void;
  switchMode?: (mode: string) => void;
  renderDashboard?: () => void;
  renderDockCreateSection?: () => void;
  _initQaSearchable?: (searchId: string, hiddenId: string, dropdownId: string, items: Array<{ id: string; label: string }>) => void;
}

/**
 * Render the dock create section
 */
export function renderDockCreateSection(): void {
  const container = document.getElementById('dock-create-area');
  const editorSection = document.getElementById('dock-editor-section');
  if (!container) return;

  const al = getActiveLoadout();
  const sls = getSavedLoadouts();

  if (!al && !_cfCreatingNew) {
    container.innerHTML = _renderCreateFormTailwind('Create Loadout', false);
    _wireCreateForm(container);
    if (editorSection) editorSection.style.display = 'none';
  } else if (al && !_cfCreatingNew) {
    container.innerHTML =
      '<button class="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[var(--dc-border)] font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--dc-storm)] hover:text-[var(--dc-platinum)] hover:border-[var(--dc-border-hover)] transition-colors" onclick="_showNewLoadoutForm()">' +
        '<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg>' +
        'Create New Loadout' +
      '</button>';
    if (editorSection) editorSection.style.display = '';
  } else if (_cfCreatingNew) {
    container.innerHTML = _renderCreateFormTailwind('New Loadout', true);
    _wireCreateForm(container);
    if (editorSection) editorSection.style.display = 'none';
  }
}

/**
 * Render create form HTML (legacy - kept for compatibility, uses Tailwind version)
 */
export function _renderCreateForm(title: string, showCancel: boolean): string {
  return _renderCreateFormTailwind(title, showCancel);
}

/**
 * Render create form HTML with Tailwind styling
 */
export function _renderCreateFormTailwind(title: string, showCancel: boolean): string {
  return '<div class="dock-cf-form">' +
    '<div class="dock-cf-header">' +
      '<span class="dock-cf-title">' + title + '</span>' +
      (showCancel ? '<a class="dock-cf-cancel" href="#" onclick="_hideNewLoadoutForm(); return false;">Cancel</a>' : '') +
    '</div>' +
    '<div class="dock-cf-toggle">' +
      '<button class="dock-cf-toggle-btn active" data-cf-mode="full" onclick="_cfToggleMode(this)">Full Bed</button>' +
      '<button class="dock-cf-toggle-btn" data-cf-mode="hybrid" onclick="_cfToggleMode(this)">Hybrid</button>' +
    '</div>' +
    '<div class="dock-cf-body" data-cf-hybrid="false">' +
      '<div class="dock-cf-section dock-cf-fullbed">' +
        '<div class="dock-qa-field">' +
          '<label class="dock-qa-label">Frame</label>' +
          '<div class="dock-qa-searchable">' +
            '<input type="text" class="dock-qa-search" id="dock-cf-frame-search" placeholder="Search frames..." autocomplete="off">' +
            '<input type="hidden" id="dock-cf-frame">' +
            '<div class="dock-qa-dropdown hidden" id="dock-cf-frame-dropdown"></div>' +
          '</div>' +
        '</div>' +
        '<div class="dock-qa-field">' +
          '<label class="dock-qa-label">String</label>' +
          '<div class="dock-qa-searchable">' +
            '<input type="text" class="dock-qa-search" id="dock-cf-string-search" placeholder="Search strings..." autocomplete="off">' +
            '<input type="hidden" id="dock-cf-string">' +
            '<div class="dock-qa-dropdown hidden" id="dock-cf-string-dropdown"></div>' +
          '</div>' +
        '</div>' +
        '<div class="dock-cf-row">' +
          '<div class="dock-qa-field dock-cf-half">' +
            '<label class="dock-qa-label">Mains (lbs)</label>' +
            '<input type="number" class="dock-qa-input" id="dock-cf-tension-m" value="55" min="30" max="70">' +
          '</div>' +
          '<div class="dock-qa-field dock-cf-half">' +
            '<label class="dock-qa-label">Crosses (lbs)</label>' +
            '<input type="number" class="dock-qa-input" id="dock-cf-tension-x" value="53" min="30" max="70">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dock-cf-section dock-cf-hybrid hidden">' +
        '<div class="dock-qa-field">' +
          '<label class="dock-qa-label">Frame</label>' +
          '<div class="dock-qa-searchable">' +
            '<input type="text" class="dock-qa-search" id="dock-cf-h-frame-search" placeholder="Search frames..." autocomplete="off">' +
            '<input type="hidden" id="dock-cf-h-frame">' +
            '<div class="dock-qa-dropdown hidden" id="dock-cf-h-frame-dropdown"></div>' +
          '</div>' +
        '</div>' +
        '<div class="dock-qa-field">' +
          '<label class="dock-qa-label dock-cf-accent-cyan">Mains String</label>' +
          '<div class="dock-qa-searchable">' +
            '<input type="text" class="dock-qa-search" id="dock-cf-mains-search" placeholder="Search mains..." autocomplete="off">' +
            '<input type="hidden" id="dock-cf-mains">' +
            '<div class="dock-qa-dropdown hidden" id="dock-cf-mains-dropdown"></div>' +
          '</div>' +
        '</div>' +
        '<div class="dock-qa-field">' +
          '<label class="dock-qa-label">Mains Tension</label>' +
          '<input type="number" class="dock-qa-input" id="dock-cf-mains-tension" value="55" min="30" max="70">' +
        '</div>' +
        '<div class="dock-qa-field">' +
          '<label class="dock-qa-label dock-cf-accent-green">Crosses String</label>' +
          '<div class="dock-qa-searchable">' +
            '<input type="text" class="dock-qa-search" id="dock-cf-crosses-search" placeholder="Search crosses..." autocomplete="off">' +
            '<input type="hidden" id="dock-cf-crosses">' +
            '<div class="dock-qa-dropdown hidden" id="dock-cf-crosses-dropdown"></div>' +
          '</div>' +
        '</div>' +
        '<div class="dock-qa-field">' +
          '<label class="dock-qa-label">Crosses Tension</label>' +
          '<input type="number" class="dock-qa-input" id="dock-cf-crosses-tension" value="53" min="30" max="70">' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="dock-qa-btns">' +
      '<button class="dock-qa-btn dock-qa-btn-primary" onclick="_cfActivate()">Set Active</button>' +
      '<button class="dock-qa-btn" onclick="_cfSave()">Save to Loadouts</button>' +
    '</div>' +
  '</div>';
}

/**
 * Toggle between full bed and hybrid mode in create form
 */
export function _cfToggleMode(btn: HTMLElement): void {
  const container = btn.closest('.dock-cf-form') as HTMLElement | null;
  if (!container) return;

  const mode = btn.dataset.cfMode;
  const isHybrid = mode === 'hybrid';

  const fullSection = container.querySelector('.dock-cf-fullbed') as HTMLElement | null;
  const hybridSection = container.querySelector('.dock-cf-hybrid') as HTMLElement | null;

  if (fullSection) {
    if (isHybrid) fullSection.classList.add('hidden');
    else fullSection.classList.remove('hidden');
  }
  if (hybridSection) {
    if (isHybrid) hybridSection.classList.remove('hidden');
    else hybridSection.classList.add('hidden');
  }

  container.querySelectorAll('.dock-cf-toggle-btn').forEach(b => {
    const isTarget = (b as HTMLElement).dataset.cfMode === mode;
    b.classList.toggle('active', isTarget);
    (b as HTMLElement).style.background = isTarget ? 'var(--dc-platinum)' : 'transparent';
    (b as HTMLElement).style.color = isTarget ? 'var(--dc-void)' : 'var(--dc-storm)';
  });
}

/**
 * Wire up searchable selects in create form
 */
export function _wireCreateForm(container: HTMLElement): void {
  const frameItems = RACQUETS.map(r => ({ id: r.id, label: r.name }));
  const stringItems = STRINGS.map(s => ({ id: s.id, label: s.name + ' (' + s.gauge + ')' }));

  const win = window as WindowExt;

  // Full bed searchables
  win._initQaSearchable?.('dock-cf-frame-search', 'dock-cf-frame', 'dock-cf-frame-dropdown', frameItems);
  win._initQaSearchable?.('dock-cf-string-search', 'dock-cf-string', 'dock-cf-string-dropdown', stringItems);

  // Hybrid searchables
  win._initQaSearchable?.('dock-cf-h-frame-search', 'dock-cf-h-frame', 'dock-cf-h-frame-dropdown', frameItems);
  win._initQaSearchable?.('dock-cf-mains-search', 'dock-cf-mains', 'dock-cf-mains-dropdown', stringItems);
  win._initQaSearchable?.('dock-cf-crosses-search', 'dock-cf-crosses', 'dock-cf-crosses-dropdown', stringItems);
}

/**
 * Build loadout from create form values
 */
export function _cfBuildLoadout(): Loadout | null {
  const form = document.querySelector('.dock-cf-form') as HTMLElement | null;
  if (!form) return null;

  const hybridSection = form.querySelector('.dock-cf-hybrid') as HTMLElement | null;
  const isHybrid = hybridSection && !hybridSection.classList.contains('hidden');

  const win = window as WindowExt;

  if (isHybrid) {
    const frameId = (document.getElementById('dock-cf-h-frame') as HTMLInputElement | null)?.value;
    const mainsId = (document.getElementById('dock-cf-mains') as HTMLInputElement | null)?.value;
    const crossesId = (document.getElementById('dock-cf-crosses') as HTMLInputElement | null)?.value;
    const mainsTension = parseInt((document.getElementById('dock-cf-mains-tension') as HTMLInputElement | null)?.value || '55') || 55;
    const crossesTension = parseInt((document.getElementById('dock-cf-crosses-tension') as HTMLInputElement | null)?.value || '53') || 53;
    if (!frameId || !mainsId || !crossesId) return null;

    return win.createLoadout?.(frameId, mainsId, mainsTension, {
      isHybrid: true,
      mainsId,
      crossesId,
      crossesTension,
      source: 'manual'
    }) || null;
  } else {
    const frameId = (document.getElementById('dock-cf-frame') as HTMLInputElement | null)?.value;
    const stringId = (document.getElementById('dock-cf-string') as HTMLInputElement | null)?.value;
    const mainsT = parseInt((document.getElementById('dock-cf-tension-m') as HTMLInputElement | null)?.value || '55') || 55;
    const crossesT = parseInt((document.getElementById('dock-cf-tension-x') as HTMLInputElement | null)?.value || '53') || 53;
    if (!frameId || !stringId) return null;

    return win.createLoadout?.(frameId, stringId, mainsT, { source: 'manual', crossesTension: crossesT }) || null;
  }
}

/**
 * Activate loadout from create form
 */
export function _cfActivate(): void {
  const sls = getSavedLoadouts();
  const isFirstLoadout = !getActiveLoadout() && sls.length === 0;
  const lo = _cfBuildLoadout();
  if (!lo) {
    _cfHighlightMissingFields();
    return;
  }
  _cfClearFieldErrors();

  _cfCreatingNew = false;
  const win = window as WindowExt;
  win.activateLoadout?.(lo);

  if (isFirstLoadout) {
    win.saveLoadout?.(lo);
    win.switchMode?.('tune');
  } else if (currentMode === 'overview') {
    win.renderDashboard?.();
  }
}

/**
 * Save loadout from create form
 */
export function _cfSave(): void {
  const lo = _cfBuildLoadout();
  if (!lo) {
    _cfHighlightMissingFields();
    return;
  }
  _cfClearFieldErrors();

  _cfCreatingNew = false;
  (window as WindowExt).saveLoadout?.(lo);
}

/**
 * Highlight missing fields in create form
 */
export function _cfHighlightMissingFields(): void {
  const form = document.querySelector('.dock-cf-form') as HTMLElement | null;
  if (!form) return;

  const hybridSection = form.querySelector('.dock-cf-hybrid') as HTMLElement | null;
  const isHybrid = hybridSection && !hybridSection.classList.contains('hidden');

  _cfClearFieldErrors();

  if (isHybrid) {
    const hFrame = document.getElementById('dock-cf-h-frame') as HTMLInputElement | null;
    const mains = document.getElementById('dock-cf-mains') as HTMLInputElement | null;
    const crosses = document.getElementById('dock-cf-crosses') as HTMLInputElement | null;

    if (!hFrame || !hFrame.value) _cfShowFieldError('dock-cf-h-frame-search', 'Frame is required');
    if (!mains || !mains.value) _cfShowFieldError('dock-cf-mains-search', 'Select a string from the dropdown');
    if (!crosses || !crosses.value) _cfShowFieldError('dock-cf-crosses-search', 'Select a string from the dropdown');
  } else {
    const frame = document.getElementById('dock-cf-frame') as HTMLInputElement | null;
    const string = document.getElementById('dock-cf-string') as HTMLInputElement | null;

    if (!frame || !frame.value) _cfShowFieldError('dock-cf-frame-search', 'Frame is required');
    if (!string || !string.value) {
      const stringSearch = document.getElementById('dock-cf-string-search') as HTMLInputElement | null;
      if (stringSearch && stringSearch.value.trim()) {
        _cfShowFieldError('dock-cf-string-search', 'Select a string from the dropdown');
      } else {
        _cfShowFieldError('dock-cf-string-search', 'String is required');
      }
    }
  }
}

/**
 * Show field error in create form
 */
export function _cfShowFieldError(inputId: string, message: string): void {
  const input = document.getElementById(inputId) as HTMLElement | null;
  if (!input) return;

  const wrapper = input.closest('.dock-qa-searchable') as HTMLElement | null;
  if (wrapper) wrapper.classList.add('ss-invalid');

  input.classList.add('ss-invalid');

  const field = input.closest('.dock-qa-field') as HTMLElement | null;
  if (field) {
    const existingError = field.querySelector('.ss-field-error');
    if (!existingError) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'ss-field-error';
      errorDiv.textContent = message;
      field.appendChild(errorDiv);
    }
  }
}

/**
 * Clear all field errors in create form
 */
export function _cfClearFieldErrors(): void {
  document.querySelectorAll('.dock-cf-form .ss-invalid').forEach(el => {
    el.classList.remove('ss-invalid');
  });
  document.querySelectorAll('.dock-cf-form .ss-field-error').forEach(el => {
    el.remove();
  });
}

/**
 * Show new loadout form
 */
export function _showNewLoadoutForm(): void {
  _cfCreatingNew = true;
  renderDockCreateSection();
}

/**
 * Hide new loadout form
 */
export function _hideNewLoadoutForm(): void {
  _cfCreatingNew = false;
  renderDockCreateSection();
}

/**
 * Legacy alias for backward compat
 */
export function toggleQuickAdd(): void { _showNewLoadoutForm(); }

/**
 * Legacy alias for backward compat
 */
export function quickAddActivate(): void { _cfActivate(); }

/**
 * Legacy alias for backward compat
 */
export function quickAddSave(): void { _cfSave(); }
