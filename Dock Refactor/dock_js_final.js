// ============================================
// DOCK JS — Tailwind Migration
// Drop these functions into app.js, replacing
// the originals with the same names
// ============================================

// ─────────────────────────────────────────────
// renderMyLoadouts()
// ─────────────────────────────────────────────
function renderMyLoadouts() {
  var listEl = document.getElementById('dock-myl-list');
  var countEl = document.getElementById('dock-myl-count');
  if (!listEl) return;

  if (countEl) countEl.textContent = savedLoadouts.length;

  if (savedLoadouts.length === 0) {
    listEl.innerHTML = '<div class="px-3 py-4 text-center font-mono text-[10px] text-dc-storm">No saved loadouts yet</div>';
    return;
  }

  var sourceLabels = { quiz: 'Quiz', compendium: 'Bible', manual: '', preset: 'Preset', optimize: 'Opt', shared: 'Shared', import: 'Imp' };

  listEl.innerHTML = savedLoadouts.map(function(lo) {
    var isActive = activeLoadout && activeLoadout.id === lo.id;
    if (!isActive && activeLoadout) {
      isActive = activeLoadout.frameId === lo.frameId &&
        activeLoadout.mainsTension === lo.mainsTension &&
        activeLoadout.crossesTension === lo.crossesTension &&
        activeLoadout.isHybrid === (lo.isHybrid || false) &&
        (lo.isHybrid
          ? activeLoadout.mainsId === lo.mainsId && activeLoadout.crossesId === lo.crossesId
          : activeLoadout.stringId === lo.stringId);
    }

    var racquet = RACQUETS.find(function(r) { return r.id === lo.frameId; });
    var frameName = racquet ? racquet.name : '\u2014';
    var stringName = '\u2014';
    if (lo.isHybrid) {
      var m = STRINGS.find(function(s) { return s.id === lo.mainsId; });
      var x = STRINGS.find(function(s) { return s.id === lo.crossesId; });
      stringName = (m && x) ? (m.name + ' / ' + x.name) : '\u2014';
    } else {
      var str = STRINGS.find(function(s) { return s.id === lo.stringId; });
      stringName = str ? str.name : '\u2014';
    }

    var srcLabel = sourceLabels[lo.source] || '';
    var obsColor = getObsScoreColor(lo.obs || 0);
    var activeBorderClass = isActive
      ? 'border-l-2 border-l-[var(--dc-accent)] bg-[var(--dc-void-lift)]'
      : 'border-l-2 border-l-transparent hover:bg-[var(--dc-void-lift)]';

    return (
      '<div class="group relative flex items-stretch border-b border-[var(--dc-border)] last:border-b-0 transition-colors ' + activeBorderClass + '" data-lo-id="' + lo.id + '">' +
        // Clickable main area
        '<div class="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2.5 cursor-pointer" onclick="switchToLoadout(\'' + lo.id + '\')">' +
          // OBS box
          '<div class="w-9 h-9 shrink-0 border border-[var(--dc-border)] flex items-center justify-center">' +
            '<span class="font-mono text-[11px] font-bold" style="color:' + obsColor + '">' + (lo.obs ? lo.obs.toFixed(1) : '\u2014') + '</span>' +
          '</div>' +
          // Info
          '<div class="flex-1 min-w-0">' +
            '<div class="font-sans text-[11px] font-semibold text-[var(--dc-platinum)] leading-tight truncate flex items-center gap-1">' +
              frameName +
              (isActive ? '<span class="font-mono text-[7px] uppercase tracking-wider text-[var(--dc-accent)]">Active</span>' : '') +
              (srcLabel ? '<span class="font-mono text-[7px] text-[var(--dc-storm)] border border-[var(--dc-border)] px-1">' + srcLabel + '</span>' : '') +
            '</div>' +
            '<div class="font-mono text-[9px] text-[var(--dc-storm)] truncate leading-tight mt-0.5">' + stringName + '</div>' +
            '<div class="font-mono text-[8px] text-[var(--dc-storm)]/60 mt-0.5">M' + lo.mainsTension + '/X' + lo.crossesTension + ' lbs</div>' +
          '</div>' +
        '</div>' +
        // Ghost action buttons (hover reveal)
        '<div class="flex items-stretch opacity-0 group-hover:opacity-100 transition-opacity border-l border-[var(--dc-border)]">' +
          '<button class="w-8 flex items-center justify-center text-[var(--dc-storm)] hover:text-[var(--dc-platinum)] hover:bg-[var(--dc-void)] transition-colors" onclick="shareLoadout(\'' + lo.id + '\')" title="Share">' +
            '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7.5L8 4.5M8 4.5V7M8 4.5H5.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="1" width="10" height="10" rx="2"/></svg>' +
          '</button>' +
          '<button class="w-8 flex items-center justify-center text-[var(--dc-storm)] hover:text-[var(--dc-platinum)] hover:bg-[var(--dc-void)] transition-colors border-l border-[var(--dc-border)]" onclick="addLoadoutToCompare(\'' + lo.id + '\')" title="Compare">' +
            '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="4" height="10" rx="0.5"/><rect x="7" y="1" width="4" height="10" rx="0.5"/></svg>' +
          '</button>' +
          '<button class="w-8 flex items-center justify-center text-[var(--dc-storm)] hover:text-[var(--dc-red)] hover:bg-[var(--dc-void)] transition-colors border-l border-[var(--dc-border)]" onclick="confirmRemoveLoadout(\'' + lo.id + '\')" title="Remove">' +
            '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// ─────────────────────────────────────────────
// confirmRemoveLoadout(loadoutId)
// ─────────────────────────────────────────────
function confirmRemoveLoadout(loadoutId) {
  var item = document.querySelector('[data-lo-id="' + loadoutId + '"]');
  if (!item) return;
  var actionBar = item.querySelector('div.flex.items-stretch.opacity-0, div.flex.items-stretch');
  if (!actionBar) return;
  actionBar.style.opacity = '1';
  actionBar.style.pointerEvents = 'auto';
  actionBar.innerHTML =
    '<span class="font-mono text-[8px] text-[var(--dc-storm)] px-2 flex items-center whitespace-nowrap">Delete?</span>' +
    '<button class="px-2 font-mono text-[9px] font-bold text-[var(--dc-red)] hover:bg-[var(--dc-void)] border-l border-[var(--dc-border)] h-full transition-colors" onclick="removeLoadout(\'' + loadoutId + '\')">Yes</button>' +
    '<button class="px-2 font-mono text-[9px] text-[var(--dc-storm)] hover:text-[var(--dc-platinum)] border-l border-[var(--dc-border)] h-full transition-colors" onclick="renderMyLoadouts()">No</button>';
}

// ─────────────────────────────────────────────
// renderDockPanel()
// ─────────────────────────────────────────────
function renderDockPanel() {
  var emptyEl = document.getElementById('dock-lo-empty');
  var activeEl = document.getElementById('dock-lo-active');
  if (!emptyEl || !activeEl) return;

  if (!activeLoadout) {
    emptyEl.classList.remove('hidden');
    activeEl.classList.add('hidden');
  } else {
    emptyEl.classList.add('hidden');
    activeEl.classList.remove('hidden');

    // OBS value + color
    var obsVal = document.getElementById('dock-lo-obs-val');
    var obsRing = document.getElementById('dock-lo-obs-ring');
    var newDockObs = activeLoadout.obs || 0;
    if (obsVal) {
      if (newDockObs > 0 && _prevObsValues.dock != null && _prevObsValues.dock > 0) {
        animateOBS(obsVal, _prevObsValues.dock, newDockObs, 400);
      } else {
        obsVal.textContent = newDockObs > 0 ? newDockObs.toFixed(1) : '\u2014';
      }
    }
    _prevObsValues.dock = newDockObs;

    if (obsRing && obsVal) {
      var color = getObsScoreColor(newDockObs);
      obsRing.style.borderColor = color;
      obsVal.style.color = color;
    }

    // Info text
    var racquet = RACQUETS.find(function(r) { return r.id === activeLoadout.frameId; });
    var stringData = activeLoadout.isHybrid ? null : STRINGS.find(function(s) { return s.id === activeLoadout.stringId; });
    var nameEl = document.getElementById('dock-lo-name');
    var identEl = document.getElementById('dock-lo-identity');
    var detailsEl = document.getElementById('dock-lo-details');
    var sourceEl = document.getElementById('dock-lo-source');

    if (nameEl) nameEl.textContent = activeLoadout.name || '\u2014';
    if (identEl) identEl.textContent = activeLoadout.identity || '';
    if (detailsEl) {
      var frameName = racquet ? racquet.name.replace(/\s+\d+g$/, '') : '\u2014';
      var strName = stringData ? stringData.name : (activeLoadout.isHybrid ? 'Hybrid' : '\u2014');
      detailsEl.textContent = frameName + ' \u00B7 ' + strName + ' \u00B7 M' + activeLoadout.mainsTension + '/X' + activeLoadout.crossesTension;
    }
    if (sourceEl) {
      var labels = { quiz: 'Quiz', compendium: 'Racket Bible', manual: 'Manual', preset: 'Preset', optimize: 'Optimizer', shared: 'Shared' };
      if (activeLoadout._dirty) {
        sourceEl.textContent = '\u270E Modified';
        sourceEl.className = sourceEl.className.replace('hidden', '');
        sourceEl.classList.remove('hidden');
        sourceEl.style.color = 'var(--dc-warn)';
      } else if (activeLoadout.source && labels[activeLoadout.source]) {
        sourceEl.textContent = labels[activeLoadout.source];
        sourceEl.classList.remove('hidden');
        sourceEl.style.color = '';
      } else {
        sourceEl.classList.add('hidden');
      }
    }

    // Save button dirty tint
    var saveBtnEl = document.querySelector('#dock-lo-active button[onclick="saveActiveLoadout()"]');
    if (saveBtnEl) {
      if (activeLoadout._dirty) {
        saveBtnEl.style.color = 'var(--dc-warn)';
        saveBtnEl.title = 'Unsaved changes';
      } else {
        saveBtnEl.style.color = '';
        saveBtnEl.title = 'Save to My Loadouts';
      }
    }
  }

  renderMyLoadouts();
  renderDockCreateSection();
  _syncMobileDockBar();
  _syncDockRail();
  renderDockContextPanel();
  renderMobileLoadoutPills();
}

// ─────────────────────────────────────────────
// renderMobileLoadoutPills()
// ─────────────────────────────────────────────
function renderMobileLoadoutPills() {
  var container = document.getElementById('mobile-loadout-pills');
  if (!container) return;
  if (window.innerWidth > 1024) { container.innerHTML = ''; return; }
  if (!savedLoadouts || savedLoadouts.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = savedLoadouts.map(function(lo) {
    var isActive = activeLoadout && activeLoadout.id === lo.id;
    var name = (lo.name || 'Loadout').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var obs = lo.obs ? lo.obs.toFixed(1) : '\u2014';
    var cls = isActive
      ? 'bg-[var(--dc-platinum)] text-[var(--dc-void)] border-[var(--dc-platinum)]'
      : 'bg-transparent text-[var(--dc-storm)] border-[var(--dc-border)] hover:text-[var(--dc-platinum)] hover:border-[var(--dc-storm)]';
    return '<button class="shrink-0 flex items-center gap-2 px-3 py-1.5 border font-mono text-[10px] font-semibold transition-colors ' + cls + '" onclick="switchToLoadout(\'' + lo.id + '\')">' +
      name + '<span class="opacity-60">' + obs + '</span></button>';
  }).join('');
}

// ─────────────────────────────────────────────
// renderDockCreateSection()
// ─────────────────────────────────────────────
function renderDockCreateSection() {
  var container = document.getElementById('dock-create-area');
  var editorSection = document.getElementById('dock-editor-section');
  if (!container) return;

  if (!activeLoadout && !_cfCreatingNew) {
    container.innerHTML = _renderCreateFormTailwind('Create Loadout', false);
    _wireCreateForm(container);
    if (editorSection) editorSection.style.display = 'none';
  } else if (activeLoadout && !_cfCreatingNew) {
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

// ─────────────────────────────────────────────
// _renderCreateFormTailwind(title, showCancel)
// ─────────────────────────────────────────────
function _renderCreateFormTailwind(title, showCancel) {
  return (
    '<div class="border border-[var(--dc-border)] bg-[var(--dc-void-deep)] p-4 flex flex-col gap-3">' +
      '<div class="flex items-center justify-between border-b border-[var(--dc-border)] pb-3">' +
        '<span class="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dc-platinum)]">' + title + '</span>' +
        (showCancel ? '<a class="font-mono text-[9px] uppercase tracking-widest text-[var(--dc-storm)] hover:text-[var(--dc-platinum)] cursor-pointer transition-colors" href="#" onclick="_hideNewLoadoutForm(); return false;">Cancel</a>' : '') +
      '</div>' +
      // Full/Hybrid toggle
      '<div class="flex border border-[var(--dc-border)]">' +
        '<button class="dock-cf-toggle-btn flex-1 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] bg-[var(--dc-platinum)] text-[var(--dc-void)] border-r border-[var(--dc-border)] transition-colors" data-cf-mode="full" onclick="_cfToggleMode(this)">Full Bed</button>' +
        '<button class="dock-cf-toggle-btn flex-1 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] bg-transparent text-[var(--dc-storm)] hover:text-[var(--dc-platinum)] transition-colors" data-cf-mode="hybrid" onclick="_cfToggleMode(this)">Hybrid</button>' +
      '</div>' +
      // Body
      '<div class="dock-cf-body flex flex-col gap-3" data-cf-hybrid="false">' +
        // Full bed
        '<div class="dock-cf-fullbed flex flex-col gap-2">' +
          _cfFieldHtml('Frame', 'dock-cf-frame-search', 'dock-cf-frame', 'dock-cf-frame-dropdown', 'Search frames...') +
          _cfFieldHtml('String', 'dock-cf-string-search', 'dock-cf-string', 'dock-cf-string-dropdown', 'Search strings...') +
          '<div class="grid grid-cols-2 gap-2">' +
            _cfTensionHtml('Mains lbs', 'dock-cf-tension-m', '55') +
            _cfTensionHtml('Crosses lbs', 'dock-cf-tension-x', '53') +
          '</div>' +
        '</div>' +
        // Hybrid
        '<div class="dock-cf-hybrid hidden flex flex-col gap-2">' +
          _cfFieldHtml('Frame', 'dock-cf-h-frame-search', 'dock-cf-h-frame', 'dock-cf-h-frame-dropdown', 'Search frames...') +
          _cfFieldHtml('Mains String', 'dock-cf-mains-search', 'dock-cf-mains', 'dock-cf-mains-dropdown', 'Search mains...') +
          '<div class="grid grid-cols-2 gap-2">' +
            _cfTensionHtml('Mains lbs', 'dock-cf-mains-tension', '55') +
            _cfTensionHtml('Crosses lbs', 'dock-cf-crosses-tension', '53') +
          '</div>' +
          _cfFieldHtml('Crosses String', 'dock-cf-crosses-search', 'dock-cf-crosses', 'dock-cf-crosses-dropdown', 'Search crosses...') +
        '</div>' +
      '</div>' +
      // Actions
      '<div class="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--dc-border)]">' +
        '<button class="py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] bg-[var(--dc-platinum)] text-[var(--dc-void)] hover:bg-[var(--dc-white)] transition-colors" onclick="_cfActivate()">Set Active</button>' +
        '<button class="py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] border border-[var(--dc-border)] text-[var(--dc-storm)] hover:text-[var(--dc-platinum)] hover:border-[var(--dc-border-hover)] bg-transparent transition-colors" onclick="_cfSave()">Save</button>' +
      '</div>' +
    '</div>'
  );
}

function _cfFieldHtml(label, searchId, hiddenId, dropdownId, placeholder) {
  return (
    '<div class="flex flex-col gap-1">' +
      '<span class="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--dc-storm)]">' + label + '</span>' +
      '<div class="relative">' +
        '<input type="text" class="w-full px-2 py-1.5 bg-[var(--dc-void)] border border-[var(--dc-border)] text-[var(--dc-platinum)] font-sans text-[12px] outline-none focus:border-[var(--dc-border-active)] transition-colors placeholder:text-[var(--dc-storm)]" id="' + searchId + '" placeholder="' + placeholder + '" autocomplete="off">' +
        '<input type="hidden" id="' + hiddenId + '">' +
        '<div class="absolute top-full left-0 right-0 z-50 bg-[var(--dc-void-deep)] border border-[var(--dc-border)] max-h-48 overflow-y-auto hidden" id="' + dropdownId + '"></div>' +
      '</div>' +
    '</div>'
  );
}

function _cfTensionHtml(label, inputId, defaultVal) {
  return (
    '<div class="flex flex-col gap-1">' +
      '<span class="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--dc-storm)]">' + label + '</span>' +
      '<input type="number" class="px-2 py-1.5 bg-[var(--dc-void)] border border-[var(--dc-border)] text-[var(--dc-platinum)] font-mono text-[12px] outline-none focus:border-[var(--dc-border-active)] transition-colors" id="' + inputId + '" value="' + defaultVal + '" min="30" max="70">' +
    '</div>'
  );
}

// ─────────────────────────────────────────────
// setHybridMode(isHybrid)
// ─────────────────────────────────────────────
function setHybridMode(isHybrid) {
  var btnFull = document.getElementById('btn-full');
  var btnHybrid = document.getElementById('btn-hybrid');
  var fullConfig = document.getElementById('full-bed-config');
  var hybridConfig = document.getElementById('hybrid-config');

  if (btnFull) {
    btnFull.classList.toggle('bg-dc-platinum', !isHybrid);
    btnFull.classList.toggle('text-dc-void', !isHybrid);
    btnFull.classList.toggle('bg-transparent', isHybrid);
    btnFull.classList.toggle('text-dc-storm', isHybrid);
    btnFull.classList.toggle('hover:text-dc-platinum', isHybrid);
  }
  if (btnHybrid) {
    btnHybrid.classList.toggle('bg-dc-platinum', isHybrid);
    btnHybrid.classList.toggle('text-dc-void', isHybrid);
    btnHybrid.classList.toggle('bg-transparent', !isHybrid);
    btnHybrid.classList.toggle('text-dc-storm', !isHybrid);
    btnHybrid.classList.toggle('hover:text-dc-platinum', !isHybrid);
  }
  if (fullConfig) fullConfig.classList.toggle('hidden', isHybrid);
  if (hybridConfig) hybridConfig.classList.toggle('hidden', !isHybrid);
}

// ─────────────────────────────────────────────
// _cfToggleMode(btn)  — Tailwind version
// ─────────────────────────────────────────────
function _cfToggleMode(btn) {
  var container = btn.closest('.dock-cf-body') ? btn.closest('.dock-cf-body').parentElement : btn.closest('[class*="border"]');
  if (!container) return;
  var isHybrid = btn.dataset.cfMode === 'hybrid';
  var body = container.querySelector('.dock-cf-body');
  if (body) body.dataset.cfHybrid = isHybrid ? 'true' : 'false';

  var fullSection = container.querySelector('.dock-cf-fullbed');
  var hybridSection = container.querySelector('.dock-cf-hybrid');
  if (fullSection) fullSection.classList.toggle('hidden', isHybrid);
  if (hybridSection) hybridSection.classList.toggle('hidden', !isHybrid);

  container.querySelectorAll('.dock-cf-toggle-btn').forEach(function(b) {
    var active = b === btn;
    b.style.background = active ? 'var(--dc-platinum)' : 'transparent';
    b.style.color = active ? 'var(--dc-void)' : 'var(--dc-storm)';
  });
}

// ─────────────────────────────────────────────
// _dockGuidance(icon, title, body) — Tailwind
// ─────────────────────────────────────────────
function _dockGuidance(icon, title, body) {
  return (
    '<div class="border border-[var(--dc-border)] bg-[var(--dc-void-deep)] p-4 flex flex-col items-center text-center gap-2">' +
      '<div class="text-2xl">' + icon + '</div>' +
      '<div class="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--dc-platinum)]">' + title + '</div>' +
      '<div class="font-sans text-[11px] text-[var(--dc-storm)] leading-relaxed">' + body + '</div>' +
    '</div>'
  );
}

// ─────────────────────────────────────────────
// _dockContextActions(actions) — Tailwind
// ─────────────────────────────────────────────
function _dockContextActions(actions) {
  if (!actions || actions.length === 0) return '';
  return '<div class="dock-ctx-actions">' +
    actions.map(function(a) {
      return '<a class="dock-ctx-action" onclick="' + a.onclick + '">' + a.label + '</a>';
    }).join('') +
  '</div>';
}

