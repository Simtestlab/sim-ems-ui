export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function solarFactor(hour: number) {
  const sunrise = 6;
  const sunset = 18.4;
  if (hour <= sunrise || hour >= sunset) return 0;
  const progress = (hour - sunrise) / (sunset - sunrise);
  return Math.pow(Math.sin(progress * Math.PI), 1.18);
}

export function oscillation(seed: number, hour: number, channel: number) {
  return (
    Math.sin(hour * 1.63 + seed * 0.0019 + channel) +
    Math.cos(hour * 0.71 + seed * 0.0008 + channel * 0.7) * 0.45
  );
}

export function buildHours(step = 0.25) {
  const hours: number[] = [];
  for (let h = 0; h < 24; h += step) hours.push(Number(h.toFixed(2)));
  hours.push(23);
  return hours;
}

export function formatTimeLabel(hour: number) {
  const whole = Math.floor(hour);
  const minutes = Math.round((hour - whole) * 60);
  return `${String(whole).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function generateDayData(seed: number, date: Date, branchCount = 10, step = 0.25) {
  const hours = buildHours(step);
  const todayLabel = date.toDateString();
  const now = new Date();
  const isToday = now.toDateString() === todayLabel;
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const availableHour = isToday ? clamp(currentHour, 0.25, 23) : 23;

  const powerSamples: { hour: number; activePower: number; dcPower: number; intensity: number }[] = hours.map((hour) => {
    const solar = solarFactor(hour);
    const activePower = clamp(solar * (79 + (seed % 7)) + oscillation(seed, hour, 0.2) * 1.6, 0, 98);
    const dcPower = clamp(activePower + 1.8 + solar * 2.3 + oscillation(seed, hour, 1.1) * 1.2, 0, 100);
    const intensity = clamp(solar * (640 + (seed % 33)) + oscillation(seed, hour, 1.8) * 12, 0, 700);
    return { hour, activePower, dcPower, intensity };
  });

  const branchPages: { label: string; points: { hour: number; current: number }[] }[] = [];
  for (let b = 0; b < branchCount; b++) {
    const points = hours.map((hour) => {
      const solar = solarFactor(hour);
      const current = clamp(solar * (6.0 - b * 0.05) + oscillation(seed + b * 97, hour, b) * 0.12, 0, 7);
      return { hour, current };
    });
    branchPages.push({ label: `Branch ${String(b + 1).padStart(2, "0")}`, points });
  }

  const labels = hours.map((h) => formatTimeLabel(h));
  const active = hours.map((h) => (h <= availableHour ? powerSamples.find((s) => s.hour === h)!.activePower : null));
  const dc = hours.map((h) => (h <= availableHour ? powerSamples.find((s) => s.hour === h)!.dcPower : null));
  const intensity = hours.map((h) => (h <= availableHour ? powerSamples.find((s) => s.hour === h)!.intensity : null));

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
