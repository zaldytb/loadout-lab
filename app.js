// ============================================
// TENNIS LOADOUT LAB — Data + Engine + UI
// ============================================

// ============================================
// DATA: RACQUETS
// ============================================
const RACQUETS = [
  {
    id: "babolat-pure-aero-100-2023",
    name: "Babolat Pure Aero 100",
    year: 2023,
    headSize: 100,
    length: 27,
    strungWeight: 318,
    balance: 33.0,
    balancePts: "4 pts HL",
    swingweight: 318,
    stiffness: 66,
    beamWidth: [23, 26, 23],
    pattern: "16x19",
    powerLevel: "Low-Medium",
    strokeStyle: "Medium-Full",
    swingSpeed: "Medium-Fast",
    tensionRange: [50, 59],
    frameProfile: "Aero-shaped beam with spin-enhancing grommets",
    identity: "Spin Cannon",
    notes: "Classic spin-focused frame. Variable beam width (26mm peak) adds free power. 66 RA provides moderate stiffness. 16x19 open pattern maximizes string movement."
  },
  {
    id: "head-speed-mp-2024",
    name: "Head Speed MP 2024",
    year: 2024,
    headSize: 100,
    length: 27,
    strungWeight: 315,
    balance: 33.02,
    balancePts: "4 pts HL",
    swingweight: 330,
    stiffness: 63,
    beamWidth: [23, 23, 23],
    pattern: "16x19",
    powerLevel: "Medium",
    strokeStyle: "Medium-Full",
    swingSpeed: "Medium-Fast",
    tensionRange: [48, 57],
    frameProfile: "Constant box beam with Auxetic 2 in yoke/handle",
    identity: "All-Rounder",
    notes: "Flat 23mm box beam. Auxetic 2 improves comfort and feel. Higher swingweight (330) than typical 100sq in frames. Good stability. 63 RA is moderate flex."
  },
  {
    id: "head-speed-mp-legend-2025",
    name: "Head Speed MP Legend 2025",
    year: 2025,
    headSize: 100,
    length: 27,
    strungWeight: 318,
    balance: 33.02,
    balancePts: "4 pts HL",
    swingweight: 329,
    stiffness: 60,
    beamWidth: [23, 23, 23],
    pattern: "16x19",
    powerLevel: "Medium",
    strokeStyle: "Medium-Full",
    swingSpeed: "Medium-Fast",
    tensionRange: [48, 57],
    frameProfile: "Constant box beam with Hy-Bor (boron+carbon) + Auxetic 2",
    identity: "Precision All-Rounder",
    notes: "Djokovic signature cosmetic. Same mold as Speed MP but with Hy-Bor material — maximizes stability and feel. 60 RA is notably soft for a 100sq in frame. Slightly heavier than 2024 version (318g vs 315g strung). Enhanced stability and comfort over 2024."
  },
  {
    id: "head-speed-pro-2024",
    name: "Head Speed Pro 2024",
    year: 2024,
    headSize: 100,
    length: 27,
    strungWeight: 325,
    balance: 32.0,
    balancePts: "6 pts HL",
    swingweight: 330,
    stiffness: 62,
    beamWidth: [23, 23, 23],
    pattern: "18x20",
    powerLevel: "Low-Medium",
    strokeStyle: "Full",
    swingSpeed: "Fast",
    tensionRange: [48, 57],
    frameProfile: "Constant box beam, dense pattern, Auxetic 2",
    identity: "Surgeon's Scalpel",
    notes: "18x20 dense pattern for flatter hitters. Heavier static weight but same swingweight as MP due to more head-light balance. Lower power assist, higher control ceiling."
  },
  {
    id: "wilson-blade-98-v8",
    name: "Wilson Blade 98 v8",
    year: 2024,
    headSize: 98,
    length: 27,
    strungWeight: 320,
    balance: 33.0,
    balancePts: "4 pts HL",
    swingweight: 322,
    stiffness: 63,
    beamWidth: [21, 21, 21],
    pattern: "16x19",
    powerLevel: "Low-Medium",
    strokeStyle: "Medium-Full",
    swingSpeed: "Medium-Fast",
    tensionRange: [50, 60],
    frameProfile: "Thin constant beam, braided graphite + Fortyfive",
    identity: "Control Artist",
    notes: "98sq in head + thin 21mm beam = control-biased. Moderate stiffness at 63 RA. Classic player's frame that rewards clean hitting."
  },
  {
    id: "babolat-pure-drive-2024",
    name: "Babolat Pure Drive 2024",
    year: 2024,
    headSize: 100,
    length: 27,
    strungWeight: 322,
    balance: 32.5,
    balancePts: "4 pts HL",
    swingweight: 323,
    stiffness: 71,
    beamWidth: [23, 26, 23],
    pattern: "16x19",
    powerLevel: "Medium-High",
    strokeStyle: "Medium",
    swingSpeed: "Medium",
    tensionRange: [50, 59],
    frameProfile: "Variable beam with HTR system",
    identity: "Power Broker",
    notes: "71 RA is stiff — maximum power assist. Variable beam adds launch. The benchmark for 'power racquet' in the intermediate+ category."
  },
  {
    id: "yonex-ezone-100-2024",
    name: "Yonex EZONE 100 2024",
    year: 2024,
    headSize: 100,
    length: 27,
    strungWeight: 315,
    balance: 33.0,
    balancePts: "4 pts HL",
    swingweight: 318,
    stiffness: 68,
    beamWidth: [23.8, 26.5, 22],
    pattern: "16x19",
    powerLevel: "Medium",
    strokeStyle: "Medium",
    swingSpeed: "Medium-Fast",
    tensionRange: [45, 60],
    frameProfile: "Isometric head with VDM vibration dampening",
    identity: "Comfort Power",
    notes: "Isometric head increases sweet spot. VDM system dampens vibration. Good blend of comfort and power. 68 RA is moderately stiff."
  },
  {
    id: "wilson-pro-staff-97-v14",
    name: "Wilson Pro Staff 97 v14",
    year: 2024,
    headSize: 97,
    length: 27,
    strungWeight: 325,
    balance: 31.5,
    balancePts: "7 pts HL",
    swingweight: 320,
    stiffness: 62,
    beamWidth: [21.5, 21.5, 21.5],
    pattern: "16x19",
    powerLevel: "Low",
    strokeStyle: "Full",
    swingSpeed: "Fast",
    tensionRange: [50, 60],
    frameProfile: "Braided construction, thin constant beam",
    identity: "Classic Heavy Blade",
    notes: "97sq in + thin beam + 62 RA = maximum feel and control. Heavy static weight but low swingweight due to very head-light balance. For advanced full swingers."
  }
];

