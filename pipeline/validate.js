#!/usr/bin/env node
/**
 * pipeline/validate.js
 *
 * Validates pipeline/data/{frames,strings,frame_meta}.json against:
 *   - Required fields from the schemas
 *   - Type checks
 *   - Numeric range checks (_validationRanges in each schema)
 *   - Cross-dataset integrity (every frame has a FRAME_META entry, IDs unique)
 *
 * Usage:  node pipeline/validate.js
 *         node pipeline/validate.js --strict   (exit 1 on any warning)
 *
 * Exit codes:
 *   0 — all checks pass (warnings may be present unless --strict)
 *   1 — one or more errors found
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const STRICT = process.argv.includes('--strict');

const DATA_DIR    = path.join(__dirname, 'data');
const SCHEMA_DIR  = path.join(__dirname, 'schemas');

const frames    = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'frames.json')));
const strings   = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'strings.json')));
const frameMeta = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'frame_meta.json')));

const frameSchema  = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'frame.schema.json')));
const stringSchema = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'string.schema.json')));

// ---------------------------------------------------------------------------
// Result collector
// ---------------------------------------------------------------------------

const issues = { errors: [], warnings: [] };

function error(ctx, msg)   { issues.errors.push(`  [ERROR]   ${ctx}: ${msg}`); }
function warning(ctx, msg) { issues.warnings.push(`  [WARN]    ${ctx}: ${msg}`); }

// ---------------------------------------------------------------------------
// Generic validators
// ---------------------------------------------------------------------------

function checkRequired(item, schema, ctx) {
  for (const field of (schema.required || [])) {
    if (item[field] === undefined || item[field] === null) {
      error(ctx, `missing required field '${field}'`);
    }
  }
}

function checkType(val, expected, field, ctx) {
  if (val === undefined || val === null) return; // handled by checkRequired
  const actual = Array.isArray(val) ? 'array' : typeof val;
  if (actual !== expected) {
    error(ctx, `field '${field}' expected ${expected}, got ${actual} (value: ${JSON.stringify(val).slice(0, 60)})`);
  }
}

/**
 * Check a numeric value against a range spec:
 *   { warn: [lo, hi], error: [lo, hi] }
 * error range is the hard outer bound; warn range is the expected band.
 */
function checkRange(val, rangeSpec, field, ctx) {
  if (val === undefined || val === null || typeof val !== 'number') return;
  const [eLo, eHi] = rangeSpec.error || [-Infinity, Infinity];
  const [wLo, wHi] = rangeSpec.warn  || [-Infinity, Infinity];

  if (val < eLo || val > eHi) {
    error(ctx, `'${field}' = ${val} is outside hard error range [${eLo}, ${eHi}]`);
  } else if (val < wLo || val > wHi) {
    warning(ctx, `'${field}' = ${val} is outside expected range [${wLo}, ${wHi}]`);
  }
}

// ---------------------------------------------------------------------------
// Frame validation
// ---------------------------------------------------------------------------

