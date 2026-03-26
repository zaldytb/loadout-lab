// Searchable Dropdown Component
// ==============================
// Self-contained UI component for racquet/string selection with filtering

import { RACQUETS, STRINGS } from '../../data/loader.js';
import { GAUGE_LABELS } from '../../engine/constants.js';
import { getGaugeOptions } from '../../engine/string-profile.js';

// Parse brand from racquet name (first word)
function parseRacquetBrand(name) {
  return name.split(' ')[0];
}

// Parse family from racquet name (second word or group like "Pure Aero")
function parseRacquetFamily(name) {
  const parts = name.split(' ');
  if (parts.length < 2) return '';
  // Known two-word families
  const twoWord = ['Pure Aero', 'Pure Drive', 'Pure Strike', 'Pro Staff', 'Poly Tour'];
  const rest = parts.slice(1).join(' ');
  for (const tw of twoWord) {
    if (rest.startsWith(tw)) return tw;
  }
  return parts[1];
}

// Sort racquets: brand → family → model → year desc
function getSortedRacquets() {
  return [...RACQUETS].sort((a, b) => {
    const brandA = parseRacquetBrand(a.name);
    const brandB = parseRacquetBrand(b.name);
    if (brandA !== brandB) return brandA.localeCompare(brandB);
    const famA = parseRacquetFamily(a.name);
    const famB = parseRacquetFamily(b.name);
    if (famA !== famB) return famA.localeCompare(famB);
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return (b.year || 0) - (a.year || 0);
  });
}

// Sort strings: brand → name → gauge
function getSortedStrings() {
  return [...STRINGS].sort((a, b) => {
    const brandA = a.name.split(' ')[0];
    const brandB = b.name.split(' ')[0];
    if (brandA !== brandB) return brandA.localeCompare(brandB);
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return (a.gaugeNum || 0) - (b.gaugeNum || 0);
  });
}

function getStringMaterialBadge(material) {
  if (!material) return '';
  const m = material.toLowerCase();
  if (m.includes('multifilament') || m.includes('multi')) return '<span class="ss-opt-badge badge-multi">MULTI</span>';
  if (m.includes('synthetic')) return '<span class="ss-opt-badge badge-syngut">SYN GUT</span>';
  if (m.includes('natural gut') || (m.includes('gut') && !m.includes('synthetic'))) return '<span class="ss-opt-badge badge-gut">GUT</span>';
  if (m.includes('co-poly') || m.includes('copoly')) return '<span class="ss-opt-badge badge-copoly">CO-POLY</span>';
  if (m.includes('poly')) return '<span class="ss-opt-badge badge-poly">POLY</span>';
  return '';
}

// Registry of all searchable selects for cleanup
const _ssRegistry = new Map();

