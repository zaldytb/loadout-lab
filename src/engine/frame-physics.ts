// src/engine/frame-physics.ts
// Pure math functions for frame physics calculations — no DOM access

import { FRAME_META as _FRAME_META } from '../data/loader.js';
import type { Racquet, FrameMeta, FrameBaseScores } from './types';

// Cast FRAME_META to a typed map — the JS source is an object literal keyed by frame id
const FRAME_META = _FRAME_META as Record<string, FrameMeta>;

export function clamp(val: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

export function lerp(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = (val - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

export function norm(val: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (val - min) / (max - min)));
}

export function getPatternOpenness(pattern: string): number {
  const [mains, crosses] = pattern.split('x').map(Number);
  // 16x18=288 (most open) to 18x20=360 (densest)
  const total = mains * crosses;
  return norm(total, 360, 288); // 0=densest, 1=most open
}

export function getAvgBeam(beamWidth: number[]): number {
  return beamWidth.reduce((a, b) => a + b, 0) / beamWidth.length;
}

export function getMaxBeam(beamWidth: number[]): number {
  return Math.max(...beamWidth);
}

export function getMinBeam(beamWidth: number[]): number {
  return Math.min(...beamWidth);
}

export function isVariableBeam(beamWidth: number[]): boolean {
  return Math.max(...beamWidth) - Math.min(...beamWidth) > 2;
}

/**
 * PREDICTION LAYER 0 — Frame base scores.
 * Normalizes raw racquet specs (stiffness, swingweight, beam, headSize, balance, pattern)
 * to [0, 1], then derives 9 attribute scores via weighted linear models.
 * Tradeoff ceilings (power+control, maneuverability+stability) are soft-enforced
 * before a final sigmoid-like compression targets the 50–85 output range.
 * @param racquet — entry from the RACQUETS array
 * @returns raw attribute scores (power, spin, control, …, maneuverability)
 */
export function calcFrameBase(racquet: Racquet, frameMeta?: Record<string, FrameMeta>): FrameBaseScores {
  const { stiffness, beamWidth, swingweight, pattern, headSize, strungWeight, balance, id } = racquet;
  const avgBeam = getAvgBeam(beamWidth);
  const maxBeam = getMaxBeam(beamWidth);
  const minBeam = getMinBeam(beamWidth);
  const [mains, crosses] = pattern.split('x').map(Number);
  const patternDensity = mains * crosses;
  const metaSource = frameMeta || FRAME_META;
  const meta: FrameMeta = metaSource[id as string] || { aeroBonus: 0, comfortTech: 0, spinTech: 0, genBonus: 0 };

  // Balance in pts HL: 34.29cm = 0 pts, each 0.3175cm toward handle = +1 pt
  const balancePtsHL = (34.29 - (balance as number)) / 0.3175;

  // ---- Normalized inputs [0, 1] ----
  const raNorm = norm(stiffness as number, 55, 72);         // 0=soft, 1=stiff
  const swNorm = norm(swingweight as number, 300, 340);      // 0=light, 1=heavy
  const wtNorm = norm(strungWeight as number, 290, 340);     // 0=light, 1=heavy
  const hsNorm = norm(headSize as number, 95, 102);          // 0=small, 1=large
  const avgBeamNorm = norm(avgBeam, 18, 27);       // 0=thin, 1=thick
  const maxBeamNorm = norm(maxBeam, 18, 27);       // 0=thin, 1=thick
  const hlNorm = norm(balancePtsHL, 0, 8);         // 0=even/HH, 1=very HL
  const densityNorm = norm(patternDensity, 288, 360); // 0=open, 1=dense
  const beamRange = maxBeam - minBeam;
  const beamVarNorm = norm(beamRange, 0, 8);       // 0=constant, 1=extreme variable
  const openness = 1 - densityNorm;

  // ===== POWER =====
  let power = 50;
  power += raNorm * 18 - 5;
  power += maxBeamNorm * 14 - 4;
  power += swNorm * 8 - 2;
  power += openness * 4 - 2;
  power += beamVarNorm * 4;
  power -= hlNorm * 3;
  power += meta.aeroBonus * 1.5;
  power += meta.genBonus * 1;

  // ===== SPIN =====
  let spin = 50;
  spin += openness * 18 - 6;
  spin += hsNorm * 8 - 2;
  spin += beamVarNorm * 4;
  spin += meta.spinTech * 3;
  spin += meta.aeroBonus * 2;
  spin += meta.genBonus * 0.5;

  // ===== CONTROL =====
  let control = 50;
  control += densityNorm * 14 - 4;
  control += (1 - hsNorm) * 8 - 2;
  control += swNorm * 6 - 1.5;
  control += (1 - maxBeamNorm) * 6 - 2;
  control += hlNorm * 3;
  control += meta.genBonus * 0.5;
  control += raNorm > 0.3 ? (raNorm - 0.3) * 4 : (raNorm - 0.3) * 6;

  // ===== LAUNCH =====
  let launch = 50;
  launch += beamVarNorm * 10;
  launch += (1 - raNorm) * 8 - 3;
  launch += openness * 5 - 2;
  launch += maxBeamNorm * 4 - 1.5;
  launch += meta.spinTech * 1.5;

  // ===== COMFORT =====
  let comfort = 50;
  comfort += (1 - raNorm) * 20 - 5;
  comfort += (1 - avgBeamNorm) * 5 - 1;
  comfort += meta.comfortTech * 3;
  comfort += meta.genBonus * 1;
  if (wtNorm > 0.7) comfort -= (wtNorm - 0.7) * 8;

  // ===== STABILITY =====
  let stability = 50;
  stability += swNorm * 20 - 6;
  stability += wtNorm * 10 - 3;
  stability += raNorm * 5 - 1.5;
  stability -= hlNorm * 4;
  stability += meta.genBonus * 0.5;

  // ===== FORGIVENESS =====
  let forgiveness = 48;
  forgiveness += hsNorm * 24 - 8;
  forgiveness += swNorm * 10 - 4;
  forgiveness += beamVarNorm * 5;
  forgiveness += avgBeamNorm * 7 - 2.5;
  forgiveness += meta.comfortTech * 1.5;
  forgiveness += (1 - raNorm) * 6 - 2;
  forgiveness += wtNorm * 5 - 2;

  // ===== FEEL =====
  let feel = 50;
  feel += (1 - raNorm) * 20 - 6;
  feel += (1 - avgBeamNorm) * 10 - 3;
  feel += hlNorm * 4;
  feel += wtNorm * 4 - 1;
  feel += meta.genBonus * 1.5;
  feel += densityNorm * 4 - 2;
  feel += meta.comfortTech > 1.5 ? -1 : meta.comfortTech * 0.5;

  // ===== MANEUVERABILITY =====
  // Inverse of swingweight: lower SW = more maneuverable, easier to accelerate
  // More head-light balance = whippier feel, faster racquet-head speed generation
  // Lower weight helps maneuverability but less than SW/balance
  // This creates a natural tradeoff axis: maneuverability ↔ stability/plow
  let maneuverability = 50;
  maneuverability += (1 - swNorm) * 22 - 6;     // SW: biggest factor — low SW = high score
  maneuverability += hlNorm * 10 - 3;            // HL balance: whippier = more maneuverable
  maneuverability += (1 - wtNorm) * 8 - 2;       // Lower static weight helps
  maneuverability += (1 - hsNorm) * 4 - 1;       // Smaller heads slightly more maneuverable
  // Interaction: very HL + low SW amplifies maneuverability
  if (hlNorm > 0.5 && swNorm < 0.4) {
    maneuverability += (hlNorm - 0.5) * (0.4 - swNorm) * 12;
  }
  // Very high SW crushes maneuverability regardless of other factors
  if (swNorm > 0.75) {
    maneuverability -= (swNorm - 0.75) * 16;
  }

  // ===== DURABILITY (frame contribution) =====
  // Thicker, stiffer, denser patterns = more durable
  let durability = 50;
  durability += maxBeamNorm * 15 - 5;
  durability += raNorm * 10 - 3;
  durability += densityNorm * 8 - 2;
  durability += meta.genBonus * 0.5;

  // ===== PLAYABILITY DURATION (frame contribution) =====
  // Softer, more comfortable frames maintain playability longer
  let playability = 50;
  playability += (1 - raNorm) * 12 - 4;
  playability += meta.comfortTech * 2;
  playability += meta.genBonus * 0.5;

  // ===== TRADEOFF ENFORCEMENT =====
  if (power + control > 145) {
    const excess = (power + control - 145) * 0.4;
    if (power > control) power -= excess;
    else control -= excess;
  }
  if (power + comfort > 140) {
    const excess = (power + comfort - 140) * 0.3;
    if (raNorm > 0.5) comfort -= excess;
    else power -= excess;
  }
  // Maneuverability ↔ Stability: naturally opposed, soft enforce ceiling
  if (maneuverability + stability > 140) {
    const excess = (maneuverability + stability - 140) * 0.3;
    if (maneuverability > stability) maneuverability -= excess;
    else stability -= excess;
  }

  // ===== SCORE COMPRESSION =====
  // Target: 50-60 avg, 60-75 strong, 75-85 excellent, 85+ rare
  const compress = (val: number, spread?: number): number => {
    const mid = 62;
    const s = spread || 0.85;
    return Math.max(30, Math.min(90, mid + (val - mid) * s));
  };

  return {
    power: clamp(compress(power)),
    spin: clamp(compress(spin)),
    control: clamp(compress(control)),
    launch: clamp(compress(launch)),
    comfort: clamp(compress(comfort)),
    stability: clamp(compress(stability)),
    forgiveness: clamp(compress(forgiveness, 0.92)),  // wider spread for narrower natural range
    feel: clamp(compress(feel)),
    maneuverability: clamp(compress(maneuverability)),
    durability: clamp(compress(durability)),
    playability: clamp(compress(playability)),
    _frameDebug: {
      raNorm: +raNorm.toFixed(3),
      swNorm: +swNorm.toFixed(3),
      wtNorm: +wtNorm.toFixed(3),
      hsNorm: +hsNorm.toFixed(3),
      avgBeamNorm: +avgBeamNorm.toFixed(3),
      maxBeamNorm: +maxBeamNorm.toFixed(3),
      hlNorm: +hlNorm.toFixed(3),
      densityNorm: +densityNorm.toFixed(3),
      beamVarNorm: +beamVarNorm.toFixed(3),
      openness: +openness.toFixed(3),
      variable: isVariableBeam(beamWidth),
      meta: id as string
    }
  };
}

/**
 * Normalizes raw racquet specs into a standard format.
 * Used by prediction engine to ensure consistent inputs.
 */
export function normalizeRawSpecs(racquet: Racquet): Racquet & {
  avgBeam: number;
  maxBeam: number;
  patternOpenness: number;
  isVariableBeam: boolean;
} {
  return {
    ...racquet,
    // Ensure all numeric fields are numbers
    headSize: Number(racquet.headSize),
    strungWeight: Number(racquet.strungWeight),
    swingweight: Number(racquet.swingweight),
    stiffness: Number(racquet.stiffness),
    balance: Number(racquet.balance),
    // Computed normalized values
    avgBeam: getAvgBeam(racquet.beamWidth),
    maxBeam: getMaxBeam(racquet.beamWidth),
    patternOpenness: getPatternOpenness(racquet.pattern),
    isVariableBeam: isVariableBeam(racquet.beamWidth)
  };
}
