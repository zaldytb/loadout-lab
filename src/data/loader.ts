// src/data/loader.ts
// Single source of truth for equipment data imports
// Re-exports from data.js so modules don't import directly from the root

import { RACQUETS, STRINGS, FRAME_META } from '../../data.js';
import type { Racquet, StringData, FrameMeta } from '../engine/types.js';

export { RACQUETS, STRINGS, FRAME_META };
export type { Racquet, StringData, FrameMeta };
