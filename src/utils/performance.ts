import { RACQUETS, STRINGS } from '../data/loader.js';
import {
  buildTensionContext,
  computeCompositeScore,
  generateIdentity,
  predictSetup,
} from '../engine/index.js';
import type { Racquet, SetupStats, StringConfig, StringData } from '../engine/types.js';

type SetupLike = {
  racquet: Racquet;
  stringConfig: StringConfig;
};

interface ScoredSetupResult {
  stats: SetupStats;
  obs: number;
  identity: ReturnType<typeof generateIdentity>;
}

const _scheduledRenders = new Map<string, number>();
const _scoredSetupCache = new Map<string, ScoredSetupResult>();
const _valueCache = new Map<string, unknown>();

const _devMode =
  typeof location !== 'undefined' &&
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
const _perfThresholdMs = 24;

function getStringConfigKey(stringConfig: StringConfig): string {
  if (stringConfig.isHybrid) {
    return [
      'hybrid',
      stringConfig.mains.id,
      stringConfig.crosses.id,
      stringConfig.mains._gaugeModified ? stringConfig.mains.gaugeNum : '',
      stringConfig.crosses._gaugeModified ? stringConfig.crosses.gaugeNum : '',
      stringConfig.mainsTension,
      stringConfig.crossesTension,
    ].join('|');
  }

  return [
    'full',
    stringConfig.string.id,
    stringConfig.string._gaugeModified ? stringConfig.string.gaugeNum : '',
    stringConfig.mainsTension,
    stringConfig.crossesTension,
  ].join('|');
}

export function scheduleRender(key: string, callback: () => void): void {
  const existing = _scheduledRenders.get(key);
  if (existing != null) {
    cancelAnimationFrame(existing);
  }

  const frame = requestAnimationFrame(() => {
    _scheduledRenders.delete(key);
    callback();
  });
  _scheduledRenders.set(key, frame);
}

export function getScoredSetup(setup: SetupLike): ScoredSetupResult {
  const cacheKey = `${setup.racquet.id}|${getStringConfigKey(setup.stringConfig)}`;
  const cached = _scoredSetupCache.get(cacheKey);
  if (cached) return cached;

  const stats = predictSetup(setup.racquet, setup.stringConfig);
  const obs = computeCompositeScore(
    stats,
    buildTensionContext(setup.stringConfig, setup.racquet)
  );
  const identity = generateIdentity(stats, setup.racquet, setup.stringConfig);
  const result = { stats, obs, identity };
  _scoredSetupCache.set(cacheKey, result);
  return result;
}

export function getCachedValue<T>(key: string, factory: () => T): T {
  if (_valueCache.has(key)) {
    return _valueCache.get(key) as T;
  }
  const value = factory();
  _valueCache.set(key, value);
  return value;
}

export function clearPerformanceCaches(scope?: 'all' | 'setup' | 'values'): void {
  if (!scope || scope === 'all' || scope === 'setup') {
    _scoredSetupCache.clear();
  }
  if (!scope || scope === 'all' || scope === 'values') {
    _valueCache.clear();
  }
}

export function measurePerformance<T>(name: string, run: () => T): T {
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const result = run();
  const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const duration = end - start;

  if (_devMode && duration >= _perfThresholdMs) {
    console.log(`[Perf] ${name}: ${duration.toFixed(1)}ms`);
  }

  return result;
}

export const RACQUET_BRANDS = getCachedValue('derived:racquet-brands', () =>
  [...new Set(((RACQUETS as unknown) as Racquet[]).map((racquet) => racquet.name.split(' ')[0]))].sort()
);

export const STRING_BRANDS = getCachedValue('derived:string-brands', () =>
  [...new Set(((STRINGS as unknown) as StringData[]).map((string) => string.name.split(' ')[0]))].sort()
);

export const STRING_MATERIALS = getCachedValue('derived:string-materials', () =>
  [...new Set(((STRINGS as unknown) as StringData[]).map((string) => string.material))].sort()
);
