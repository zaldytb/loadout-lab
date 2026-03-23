'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

const DRY_RUN  = args.includes('--dry-run');
const LIMIT    = getArg('--limit')  != null ? parseInt(getArg('--limit'),  10) : null;
const START    = getArg('--start')  != null ? parseInt(getArg('--start'),  10) : 0;
const DELAY_MS = getArg('--delay')  != null ? parseInt(getArg('--delay'),  10) : 300;
const TODAY    = new Date().toISOString().slice(0, 10);
const OUT_FILE = getArg('--out') ||
  path.join(__dirname, '..', 'data', `twu-scrape-${TODAY}.csv`);

const BASE_URL = 'https://twu.tennis-warehouse.com/cgi-bin/compareracquets.cgi';

// ─── HTTP fetch ───────────────────────────────────────────────────────────────

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LoadoutLab-scraper/1.0)',
        'Accept':     'text/html,application/xhtml+xml'
      }
    }, res => {
      const chunks = [];
      res.on('data',  c => chunks.push(c));
      res.on('error', reject);
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const ct  = res.headers['content-type'] || '';
        const enc = /charset=(utf-8|utf8)/i.test(ct) ? 'utf8' : 'latin1';
        resolve(buf.toString(enc));
      });
    });
    req.setTimeout(15000, () => req.destroy(new Error('Request timed out (15s)')));
    req.on('error', reject);
  });
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').trim();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g,        '&')
    .replace(/&lt;/g,         '<')
    .replace(/&gt;/g,         '>')
    .replace(/&quot;/g,       '"')
    .replace(/&apos;/g,       "'")
    .replace(/&#(\d+);/g,     (_, n) => String.fromCharCode(+n))
    .replace(/&nbsp;/g,       ' ')
    .trim();
}

// Extract inner HTML of element with given id (td or th).
function extractById(html, id) {
  const re = new RegExp(
    `<(?:td|th)[^>]+id="${id}"[^>]*>([\\s\\S]*?)<\\/(?:td|th)>`, 'i'
  );
  const m = html.match(re);
  return m ? m[1] : null;
}

// First number before <br> in a multi-value TWU cell ("100<br>645").
function beforeBr(raw) {
  if (!raw) return NaN;
  return parseFloat(raw.split(/<br\s*\/?>/i)[0].replace(/[^0-9.-]/g, ''));
}

// Second number after <br> in a multi-value TWU cell ("11.36<br>322").
function afterBr(raw) {
  if (!raw) return NaN;
  const parts = raw.split(/<br\s*\/?>/i);
  return parts.length < 2 ? NaN : parseFloat(parts[1].replace(/[^0-9.-]/g, ''));
}

// Direct numeric value from a single-value cell ("319").
function directNum(raw) {
  if (!raw) return NaN;
  return parseFloat(stripTags(raw));
}

// Return string representation or '' when NaN.
function numStr(n) {
  return isNaN(n) ? '' : String(n);
}

// ─── Parse racquet list ───────────────────────────────────────────────────────

function parseRacquetList(html) {
  const m = html.match(/<select[^>]+name="A"[^>]*>([\s\S]*?)<\/select>/i);
  if (!m) throw new Error('Could not find <select name="A"> in main page');

  const options = [];
  const optRe   = /<option([^>]*)>([^<]*)/gi;
  let opt;
  while ((opt = optRe.exec(m[1])) !== null) {
    const valM = opt[1].match(/value="([^"]*)"/i);
    const val  = decodeEntities((valM ? valM[1] : opt[2]).trim());
    if (val) options.push(val);
  }
  return options;
}

// ─── Parse comparison page — column A only ───────────────────────────────────

