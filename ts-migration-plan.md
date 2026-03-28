# TypeScript Migration Plan

## Architecture Map

The app is no longer a single-owner monolith, but it is still in a transitional dual-runtime state.

### Current runtime layers

1. `app.js`
   - Compatibility surface
   - Legacy fallback implementations
   - Still contains duplicate page logic for Overview, Tune, Compare, Compendium, and shell-era helpers

2. `src/main.js`
   - Bridge layer from module code to `window.*`
   - Decides which implementation is the public runtime owner for inline handlers

3. `src/state/store.ts`
   - Canonical saved/active loadout store
   - Source of truth for loadout persistence and active loadout switching

4. `src/state/app-state.ts`
   - Shared runtime coordination state
   - Owns mode flags, compare compatibility mirrors, radar refs, slot color mirrors, dock editor context

5. Page modules under `src/ui/pages/*`
   - Most app surfaces now have a TypeScript owner
   - Some pages are fully runtime-owned in TS
   - Some still coexist with legacy duplicates in `app.js`

6. Compare has two TS layers today
   - `src/ui/pages/compare/index.ts`
     - New fixed 3-slot compare page runtime
     - Own state store in `src/ui/pages/compare/hooks/useCompareState.ts`
     - Own card, radar, diff, and editor modal components
   - `src/ui/pages/compare.ts`
     - Transitional compatibility layer
     - Still backs legacy compare render/edit APIs
     - Still reads and writes the older app-state compare mirror

### Current ownership by surface

#### Strongly TS-owned

- Engine: `src/engine/*`
- Store/loadout state: `src/state/*`
- Shell mode orchestration: `src/ui/pages/shell.ts`
- Overview runtime: `src/ui/pages/overview.ts`
- Tune runtime: `src/ui/pages/tune.ts`
- Compendium: `src/ui/pages/compendium.ts`
- Strings: `src/ui/pages/strings.ts`
- New Compare page: `src/ui/pages/compare/index.ts`

#### Transitional / split-owner

- Compare compatibility layer: `src/ui/pages/compare.ts`
- Compare persistence/mirroring between:
  - `src/ui/pages/compare/hooks/useCompareState.ts`
  - `src/state/app-state.ts`
  - legacy compare helpers in `app.js`
- Leaderboard: `src/ui/pages/leaderboard.js`
- Legacy wrappers and dead-but-present renderers in `app.js`

### Current monolith status

- `app.js` is still large: about 8.8k lines
- The live app usually routes through TS first
- The main remaining risk is no longer missing TS modules
- The main remaining risk is duplicated runtime ownership and compatibility mirrors that can drift

## What Is Done

- Shell ownership moved to `src/ui/pages/shell.ts`
- Overview is routed through the TS page path
- Tune runtime, recommendation panels, and recommendation actions are TS-owned
- Compendium and Strings are extracted
- Compare page exists as a new TS module set under `src/ui/pages/compare/*`
- Dock, leaderboard, optimize, and compendium compare entrypoints now prefer the newer compare APIs
- Compare slot cards now support Tune, Save, and Set Active directly
- Compare slot colors, radar datasets, and diff bars use the updated contrast palette

## Main Remaining Problem

The app still has **two compare systems**:

1. The new compare page runtime in `src/ui/pages/compare/index.ts`
2. The older compatibility compare runtime in `src/ui/pages/compare.ts` plus legacy `app.js` helpers

That duality is still the biggest source of migration risk.

## Further Migration Phases

### Phase 1: Converge Compare State to a Single Owner

Goal:
- Make `src/ui/pages/compare/index.ts` plus `useCompareState.ts` the only real compare state owner

Scope:
- Move remaining public compare actions off `src/ui/pages/compare.ts`
- Keep `src/ui/pages/compare.ts` only as a thin adapter temporarily, or remove it once safe
- Stop treating `app-state` compare slots as a second canonical model

Key work:
- Bridge compare actions directly from `compare/index.ts` where possible:
  - add slot
  - edit slot
  - remove slot
  - quick load from saved
  - open Tune from slot
  - set active
  - save slot
