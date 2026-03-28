/**
 * Compare Page Types
 * TypeScript definitions for the compare system
 */

import type { Loadout, SetupStats, Racquet, StringData } from '../../../engine/types.js';

export type SlotId = 'A' | 'B' | 'C';

export interface SlotColor {
  id: SlotId;
  border: string;
  bg: string;
  bgFaint: string;
  label: string;
  cssClass: string;
  borderDash: number[];
  isPrimary: boolean;
}

export interface CompareSlot {
  id: SlotId;
  loadout: Loadout;
  color: SlotColor;
  stats: SetupStats;
}

export interface EmptySlot {
  id: SlotId;
  color: SlotColor;
  loadout: null;
  stats: null;
}

export type Slot = CompareSlot | EmptySlot;

export interface CompareState {
  slots: Slot[];
  activeSlotId: SlotId | null;
  editingSlotId: SlotId | null;
}

export interface StatDiff {
  stat: string;
  label: string;
  values: {
    slotId: SlotId;
    value: number;
  }[];
  baselineValue: number;
  maxDiff: number;
  winner: SlotId | null;
}

export interface RadarDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
  borderDash: number[];
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointRadius: number;
  pointHoverRadius: number;
}

export const SLOT_COLORS: SlotColor[] = [
  {
    id: 'A',
    border: 'rgba(175, 0, 0, 0.8)',
    bg: 'rgba(175, 0, 0, 0.06)',
    bgFaint: 'rgba(175, 0, 0, 0.03)',
    label: 'A',
    cssClass: 'slot-a',
    borderDash: [],
    isPrimary: true
  },
  {
    id: 'B',
    border: 'rgba(188, 160, 255, 0.86)',
    bg: 'rgba(188, 160, 255, 0.1)',
    bgFaint: 'rgba(188, 160, 255, 0.08)',
    label: 'B',
    cssClass: 'slot-b',
    borderDash: [8, 4],
    isPrimary: false
  },
  {
    id: 'C',
    border: 'rgba(210, 255, 74, 0.88)',
    bg: 'rgba(210, 255, 74, 0.1)',
    bgFaint: 'rgba(210, 255, 74, 0.08)',
    label: 'C',
    cssClass: 'slot-c',
    borderDash: [4, 4],
    isPrimary: false
  }
];

export function getSlotColor(id: SlotId): SlotColor {
  return SLOT_COLORS.find(c => c.id === id) || SLOT_COLORS[0];
}
