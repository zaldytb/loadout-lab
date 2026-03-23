#!/usr/bin/env node
/**
 * pipeline/extract.js
 *
 * Extracts RACQUETS, STRINGS, and FRAME_META from app.js by bracket-walking
 * each top-level const literal, evaluating it in a Node vm sandbox, and
 * writing the result to pipeline/data/{frames,strings,frame_meta}.json.
 *
 * Usage:  node pipeline/extract.js
 *         node pipeline/extract.js --verbose
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const VERBOSE  = process.argv.includes('--verbose');
const APP_JS   = path.join(__dirname, '..', 'app.js');
const OUT_DIR  = path.join(__dirname, 'data');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(...args)    { console.log('[extract]', ...args); }
function warn(...args)   { console.warn('[extract:warn]', ...args); }
function detail(...args) { if (VERBOSE) console.log('[extract:verbose]', ...args); }

/**
 * Walk src from startIdx, matching brackets/quotes to find the balanced end
 * of a JS array or object literal.  Returns the substring [startIdx, end).
 */
function extractLiteral(src, startIdx) {
  const opener = src[startIdx];
  if (opener !== '[' && opener !== '{') {
    throw new Error(`Expected '[' or '{' at index ${startIdx}, got '${opener}'`);
  }

  let depth    = 0;
  let i        = startIdx;
  let inString = false;
  let strChar  = '';
  let escaped  = false;
  let inLineComment  = false;
  let inBlockComment = false;

  while (i < src.length) {
    const ch   = src[i];
    const next = src[i + 1];

    // ---- escape sequences inside strings ----
    if (escaped) { escaped = false; i++; continue; }
    if (ch === '\\' && inString) { escaped = true; i++; continue; }

    // ---- inside a string ----
    if (inString) {
      if (ch === strChar && strChar !== '`') { inString = false; }
      else if (ch === '`') { inString = false; }  // template literal end
      i++; continue;
    }

    // ---- line comment ----
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      i++; continue;
    }

    // ---- block comment ----
    if (inBlockComment) {
      if (ch === '*' && next === '/') { inBlockComment = false; i += 2; continue; }
      i++; continue;
    }

    // ---- detect comment start ----
    if (ch === '/' && next === '/') { inLineComment = true;  i += 2; continue; }
    if (ch === '/' && next === '*') { inBlockComment = true; i += 2; continue; }

    // ---- detect string start ----
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; strChar = ch; i++; continue; }

    // ---- bracket balancing ----
    if (ch === '[' || ch === '{' || ch === '(') { depth++; }
    if (ch === ']' || ch === '}' || ch === ')') {
      depth--;
      if (depth === 0) { i++; break; }
    }

    i++;
  }

  if (depth !== 0) throw new Error(`Unbalanced brackets starting at index ${startIdx}`);
  return src.slice(startIdx, i);
}

/**
 * Find the start index of `const NAME = ` in src, returning the index of the
 * opening bracket of the literal.
 */
function findConstStart(src, name) {
  // Match both `const NAME =` and `const NAME=`
  const re = new RegExp(`(?:^|\\n)[ \\t]*const\\s+${name}\\s*=\\s*`, 'm');
  const m  = re.exec(src);
  if (!m) throw new Error(`Could not find 'const ${name}' in app.js`);

  // The opener is immediately after the match
  const opener = src[m.index + m[0].length];
  if (opener !== '[' && opener !== '{') {
    throw new Error(`'const ${name}' does not start with '[' or '{' (got '${opener}')`);
  }
  return m.index + m[0].length;
}

/**
 * Evaluate a JS literal in a clean vm sandbox.
 * Returns the parsed value.
 */
function evalLiteral(literal, name) {
  try {
    return vm.runInNewContext(`(${literal})`);
  } catch (err) {
    throw new Error(`Failed to evaluate literal for ${name}: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

log(`Reading ${APP_JS} …`);
const src = fs.readFileSync(APP_JS, 'utf8');
log(`Read ${(src.length / 1024).toFixed(0)} KB`);

const TARGETS = ['RACQUETS', 'STRINGS', 'FRAME_META'];
const results = {};

for (const name of TARGETS) {
  try {
    const start   = findConstStart(src, name);
    detail(`${name}: literal starts at char ${start}`);
    const literal = extractLiteral(src, start);
    detail(`${name}: literal is ${literal.length} chars`);
    results[name] = evalLiteral(literal, name);
    log(`${name}: extracted ${Array.isArray(results[name]) ? results[name].length + ' entries' : Object.keys(results[name]).length + ' keys'}`);
  } catch (err) {
    console.error(`[extract:error] ${name}: ${err.message}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

fs.mkdirSync(OUT_DIR, { recursive: true });

const FILES = {
  frames:     results.RACQUETS,
  strings:    results.STRINGS,
  frame_meta: results.FRAME_META,
};

for (const [base, data] of Object.entries(FILES)) {
  const file = path.join(OUT_DIR, `${base}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  log(`Wrote ${file}`);
}

log('Done.');