// ============================================
// DATA: STRINGS
// ============================================
const STRINGS = [
  {
    id: "solinco-confidential-16",
    name: "Solinco Confidential",
    gauge: "16 (1.30mm)",
    gaugeNum: 1.30,
    material: "Polyester",
    shape: "Square/4-pointed edges",
    stiffness: 222.3,
    tensionLoss: 22.2,
    spinPotential: 6.4,
    twScore: { power: 42, spin: 90, comfort: 63, control: 93, feel: 83, playabilityDuration: 88, durability: 91 },
    identity: "Control Lockdown",
    notes: "Stiff poly (222 lb/in) with excellent tension maintenance (22% loss — top tier). Four grippy edges for spin. Needs 3-4 hrs break-in. Rewards full swings with pinpoint accuracy."
  },
  {
    id: "solinco-confidential-17",
    name: "Solinco Confidential",
    gauge: "17 (1.25mm)",
    gaugeNum: 1.25,
    material: "Polyester",
    shape: "Square/4-pointed edges",
    stiffness: 205,
    tensionLoss: 24,
    spinPotential: 7.0,
    twScore: { power: 48, spin: 92, comfort: 66, control: 90, feel: 85, playabilityDuration: 82, durability: 84 },
    identity: "Control Lockdown (Lite)",
    notes: "Thinner gauge: ~8% softer, marginally more spin access, slightly less durability. Better pocketing and comfort than 16g. Good for non-string-breakers who want more feel."
  },
  {
    id: "solinco-hyper-g-16",
    name: "Solinco Hyper-G",
    gauge: "16 (1.30mm)",
    gaugeNum: 1.30,
    material: "Polyester",
    shape: "Pentagon/5-sided",
    stiffness: 219.5,
    tensionLoss: 26.3,
    spinPotential: 7.0,
    twScore: { power: 50, spin: 92, comfort: 62, control: 88, feel: 80, playabilityDuration: 80, durability: 88 },
    identity: "Spin Shredder",
    notes: "Iconic green poly. Pentagon shape bites the ball aggressively. Slightly softer than Confidential with a bit more power. Good all-around aggressive poly."
  },
  {
    id: "solinco-hyper-g-16l",
    name: "Solinco Hyper-G",
    gauge: "16L (1.25mm)",
    gaugeNum: 1.25,
    material: "Polyester",
    shape: "Pentagon/5-sided",
    stiffness: 218.3,
    tensionLoss: 24.7,
    spinPotential: 6.1,
    twScore: { power: 52, spin: 88, comfort: 65, control: 86, feel: 82, playabilityDuration: 76, durability: 82 },
    identity: "Spin Shredder (Lite)",
    notes: "16L version maintains stiffness but lower spin potential in TWU testing. Better tension maintenance than 16g counterpart."
  },
  {
    id: "solinco-tour-bite-16",
    name: "Solinco Tour Bite",
    gauge: "16 (1.30mm)",
    gaugeNum: 1.30,
    material: "Polyester",
    shape: "Pentagon/5-sided",
    stiffness: 202.9,
    tensionLoss: 47.1,
    spinPotential: 6.7,
    twScore: { power: 38, spin: 88, comfort: 52, control: 95, feel: 78, playabilityDuration: 70, durability: 90 },
    identity: "Iron Maiden",
    notes: "Very firm, very controlled. High tension loss (47%) means it starts tight and opens up quickly. Stiff but not as stiff as Confidential. For players who want maximum control and don't mind frequent restrings."
  },
  {
    id: "babolat-rpm-blast-17",
    name: "Babolat RPM Blast",
    gauge: "17 (1.25mm)",
    gaugeNum: 1.25,
    material: "Polyester",
    shape: "Octagonal",
    stiffness: 233.7,
    tensionLoss: 33.3,
    spinPotential: 4.6,
    twScore: { power: 55, spin: 82, comfort: 60, control: 85, feel: 80, playabilityDuration: 72, durability: 82 },
    identity: "The Pro Standard",
    notes: "Nadal's string. Very stiff (234 lb/in). Moderate tension loss. TWU spin potential is low (4.6) but real-world spin comes from snap-back of the octagonal shape. Good power for a poly."
  },
  {
    id: "babolat-rpm-blast-16",
    name: "Babolat RPM Blast",
    gauge: "16 (1.30mm)",
    gaugeNum: 1.30,
    material: "Polyester",
    shape: "Octagonal",
    stiffness: 232.6,
    tensionLoss: 45.9,
    spinPotential: 4.5,
    twScore: { power: 50, spin: 80, comfort: 55, control: 88, feel: 78, playabilityDuration: 68, durability: 88 },
    identity: "The Pro Standard (Tank)",
    notes: "16g version: similar stiffness but significantly more tension loss (46%). More durable but loses playability faster. Good for string breakers."
  },
  {
    id: "babolat-vs-touch-16",
    name: "Babolat VS Touch",
    gauge: "16 (1.30mm)",
    gaugeNum: 1.30,
    material: "Natural Gut",
    shape: "Round (braided)",
    stiffness: 140,
    tensionLoss: 12,
    spinPotential: 5.0,
    twScore: { power: 85, spin: 65, comfort: 98, control: 65, feel: 95, playabilityDuration: 95, durability: 50 },
    identity: "The Silk Cannon",
    notes: "Gold standard natural gut. Softest stiffness (~140 lb/in), best tension maintenance (12% loss), maximum comfort and feel. High power, lower control ceiling. Fragile in wet conditions. Best pocketing of any string material."
  },
  {
    id: "luxilon-alu-power-16l",
    name: "Luxilon ALU Power",
    gauge: "16L (1.25mm)",
    gaugeNum: 1.25,
    material: "Polyester",
    shape: "Round",
    stiffness: 209.2,
    tensionLoss: 46.6,
    spinPotential: 5.8,
    twScore: { power: 65, spin: 78, comfort: 58, control: 82, feel: 85, playabilityDuration: 60, durability: 80 },
    identity: "Legacy Standard",
    notes: "The most famous poly. Good feel and power for a poly but terrible tension maintenance (47% loss). Goes dead fast. The string that defined the poly era but showing its age."
  },
  {
    id: "restring-sync",
    name: "ReString Sync",
    gauge: "17 (1.24mm)",
    gaugeNum: 1.24,
    material: "Polyester",
    shape: "Round (coated)",
    stiffness: 195,
    tensionLoss: 18,
    spinPotential: 6.8,
    twScore: { power: 55, spin: 82, comfort: 72, control: 85, feel: 78, playabilityDuration: 92, durability: 88 },
    identity: "The Endurance Build",
    notes: "Outstanding tension maintenance (~18% loss). Coated surface resists notching. Slightly muted feel compared to ALU Power but vastly superior playability duration. Good spin and comfort for its control level."
  },
  {
    id: "restring-zero",
    name: "ReString Zero",
    gauge: "17 (1.24mm)",
    gaugeNum: 1.24,
    material: "Polyester",
    shape: "Round (textured coating)",
    stiffness: 188,
    tensionLoss: 20,
    spinPotential: 7.5,
    twScore: { power: 58, spin: 88, comfort: 70, control: 82, feel: 80, playabilityDuration: 88, durability: 82 },
    identity: "The Spin Tank",
    notes: "More snap-back than Sync. Better spin access but slightly less tension maintenance and durability. More textured coating gives better ball bite. Good blend of spin and longevity."
  },
  {
    id: "head-lynx-tour-17",
    name: "Head Lynx Tour",
    gauge: "17 (1.25mm)",
    gaugeNum: 1.25,
    material: "Polyester",
    shape: "Square",
    stiffness: 217.7,
    tensionLoss: 24.6,
    spinPotential: 7.1,
    twScore: { power: 48, spin: 88, comfort: 62, control: 88, feel: 80, playabilityDuration: 82, durability: 86 },
    identity: "The Consistent Edge",
    notes: "Square profile for spin, good tension maintenance (24.6% loss). Pairs well with Speed frames. Stiff and controlled with decent playability duration."
  },
  {
    id: "head-hawk-power-17",
    name: "Head Hawk Power",
    gauge: "17 (1.25mm)",
    gaugeNum: 1.25,
    material: "Polyester",
    shape: "Spiral",
    stiffness: 203.5,
    tensionLoss: 48.3,
    spinPotential: 7.5,
    twScore: { power: 60, spin: 86, comfort: 65, control: 80, feel: 78, playabilityDuration: 65, durability: 78 },
    identity: "Power Spinner",
    notes: "More power and spin than Lynx Tour but much worse tension maintenance (48%). Spiral shape generates good ball bite. Loses playability relatively fast."
  },
  {
    id: "tecnifibre-razor-soft-17",
    name: "Tecnifibre Razor Soft",
    gauge: "17 (1.25mm)",
    gaugeNum: 1.25,
    material: "Polyester",
    shape: "Round",
    stiffness: 212,
    tensionLoss: 33.3,
    spinPotential: 7.4,
    twScore: { power: 52, spin: 82, comfort: 70, control: 84, feel: 82, playabilityDuration: 78, durability: 80 },
    identity: "Comfort Control",
    notes: "Good blend of comfort and control. Moderate stiffness and tension loss. A safe all-arounder poly."
  }
];