export function createSearchableSelect(container, {
  type = 'racquet', // 'racquet', 'string', or 'custom'
  placeholder = 'Select...',
  value = '',
  onChange = () => {},
  id = '',
  options = null // For 'custom' type: array of {value, label} objects
}) {
  // Clean up previous instance if exists
  if (_ssRegistry.has(container)) {
    const old = _ssRegistry.get(container);
    if (old._cleanup) old._cleanup();
  }

  container.innerHTML = '';
  container.classList.add('searchable-select');

  let items;
  if (type === 'custom' && options) {
    items = options;
  } else {
    items = type === 'racquet' ? getSortedRacquets() : getSortedStrings();
  }

  // Build trigger
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'ss-trigger';
  if (id) trigger.id = id;

  // Build dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'ss-dropdown';

  const searchWrap = document.createElement('div');
  searchWrap.className = 'ss-search-wrap';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'ss-search';
  if (type === 'racquet') {
    searchInput.placeholder = 'Search racquets...';
  } else if (type === 'string') {
    searchInput.placeholder = 'Search strings...';
  } else {
    searchInput.placeholder = 'Search...';
  }
  searchInput.autocomplete = 'off';
  searchWrap.appendChild(searchInput);
  dropdown.appendChild(searchWrap);

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'ss-options';
  dropdown.appendChild(optionsContainer);

  container.appendChild(trigger);
  container.appendChild(dropdown);

  let selectedValue = value;
  let highlightIndex = -1;
  let flatOptions = []; // all visible option elements for keyboard nav

  function getDisplayText(val) {
    if (!val) return '';
    if (type === 'custom') {
      const opt = options.find(x => x.value === val);
      return opt ? opt.label : '';
    }
    if (type === 'racquet') {
      const r = RACQUETS.find(x => x.id === val);
      return r ? r.name : '';
    } else {
      const s = STRINGS.find(x => x.id === val);
      return s ? s.name : '';  // gauge is now a separate selector
    }
  }

  function updateTrigger() {
    const text = getDisplayText(selectedValue);
    if (text) {
      trigger.textContent = text;
      trigger.classList.remove('ss-placeholder');
    } else {
      trigger.textContent = placeholder;
      trigger.classList.add('ss-placeholder');
    }
  }

  function renderOptions(filter = '') {
    optionsContainer.innerHTML = '';
    flatOptions = [];
    highlightIndex = -1;
    const q = filter.toLowerCase().trim();

    let lastGroup = '';
    let hasResults = false;

    items.forEach(item => {
      // Build search text
      let searchText, groupKey, primaryText, secondaryText, badgeHTML;
      let itemId, itemLabel;

      if (type === 'custom') {
        itemId = item.value;
        itemLabel = item.label;
        searchText = item.label.toLowerCase();
        groupKey = '';
        primaryText = item.label;
        secondaryText = '';
        badgeHTML = '';
      } else if (type === 'racquet') {
        itemId = item.id;
        searchText = `${item.name} ${item.year || ''} ${item.pattern || ''}`.toLowerCase();
        groupKey = parseRacquetBrand(item.name);
        // Split name: everything before weight suffix becomes primary, weight goes to secondary
        const wtMatch = item.name.match(/^(.+?)\s+(\d+g)$/);
        primaryText = wtMatch ? wtMatch[1] : item.name;
        const wtBadge = wtMatch ? `<span class="ss-opt-badge badge-weight">${wtMatch[2]}</span>` : '';
        secondaryText = `${item.year || ''}`;
        badgeHTML = wtBadge;
      } else {
        itemId = item.id;
        searchText = `${item.name} ${item.gauge} ${item.material || ''} ${item.gaugeNum || ''} ${item.shape || ''}`.toLowerCase();
        groupKey = item.name.split(' ')[0];
        primaryText = item.name;
        secondaryText = `${item.shape || item.material || ''}`;
        badgeHTML = getStringMaterialBadge(item.material);
      }

      // Filter
      if (q) {
        const words = q.split(/\s+/);
        const match = words.every(w => searchText.includes(w));
        if (!match) return;
      }

      hasResults = true;

      // Group header (skip for custom type)
      if (type !== 'custom' && groupKey !== lastGroup) {
        const groupLabel = document.createElement('div');
        groupLabel.className = 'ss-group-label';
        groupLabel.textContent = groupKey;
        optionsContainer.appendChild(groupLabel);
        lastGroup = groupKey;
      }

      // Option
      const opt = document.createElement('div');
      opt.className = 'ss-option';
      if (itemId === selectedValue) opt.classList.add('ss-selected');
      opt.dataset.value = itemId;

      if (type === 'custom') {
        // Simple layout for custom options
        opt.innerHTML = `<span class="ss-opt-primary">${primaryText}</span>`;
      } else if (type === 'string') {
        // 2-line stacked layout for strings: name on line 1, type+gauge on line 2
        opt.classList.add('ss-option-stacked');
        opt.innerHTML = `
          <span class="ss-opt-primary">${primaryText}</span>
          <span class="ss-opt-meta">${badgeHTML}<span class="ss-opt-secondary">${secondaryText}</span></span>
        `;
      } else {
        // 2-line stacked layout for racquets: model on line 1, weight+year on line 2
        opt.classList.add('ss-option-stacked');
        opt.innerHTML = `
          <span class="ss-opt-primary">${primaryText}</span>
          <span class="ss-opt-meta">${badgeHTML}<span class="ss-opt-secondary">${secondaryText}</span></span>
        `;
      }

      opt.addEventListener('mouseenter', () => {
        flatOptions.forEach(o => o.classList.remove('ss-highlighted'));
        opt.classList.add('ss-highlighted');
        highlightIndex = flatOptions.indexOf(opt);
      });

      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOption(itemId);
      });

      optionsContainer.appendChild(opt);
      flatOptions.push(opt);
    });

    if (!hasResults) {
      const noRes = document.createElement('div');
      noRes.className = 'ss-no-results';
      noRes.textContent = 'No matches found';
      optionsContainer.appendChild(noRes);
    }
  }

  function selectOption(val) {
    selectedValue = val;
    updateTrigger();
    closeDropdown();
    onChange(val);
  }

  function openDropdown() {
    container.classList.add('ss-open');
    searchInput.value = '';
    renderOptions();
    // Slight delay for DOM to settle before focus
    requestAnimationFrame(() => searchInput.focus());
    // Scroll selected into view
    requestAnimationFrame(() => {
      const sel = optionsContainer.querySelector('.ss-selected');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    });
  }

  function closeDropdown() {
    container.classList.remove('ss-open');
    searchInput.value = '';
    highlightIndex = -1;
  }

  function isOpen() {
    return container.classList.contains('ss-open');
  }

  // Event: trigger click
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen()) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Event: search input
  searchInput.addEventListener('input', () => {
    renderOptions(searchInput.value);
  });

  // Event: keyboard
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatOptions.length === 0) return;
      highlightIndex = Math.min(highlightIndex + 1, flatOptions.length - 1);
      flatOptions.forEach(o => o.classList.remove('ss-highlighted'));
      flatOptions[highlightIndex].classList.add('ss-highlighted');
      flatOptions[highlightIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatOptions.length === 0) return;
      highlightIndex = Math.max(highlightIndex - 1, 0);
      flatOptions.forEach(o => o.classList.remove('ss-highlighted'));
      flatOptions[highlightIndex].classList.add('ss-highlighted');
      flatOptions[highlightIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && flatOptions[highlightIndex]) {
        const val = flatOptions[highlightIndex].dataset.value;
        selectOption(val);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
      trigger.focus();
    }
  });

  // Close on outside click
  function onDocClick(e) {
    if (!container.contains(e.target)) {
      closeDropdown();
    }
  }
  document.addEventListener('click', onDocClick);

  // Init
  updateTrigger();

  const instance = {
    getValue: () => selectedValue,
    setValue: (val) => {
      selectedValue = val;
      updateTrigger();
    },
    setOptions: (newOptions) => {
      if (type === 'custom') {
        options = newOptions;
        items = newOptions;
        renderOptions();
      }
    },
    _cleanup: () => {
      document.removeEventListener('click', onDocClick);
    }
  };

  _ssRegistry.set(container, instance);
  return instance;
}

