export type Point = { x: number; y: number }

export type LineSeries = {
  label: string
  color: string
  points: Point[]
  fillId?: string
  muted?: boolean
}

export type TooltipItem = {
  label: string
  value: string
  color: string
}

export type Metric = {
  label: string
  value: string
}

export type PowerSample = {
  hour: number
  activePower: number
  dcPower: number
  intensity: number
}

export type CurrentSample = {
  hour: number
  current: number
}

export type BranchPage = {
  plottedSeries: LineSeries[]
  legendSeries: LineSeries[]
}

export type TelemetrySnapshot = {
  powerSeries: LineSeries[]
  powerSamples: PowerSample[]
  branchPages: BranchPage[]
  metrics: Metric[]
  latestHour: number
}

export const TIME_TICKS = [0, 3, 6, 9, 12, 15, 18, 21, 23]

export const BRANCH_COLORS = ['#17a86b', '#36dff2', '#f4c36f', '#9ec5ff', '#ffb1d4']

export function hslToHex(h: number, s: number, l: number) {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const color = l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function getBranchColor(index: number) {
  if (index < BRANCH_COLORS.length) return BRANCH_COLORS[index]
  const h = (index * 47) % 360
  return hslToHex(h, 70, 52)
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function hashString(input: string) {
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

export function formatDateLabel(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatHeaderDateTime(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`
}

export function formatTimeLabel(hour: number) {
  const wholeHour = Math.floor(hour)
  const minutes = Math.floor((hour - wholeHour) * 60)

  return `${String(wholeHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function solarFactor(hour: number) {
  const sunrise = 6
  const sunset = 18.4

  if (hour <= sunrise || hour >= sunset) {
    return 0
  }

  const progress = (hour - sunrise) / (sunset - sunrise)
  return Math.pow(Math.sin(progress * Math.PI), 1.18)
}

export function oscillation(seed: number, hour: number, channel: number) {
  return Math.sin(hour * 1.63 + seed * 0.0019 + channel) + Math.cos(hour * 0.71 + seed * 0.0008 + channel * 0.7) * 0.45
}

export function buildHours(availableHour: number, step: number) {
  const hours: number[] = []
  let current = 0

  while (current < availableHour) {
    hours.push(Number(current.toFixed(2)))
    current += step
  }

  hours.push(Number(availableHour.toFixed(2)))

  return hours
}

export function createCurrentSamples(hours: number[], seed: number, branchOffset: number, limit: number) {
  return hours.map((hour) => {
    const solar = solarFactor(hour)
    const current = clamp(
      solar * (limit - branchOffset * 0.15) + oscillation(seed + branchOffset * 97, hour, branchOffset) * 0.16,
      0,
      limit,
    )

    return {
      hour,
      current,
    }
  })
}

export function closestByHour<T extends { hour: number }>(samples: T[], targetHour: number | null) {
  if (samples.length === 0 || targetHour === null) {
    return undefined
  }

  const first = samples[0]
  const last = samples[samples.length - 1]

  if (targetHour <= first.hour) {
    return first
  }

  if (targetHour >= last.hour) {
    return last
  }

  return samples.reduce((closest, sample) => {
    return Math.abs(sample.hour - targetHour) < Math.abs(closest.hour - targetHour) ? sample : closest
  }, first)
}

export function buildPolyline(points: Point[], width: number, height: number, xMax: number, yMax: number) {
  return points
    .map((point) => {
      const x = (point.x / xMax) * width
      const y = height - (point.y / yMax) * height
      return `${x},${y}`
    })
    .join(' ')
}

export function buildTelemetrySnapshot(deviceId: string, selectedDate: string, now: Date): TelemetrySnapshot {
  const todayLabel = formatDateLabel(now)
  const seed = hashString(`${deviceId}:${selectedDate}`)
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const availableHour = selectedDate === todayLabel ? clamp(currentHour, 0.25, 23) : 23
  const hours = buildHours(availableHour, 0.25)

  const powerSamples = hours.map((hour) => {
    const solar = solarFactor(hour)
    const activePower = clamp(solar * (79 + (seed % 7)) + oscillation(seed, hour, 0.2) * 1.6, 0, 98)
    const dcPower = clamp(activePower + 1.8 + solar * 2.3 + oscillation(seed, hour, 1.1) * 1.2, 0, 100)
    const intensity = clamp(solar * (640 + (seed % 33)) + oscillation(seed, hour, 1.8) * 12, 0, 700)

    return {
      hour,
      activePower,
      dcPower,
      intensity,
    }
  })

  const latestPower = powerSamples[powerSamples.length - 1]

  const powerSeries: LineSeries[] = [
    {
      label: 'Active Power',
      color: '#28b3d6',
      points: powerSamples.map((sample) => ({ x: sample.hour, y: sample.activePower })),
      fillId: 'power-fill-active',
    },
    {
      label: 'DC Power',
      color: '#ea5aad',
      points: powerSamples.map((sample) => ({ x: sample.hour, y: sample.dcPower })),
      fillId: 'power-fill-dc',
    },
    {
      label: 'Intensity',
      color: '#ffa42b',
      points: powerSamples.map((sample) => ({ x: sample.hour, y: sample.intensity / 7 })),
      fillId: 'power-fill-intensity',
    },
  ]

  const totalBranches = 10
  const pageSize = 4
  const branchSamples = Array.from({ length: totalBranches }, (_, i) => {
    const branchNumber = i + 1
    const currentSamples = createCurrentSamples(hours, seed + i * 97, branchNumber, 6.9)
    return {
      label: `Branch ${String(branchNumber).padStart(2, '0')}`,
      color: getBranchColor(i) ?? '#cfd3d9',
      points: currentSamples.map((sample) => ({ x: sample.hour, y: sample.current })),
      rawSamples: currentSamples,
      muted: i >= 3,
    }
  })

  const branchPages: BranchPage[] = []
  for (let p = 0; p < Math.ceil(totalBranches / pageSize); p += 1) {
    const start = p * pageSize
    const pageSlice = branchSamples.slice(start, start + pageSize)
    branchPages.push({
      plottedSeries: pageSlice.map((series, index) => ({
        label: series.label,
        color: series.color,
        points: series.points,
        fillId: `current-branch-fill-${start + index}`,
      })),
      legendSeries: pageSlice.map((series, index) => ({
        label: series.label,
        color: series.color,
        points: series.points,
        muted: series.muted,
        fillId: `current-branch-fill-${start + index}`,
      })),
    })
  }

  const activeCurrentPage = branchPages[0].plottedSeries
  const currentSamples = activeCurrentPage.map((series) => series.points[series.points.length - 1]?.y ?? 0)

  const metrics: Metric[] = [
    { label: 'DC Voltage', value: `${(620 + latestPower.dcPower * 0.4).toFixed(1)}V` },
    { label: 'DC Current', value: `${(currentSamples.reduce((sum, value) => sum + value, 0) + latestPower.dcPower * 0.65).toFixed(1)}A` },
    { label: 'AC Voltage', value: `${(392 + latestPower.activePower * 0.07).toFixed(1)}V` },
    { label: 'AC Current', value: `${(96 + latestPower.activePower * 0.36).toFixed(0)}A` },
    { label: 'Grid Frequency', value: `${(49.97 + solarFactor(availableHour) * 0.05).toFixed(2)}Hz` },
    { label: 'Internal Temperature', value: `${(35.4 + solarFactor(availableHour) * 8.6).toFixed(1)}°C` },
    { label: 'Power Factor', value: `${(0.978 + solarFactor(availableHour) * 0.016).toFixed(3)}` },
    { label: 'Conversion Efficiency', value: `${(96.7 + solarFactor(availableHour) * 1.1).toFixed(1)}%` },
  ]

  return {
    powerSeries,
    powerSamples,
    branchPages,
    metrics,
    latestHour: latestPower.hour,
  }
}