// ============================================
// PREDICTION ENGINE
// ============================================

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(val)));
}

function lerp(val, inMin, inMax, outMin, outMax) {
  const t = (val - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function getPatternOpenness(pattern) {
  const [mains, crosses] = pattern.split('x').map(Number);
  // 16x19 = 304, 18x20 = 360 — lower total = more open
  const total = mains * crosses;
  return lerp(total, 360, 304, 0, 1); // 0 = dense, 1 = open
}

function getAvgBeam(beamWidth) {
  return beamWidth.reduce((a, b) => a + b, 0) / beamWidth.length;
}

function getMaxBeam(beamWidth) {
  return Math.max(...beamWidth);
}

function isVariableBeam(beamWidth) {
  return Math.max(...beamWidth) - Math.min(...beamWidth) > 2;
}

function calcFrameBase(racquet) {
  const { stiffness, beamWidth, swingweight, pattern, headSize } = racquet;
  const avgBeam = getAvgBeam(beamWidth);
  const maxBeam = getMaxBeam(beamWidth);
  const openness = getPatternOpenness(pattern);
  const variable = isVariableBeam(beamWidth);

  // Power: stiffness (55-75 → 30-80), beam (20-27 → 0-20), swingweight (310-340 → 0-10)
  let power = lerp(stiffness, 55, 75, 30, 80);
  power += lerp(maxBeam, 20, 27, 0, 20);
  power += lerp(swingweight, 310, 340, 0, 10);

  // Spin: pattern openness, head size, variable beam
  let spin = 40 + openness * 30;
  spin += lerp(headSize, 95, 105, -5, 15);
  if (variable) spin += 5;

  // Control: inverse power + swingweight stability + pattern density
  let control = 100 - power * 0.5;
  control += lerp(swingweight, 310, 340, 0, 15);
  control += (1 - openness) * 15;

  // Launch: variable beam, stiffness (inverse), pattern openness
  let launch = 40;
  if (variable) launch += 12;
  launch += lerp(stiffness, 55, 75, 10, -5);
  launch += openness * 8;

  // Comfort: inverse stiffness
  let comfort = lerp(stiffness, 55, 75, 85, 30);
  // Lower beam = slightly more feel/comfort from flex
  comfort += lerp(avgBeam, 20, 27, 5, -5);

  // Stability: swingweight (primary), weight
  let stability = lerp(swingweight, 310, 340, 35, 85);
  stability += lerp(racquet.strungWeight, 310, 330, 0, 10);

  // Forgiveness: head size, swingweight
  let forgiveness = lerp(headSize, 95, 105, 30, 70);
  forgiveness += lerp(swingweight, 310, 340, 5, 20);
  if (variable) forgiveness += 5;

  // Feel: inverse stiffness, thin beam, weight
  let feel = lerp(stiffness, 55, 75, 80, 40);
  feel += lerp(avgBeam, 20, 27, 10, -5);

  return {
    power: clamp(power),
    spin: clamp(spin),
    control: clamp(control),
    launch: clamp(launch),
    comfort: clamp(comfort),
    stability: clamp(stability),
    forgiveness: clamp(forgiveness),
    feel: clamp(feel),
    durability: 50, // baseline, string determines
    playability: 50  // baseline, string determines
  };
}

function calcStringContribution(stringData) {
  // String stiffness range: ~140 (gut) to ~234 (RPM Blast)
  // Normalize: lower stiffness = more power, more comfort
  const stiffNorm = lerp(stringData.stiffness, 140, 240, 1, 0); // 1 = soft, 0 = stiff

  return {
    powerMod: stiffNorm * 25 - 10, // soft string adds power, stiff subtracts
    spinMod: (stringData.spinPotential - 5) * 5, // center at 5, scale
    controlMod: (1 - stiffNorm) * 15 - 5, // stiffer = more control
    comfortMod: stiffNorm * 20 - 8,
    feelMod: stringData.material === 'Natural Gut' ? 15 : (stiffNorm * 8 - 2),
    durability: stringData.twScore.durability,
    playability: stringData.twScore.playabilityDuration,
    tensionLossMod: lerp(stringData.tensionLoss, 10, 50, 10, -15) // low loss = bonus playability
  };
}

function calcTensionModifier(tension, tensionRange) {
  const mid = (tensionRange[0] + tensionRange[1]) / 2;
  const diff = tension - mid;
  // Every 2 lbs above midpoint: +3% control, -3% power
  const factor = diff / 2;

  return {
    powerMod: -factor * 3,
    controlMod: factor * 3,
    launchMod: -factor * 2,
    comfortMod: -factor * 2,
    spinMod: -Math.abs(factor) * 0.5 // extreme tensions slightly reduce spin
  };
}

function predictSetup(racquet, stringConfig) {
  const frameBase = calcFrameBase(racquet);

  let stringContrib;
  let avgTension;

  if (stringConfig.isHybrid) {
    const mainsContrib = calcStringContribution(stringConfig.mains);
    const crossesContrib = calcStringContribution(stringConfig.crosses);

    // Mains 70%, crosses 30%
    stringContrib = {
      powerMod: mainsContrib.powerMod * 0.7 + crossesContrib.powerMod * 0.3,
      spinMod: mainsContrib.spinMod * 0.7 + crossesContrib.spinMod * 0.3,
      controlMod: mainsContrib.controlMod * 0.3 + crossesContrib.controlMod * 0.7,
      comfortMod: mainsContrib.comfortMod * 0.7 + crossesContrib.comfortMod * 0.3,
      feelMod: mainsContrib.feelMod * 0.7 + crossesContrib.feelMod * 0.3,
      durability: mainsContrib.durability * 0.4 + crossesContrib.durability * 0.6,
      playability: mainsContrib.playability * 0.7 + crossesContrib.playability * 0.3,
      tensionLossMod: mainsContrib.tensionLossMod * 0.6 + crossesContrib.tensionLossMod * 0.4
    };
    avgTension = (stringConfig.mainsTension + stringConfig.crossesTension) / 2;
  } else {
    stringContrib = calcStringContribution(stringConfig.string);
    avgTension = stringConfig.tension;
  }

  const tensionMod = calcTensionModifier(avgTension, racquet.tensionRange);

  // Combine
  const stats = {
    spin: clamp(frameBase.spin + stringContrib.spinMod + tensionMod.spinMod),
    power: clamp(frameBase.power + stringContrib.powerMod + tensionMod.powerMod),
    control: clamp(frameBase.control + stringContrib.controlMod + tensionMod.controlMod),
    launch: clamp(frameBase.launch + tensionMod.launchMod),
    feel: clamp(frameBase.feel + stringContrib.feelMod),
    comfort: clamp(frameBase.comfort + stringContrib.comfortMod + tensionMod.comfortMod),
    stability: clamp(frameBase.stability),
    forgiveness: clamp(frameBase.forgiveness),
    durability: clamp(stringContrib.durability),
    playability: clamp(stringContrib.playability + stringContrib.tensionLossMod)
  };

  return stats;
}

// ============================================
// IDENTITY GENERATOR
// ============================================

function generateIdentity(stats, racquet, stringConfig) {
  const archetypes = [];

  // Determine dominant traits
  if (stats.spin >= 75 && stats.control >= 70) archetypes.push('Surgical Topspin Machine');
  else if (stats.spin >= 70) archetypes.push('Spin Dominator');

  if (stats.power >= 70 && stats.control <= 60) archetypes.push('Power Brawler');
  else if (stats.power >= 65) archetypes.push('Power Hybrid');

  if (stats.control >= 80) archetypes.push('Precision Instrument');
  else if (stats.control >= 70) archetypes.push('Control Platform');

  if (stats.comfort >= 75 && stats.power >= 60) archetypes.push('Comfort Cannon');
  if (stats.feel >= 80 && stats.control >= 70) archetypes.push('Touch Artist');

  if (stats.stability >= 75 && stats.control >= 65) archetypes.push('Wall of Stability');
  if (stats.forgiveness >= 65 && stats.power >= 60) archetypes.push('Forgiving Weapon');

  if (stats.playability >= 85) archetypes.push('Endurance Build');
  if (stats.durability >= 85 && stats.playability >= 80) archetypes.push('Marathon Setup');

  // Default
  if (archetypes.length === 0) archetypes.push('Balanced Setup');

  const archetype = archetypes[0];

  // Description
  const descriptions = {
    'Surgical Topspin Machine': `High spin potential meets pinpoint control. Excels at constructing points with heavy topspin from the baseline, allowing you to hit with margin and still redirect at will.`,
    'Spin Dominator': `Spin-first setup that generates heavy ball rotation. The string bed grips the ball aggressively, creating a high-bouncing, dipping trajectory that pushes opponents behind the baseline.`,
    'Power Brawler': `Maximum power with enough raw muscle to overpower opponents. Best for players who want to dictate with pace and don't need surgical precision on every shot.`,
    'Power Hybrid': `Balanced power delivery with enough control to keep balls in play. Good for intermediate to advanced players transitioning to more aggressive play.`,
    'Precision Instrument': `Control-first build for players who generate their own pace. Every swing gives clear feedback and directional precision. Rewards clean technique with surgical accuracy.`,
    'Control Platform': `Reliable control with enough assistance to stay competitive. A stable platform for developing players or all-courters who value consistency.`,
    'Comfort Cannon': `Arm-friendly power. High comfort rating means you can swing freely without worrying about elbow or shoulder strain, while still getting good power return.`,
    'Touch Artist': `Maximum feel and connection to the ball. Ideal for net players and all-courters who rely on touch, placement, and variety over raw power.`,
    'Wall of Stability': `Immovable on contact. High stability means the frame doesn't twist on off-center hits, giving you confidence even when you're not hitting the sweet spot.`,
    'Forgiving Weapon': `Large effective sweet spot with decent power. Mis-hits still go in, and centered hits carry real authority. Good for developing power hitters.`,
    'Endurance Build': `Exceptional playability duration. This setup maintains its performance characteristics far longer than average, meaning fewer restrings and more consistent play.`,
    'Marathon Setup': `Built to last. Both durability and playability are elite — the string bed stays lively for weeks and resists breakage. Ideal for frequent players.`,
    'Balanced Setup': `Well-rounded profile with no glaring weaknesses. A versatile setup that adapts to different game styles and court conditions.`
  };

  return {
    archetype,
    description: descriptions[archetype] || descriptions['Balanced Setup']
  };
}

// ============================================
// FIT PROFILE GENERATOR
// ============================================

function generateFitProfile(stats, racquet, stringConfig) {
  const bestFor = [];
  const watchOut = [];

  if (stats.spin >= 70) bestFor.push('Baseline grinders who rely on topspin');
  if (stats.power >= 65) bestFor.push('Players who like to dictate with pace');
  if (stats.control >= 70) bestFor.push('Touch players and all-courters');
  if (stats.comfort >= 70) bestFor.push('Players with arm sensitivity');
  if (stats.stability >= 70) bestFor.push('Aggressive returners and blockers');
  if (stats.feel >= 75) bestFor.push('Net players and volleyers');
  if (stats.forgiveness >= 65) bestFor.push('Developing players building consistency');
  if (stats.playability >= 80) bestFor.push('Frequent players (3+ times/week)');

  if (bestFor.length === 0) bestFor.push('Versatile all-court players');

  if (stats.power <= 40) watchOut.push('Players who need free power from the frame');
  if (stats.comfort <= 45) watchOut.push('Players with arm/elbow issues — too stiff');
  if (stats.control <= 50) watchOut.push('Players who need help keeping the ball in');
  if (stats.spin <= 50) watchOut.push('Heavy topspin players — limited spin access');
  if (stats.forgiveness <= 45) watchOut.push('Beginners — small effective sweet spot');
  if (stats.durability <= 55) watchOut.push('String breakers — low durability');
  if (stats.playability <= 55) watchOut.push('Infrequent restringers — goes dead fast');

  if (watchOut.length === 0) watchOut.push('No major red flags — versatile setup');

  // Recommended tension
  const [low, high] = racquet.tensionRange;
  const mid = Math.round((low + high) / 2);
  const tensionRec = `${low}–${high} lbs (sweet spot: ${mid - 1}–${mid + 1} lbs)`;

  return { bestFor, watchOut, tensionRec };
}

// ============================================
// WARNINGS GENERATOR
// ============================================

function generateWarnings(racquet, stringConfig, stats) {
  const warnings = [];

  const getMainString = () => stringConfig.isHybrid ? stringConfig.mains : stringConfig.string;
  const getCrossString = () => stringConfig.isHybrid ? stringConfig.crosses : stringConfig.string;
  const getAvgTension = () => stringConfig.isHybrid
    ? (stringConfig.mainsTension + stringConfig.crossesTension) / 2
    : stringConfig.tension;
  const getMainsTension = () => stringConfig.isHybrid ? stringConfig.mainsTension : stringConfig.tension;
  const getCrossesTension = () => stringConfig.isHybrid ? stringConfig.crossesTension : stringConfig.tension;

  // Tension outside range
  const mainsTension = getMainsTension();
  const crossesTension = getCrossesTension();

  if (mainsTension < racquet.tensionRange[0]) {
    warnings.push(`Mains tension (${mainsTension} lbs) is below the recommended range (${racquet.tensionRange[0]}–${racquet.tensionRange[1]} lbs). Risk of losing control and trampoline effect.`);
  }
  if (mainsTension > racquet.tensionRange[1]) {
    warnings.push(`Mains tension (${mainsTension} lbs) is above the recommended range (${racquet.tensionRange[0]}–${racquet.tensionRange[1]} lbs). Risk of reduced comfort and arm strain.`);
  }
  if (stringConfig.isHybrid && crossesTension < racquet.tensionRange[0]) {
    warnings.push(`Crosses tension (${crossesTension} lbs) is below the recommended range.`);
  }
  if (stringConfig.isHybrid && crossesTension > racquet.tensionRange[1]) {
    warnings.push(`Crosses tension (${crossesTension} lbs) is above the recommended range.`);
  }

  // Stiffness combo warning
  const mainString = getMainString();
  if (racquet.stiffness >= 68 && mainString.stiffness >= 220) {
    warnings.push(`High frame stiffness (${racquet.stiffness} RA) + stiff string (${mainString.stiffness} lb/in) = significant shock transmission. Consider monitoring for arm discomfort.`);
  }

  // Thin gauge durability
  const allStrings = stringConfig.isHybrid ? [stringConfig.mains, stringConfig.crosses] : [stringConfig.string];
  for (const s of allStrings) {
    if (s.gaugeNum <= 1.25 && s.material === 'Polyester') {
      warnings.push(`${s.name} ${s.gauge} is thin gauge — expect reduced durability vs 16g. Frequent string breakers should consider thicker gauge.`);
    }
  }

  // Gut rain warning
  for (const s of allStrings) {
    if (s.material === 'Natural Gut') {
      warnings.push(`${s.name} is natural gut — highly vulnerable to moisture. Avoid playing in rain or high humidity without a backup racquet.`);
    }
  }

  // High tension loss
  for (const s of allStrings) {
    if (s.tensionLoss >= 40) {
      warnings.push(`${s.name} has high tension loss (${s.tensionLoss}%). Setup will play noticeably different after a few sessions. Consider restringing every 10-15 hours of play.`);
    }
  }

  return warnings;
}

// ============================================
// DATA FOUNDATION
// ============================================

function getDataFoundation(racquet, stringConfig) {
  const items = [];

  // Frame data — all measured
  items.push({ label: 'Frame Weight', type: 'measured' });
  items.push({ label: 'Swingweight', type: 'measured' });
  items.push({ label: 'Stiffness (RA)', type: 'measured' });
  items.push({ label: 'Beam Width', type: 'measured' });
  items.push({ label: 'String Pattern', type: 'measured' });
  items.push({ label: 'Balance', type: 'measured' });

  // String data — measured from TWU
  items.push({ label: 'String Stiffness', type: 'measured' });
  items.push({ label: 'Tension Loss %', type: 'measured' });
  items.push({ label: 'Spin Potential', type: 'measured' });
  items.push({ label: 'TWU Scores', type: 'measured' });

  // Modeled outputs
  items.push({ label: 'Power Rating', type: 'modeled' });
  items.push({ label: 'Spin Rating', type: 'modeled' });
  items.push({ label: 'Control Rating', type: 'modeled' });
  items.push({ label: 'Launch Angle', type: 'modeled' });
  items.push({ label: 'Feel Rating', type: 'modeled' });
  items.push({ label: 'Comfort Rating', type: 'modeled' });

  // Estimated
  items.push({ label: 'Setup Identity', type: 'estimated' });
  items.push({ label: 'Fit Profile', type: 'estimated' });

  return items;
}

// ============================================
// SETUP BADGE TEXT
// ============================================

function getSetupBadge(racquet, stringConfig) {
  const racketId = racquet.identity;
  const stringId = stringConfig.isHybrid
    ? `${stringConfig.mains.identity} × ${stringConfig.crosses.identity}`
    : stringConfig.string.identity;
  return `${racketId} + ${stringId}`;
}

// ============================================
// UI CONTROLLER
// ============================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let currentRadarChart = null;
let comparisonRadarChart = null;
let comparisonSlots = []; // array of { racquet, stringConfig, stats, identity }
let isComparisonMode = false;

const STAT_KEYS = ['spin', 'power', 'control', 'launch', 'feel', 'comfort', 'stability', 'forgiveness', 'durability', 'playability'];
const STAT_LABELS = ['Spin', 'Power', 'Control', 'Launch', 'Feel', 'Comfort', 'Stability', 'Forgiveness', 'Durability', 'Playability'];
const STAT_LABELS_FULL = ['Spin', 'Power', 'Control', 'Launch', 'Feel', 'Comfort', 'Stability', 'Forgiveness', 'Durability', 'Playability Duration'];
const STAT_CSS_CLASSES = ['spin', 'power', 'control', 'launch', 'feel', 'comfort', 'stability', 'forgiveness', 'durability', 'playability'];

const SLOT_COLORS = [
  { border: 'var(--cyan)', bg: 'rgba(0, 212, 255, 0.6)', bgFaint: 'rgba(0, 212, 255, 0.1)', label: 'A', cssClass: 'a' },
  { border: 'var(--green)', bg: 'rgba(0, 255, 136, 0.6)', bgFaint: 'rgba(0, 255, 136, 0.1)', label: 'B', cssClass: 'b' },
  { border: 'var(--amber)', bg: 'rgba(255, 187, 0, 0.6)', bgFaint: 'rgba(255, 187, 0, 0.1)', label: 'C', cssClass: 'c' }
];

// ============================================
// POPULATE DROPDOWNS
// ============================================

function populateRacquetDropdown(selectEl) {
  selectEl.innerHTML = '<option value="">Select Racquet...</option>';
  RACQUETS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `${r.name} (${r.year})`;
    selectEl.appendChild(opt);
  });
}