// Store references to searchable select instances
export const ssInstances = {};

// Simple searchable dropdown for create form (dock-qa pattern)
export function _initQaSearchable(searchId, hiddenId, dropdownId, items) {
  const searchEl = document.getElementById(searchId);
  const hiddenEl = document.getElementById(hiddenId);
  const dropdownEl = document.getElementById(dropdownId);
  if (!searchEl || !hiddenEl || !dropdownEl) return;

  function renderDropdown(filter) {
    const filtered = filter ? items.filter(function(item) {
      return item.label.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
    }) : items;

    if (filtered.length === 0) {
      dropdownEl.innerHTML = '<div class="dock-qa-dd-empty">No results</div>';
    } else {
      dropdownEl.innerHTML = filtered.slice(0, 20).map(function(item) {
        return '<div class="dock-qa-dd-item" data-id="' + item.id + '">' + item.label + '</div>';
      }).join('');
    }
    dropdownEl.classList.remove('hidden');

    dropdownEl.querySelectorAll('.dock-qa-dd-item').forEach(function(el) {
      el.addEventListener('mousedown', function(e) {
        e.preventDefault();
        hiddenEl.value = el.dataset.id;
        searchEl.value = el.textContent;
        dropdownEl.classList.add('hidden');
      });
    });
  }

  searchEl.addEventListener('focus', function() { renderDropdown(searchEl.value); });
  searchEl.addEventListener('input', function() {
    hiddenEl.value = '';
    renderDropdown(searchEl.value);
  });
  searchEl.addEventListener('blur', function() {
    setTimeout(function() { dropdownEl.classList.add('hidden'); }, 150);
  });
}
