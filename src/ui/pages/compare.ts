/**
 * Compare compatibility adapter.
 *
 * The live Compare runtime now lives under `./compare/index.ts`.
 * This file remains only as a defensive shim for any straggling imports
 * while the last legacy references are being removed.
 */

export {
  getSlotColors,
  toggleComparisonMode,
  addComparisonSlot,
  addComparisonSlotFromHome,
  removeComparisonSlot,
  renderComparisonSlots,
  recalcSlot,
  updateComparisonRadar,
  renderComparisonDeltas,
  renderCompareSummaries,
  renderCompareVerdict,
  renderCompareMatrix,
  compareLoadFromSaved as _compareLoadFromSaved,
  refreshCompareSlot as _refreshCompareSlot,
  _toggleCompareCardEditor,
} from './compare/index.js';

export type { CompareSlot, SlotId, Slot } from './compare/index.js';
export type { SlotColor } from './compare/types.js';

export function openTuneForSlot(slotIndex: number): void {
  (window as any).openTuneForSlot?.(slotIndex);
}