function parseRacquet(html) {
  const nameRaw = extractById(html, 'racquetnameA');
  if (!nameRaw) return null;

  const name = decodeEntities(stripTags(nameRaw));
  if (!name) return null;

  const headsizeRaw = extractById(html, 'headsizeA');
  const weightRaw   = extractById(html, 'weightA');
  const balanceRaw  = extractById(html, 'balanceA');
  const swingwtRaw  = extractById(html, 'swingweightA');
  const flexRaw     = extractById(html, 'flexA');
  const twistRaw    = extractById(html, 'twistweightA');
  const vibRaw      = extractById(html, 'vibfrequencyA');
  const acorRaw     = extractById(html, 'acorA');
  const sweetRaw    = extractById(html, 'sweetA');
  const lgthRaw     = extractById(html, 'lgthA');

  const headSize     = numStr(beforeBr(headsizeRaw));
  const strungWeight = numStr(afterBr(weightRaw));
  const balanceCm    = numStr(afterBr(balanceRaw));
  const balanceIn    = beforeBr(balanceRaw);

  // Length: default 27.0 if not present or parse fails.
  const lgthIn  = beforeBr(lgthRaw);
  const lengthIn = isNaN(lgthIn) ? 27.0 : lgthIn;

  const swingweight = numStr(directNum(swingwtRaw));
  const stiffness   = numStr(directNum(flexRaw));

  // Balance points — corrected for non-standard length frames.
  // Even balance point shifts with length: a 27.5" frame balances at 13.75",
  // so (evenPoint - balanceIn) * 8 gives the correct head-light/heavy reading.
  let balancePts = '';
  if (!isNaN(balanceIn)) {
    const evenPoint = lengthIn / 2;
    const pts = Math.round((evenPoint - balanceIn) * 8);
    if      (pts > 0) balancePts = `${pts} pts HL`;
    else if (pts < 0) balancePts = `${Math.abs(pts)} pts HH`;
    else              balancePts = 'Even';
  }

  // Year: last 4-digit year found in name ("Blade 98 (16x19) (2015)" → "2015").
  const yearMatches = name.match(/\b(19|20)\d{2}\b/g);
  const year = yearMatches ? yearMatches[yearMatches.length - 1] : '';

  // ID: same logic as toKebab() in ingest.js.
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  // Notes: extra TWU fields not in the frame schema.
  const noteParts = [];
  const twist = directNum(twistRaw);
  const vib   = directNum(vibRaw);
  const acor  = directNum(acorRaw);
  const sweet = beforeBr(sweetRaw);

  if (!isNaN(twist)) noteParts.push(`twistweight=${twist}`);
  if (!isNaN(vib))   noteParts.push(`vibration=${vib}Hz`);
  if (!isNaN(acor))  noteParts.push(`power=${acor}%`);
  if (!isNaN(sweet)) noteParts.push(`sweetzone=${sweet}sqin`);
  if (lengthIn !== 27.0) noteParts.push(`length=${lengthIn}in`);

  const notes = noteParts.length ? `TWU: ${noteParts.join(' ')}` : '';

  return {
    id,
    name,
    year,
    headSize,
    strungWeight,
    balance:      balanceCm,
    balancePts,
    swingweight,
    stiffness,
    beamWidth:    '',
    pattern:      '',
    tensionRange: '',
    powerLevel:   '',
    strokeStyle:  '',
    swingSpeed:   '',
    frameProfile: '',
    identity:     '',
    notes
  };
}

// ─── CSV output ───────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  'id', 'name', 'year', 'headSize', 'strungWeight', 'balance', 'balancePts',
  'swingweight', 'stiffness', 'beamWidth', 'pattern', 'tensionRange',
  'powerLevel', 'strokeStyle', 'swingSpeed', 'frameProfile', 'identity', 'notes'
];