function populateStringDropdown(selectEl) {
  selectEl.innerHTML = '<option value="">Select String...</option>';
  STRINGS.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.name} ${s.gauge}`;
    selectEl.appendChild(opt);
  });
}

function populateGaugeDropdown(selectEl, stringId) {
  selectEl.innerHTML = '';
  if (!stringId) {
    selectEl.innerHTML = '<option value="">—</option>';
    return;
  }
  const s = STRINGS.find(x => x.id === stringId);
  if (s) {
    const opt = document.createElement('option');
    opt.value = s.gauge;
    opt.textContent = s.gauge;
    opt.selected = true;
    selectEl.appendChild(opt);
  }
}

// ============================================
// FRAME SPECS DISPLAY
// ============================================

function showFrameSpecs(racquet) {
  const el = $('#frame-specs');
  if (!racquet) {
    el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="frame-spec-item"><span class="frame-spec-label">Weight</span><span class="frame-spec-value">${racquet.strungWeight}g</span></div>
    <div class="frame-spec-item"><span class="frame-spec-label">SW</span><span class="frame-spec-value">${racquet.swingweight}</span></div>
    <div class="frame-spec-item"><span class="frame-spec-label">Stiffness</span><span class="frame-spec-value">${racquet.stiffness} RA</span></div>
    <div class="frame-spec-item"><span class="frame-spec-label">Pattern</span><span class="frame-spec-value">${racquet.pattern}</span></div>
    <div class="frame-spec-item"><span class="frame-spec-label">Head</span><span class="frame-spec-value">${racquet.headSize} sq in</span></div>
    <div class="frame-spec-item"><span class="frame-spec-label">Balance</span><span class="frame-spec-value">${racquet.balancePts}</span></div>
    <div class="frame-spec-item"><span class="frame-spec-label">Beam</span><span class="frame-spec-value">${racquet.beamWidth.join('/')}</span></div>
    <div class="frame-spec-item"><span class="frame-spec-label">Tension</span><span class="frame-spec-value">${racquet.tensionRange[0]}-${racquet.tensionRange[1]} lbs</span></div>
  `;
}

