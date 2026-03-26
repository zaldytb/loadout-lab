# Tennis Loadout Lab

**Frame × String × Tension Prediction Engine**

Physics-based tennis equipment prediction tool. Calculates composite performance scores across 11 attributes by modeling frame physics, string properties, tension effects, and hybrid interactions.

Zero dependencies. No build step. Three files: `index.html`, `app.js`, `style.css` + `data.js` (generated). Tailwind CSS via CDN with custom Digicraft theme.

## Quick Start

Open `index.html` in any browser. That's it.

## Architecture

### Prediction Engine (app.js)

4-layer pipeline: Frame Physics → String Profile → Tension Modifier → Hybrid Interaction

- **L0** `calcFrameBase()` — normalizes raw specs, derives 9 attributes, applies technology bonuses
- **L1** `calcBaseStringProfile()` + `calcStringFrameMod()` — string scoring with frame coupling
- **L2** `calcTensionModifier()` — pattern-aware tension effects
- **L3** `calcHybridInteraction()` — mains/crosses pairing bonuses

Composite score (OBS) maps to a 10-tier ranking system.

### Bible & Compendium Pages

**Racket Bible** (`comp-tab-rackets`): Browse racquets with hero layout (weight anchor, spec strip, console output). String Modulator panel for injection preview with fullbed/hybrid toggle, gauge selection, and real-time battery bar preview. Top Builds grid with OBS-ranked string recommendations.

**String Compendium** (`comp-tab-strings`): Mirror architecture to Racket Bible. Browse strings by material, shape, stiffness. Hero shows TWU composite score. String Telemetry displays intrinsic characteristics. **Frame Injection** modulator — select frame, configure gauge/tension, preview how string affects frame stats. Supports hybrid configurations with independent crosses string selection.

### Data Layer

Equipment data lives in `pipeline/data/` as JSON files. The browser loads `data.js` which is generated from these files.

- `pipeline/data/frames.json` — racquet database (source of truth)
- `pipeline/data/strings.json` — string database (source of truth)
- `data.js` — generated, never edit directly

### Design System

