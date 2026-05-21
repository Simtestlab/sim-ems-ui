// Realistic, stateful day-simulation for an EMS site.
//
// Replaces the old stateless trigonometric noise with a small physics model:
//  - Solar follows a clear-sky Gaussian curve attenuated by smooth "cloud cover"
//    (a seeded 1D random walk) and derated by panel temperature.
//  - Building load follows a commercial occupancy profile.
//  - The BESS is stateful: it charges on excess solar and discharges into a
//    deficit, bounded by inverter power, capacity and State of Charge.

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function formatTimeLabel(hour: number) {
  const whole = Math.floor(hour);
  const minutes = Math.round((hour - whole) * 60);
  return `${String(whole).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function buildHours(step = 0.25) {
  const hours: number[] = [];
  for (let h = 0; h < 24; h += step) hours.push(Number(h.toFixed(2)));
  hours.push(23);
  return hours;
}

// --- system parameters ------------------------------------------------------

const SUNRISE = 6.0;
const SUNSET = 18.5;

const SOLAR_PEAK_KW = 170; // plant clear-sky AC output at solar noon
const PEAK_IRRADIANCE = 700; // W/m² at solar noon, clear sky
const BRANCH_PEAK_CURRENT = 6.0; // A per string at full irradiance

const LOAD_BASE_KW = 16; // overnight commercial base load
const LOAD_PEAK_KW = 78; // afternoon occupancy peak

const BESS_CAPACITY_KWH = 200; // usable energy capacity
const BESS_MAX_POWER_KW = 60; // inverter charge/discharge limit
const BESS_SOC_MIN = 10; // % — safe minimum, stop discharging
const BESS_SOC_MAX = 100; // % — stop charging above this
const BESS_SOC_START = 30; // % — SoC at midnight
const BESS_CHARGE_EFF = 0.97; // energy stored / energy drawn
const BESS_DISCHARGE_EFF = 0.97; // energy delivered / energy released

// --- low-level helpers ------------------------------------------------------

// Deterministic PRNG (mulberry32) so a given seed always yields the same day.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Clear-sky generation factor (0..1): a true Gaussian centred on solar noon,
// rebased so it reaches exactly zero at sunrise/sunset.
export function clearSkyFactor(hour: number, sunrise = SUNRISE, sunset = SUNSET) {
  if (hour <= sunrise || hour >= sunset) return 0;
  const solarNoon = (sunrise + sunset) / 2;
  const halfWidth = (sunset - sunrise) / 2;
  const sigma = halfWidth / 2.2;
  const gauss = Math.exp(-Math.pow(hour - solarNoon, 2) / (2 * sigma * sigma));
  const edge = Math.exp(-Math.pow(halfWidth, 2) / (2 * sigma * sigma));
  return clamp((gauss - edge) / (1 - edge), 0, 1);
}

// Smooth "cloud cover" series in (0..1], 1 = clear sky. A mean-reverting random
// walk with momentum produces deep, localised dips rather than constant jitter.
function buildCloudSeries(seed: number, count: number) {
  const rng = mulberry32(seed);
  const series: number[] = [];
  let value = 0.9;
  let velocity = 0;
  for (let i = 0; i < count; i++) {
    velocity += (rng() - 0.5) * 0.09; // random impulse
    velocity *= 0.8; // damping → smooth, low-frequency drift
    value += velocity;
    value += (0.9 - value) * 0.05; // mean reversion toward mostly-clear
    value = clamp(value, 0.2, 1);
    series.push(value);
  }
  return series;
}

// Ambient temperature (°C): sinusoidal, coolest before dawn, warmest mid-afternoon.
function ambientTemp(hour: number) {
  return 29 + 7 * Math.cos(((hour - 15) / 24) * 2 * Math.PI);
}

// PV temperature derating factor (<= 1): panels lose efficiency when hot.
function tempDerate(generationFactor: number, hour: number) {
  const cellTemp = ambientTemp(hour) + generationFactor * 30; // irradiance heating
  const lossPerDeg = 0.004; // ~0.4 %/°C above the 25°C reference
  return clamp(1 - lossPerDeg * Math.max(0, cellTemp - 25), 0.85, 1);
}

// Commercial building load (kW): flat overnight base, occupancy ramp from
// ~07:00, afternoon peak near 14:00, ramp down by ~19:00.
function commercialLoad(hour: number) {
  const rampUp = smoothstep(6.5, 9.0, hour);
  const rampDown = 1 - smoothstep(17.0, 20.0, hour);
  const occupied = rampUp * rampDown;
  const afternoon = Math.exp(-Math.pow(hour - 14, 2) / (2 * 3 * 3));
  const shape = 0.72 + 0.28 * afternoon; // afternoon-weighted occupancy
  return LOAD_BASE_KW + occupied * shape * (LOAD_PEAK_KW - LOAD_BASE_KW);
}

// --- core profile -----------------------------------------------------------

export interface SimSample {
  hour: number;
  /** Combined attenuation: clear-sky × cloud cover, in 0..1. */
  generationFactor: number;
  /** Irradiance at the plane of array, W/m². */
  irradiance: number;
  /** Plant solar generation, kW. */
  solarGeneration: number;
  /** Building electrical load, kW. */
  buildingLoad: number;
}

// Per-step solar + load for an ordered list of hours.
function buildProfile(seed: number, hours: number[]): SimSample[] {
  const cloud = buildCloudSeries(seed, hours.length);
  return hours.map((hour, i) => {
    const clearSky = clearSkyFactor(hour);
    const generationFactor = clearSky * cloud[i];
    const solarGeneration = generationFactor * tempDerate(generationFactor, hour) * SOLAR_PEAK_KW;
    return {
      hour,
      generationFactor,
      irradiance: clamp(generationFactor * PEAK_IRRADIANCE, 0, PEAK_IRRADIANCE),
      solarGeneration: clamp(solarGeneration, 0, SOLAR_PEAK_KW),
      buildingLoad: commercialLoad(hour),
    };
  });
}

export interface BessReading {
  /** ISO-8601 timestamp for the interval. */
  timestamp: string;
  /** Plant solar generation, kW. */
  solarGeneration: number;
  /** Building electrical load, kW. */
  buildingLoad: number;
  /** BESS power, kW. Positive = discharging (supplying), negative = charging. */
  bessPower: number;
  /** BESS State of Charge, %. */
  bessSoC: number;
}

/**
 * Simulate a full 24-hour day at fixed intervals, running the BESS as a stateful
 * device that charges on excess solar and discharges into a deficit.
 *
 * @param seed         deterministic seed — same seed yields the same day
 * @param date         calendar day the timestamps belong to
 * @param stepMinutes  interval length (default 15 minutes)
 */
export function generateSimulationDay(seed: number, date: Date, stepMinutes = 15): BessReading[] {
  const hours: number[] = [];
  for (let m = 0; m < 24 * 60; m += stepMinutes) hours.push(m / 60);

  const profile = buildProfile(seed, hours);
  const dt = stepMinutes / 60; // hours per step

  // SoC tracked as stored energy (kWh); carried forward across steps.
  let socKWh = (BESS_SOC_START / 100) * BESS_CAPACITY_KWH;
  const socMinKWh = (BESS_SOC_MIN / 100) * BESS_CAPACITY_KWH;
  const socMaxKWh = (BESS_SOC_MAX / 100) * BESS_CAPACITY_KWH;

  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return profile.map((sample, i) => {
    const netPower = sample.solarGeneration - sample.buildingLoad; // kW
    let bessPower = 0; // + discharge, − charge

    if (netPower > 0) {
      // Excess solar → charge. Bounded by inverter rating and free capacity.
      const headroomKWh = socMaxKWh - socKWh;
      const chargeKW = Math.min(netPower, BESS_MAX_POWER_KW, headroomKWh / (dt * BESS_CHARGE_EFF));
      const charge = Math.max(0, chargeKW);
      socKWh += charge * dt * BESS_CHARGE_EFF;
      bessPower = -charge; // drawing from the system
    } else if (netPower < 0) {
      // Deficit → discharge. Bounded by inverter rating and energy above SoC min.
      const availableKWh = socKWh - socMinKWh;
      const dischargeKW = Math.min(-netPower, BESS_MAX_POWER_KW, (availableKWh * BESS_DISCHARGE_EFF) / dt);
      const discharge = Math.max(0, dischargeKW);
      socKWh -= (discharge * dt) / BESS_DISCHARGE_EFF;
      bessPower = discharge; // supplying the system
    }

    socKWh = clamp(socKWh, socMinKWh, socMaxKWh);

    const ts = new Date(dayStart);
    ts.setMinutes(Math.round(sample.hour * 60));

    return {
      timestamp: ts.toISOString(),
      solarGeneration: Number(sample.solarGeneration.toFixed(2)),
      buildingLoad: Number(sample.buildingLoad.toFixed(2)),
      bessPower: Number(bessPower.toFixed(2)),
      bessSoC: Number(((socKWh / BESS_CAPACITY_KWH) * 100).toFixed(2)),
    };
  });
}

// --- chart-facing data (existing contract) ----------------------------------

/**
 * Day data shaped for the Live Monitoring charts. Same return shape as before,
 * but the values now come from the clear-sky + cloud-cover model rather than
 * stateless trigonometric noise.
 */
export function generateDayData(seed: number, date: Date, branchCount = 10, step = 0.25) {
  const hours = buildHours(step);
  const profile = buildProfile(seed, hours);

  const todayLabel = date.toDateString();
  const now = new Date();
  const isToday = now.toDateString() === todayLabel;
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const availableHour = isToday ? clamp(currentHour, 0.25, 23) : 23;

  // PV inverter readings derived from the smooth generation factor.
  const powerSamples = profile.map((s) => {
    const ratedAC = 86 + (seed % 8); // per-inverter rating, kW
    const activePower = clamp(s.generationFactor * tempDerate(s.generationFactor, s.hour) * ratedAC, 0, 98);
    const dcPower = clamp(activePower / 0.97 + s.generationFactor * 1.6, 0, 100);
    return { hour: s.hour, activePower, dcPower, intensity: s.irradiance };
  });

  const branchPages = [];
  for (let b = 0; b < branchCount; b++) {
    const branchDerate = 0.96 + ((seed + b * 31) % 9) * 0.008; // slight per-string spread
    const points = profile.map((s) => ({
      hour: s.hour,
      current: clamp(s.generationFactor * (BRANCH_PEAK_CURRENT - b * 0.05) * branchDerate, 0, 7),
    }));
    branchPages.push({ label: `Branch ${String(b + 1).padStart(2, "0")}`, points });
  }

  const labels = hours.map((h) => formatTimeLabel(h));
  const active = powerSamples.map((s) => (s.hour <= availableHour ? s.activePower : null));
  const dc = powerSamples.map((s) => (s.hour <= availableHour ? s.dcPower : null));
  const intensity = powerSamples.map((s) => (s.hour <= availableHour ? s.intensity : null));
  const branches = branchPages.map((br) => br.points.map((p) => (p.hour <= availableHour ? p.current : null)));

  return {
    labels,
    hours,
    active,
    dc,
    intensity,
    branches,
    availableHour,
  };
}