function validateFrame(frame, idx) {
  const ctx = `frames[${idx}] id=${frame.id || '?'}`;

  checkRequired(frame, frameSchema, ctx);

  // Type checks for required fields
  checkType(frame.id,           'string', 'id',           ctx);
  checkType(frame.name,         'string', 'name',         ctx);
  checkType(frame.year,         'number', 'year',         ctx);
  checkType(frame.headSize,     'number', 'headSize',     ctx);
  checkType(frame.strungWeight, 'number', 'strungWeight', ctx);
  checkType(frame.swingweight,  'number', 'swingweight',  ctx);
  checkType(frame.stiffness,    'number', 'stiffness',    ctx);
  checkType(frame.pattern,      'string', 'pattern',      ctx);
  checkType(frame.balance,      'number', 'balance',      ctx);
  checkType(frame.beamWidth,    'array',  'beamWidth',    ctx);
  checkType(frame.tensionRange, 'array',  'tensionRange', ctx);

  // id format
  if (frame.id && !/^[a-z0-9-]+$/.test(frame.id)) {
    error(ctx, `id '${frame.id}' is not kebab-case`);
  }

  // pattern format
  if (frame.pattern && !/^\d+x\d+$/.test(frame.pattern)) {
    error(ctx, `pattern '${frame.pattern}' does not match \\d+x\\d+`);
  }

  // beamWidth items
  if (Array.isArray(frame.beamWidth)) {
    if (frame.beamWidth.length < 1) {
      error(ctx, `beamWidth must have at least 1 element`);
    }
    frame.beamWidth.forEach((bw, i) => {
      if (typeof bw !== 'number') {
        error(ctx, `beamWidth[${i}] is not a number (got ${typeof bw})`);
      } else {
        checkRange(bw, frameSchema._validationRanges.beamWidth_element, `beamWidth[${i}]`, ctx);
      }
    });
  }

  // tensionRange
  if (Array.isArray(frame.tensionRange)) {
    if (frame.tensionRange.length !== 2) {
      error(ctx, `tensionRange must have exactly 2 elements`);
    } else {
      const [lo, hi] = frame.tensionRange;
      if (typeof lo !== 'number' || typeof hi !== 'number') {
        error(ctx, `tensionRange elements must be numbers`);
      } else if (lo >= hi) {
        error(ctx, `tensionRange[0]=${lo} must be < tensionRange[1]=${hi}`);
      } else if (lo < 30 || hi > 75) {
        warning(ctx, `tensionRange [${lo}, ${hi}] is outside typical [30, 75] lbs`);
      }
    }
  }

  // Numeric ranges
  const vr = frameSchema._validationRanges;
  checkRange(frame.stiffness,    vr.stiffness,    'stiffness',    ctx);
  checkRange(frame.swingweight,  vr.swingweight,  'swingweight',  ctx);
  checkRange(frame.strungWeight, vr.strungWeight, 'strungWeight', ctx);
  checkRange(frame.headSize,     vr.headSize,     'headSize',     ctx);

  // year sanity
  if (frame.year && (frame.year < 1990 || frame.year > 2030)) {
    warning(ctx, `year ${frame.year} is outside expected [1990, 2030]`);
  }

  // balance sanity (cm from butt: typical 30–37cm)
  if (frame.balance && (frame.balance < 25 || frame.balance > 42)) {
    warning(ctx, `balance ${frame.balance}cm is unusual`);
  }
}

// ---------------------------------------------------------------------------
// String validation
// ---------------------------------------------------------------------------

const VALID_MATERIALS = ['Polyester', 'Co-Polyester (elastic)', 'Multifilament', 'Natural Gut', 'Synthetic Gut'];

function validateString(str, idx) {
  const ctx = `strings[${idx}] id=${str.id || '?'}`;

  checkRequired(str, stringSchema, ctx);

  checkType(str.id,            'string', 'id',            ctx);
  checkType(str.name,          'string', 'name',          ctx);
  checkType(str.gauge,         'string', 'gauge',         ctx);
  checkType(str.gaugeNum,      'number', 'gaugeNum',      ctx);
  checkType(str.material,      'string', 'material',      ctx);
  checkType(str.stiffness,     'number', 'stiffness',     ctx);
  checkType(str.tensionLoss,   'number', 'tensionLoss',   ctx);
  checkType(str.spinPotential, 'number', 'spinPotential', ctx);
  checkType(str.twScore,       'object', 'twScore',       ctx);

  // id format
  if (str.id && !/^[a-z0-9-]+$/.test(str.id)) {
    error(ctx, `id '${str.id}' is not kebab-case`);
  }

  // material enum
  if (str.material && !VALID_MATERIALS.includes(str.material)) {
    error(ctx, `material '${str.material}' is not in the allowed enum`);
  }

  // gaugeNum sanity
  if (str.gaugeNum && (str.gaugeNum < 1.0 || str.gaugeNum > 1.6)) {
    warning(ctx, `gaugeNum ${str.gaugeNum}mm is outside typical [1.0, 1.6]mm`);
  }

  // twScore fields
  const TW_FIELDS = ['power', 'spin', 'comfort', 'control', 'feel', 'playabilityDuration', 'durability'];
  if (str.twScore && typeof str.twScore === 'object') {
    for (const f of TW_FIELDS) {
      if (str.twScore[f] === undefined || str.twScore[f] === null) {
        error(ctx, `twScore.${f} is missing`);
      } else if (typeof str.twScore[f] !== 'number') {
        error(ctx, `twScore.${f} must be a number (got ${typeof str.twScore[f]})`);
      } else {
        checkRange(str.twScore[f], stringSchema._validationRanges.twScore_field, `twScore.${f}`, ctx);
      }
    }
  }

  // Numeric ranges
  const vr = stringSchema._validationRanges;
  checkRange(str.stiffness,     vr.stiffness,     'stiffness',     ctx);
  checkRange(str.tensionLoss,   vr.tensionLoss,   'tensionLoss',   ctx);
  checkRange(str.spinPotential, vr.spinPotential, 'spinPotential', ctx);
}