// ============================================
// MAIN DASHBOARD RENDER
// ============================================

function getCurrentSetup() {
  const racquetId = $('#select-racquet').value;
  const racquet = RACQUETS.find(r => r.id === racquetId);
  if (!racquet) return null;

  const isHybrid = $('#btn-hybrid').classList.contains('active');

  if (isHybrid) {
    const mainsId = $('#select-string-mains').value;
    const crossesId = $('#select-string-crosses').value;
    if (!mainsId || !crossesId) return null;

    return {
      racquet,
      stringConfig: {
        isHybrid: true,
        mains: STRINGS.find(s => s.id === mainsId),
        crosses: STRINGS.find(s => s.id === crossesId),
        mainsTension: parseInt($('#input-tension-mains').value) || 55,
        crossesTension: parseInt($('#input-tension-crosses').value) || 53
      }
    };
  } else {
    const stringId = $('#select-string-full').value;
    if (!stringId) return null;

    return {
      racquet,
      stringConfig: {
        isHybrid: false,
        string: STRINGS.find(s => s.id === stringId),
        tension: parseInt($('#input-tension-full').value) || 55
      }
    };
  }
}

function renderDashboard() {
  const setup = getCurrentSetup();

  if (!setup) {
    $('#empty-state').classList.remove('hidden');
    $('#dashboard-content').classList.add('hidden');
    return;
  }

  $('#empty-state').classList.add('hidden');
  $('#dashboard-content').classList.remove('hidden');

  const { racquet, stringConfig } = setup;
  const stats = predictSetup(racquet, stringConfig);
  const identity = generateIdentity(stats, racquet, stringConfig);
  const fitProfile = generateFitProfile(stats, racquet, stringConfig);
  const warnings = generateWarnings(racquet, stringConfig, stats);
  const foundation = getDataFoundation(racquet, stringConfig);
  const badge = getSetupBadge(racquet, stringConfig);

  // Summary
  renderSummary(racquet, stringConfig, badge);

  // Data Foundation
  renderFoundation(foundation);

  // Identity
  $('#identity-archetype').textContent = identity.archetype.toUpperCase();
  $('#identity-description').textContent = identity.description;

  // Stats
  renderStatBars(stats);
  renderRadarChart(stats);

  // Fit
  renderFitProfile(fitProfile);

  // Warnings
  renderWarnings(warnings);
}