- Narrow `app-state` compare usage to compatibility mirroring only
- Remove remaining old compare render/edit assumptions from shell and dock flows

Success criteria:
- One compare store only
- `compareGetState()` is the canonical source
- No user-facing compare flow depends on the old app-state slot array

### Phase 2: Remove Legacy Compare Implementations from `app.js`

Goal:
- Delete or dead-code-isolate the old compare rendering and editing system in `app.js`

Likely targets:
- `renderComparisonSlots`
- `recalcSlot`
- `updateComparisonRadar`
- `renderComparisonDeltas`
- `renderCompareSummaries`
- `renderCompareVerdict`
- `renderCompareMatrix`
- `_compareLoadFromSaved`
- `_toggleCompareCardEditor`
- `_refreshCompareSlot`
- compare bootstrap helpers that are now shell-owned

Success criteria:
- `app.js` no longer contains a working compare page implementation
- compare-specific logic lives only under `src/ui/pages/compare/*`

### Phase 3: Finish Tune Legacy Excision

Goal:
- Remove inactive Tune duplicates from `app.js`

Scope:
- dead-code-isolate old slider/render/apply helpers still present there
- keep only wrappers if any straggling callers still need compatibility

Success criteria:
- Tune page behavior comes only from `src/ui/pages/tune.ts`
- `app.js` no longer contains an alternate Tune implementation

### Phase 4: Finish Overview Legacy Excision

Goal:
- Remove the last duplicate Overview renderers in `app.js`

Scope:
- fit profile
- radar fallback
- stat bars
- warnings
- overview shell fragments still present only for fallback safety

Success criteria:
- Overview is TS-owned publicly and internally
- `app.js` does not secretly render Overview anymore

### Phase 5: Convert Leaderboard to TypeScript

Goal:
- Replace `src/ui/pages/leaderboard.js` with `leaderboard.ts`

Why later:
- It is less risky than compare-state convergence
- The compare API it talks to should stabilize first

Success criteria:
- `src/main.js` bridges a TS leaderboard module
- leaderboard compare integration uses the canonical compare API only

### Phase 6: Shared Utility Cleanup

Goal:
- Consolidate duplicated helper and recommendation logic

Likely targets:
- preset helpers
- recommendation helpers
- rendering helpers that still exist in both legacy and TS paths
- comments/docs that still describe old ownership

Success criteria:
- One owner per shared utility
- fewer bridge collisions
- fewer mixed old/new helper chains

### Phase 7: Shrink `app.js` to Bootstrap Only

Goal:
- Turn `app.js` into a thin compatibility/bootstrap shell

Target state:
- imports and startup only
- temporary compatibility shims only where unavoidable
- no page-level render systems
- no active state owners

Success criteria:
- `app.js` is small
- all page logic is under `src/`
- migration risk is no longer dominated by duplicate runtime paths

## Recommended Execution Order

1. Converge Compare state to a single owner
2. Remove legacy Compare implementations from `app.js`
3. Remove legacy Tune implementations from `app.js`
4. Remove legacy Overview implementations from `app.js`
5. Convert `leaderboard.js` to TypeScript
6. Consolidate shared utilities
7. Reduce `app.js` to bootstrap only

## Verification Gate

After each phase:

```bash
npm run typecheck
npm run canary
npm run build
```

Manual checks:

- switch between Overview, Tune, Compare, Optimize, Compendium, and Strings
- verify Compare slots survive mode roundtrips
- verify Compare card actions:
  - Tune
  - Set Active
  - Save
  - Edit
- verify Compare entrypoints from:
  - dock
  - leaderboard
  - optimize
  - compendium
  - saved loadouts
- verify Tune delta card, OBS card, WTTN, recommendations, and apply flow
- verify Overview fit-grid, warnings, hero, and radar

## Definition of Done

The migration is done when:

- page runtime ownership is fully in TypeScript
- Compare has a single state owner
- `app.js` is only bootstrap/compatibility glue
- `src/main.js` has no ambiguous bridge collisions
- the verification gate passes without relying on legacy fallback behavior