function csvEscape(val) {
  const s = val == null ? '' : String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function toCSV(rows) {
  const lines = [CSV_HEADERS.join(',')];
  for (const row of rows) {
    lines.push(CSV_HEADERS.map(h => csvEscape(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching racquet list from TWU...');

  let mainHtml;
  try {
    mainHtml = await fetch(BASE_URL);
  } catch (e) {
    console.error(`Failed to fetch main page: ${e.message}`);
    process.exit(1);
  }

  let allRacquets;
  try {
    allRacquets = parseRacquetList(mainHtml);
  } catch (e) {
    console.error(`Failed to parse racquet list: ${e.message}`);
    process.exit(1);
  }

  console.log(`Found ${allRacquets.length} racquets in TWU database.`);

  if (DRY_RUN) {
    console.log('\n-- DRY RUN: racquet list --');
    allRacquets.forEach((name, i) => console.log(`  [${i + 1}] ${name}`));
    return;
  }

  const anchor = allRacquets[0];
  const slice  = allRacquets.slice(START, LIMIT != null ? START + LIMIT : undefined);
  const total  = slice.length;

  if (total === 0) {
    console.log('No racquets to scrape (check --start / --limit values).');
    return;
  }

  console.log(`Scraping ${total} racquet(s) (start=${START}, delay=${DELAY_MS}ms)`);
  console.log(`Anchor (B): ${anchor}`);
  console.log(`Output:     ${OUT_FILE}\n`);

  const results  = [];
  const seen     = new Set();
  const failures = [];

  for (let i = 0; i < slice.length; i++) {
    const racquet   = slice[i];
    const globalIdx = START + i + 1;
    const totalEnd  = START + total;
    process.stdout.write(`[${globalIdx}/${totalEnd}] ${racquet} ... `);

    const url = `${BASE_URL}?A=${encodeURIComponent(racquet)}&B=${encodeURIComponent(anchor)}`;

    let html;
    try {
      html = await fetch(url);
    } catch (e) {
      process.stdout.write(`FAIL (${e.message})\n`);
      failures.push({ name: racquet, reason: e.message });
      if (i < slice.length - 1) await sleep(DELAY_MS);
      continue;
    }

    if (!html.includes('simtable')) {
      process.stdout.write('FAIL (no comparison table)\n');
      failures.push({ name: racquet, reason: 'no comparison table in response' });
      if (i < slice.length - 1) await sleep(DELAY_MS);
      continue;
    }

    let row;
    try {
      row = parseRacquet(html);
    } catch (e) {
      process.stdout.write(`FAIL (${e.message})\n`);
      failures.push({ name: racquet, reason: e.message });
      if (i < slice.length - 1) await sleep(DELAY_MS);
      continue;
    }

    if (!row) {
      process.stdout.write('FAIL (no data extracted)\n');
      failures.push({ name: racquet, reason: 'no data extracted' });
      if (i < slice.length - 1) await sleep(DELAY_MS);
      continue;
    }

    if (seen.has(row.name)) {
      process.stdout.write('SKIP (duplicate)\n');
      if (i < slice.length - 1) await sleep(DELAY_MS);
      continue;
    }

    seen.add(row.name);
    results.push(row);
    process.stdout.write('OK\n');

    if (i < slice.length - 1) await sleep(DELAY_MS);
  }

  // Write CSV
  const csv = toCSV(results);
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, csv, 'utf8');

  const successful = results.length;
  const failed     = failures.length;
  const dupes      = total - successful - failed;

  console.log(
    `\nScraped ${total} racquets, ${successful} successful, ${failed} failed` +
    (dupes > 0 ? `, ${dupes} duplicate(s) skipped` : '') + '.'
  );
  console.log(`Output written to: ${OUT_FILE}`);

  if (failures.length) {
    console.log('\nFailed racquets:');
    for (const f of failures) console.log(`  - ${f.name}: ${f.reason}`);
  }

  console.log('\nNext steps:');
  console.log('  Open the CSV in tools/frame-editor.html or a spreadsheet');
  console.log('  Fill in missing required fields: beamWidth, pattern, tensionRange, year (where missing)');
  console.log('  Remove any racquets you don\'t want to import');
  console.log(`  Run: node pipeline/scripts/ingest.js --type frame --csv ${OUT_FILE}`);
  console.log('  Run: npm run pipeline');
}

main().catch(e => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