function renderSummary(racquet, stringConfig, badge) {
  const grid = $('#summary-grid');
  const badgeEl = $('#identity-badge');
  badgeEl.textContent = badge;

  let stringName, stringTension;
  if (stringConfig.isHybrid) {
    stringName = `${stringConfig.mains.name} ${stringConfig.mains.gauge} / ${stringConfig.crosses.name} ${stringConfig.crosses.gauge}`;
    stringTension = `M: ${stringConfig.mainsTension} / X: ${stringConfig.crossesTension} lbs`;
  } else {
    stringName = `${stringConfig.string.name} ${stringConfig.string.gauge}`;
    stringTension = `${stringConfig.tension} lbs`;
  }

  grid.innerHTML = `
    <div class="summary-item">
      <span class="summary-label">Frame</span>
      <span class="summary-value">${racquet.name}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Year</span>
      <span class="summary-value">${racquet.year}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Weight / SW</span>
      <span class="summary-value">${racquet.strungWeight}g / ${racquet.swingweight}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Stiffness</span>
      <span class="summary-value">${racquet.stiffness} RA</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Pattern</span>
      <span class="summary-value">${racquet.pattern}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">String</span>
      <span class="summary-value">${stringName}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Tension</span>
      <span class="summary-value">${stringTension}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Setup Type</span>
      <span class="summary-value">${stringConfig.isHybrid ? 'Hybrid' : 'Full Bed'}</span>
    </div>
  `;
}

function renderFoundation(items) {
  const grid = $('#foundation-grid');
  grid.innerHTML = items.map(item => `
    <span class="foundation-item ${item.type}">
      <span>${item.label}</span>
    </span>
  `).join('');
}

function renderStatBars(stats) {
  const container = $('#stat-bars');
  container.innerHTML = '';

  STAT_KEYS.forEach((key, i) => {
    const value = stats[key];
    const row = document.createElement('div');
    row.className = `stat-row stat-${STAT_CSS_CLASSES[i]}`;
    row.innerHTML = `
      <span class="stat-label">${STAT_LABELS[i]}</span>
      <div class="stat-bar-track">
        <div class="stat-bar-fill" data-target="${value}"></div>
      </div>
      <span class="stat-value">${value}</span>
    `;
    container.appendChild(row);
  });

  // Animate bars
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll('.stat-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    });
  });
}

