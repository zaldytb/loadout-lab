# style.css Surgery Instructions

## Step 1 — Find and DELETE these entire CSS rule blocks

Search for each selector below. Delete the entire block: from the selector line through the closing `}`.
Also delete any variant blocks like `[data-theme="light"] .selector-name { ... }` 
and media query variants like `@media (max-width: 600px) { .selector-name { ... } }`.

### BUILDER PANEL
- `.builder-panel` and all nested rules (it's a section with many sub-rules)
- `.panel-section`  
- `.panel-title` (delete the main block AND the `[data-theme="light"]` variant)

### DOCK ACTIVE LOADOUT
- `.dock-lo-card`
- `.dock-lo-empty`, `.dock-lo-empty-title`, `.dock-lo-empty-sub`
- `.dock-lo-active`
- `.dock-lo-header`
- `.dock-lo-obs-ring`, `.dock-lo-obs-val`
- `.dock-lo-info`, `.dock-lo-name`, `.dock-lo-identity`, `.dock-lo-details`, `.dock-lo-source`
- `.dock-lo-actions`
- `.dock-lo-btn`, `.dock-lo-btn:hover`, `.dock-lo-btn-dirty`

### DOCK MY LOADOUTS  
- `.dock-my-loadouts`
- `.dock-myl-header`, `.dock-myl-count`, `.dock-myl-list`, `.dock-myl-empty`
- `.dock-myl-item`, `.dock-myl-item:hover`
- `.dock-myl-active` + `[data-theme="light"]` variant
- `.dock-myl-active .dock-myl-item-main` etc. (all `.dock-myl-active .` compound rules)
- `.dock-myl-item-main`
- `.dock-myl-obs`
- `.dock-myl-item-info`, `.dock-myl-item-frame`, `.dock-myl-active-badge`, `.dock-myl-source-tag`
- `.dock-myl-item-string`, `.dock-myl-item-meta`
- `.dock-myl-item-actions`
- `.dock-myl-btn`, `.dock-myl-btn:hover`, `.dock-myl-btn-remove`, `.dock-myl-btn-remove:hover`
- `.dock-myl-btn-confirm-yes`, `.dock-myl-btn-confirm-yes:hover`
- `.dock-myl-confirm-text`
- `.dock-myl-actions`
- `.dock-myl-action-btn`, `.dock-myl-action-btn:hover`

### DOCK EDITOR
- `.dock-editor-details`, `.dock-editor-summary`, `.dock-editor-summary:hover`
- `.dock-editor-summary::-webkit-details-marker`
- `.dock-editor-body`

### DOCK COLLAPSE
- `.dock-collapse-row`, `.dock-collapse-btn`, `.dock-collapse-btn:hover`

### DOCK RAIL
- `.dock-rail-expand`, `.dock-rail-expand:hover`
- `.dock-rail-obs`, `.dock-rail-count`
- **KEEP**: `.build-dock.dock-collapsed .dock-rail { display: flex; }` — this is a compound rule, keep it

### DOCK CREATE / CF / QA
- `.dock-create-new-wrap`, `.dock-create-new-btn`, `.dock-create-new-btn:hover`
- `.dock-cf-form`, `.dock-cf-header`, `.dock-cf-title`, `.dock-cf-cancel`, `.dock-cf-cancel:hover`
- `.dock-cf-toggle`, `.dock-cf-toggle-btn`, `.dock-cf-toggle-btn:hover`, `.dock-cf-toggle-btn.active`
- `.dock-cf-body`, `.dock-cf-section`, `.dock-cf-row`, `.dock-cf-half`
- `.dock-cf-accent-cyan`, `.dock-cf-accent-green`
- `.dock-qa-field`, `.dock-qa-label`, `.dock-qa-searchable`
- `.dock-qa-search`, `.dock-qa-search:focus`, `.dock-qa-search::placeholder`
- `.dock-qa-dropdown` (the CSS class — note: `ss-dropdown` is different, keep that)
- `.dock-qa-input`, `.dock-qa-input:focus`
- `.dock-qa-btns`, `.dock-qa-btn`, `.dock-qa-btn:hover`, `.dock-qa-btn-primary`, `.dock-qa-btn-primary:hover`
- `.dock-qa-select`
- `.dock-qa-dd-item`, `.dock-qa-dd-item:hover`, `.dock-qa-dd-empty` (if present)

### DOCK CONTEXT PANEL
- `.dock-ctx-guidance`, `.dock-ctx-guidance-icon`, `.dock-ctx-guidance-title`, `.dock-ctx-guidance-body`
- `.dock-ctx-label`
- `.dock-ctx-current`, `.dock-ctx-current-name`, `.dock-ctx-current-detail`, `.dock-ctx-current-obs`
- `.dock-ctx-actions`, `.dock-ctx-action`, `.dock-ctx-action:hover`

### DOCK COMPARE (small)
- `.dock-compare-slots`
- `.dock-compare-slot`, `.dock-compare-slot:hover`
- `.dock-compare-slot-header`, `.dock-compare-slot-label`, `.dock-compare-slot-obs`
- `.dock-compare-slot-meta`, `.dock-compare-slot-actions`, `.dock-compare-slot-btn`, `.dock-compare-slot-btn:hover`
- `.dock-compare-slot-remove`, `.dock-compare-slot-remove:hover`
- `.dock-compare-quickadd`
- `.dock-compare-pill`, `.dock-compare-pill:hover`
- `.dock-compare-pill-frame`, `.dock-compare-pill-string`

### MOBILE DOCK
- `.dock-mob-summary`, `.dock-mob-obs`, `.dock-mob-obs:empty`
- `.dock-mob-label`, `.dock-mob-chevron`, `.dock-mob-theme`, `.dock-mob-theme:hover`

### MOBILE LOADOUT PILLS
- `.mobile-loadout-pills`
- `.mobile-lo-pill`, `.mobile-lo-pill.active`
- `.mobile-lo-pill-obs`
- `[data-theme="light"] .mobile-lo-pill.active` etc.

### LEGACY FORM INPUTS (being replaced by Tailwind versions)
- `.toggle-group`, `.toggle-btn`, `.toggle-btn.active`, `.toggle-btn:hover:not(.active)`
- `.field-label`, `.field-label.accent-cyan`, `.field-label.accent-green`
- `.frame-specs` (the container — NOT `.frame-spec-item`, `.frame-spec-label`, `.frame-spec-value`)
- `.hybrid-section`
- `.fullbed-gauge-row`, `.fullbed-tension-row`
- `.gauge-select`, `.gauge-select:focus`, `.gauge-select:disabled` + `[data-theme="light"]` variant
- `.text-input`, `.text-input:focus`, `.text-input::-webkit-inner-spin-button` + light variant
- `.select-input`, `.select-input:focus` + light variant

### SHARE TOAST (adding back minimal version)
- `.share-toast`, `.share-toast-show`

### PRESETS
- `.preset-header`
- `.preset-list`, `.preset-item`
- `.preset-item .preset-btn`, `.preset-item .preset-btn:hover`
- `.preset-name`, `.preset-detail`
- `.preset-delete`, `.preset-delete:hover`
- Also delete `.btn-save-preset`, `.btn-save-preset:hover`, `.btn-save-preset.saved`

---

## Step 2 — REPLACE the entire "DOCK / BUILDER PANEL" comment section

Find this comment:
```
/* ============================================
   DOCK PANEL COMPONENTS
   ============================================ */
```

Delete everything from that comment through the end of the builder panel CSS section,
and replace with the contents of `dock_replacement.css`.

---

## Step 3 — In `index.html`

Find: `<div class="builder-panel" id="builder-panel">`  
...and everything up to the matching closing `</div>` (it ends before `</aside>`)

Replace with contents of `builder_panel_final.html`

---

## Step 4 — In `app.js`

Replace these functions with the versions from `dock_js_final.js`:
- `renderMyLoadouts()`
- `confirmRemoveLoadout(loadoutId)`
- `renderDockPanel()`
- `renderMobileLoadoutPills()`
- `renderDockCreateSection()`
- `setHybridMode(isHybrid)`
- `_cfToggleMode(btn)`
- `_dockGuidance(icon, title, body)`
- `_dockContextActions(actions)`

Add these new functions (also in `dock_js_final.js`):
- `_renderCreateFormTailwind(title, showCancel)`
- `_cfFieldHtml(label, searchId, hiddenId, dropdownId, placeholder)`
- `_cfTensionHtml(label, inputId, defaultVal)`

