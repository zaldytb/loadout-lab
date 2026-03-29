// src/data/loader.ts
// Single source of truth for equipment data imports
// Re-exports from data.js so modules don't import directly from the root

import { RACQUETS, STRINGS, FRAME_META } from '../../data.js';
import type { Racquet, StringData, FrameMeta } from '../engine/types.js';

export const RACQUET_INDEX = new Map(
  ((RACQUETS as unknown) as Racquet[]).map((racquet) => [racquet.id, racquet])
);

export const STRING_INDEX = new Map(
  ((STRINGS as unknown) as StringData[]).map((string) => [string.id, string])
);

export function getRacquetById(id: string | null | undefined): Racquet | undefined {
  return id ? (RACQUET_INDEX.get(id) as Racquet | undefined) : undefined;
}

export function getStringById(id: string | null | undefined): StringData | undefined {
  return id ? (STRING_INDEX.get(id) as StringData | undefined) : undefined;
}

export { RACQUETS, STRINGS, FRAME_META };
export type { Racquet, StringData, FrameMeta };