function renderRadarChart(stats) {
  const ctx = document.getElementById('radar-chart').getContext('2d');

  const data = STAT_KEYS.map(k => stats[k]);

  const isDark = document.documentElement.dataset.theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const labelColor = isDark ? '#9ba3b5' : '#555e70';

  if (currentRadarChart) {
    currentRadarChart.data.datasets[0].data = data;
    currentRadarChart.options.scales.r.grid.color = gridColor;
    currentRadarChart.options.scales.r.angleLines.color = gridColor;
    currentRadarChart.options.scales.r.pointLabels.color = labelColor;
    currentRadarChart.update('active');
    return;
  }

  currentRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: STAT_LABELS_FULL,
      datasets: [{
        data,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderColor: '#00d4ff',
        borderWidth: 2,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#00d4ff',
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 25,
            display: false
          },
          grid: {
            color: gridColor,
            circular: true
          },
          angleLines: {
            color: gridColor
          },
          pointLabels: {
            font: {
              family: "'JetBrains Mono', monospace",
              size: 9,
              weight: 500
            },
            color: labelColor
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
}

function renderFitProfile(fitProfile) {
  const grid = $('#fit-grid');
  grid.innerHTML = `
    <div class="fit-section best-for">
      <h4 class="fit-section-title best-for">Best For:</h4>
      ${fitProfile.bestFor.map(f => `<p class="fit-item">${f}</p>`).join('')}
    </div>
    <div class="fit-section watch-out">
      <h4 class="fit-section-title watch-out">Watch Out:</h4>
      ${fitProfile.watchOut.map(f => `<p class="fit-item">${f}</p>`).join('')}
    </div>
    <div class="fit-section tension-rec">
      <h4 class="fit-section-title tension-rec">Recommended Tension:</h4>
      <p class="fit-item">${fitProfile.tensionRec}</p>
    </div>
  `;
}

function renderWarnings(warnings) {
  const card = $('#warnings-card');
  const list = $('#warnings-list');

  if (warnings.length === 0) {
    card.classList.add('hidden');
    return;
  }

  card.classList.remove('hidden');
  list.innerHTML = warnings.map(w => `
    <div class="warning-item">
      <svg class="warning-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L1 14h14L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <line x1="8" y1="6" x2="8" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="8" cy="12" r="0.8" fill="currentColor"/>
      </svg>
      <span>${w}</span>
    </div>
  `).join('');
}

// ============================================
// COMPARISON MODE
// ============================================

function toggleComparisonMode() {
  isComparisonMode = !isComparisonMode;
  const btn = $('#btn-toggle-comparison');
  btn.classList.toggle('active', isComparisonMode);

  if (isComparisonMode) {
    $('#single-view').classList.add('hidden');
    $('#comparison-view').classList.remove('hidden');

    if (comparisonSlots.length === 0) {
      // Auto-add first slot with current setup
      addComparisonSlot();
    }
  } else {
    $('#single-view').classList.remove('hidden');
    $('#comparison-view').classList.add('hidden');
  }
}

function addComparisonSlot() {
  if (comparisonSlots.length >= 3) return;

  const slotIndex = comparisonSlots.length;
  const slotColor = SLOT_COLORS[slotIndex];

  const slotData = {
    id: Date.now(),
    racquetId: '',
    stringId: '',
    tension: 55,
    isHybrid: false,
    mainsId: '',
    crossesId: '',
    mainsTension: 55,
    crossesTension: 53,
    stats: null,
    identity: null
  };

  comparisonSlots.push(slotData);
  renderComparisonSlots();
  updateComparisonRadar();
}

function removeComparisonSlot(index) {
  comparisonSlots.splice(index, 1);
  renderComparisonSlots();
  updateComparisonRadar();
}

function renderComparisonSlots() {
  const container = $('#comparison-slots');
  container.innerHTML = '';

  // Update add button visibility
  const addBtn = $('#btn-add-slot');
  addBtn.style.display = comparisonSlots.length >= 3 ? 'none' : '';

  comparisonSlots.forEach((slot, index) => {
    const color = SLOT_COLORS[index];
    const div = document.createElement('div');
    div.className = `comparison-slot slot-color-${color.cssClass}`;
    div.dataset.slotIndex = index;

    div.innerHTML = `
      <div class="slot-header">
        <span class="slot-label slot-label-${color.cssClass}">SETUP ${color.label}</span>
        <button class="slot-remove" onclick="removeComparisonSlot(${index})" title="Remove">✕</button>
      </div>
      <div class="slot-config">
        <select class="select-input slot-racquet" data-slot="${index}">
          <option value="">Select Racquet...</option>
          ${RACQUETS.map(r => `<option value="${r.id}" ${slot.racquetId === r.id ? 'selected' : ''}>${r.name} (${r.year})</option>`).join('')}
        </select>
        <select class="select-input slot-string" data-slot="${index}">
          <option value="">Select String...</option>
          ${STRINGS.map(s => `<option value="${s.id}" ${slot.stringId === s.id ? 'selected' : ''}>${s.name} ${s.gauge}</option>`).join('')}
        </select>
        <div class="row-2col">
          <div>
            <label class="field-label">Tension</label>
            <input type="number" class="text-input slot-tension" data-slot="${index}" value="${slot.tension}" min="30" max="70">
          </div>
          <div style="display:flex;align-items:flex-end;">
            ${slot.stats ? `<div class="slot-identity" style="color: ${color.border}">${slot.identity?.archetype || '—'}</div>` : ''}
          </div>
        </div>
      </div>
      ${slot.stats ? renderSlotStats(slot.stats, index) : '<div style="padding:8px;text-align:center;color:var(--text-muted);font-size:0.8rem;">Configure to see stats</div>'}
    `;

    container.appendChild(div);
  });

  // Attach events
  container.querySelectorAll('.slot-racquet').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.slot);
      comparisonSlots[idx].racquetId = e.target.value;
      recalcSlot(idx);
    });
  });
  container.querySelectorAll('.slot-string').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.slot);
      comparisonSlots[idx].stringId = e.target.value;
      recalcSlot(idx);
    });
  });
  container.querySelectorAll('.slot-tension').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.slot);
      comparisonSlots[idx].tension = parseInt(e.target.value) || 55;
      recalcSlot(idx);
    });
  });
}

function renderSlotStats(stats, slotIndex) {
  const color = SLOT_COLORS[slotIndex];
  return `
    <div class="slot-stats">
      ${STAT_KEYS.map((key, i) => `
        <div class="slot-stat">
          <span class="slot-stat-label">${STAT_LABELS[i]}</span>
          <div class="slot-stat-bar">
            <div class="slot-stat-fill" style="width:${stats[key]}%; background:${color.border}; box-shadow: 0 0 6px ${color.bgFaint};"></div>
          </div>
          <span class="slot-stat-value" style="color:${color.border}">${stats[key]}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function recalcSlot(index) {
  const slot = comparisonSlots[index];
  const racquet = RACQUETS.find(r => r.id === slot.racquetId);
  const stringData = STRINGS.find(s => s.id === slot.stringId);

  if (racquet && stringData) {
    const stringConfig = {
      isHybrid: false,
      string: stringData,
      tension: slot.tension
    };
    slot.stats = predictSetup(racquet, stringConfig);
    slot.identity = generateIdentity(slot.stats, racquet, stringConfig);
  } else {
    slot.stats = null;
    slot.identity = null;
  }

  renderComparisonSlots();
  updateComparisonRadar();
  renderComparisonDeltas();
}

function updateComparisonRadar() {
  const ctx = document.getElementById('comparison-radar-chart').getContext('2d');
  const datasets = [];

  comparisonSlots.forEach((slot, i) => {
    if (!slot.stats) return;
    const color = SLOT_COLORS[i];
    datasets.push({
      label: `Setup ${color.label}`,
      data: STAT_KEYS.map(k => slot.stats[k]),
      backgroundColor: color.bgFaint,
      borderColor: color.border,
      borderWidth: 2,
      pointBackgroundColor: color.border,
      pointRadius: 3,
      pointHoverRadius: 5
    });
  });

  const isDark = document.documentElement.dataset.theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const labelColor = isDark ? '#9ba3b5' : '#555e70';

  if (comparisonRadarChart) {
    comparisonRadarChart.data.datasets = datasets;
    comparisonRadarChart.options.scales.r.grid.color = gridColor;
    comparisonRadarChart.options.scales.r.angleLines.color = gridColor;
    comparisonRadarChart.options.scales.r.pointLabels.color = labelColor;
    comparisonRadarChart.update('active');
    return;
  }

  comparisonRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: STAT_LABELS_FULL,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            color: labelColor,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 25, display: false },
          grid: { color: gridColor, circular: true },
          angleLines: { color: gridColor },
          pointLabels: {
            font: { family: "'JetBrains Mono', monospace", size: 10, weight: 500 },
            color: labelColor
          }
        }
      },
      animation: { duration: 600, easing: 'easeOutQuart' }
    }
  });
}