// ---------------------------------------------------------------------------
// Cross-dataset integrity
// ---------------------------------------------------------------------------

function validateCrossIntegrity() {
  const frameIds     = new Set(frames.map(f => f.id));
  const frameMetaIds = new Set(Object.keys(frameMeta));
  const stringIds    = new Set(strings.map(s => s.id));

  // Every frame must have a FRAME_META entry
  for (const id of frameIds) {
    if (!frameMetaIds.has(id)) {
      error('cross-integrity', `frame '${id}' has no FRAME_META entry`);
    }
  }

  // Every FRAME_META key must correspond to a frame
  for (const id of frameMetaIds) {
    if (!frameIds.has(id)) {
      warning('cross-integrity', `FRAME_META key '${id}' has no matching frame`);
    }
  }

  // FRAME_META value structure
  const META_FIELDS = ['aeroBonus', 'comfortTech', 'spinTech', 'genBonus'];
  for (const [id, meta] of Object.entries(frameMeta)) {
    for (const f of META_FIELDS) {
      if (meta[f] === undefined) {
        error(`frame_meta[${id}]`, `missing field '${f}'`);
      } else if (typeof meta[f] !== 'number') {
        error(`frame_meta[${id}]`, `'${f}' must be a number`);
      } else if (meta[f] < 0 || meta[f] > 5) {
        warning(`frame_meta[${id}]`, `'${f}' = ${meta[f]} is outside expected [0, 5]`);
      }
    }
  }

  // Duplicate frame IDs
  const frameIdArr = frames.map(f => f.id);
  const frameIdSet = new Set();
  for (const id of frameIdArr) {
    if (frameIdSet.has(id)) error('cross-integrity', `duplicate frame id '${id}'`);
    frameIdSet.add(id);
  }

  // Duplicate string IDs
  const strIdArr = strings.map(s => s.id);
  const strIdSet = new Set();
  for (const id of strIdArr) {
    if (strIdSet.has(id)) error('cross-integrity', `duplicate string id '${id}'`);
    strIdSet.add(id);
  }
}

// ---------------------------------------------------------------------------
// Run all checks
// ---------------------------------------------------------------------------

console.log('[validate] Validating frames …');
frames.forEach(validateFrame);

console.log('[validate] Validating strings …');
strings.forEach(validateString);

console.log('[validate] Cross-dataset integrity …');
validateCrossIntegrity();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const totalIssues = issues.errors.length + issues.warnings.length;

console.log('');
console.log('='.repeat(60));
console.log(`VALIDATION REPORT`);
console.log(`  Frames:     ${frames.length}`);
console.log(`  Strings:    ${strings.length}`);
console.log(`  Frame meta: ${Object.keys(frameMeta).length} keys`);
console.log('='.repeat(60));

if (issues.warnings.length) {
  console.log(`\nWARNINGS (${issues.warnings.length}):`);
  issues.warnings.forEach(w => console.log(w));
}

if (issues.errors.length) {
  console.log(`\nERRORS (${issues.errors.length}):`);
  issues.errors.forEach(e => console.log(e));
}

if (totalIssues === 0) {
  console.log('\n✓ All checks passed.');
} else {
  console.log(`\nTotal: ${issues.errors.length} error(s), ${issues.warnings.length} warning(s)`);
}

console.log('='.repeat(60));

const exitCode = (issues.errors.length > 0 || (STRICT && issues.warnings.length > 0)) ? 1 : 0;
process.exit(exitCode);