"Digicraft Brutalism" — monochrome base (#1A1A1A void, #DCDFE2 platinum, #5E666C storm) with #FF4500 accent orange for data visualization. Inter + JetBrains Mono typography. Halftone grain textures. No drop shadows.

**Tailwind CSS v3** (CDN) with custom config:
- Dark mode: `[data-theme="dark"]` selector
- Custom colors: `dc-void`, `dc-platinum`, `dc-storm`, `dc-accent`, `dc-red`
- Typography: Elephant (hero: 4.5rem), Obs (2.5-3.5rem), Mouse (9px labels)

## Data Pipeline

### Adding new equipment

```bash
# Interactive
npm run ingest:frame
npm run ingest:string

# Batch CSV import
node pipeline/scripts/ingest.js --type frame --csv path/to/file.csv
node pipeline/scripts/ingest.js --type string --csv path/to/file.csv

# After any addition
npm run pipeline
```

### Visual tools (browser-based, no install)

- `tools/frame-editor.html` — spreadsheet-style batch frame editor, exports CSV
- `tools/twu-import.html` — AI-assisted extraction from TWU pages using Claude API

### TWU bulk scraping

```bash
# Scrape all racquets from TWU comparison database
npm run scrape:twu

# Scrape polyester string data
npm run scrape:twu-strings

# Enrich scraped frames with inferred specs (beamWidth, pattern, etc.)
npm run enrich:twu -- --input pipeline/data/twu-scrape-YYYY-MM-DD.csv --filter --dedup

# Enrich scraped strings with gauge, shape, identity
npm run enrich:twu-strings -- --input pipeline/data/twu-strings-raw-YYYY-MM-DD.csv --filter
```

### Pipeline commands

| Command | Description |
|---------|-------------|
| `npm run validate` | Check all data against schemas |
| `npm run export` | Regenerate data.js from JSON |
| `npm run export:verify` | Regenerate + canary regression test |
| `npm run canary` | Run 5 regression canaries |
| `npm run canary:baseline` | Re-record canary expected values |
| `npm run estimate` | Show string estimation accuracy stats |
| `npm run calibrate` | Re-fit string estimation coefficients |
| `npm run pipeline` | Full validate + export + verify |
| `npm run scrape:twu` | Scrape TWU racquet database |
| `npm run scrape:twu-strings` | Scrape TWU string database |
| `npm run enrich:twu` | Enrich scraped frame CSV |
| `npm run enrich:twu-strings` | Enrich scraped string CSV (if script exists) |

### File structure

```
├── index.html              ← app shell
├── app.js                  ← engine + UI (~9,800 lines)
├── style.css               ← Digicraft design system (Tailwind + custom)
├── data.js                 ← generated from pipeline (never edit)
├── package.json
│
├── pipeline/
│   ├── data/
│   │   ├── frames.json         ← racquet database (source of truth)
│   │   ├── strings.json        ← string database (source of truth)
│   │   └── canaries.json       ← regression test definitions
│   ├── schemas/
│   │   ├── frame.schema.json   ← validation schema
│   │   └── string.schema.json  ← validation schema
│   ├── scripts/
│   │   ├── validate.js         ← schema + range validation
│   │   ├── estimate.js         ← string property estimation (OLS-fitted)
│   │   ├── calibrate.js        ← re-fit estimation coefficients
│   │   ├── ingest.js           ← add entries (interactive + CSV batch)
│   │   ├── canary-test.js      ← regression canary runner
│   │   ├── export-to-app.js    ← JSON → data.js generator
│   │   ├── extract.js          ← one-time migration (DO NOT RE-RUN)
│   │   ├── scrape-twu.js       ← TWU racquet scraper
│   │   ├── scrape-twu-strings.js ← TWU string scraper
│   │   ├── enrich-twu-csv.js   ← frame enrichment + filtering
│   │   └── enrich-twu-strings.js ← string enrichment + filtering
│   └── engine/
│       └── core.js             ← portable engine (22 functions, Node.js)
│
└── tools/
    ├── frame-editor.html       ← visual batch frame editor
    └── twu-import.html         ← AI-assisted TWU data extraction
```

### Key principles

- `pipeline/data/*.json` is the source of truth
- `data.js` is generated — never edit directly
- `app.js` contains only engine + UI — no equipment data
- The engine is deterministic — same inputs always produce same outputs
- Canary tests guard against regression on every export
- Setup syncing ensures consistency across all pages (see below)

## Setup Syncing

The app maintains a single source of truth: the **active loadout** (frame + strings + tensions). All pages sync to this state:

### Automatic Sync Points

| Page | Sync Behavior |
|------|---------------|
| **Overview** | Always shows active loadout stats |
| **Tune** | Initializes with active racquet + strings, modifications update active loadout |
| **Compare** | Uses active loadout as first slot, survives roundtrips |
| **Optimize** | Searches from current active setup as baseline |
| **Racket Bible** | On entry: auto-selects active racket frame, syncs strings to modulator |
| **String Compendium** | On entry: auto-selects active strings, syncs frame to injector |

### User Workflows

**Browsing different rackets** (no loadout → new setup):
```
Racket Bible → Select Frame A → Apply → Creates loadout + activates
→ Browse Frame B → Fresh modulator → Apply → Overwrites with Frame B setup
```

**Modifying active setup** (existing loadout → update):
```
Overview → Tune → Change tension → Save → Active loadout updated
→ Racket Bible → Shows same frame + strings → Modify → Apply → Updates active
```

**Hybrid mode consistency**:
```
Racket Bible → Hybrid mode → Select mains + crosses → Apply
→ Any page → Shows hybrid setup
→ Back to Racket Bible → Hybrid mode preserved, strings populated
```

### Implementation

Sync is handled by `getCurrentSetup()` which returns the active configuration. Mode switching triggers re-sync via `switchMode()`. The Racket Bible uses `_compSyncWithActiveLoadout()` to ensure the displayed frame matches the active loadout on every entry.