function renderComparisonDeltas() {
  const container = $('#comparison-deltas');
  const validSlots = comparisonSlots.filter(s => s.stats);
  if (validSlots.length < 2) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  for (let i = 1; i < validSlots.length; i++) {
    const base = validSlots[0];
    const comp = validSlots[i];
    const baseColor = SLOT_COLORS[comparisonSlots.indexOf(base)];
    const compColor = SLOT_COLORS[comparisonSlots.indexOf(comp)];

    html += `<div class="delta-group">
      <div class="delta-title">Setup ${compColor.label} vs Setup ${baseColor.label}</div>
      ${STAT_KEYS.map((key, j) => {
        const diff = comp.stats[key] - base.stats[key];
        const cls = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';
        const sign = diff > 0 ? '+' : '';
        return `<div class="delta-item">
          <span class="delta-label">${STAT_LABELS[j]}</span>
          <span class="delta-value ${cls}">${sign}${diff}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  container.innerHTML = html;
}

// ============================================
// PRESETS
// ============================================

function loadPreset(presetId) {
  switch (presetId) {
    case 'confidential-sync-pa100':
      $('#select-racquet').value = 'babolat-pure-aero-100-2023';
      showFrameSpecs(RACQUETS.find(r => r.id === 'babolat-pure-aero-100-2023'));
      setHybridMode(true);
      $('#select-string-mains').value = 'solinco-confidential-16';
      populateGaugeDropdown($('#select-gauge-mains'), 'solinco-confidential-16');
      $('#input-tension-mains').value = 55;
      $('#select-string-crosses').value = 'restring-sync';
      populateGaugeDropdown($('#select-gauge-crosses'), 'restring-sync');
      $('#input-tension-crosses').value = 53;
      break;

    case 'gut-rpm-pa100':
      $('#select-racquet').value = 'babolat-pure-aero-100-2023';
      showFrameSpecs(RACQUETS.find(r => r.id === 'babolat-pure-aero-100-2023'));
      setHybridMode(true);
      $('#select-string-mains').value = 'babolat-vs-touch-16';
      populateGaugeDropdown($('#select-gauge-mains'), 'babolat-vs-touch-16');
      $('#input-tension-mains').value = 55;
      $('#select-string-crosses').value = 'babolat-rpm-blast-17';
      populateGaugeDropdown($('#select-gauge-crosses'), 'babolat-rpm-blast-17');
      $('#input-tension-crosses').value = 53;
      break;

    case 'confidential-speed-legend':
      $('#select-racquet').value = 'head-speed-mp-legend-2025';
      showFrameSpecs(RACQUETS.find(r => r.id === 'head-speed-mp-legend-2025'));
      setHybridMode(false);
      $('#select-string-full').value = 'solinco-confidential-16';
      populateGaugeDropdown($('#select-gauge-full'), 'solinco-confidential-16');
      $('#input-tension-full').value = 55;
      break;
  }

  renderDashboard();
}

function setHybridMode(isHybrid) {
  if (isHybrid) {
    $('#btn-full').classList.remove('active');
    $('#btn-hybrid').classList.add('active');
    $('#full-bed-config').classList.add('hidden');
    $('#hybrid-config').classList.remove('hidden');
  } else {
    $('#btn-full').classList.add('active');
    $('#btn-hybrid').classList.remove('active');
    $('#full-bed-config').classList.remove('hidden');
    $('#hybrid-config').classList.add('hidden');
  }
}

// ============================================
// THEME TOGGLE
// ============================================

function toggleTheme() {
  const html = document.documentElement;
  const current = html.dataset.theme;
  html.dataset.theme = current === 'dark' ? 'light' : 'dark';

  // Update charts
  if (currentRadarChart) {
    const setup = getCurrentSetup();
    if (setup) {
      const stats = predictSetup(setup.racquet, setup.stringConfig);
      renderRadarChart(stats);
    }
  }
  if (comparisonRadarChart) {
    updateComparisonRadar();
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function init() {
  // Populate dropdowns
  populateRacquetDropdown($('#select-racquet'));
  populateStringDropdown($('#select-string-full'));
  populateStringDropdown($('#select-string-mains'));
  populateStringDropdown($('#select-string-crosses'));

  // Frame selector
  $('#select-racquet').addEventListener('change', (e) => {
    const r = RACQUETS.find(x => x.id === e.target.value);
    showFrameSpecs(r);
    renderDashboard();
  });

  // String selectors
  $('#select-string-full').addEventListener('change', (e) => {
    populateGaugeDropdown($('#select-gauge-full'), e.target.value);
    renderDashboard();
  });
  $('#select-string-mains').addEventListener('change', (e) => {
    populateGaugeDropdown($('#select-gauge-mains'), e.target.value);
    renderDashboard();
  });
  $('#select-string-crosses').addEventListener('change', (e) => {
    populateGaugeDropdown($('#select-gauge-crosses'), e.target.value);
    renderDashboard();
  });

  // Tension inputs
  $('#input-tension-full').addEventListener('input', renderDashboard);
  $('#input-tension-mains').addEventListener('input', renderDashboard);
  $('#input-tension-crosses').addEventListener('input', renderDashboard);

  // String mode toggle
  $('#btn-full').addEventListener('click', () => {
    setHybridMode(false);
    renderDashboard();
  });
  $('#btn-hybrid').addEventListener('click', () => {
    setHybridMode(true);
    renderDashboard();
  });

  // Presets
  $$('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => loadPreset(btn.dataset.preset));
  });

  // Comparison
  $('#btn-toggle-comparison').addEventListener('click', toggleComparisonMode);
  $('#btn-add-slot').addEventListener('click', addComparisonSlot);
  $('#btn-exit-comparison').addEventListener('click', toggleComparisonMode);

  // Theme
  $('#btn-theme').addEventListener('click', toggleTheme);
}

document.addEventListener('DOMContentLoaded', init);
