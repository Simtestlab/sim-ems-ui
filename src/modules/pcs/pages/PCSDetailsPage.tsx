"use client"

import { CalendarDays, ChevronLeft } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

/* ─── Types ─────────────────────────────────────────────────────────── */

type Point = { x: number; y: number }

type LineSeries = {
  label: string
  color: string
  points: Point[]
  fillId?: string
  dashed?: boolean
  muted?: boolean
}

type TooltipItem = { label: string; value: string; color: string }

type PCSSample = {
  hour: number
  bessPower: number
  chargeEnergy: number
  dischargeEnergy: number
  soc: number
}

type PCSStats = {
  cumulativeCharge: number
  chargeCycles: number
  cumulativeDischarge: number
  dischargeCycles: number
}

type PCSRealtime = {
  totalVoltage: number
  totalCurrent: number
  totalActivePower: number
  totalReactivePower: number
  totalApparentPower: number
  totalPowerFactor: number
  soc: number
  phaseAVoltage: number
  phaseBVoltage: number
  phaseCVoltage: number
  phaseACurrent: number
  phaseBCurrent: number
  phaseCCurrent: number
  moduleTemperature: number
  dcBusVoltage: number
}

type PCSTelemetry = {
  series: LineSeries[]
  samples: PCSSample[]
  stats: PCSStats
  realtime: PCSRealtime
  latestHour: number
}

/* ─── Constants ──────────────────────────────────────────────────────── */

const TIME_TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]

const PCS_STATUSES = [
  { label: 'Running', active: true },
  { label: 'Communication Normal', active: true },
  { label: 'Alarm', active: false },
  { label: 'Fault', active: false },
  { label: 'Contactor Closed', active: true },
]

/* ─── Helpers ────────────────────────────────────────────────────────── */

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function formatDateLabel(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatTimeLabel(hour: number) {
  const h = Math.floor(hour)
  const m = Math.floor((hour - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatHeaderDateTime(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${h}:${m}:${s}`
}

function buildHours(availableHour: number, step: number) {
  const hours: number[] = []
  let current = 0
  while (current < availableHour) {
    hours.push(Number(current.toFixed(2)))
    current += step
  }
  hours.push(Number(availableHour.toFixed(2)))
  return hours
}

function closestByHour<T extends { hour: number }>(samples: T[], targetHour: number | null): T | undefined {
  if (!samples.length || targetHour === null) return undefined
  const first = samples[0]
  const last = samples[samples.length - 1]
  if (targetHour <= first.hour) return first
  if (targetHour >= last.hour) return last
  return samples.reduce((closest, s) =>
    Math.abs(s.hour - targetHour) < Math.abs(closest.hour - targetHour) ? s : closest,
    first,
  )
}

function buildPolyline(points: Point[], plotWidth: number, plotHeight: number, xMax: number, yMax: number) {
  return points
    .map((p) => {
      const x = (p.x / xMax) * plotWidth
      const y = plotHeight - (p.y / yMax) * plotHeight
      return `${x},${y}`
    })
    .join(' ')
}

/* ─── Telemetry Simulation ────────────────────────────────────────────── */

function buildPCSTelemetry(deviceId: string, selectedDate: string, now: Date): PCSTelemetry {
  const todayLabel = formatDateLabel(now)
  const seed = hashString(`${deviceId}:${selectedDate}`)
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const availableHour = selectedDate === todayLabel ? clamp(currentHour, 0.25, 23) : 23
  const hours = buildHours(availableHour, 0.25)

  const batteryCapacity = 250
  const chargeStart = 7.25 + (seed % 5) * 0.1
  const chargeEnd = 9.75 + (seed % 5) * 0.1
  const peakCharge = clamp(28 + (seed % 18), 20, 44)

  let soc = 5 + (seed % 8)           // starts low, rises as battery charges
  let chargeEnergy = 0
  let dischargeEnergy = 0

  const samples: PCSSample[] = hours.map((hour) => {
    let bessPower = 0

    if (hour >= chargeStart && hour <= chargeEnd) {
      const progress = (hour - chargeStart) / (chargeEnd - chargeStart)
      const curve = Math.sin(progress * Math.PI)
      const noise = Math.sin(hour * 3.7 + seed * 0.00031) * 2.2
      bessPower = clamp(curve * peakCharge + Math.max(0, noise), 0, 125)
    } else if (hour > chargeEnd) {
      const decay = Math.exp(-(hour - chargeEnd) * 0.8)
      bessPower = clamp(peakCharge * 0.22 * decay, 0, 125)
    }

    const dt = 0.25
    if (bessPower > 0) {
      dischargeEnergy += bessPower * dt
      soc = Math.min(95, soc + (bessPower * dt / batteryCapacity) * 100)
    }

    return { hour, bessPower, chargeEnergy, dischargeEnergy, soc }
  })

  const latestSample = samples[samples.length - 1]
  const latestHour = latestSample.hour
  const currentSoc = latestSample.soc
  const activePower = latestSample.bessPower

  const stats: PCSStats = {
    cumulativeCharge: 8000 + (seed % 500) + ((seed >> 4) % 100) * 0.1,
    chargeCycles: 230 + (seed % 30),
    cumulativeDischarge: 7500 + ((seed >> 2) % 600) + ((seed >> 6) % 100) * 0.1,
    dischargeCycles: 220 + ((seed >> 3) % 30),
  }

  const voltage = 395 + (seed % 10) + Math.sin(latestHour * 0.5) * 2
  const current = activePower > 0 ? activePower * 1000 / (voltage * 1.732) : 0

  const realtime: PCSRealtime = {
    totalVoltage: Number(voltage.toFixed(1)),
    totalCurrent: Number((current + 0.3).toFixed(1)),
    totalActivePower: Number(activePower.toFixed(2)),
    totalReactivePower: Number((activePower * 0.11).toFixed(1)),
    totalApparentPower: Number((activePower * 1.006).toFixed(2)),
    totalPowerFactor: Number((0.990 + (seed % 8) * 0.001).toFixed(3)),
    soc: Number(currentSoc.toFixed(1)),
    phaseAVoltage: Number((voltage + 1.2).toFixed(0)),
    phaseBVoltage: Number((voltage + 2.5).toFixed(0)),
    phaseCVoltage: Number((voltage - 0.7).toFixed(1)),
    phaseACurrent: Number((current * 1.01).toFixed(1)),
    phaseBCurrent: Number((current * 0.99).toFixed(1)),
    phaseCCurrent: Number((current * 1.03).toFixed(1)),
    moduleTemperature: Number((30 + (seed % 8) + activePower * 0.04).toFixed(1)),
    dcBusVoltage: Number((780 + (seed % 20) + activePower * 0.1).toFixed(0)),
  }

  // SOC points are normalized to 0–50 scale for the 0–50 plot (100% → 50 units)
  // Render order: Discharge Energy first (behind), then BESS Power (in front), then lines on top
  const series: LineSeries[] = [
    {
      label: 'Discharge Energy',
      color: '#1d4ed8',
      points: samples.map((s) => ({ x: s.hour, y: s.dischargeEnergy })),
      fillId: 'pcs-fill-discharge',
    },
    {
      label: 'BESS Power',
      color: '#4a8ff7',
      points: samples.map((s) => ({ x: s.hour, y: s.bessPower })),
      fillId: 'pcs-fill-bess',
    },
    {
      label: 'Charge Energy',
      color: '#f5a623',
      points: samples.map((s) => ({ x: s.hour, y: s.chargeEnergy })),
    },
    {
      label: 'SOC (state Of Charge)',
      color: '#22c55e',
      // Normalize % → 0–50 plot units so it fits on the kW axis
      points: samples.map((s) => ({ x: s.hour, y: s.soc / 2 })),
    },
  ]

  return { series, samples, stats, realtime, latestHour }
}

/* ─── Inner components ───────────────────────────────────────────────── */

function DateControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="inline-flex h-10 min-w-[188px] cursor-pointer items-center justify-center gap-3 rounded-[8px] border border-[#d9e2ee] bg-white px-4 text-[12px] font-medium text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CalendarDays className="h-4 w-4 text-[#adb8c7]" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent text-[12px] font-medium text-[#34455d] outline-none"
      />
    </label>
  )
}

function ChartLegend({
  series,
  visibleMap,
  onToggle,
  onHover,
}: {
  series: LineSeries[]
  visibleMap?: Record<string, boolean>
  onToggle?: (label: string) => void
  onHover?: (label: string | null) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-8 text-[13px] text-[#31445f]">
      {series.map((item) => {
        const visible = visibleMap ? visibleMap[item.label] !== false : true
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onToggle?.(item.label)}
            onMouseEnter={() => onHover?.(item.label)}
            onMouseLeave={() => onHover?.(null)}
            className={`flex items-center gap-2 transition-opacity focus:outline-none ${!visible ? 'opacity-40' : ''}`}
          >
            <span className="relative inline-flex h-4 w-8 items-center justify-center">
              <span
                className="absolute inset-x-0 top-1/2 h-[2.5px] -translate-y-1/2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span
                className="relative h-[13px] w-[13px] rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: item.color }}
              />
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function BESSChartPlot({
  series,
  hoverX,
  hoverY,
  hoverBottomLabel,
  hoverLeftLabel,
  tooltipTitle,
  tooltipItems,
  onHoverHourChange,
  hoveredSeriesLabel,
  onHoverSeriesChange,
}: {
  series: LineSeries[]
  hoverX?: number
  hoverY?: number
  hoverBottomLabel?: string
  hoverLeftLabel?: string
  tooltipTitle?: string
  tooltipItems?: TooltipItem[]
  onHoverHourChange?: (hour: number | null) => void
  hoveredSeriesLabel?: string | null
  onHoverSeriesChange?: (label: string | null) => void
}) {
  // SVG coordinate system (viewport units, rendered at actual container size via preserveAspectRatio=none)
  const width = 1200
  const height = 480
  const topPadding = 36
  const bottomPadding = 52
  const leftPadding = 68
  const rightPadding = 108 // wide enough for two right-axis columns
  const plotWidth = width - leftPadding - rightPadding
  const plotHeight = height - topPadding - bottomPadding
  const xMax = 23
  const yMax = 50 // kW / kWh scale; SOC is pre-divided by 2 to fit

  const Y_TICKS = [0, 10, 20, 30, 40, 50]
  const PCT_TICKS = [0, 20, 40, 60, 80, 100]

  const svgRef = useRef<SVGSVGElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null)
  const [clampedTooltipPos, setClampedTooltipPos] = useState<{ left: number; top: number } | null>(null)
  const [localHoveredLabel, setLocalHoveredLabel] = useState<string | null>(null)

  const hoverXPixel = hoverX === undefined ? null : leftPadding + (hoverX / xMax) * plotWidth
  const hoverYPixel = hoverY === undefined ? null : topPadding + (1 - hoverY / yMax) * plotHeight

  function updateTooltipFromEvent(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    setTooltipPos({
      left: clamp(event.clientX - bounds.left, 0, bounds.width),
      top: clamp(event.clientY - bounds.top, 0, bounds.height),
    })
  }

  function handlePointerMove(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = clamp(event.clientX - bounds.left, leftPadding, bounds.width - rightPadding)
    const progress = (x - leftPadding) / (bounds.width - leftPadding - rightPadding)
    const floatHour = clamp(progress * xMax, 0, xMax)

    if (!onHoverHourChange) {
      updateTooltipFromEvent(event)
      return
    }

    const snapIncrement = 0.25
    const nearest = Number(clamp(Math.round(floatHour / snapIncrement) * snapIncrement, 0, 23).toFixed(2))
    onHoverHourChange(nearest)

    // Highlight nearest series to cursor Y
    const rawY = clamp(event.clientY - bounds.top, topPadding, topPadding + plotHeight)
    const dataY = (1 - (rawY - topPadding) / plotHeight) * yMax

    let minDiff = Infinity
    let candidate: string | null = null
    for (const s of series) {
      const sample = s.points.find((p) => Math.abs(p.x - nearest) < 0.001)
      if (!sample) continue
      const diff = Math.abs(sample.y - dataY)
      if (diff < minDiff) {
        minDiff = diff
        candidate = s.label
      }
    }

    if (candidate && minDiff <= yMax * 0.15) {
      setLocalHoveredLabel(candidate)
      onHoverSeriesChange?.(candidate)
    } else {
      setLocalHoveredLabel(null)
      onHoverSeriesChange?.(null)
    }

    updateTooltipFromEvent(event)
  }

  function handleMouseLeave() {
    onHoverHourChange?.(null)
    setTooltipPos(null)
    setLocalHoveredLabel(null)
    onHoverSeriesChange?.(null)
  }

  useEffect(() => {
    if (hoverX === undefined || !svgRef.current) return
    const bounds = svgRef.current.getBoundingClientRect()
    const viewX = leftPadding + (hoverX / xMax) * plotWidth
    const viewY = hoverY === undefined ? topPadding : topPadding + (1 - hoverY / yMax) * plotHeight
    setTooltipPos({
      left: viewX * (bounds.width / width),
      top: viewY * (bounds.height / height),
    })
    // These consts never change; exhaustive-deps would be noise here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverX, hoverY])

  useLayoutEffect(() => {
    if (!tooltipPos || !svgRef.current) {
      setClampedTooltipPos(null)
      return
    }
    const cw = svgRef.current.getBoundingClientRect().width
    const ch = svgRef.current.getBoundingClientRect().height
    const tw = tooltipRef.current?.offsetWidth ?? 280
    const th = tooltipRef.current?.offsetHeight ?? 110
    const margin = 8
    const offset = 12

    let left = clamp(tooltipPos.left, margin + tw / 2, cw - margin - tw / 2)
    const topAbove = tooltipPos.top - offset - th
    const top = topAbove >= margin ? topAbove : Math.min(tooltipPos.top + offset, ch - margin - th)
    setClampedTooltipPos({ left, top })
  }, [tooltipPos, tooltipItems])

  return (
    <div className="relative h-full">
      <svg
        ref={svgRef}
        className="h-full w-full select-none"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        onDragStart={(e) => e.preventDefault()}
        onMouseMove={handlePointerMove}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: 'none', userSelect: 'none' }}
      >
        <defs>
          {series
            .filter((s): s is LineSeries & { fillId: string } => Boolean(s.fillId))
            .map((s) => (
              <linearGradient key={s.fillId} id={s.fillId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.24" />
                <stop offset="55%" stopColor={s.color} stopOpacity="0.08" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
        </defs>

        {/* Axis unit labels */}
        <text x={leftPadding - 10} y={22} fill="#6b7280" fontSize="13" fontWeight="600" textAnchor="end">kW</text>
        <text x={leftPadding + plotWidth + 10} y={22} fill="#6b7280" fontSize="13" fontWeight="600">kWh</text>
        <text x={leftPadding + plotWidth + 62} y={22} fill="#6b7280" fontSize="13" fontWeight="600">%</text>

        {/* Grid lines + tick labels */}
        {Y_TICKS.map((_, index) => {
          const y = topPadding + (index / (Y_TICKS.length - 1)) * plotHeight
          const kwVal = Y_TICKS[Y_TICKS.length - 1 - index]
          const pctVal = PCT_TICKS[PCT_TICKS.length - 1 - index]
          return (
            <g key={kwVal}>
              <line x1={leftPadding} x2={leftPadding + plotWidth} y1={y} y2={y} stroke="#e2eaf4" strokeWidth="1" />
              <text x={leftPadding - 8} y={y + 4.5} fill="#94a3b8" fontSize="13" textAnchor="end">{kwVal}</text>
              <text x={leftPadding + plotWidth + 8} y={y + 4.5} fill="#94a3b8" fontSize="13">{kwVal}</text>
              <text x={leftPadding + plotWidth + 60} y={y + 4.5} fill="#94a3b8" fontSize="13">{pctVal}</text>
            </g>
          )
        })}

        {/* Time axis ticks */}
        {TIME_TICKS.map((hour) => (
          <text
            key={hour}
            x={leftPadding + (hour / xMax) * plotWidth}
            y={height - 16}
            fill="#94a3b8"
            fontSize="13"
            textAnchor="middle"
          >
            {String(hour).padStart(2, '0')}:00
          </text>
        ))}

        {/* Series */}
        {series.map((item) => {
          const polylinePoints = buildPolyline(item.points, plotWidth, plotHeight, xMax, yMax)
          const first = item.points[0]
          const last = item.points[item.points.length - 1]
          const areaPath =
            item.fillId && first && last
              ? `M ${(first.x / xMax) * plotWidth},${plotHeight - (first.y / yMax) * plotHeight} ${polylinePoints
                .split(' ')
                .map((pt) => `L ${pt}`)
                .join(' ')} L ${(last.x / xMax) * plotWidth},${plotHeight} L ${(first.x / xMax) * plotWidth},${plotHeight} Z`
              : null

          const activeHovered = hoveredSeriesLabel ?? localHoveredLabel
          const isHighlighted = activeHovered ? activeHovered === item.label : null
          const strokeOpacity = activeHovered ? (isHighlighted ? 1 : 0.1) : item.muted ? 0.45 : 1
          const fillOpacity = activeHovered ? (isHighlighted ? 1 : 0.03) : 1
          const strokeWidth = activeHovered ? (isHighlighted ? 3.5 : 1.5) : 2.5
          const dashArray = item.dashed ? '7 3' : undefined

          return (
            <g key={item.label} transform={`translate(${leftPadding} ${topPadding})`}>
              {areaPath ? (
                <path d={areaPath} fill={`url(#${item.fillId})`} style={{ opacity: fillOpacity }} />
              ) : null}
              <polyline
                fill="none"
                points={polylinePoints}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashArray}
                opacity={strokeOpacity}
              />
            </g>
          )
        })}

        {/* Hover crosshair */}
        {hoverXPixel !== null ? (
          <>
            <line
              x1={hoverXPixel} x2={hoverXPixel}
              y1={topPadding} y2={topPadding + plotHeight}
              stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5"
            />
            {hoverYPixel !== null ? (
              <line
                x1={leftPadding} x2={leftPadding + plotWidth}
                y1={hoverYPixel} y2={hoverYPixel}
                stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5"
              />
            ) : null}
            {hoverLeftLabel && hoverYPixel !== null ? (
              <g transform={`translate(${leftPadding - 72} ${hoverYPixel - 14})`}>
                <rect width="68" height="28" rx="6" fill="#475569" />
                <text x="34" y="19" fill="#fff" fontSize="13" textAnchor="middle">{hoverLeftLabel}</text>
              </g>
            ) : null}
            {hoverBottomLabel ? (
              <g transform={`translate(${hoverXPixel - 34} ${height - 40})`}>
                <rect width="68" height="28" rx="6" fill="#475569" />
                <text x="34" y="19" fill="#fff" fontSize="13" textAnchor="middle">{hoverBottomLabel}</text>
              </g>
            ) : null}
          </>
        ) : null}
      </svg>

      {/* Floating tooltip */}
      {tooltipTitle && tooltipItems && tooltipPos ? (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 w-[300px] rounded-[10px] border border-[#edf1f5] bg-white/95 px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
          style={{
            left: clampedTooltipPos ? clampedTooltipPos.left : tooltipPos.left,
            top: clampedTooltipPos ? clampedTooltipPos.top : tooltipPos.top,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="mb-2.5 text-[15px] font-medium text-[#5f6773]">{tooltipTitle}</div>
          <div className="space-y-1.5 text-[13px] text-[#2c3948]">
            {tooltipItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium">{item.label}:</span>
                <span className="ml-auto font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/* ─── Main export ────────────────────────────────────────────────────── */

export default function PCSDetailsPage({ params }: { params?: { id?: string } }) {
  const router = useRouter()
  const rawId = params?.id ? decodeURIComponent(params.id) : '1#PCS'

  const [now, setNow] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [hoveredHour, setHoveredHour] = useState<number | null>(null)
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null)

  useEffect(() => {
    if (!mounted) return
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [mounted])

  useEffect(() => {
    const initialNow = new Date()
    setNow(initialNow)
    setSelectedDate(formatDateLabel(initialNow))
    setMounted(true)
  }, [])

  useEffect(() => {
    setHoveredHour(null)
  }, [rawId, selectedDate])

  useEffect(() => {
    const LABELS = ['BESS Power', 'Charge Energy', 'Discharge Energy', 'SOC (state Of Charge)']
    setVisibleSeries((prev) => {
      const out: Record<string, boolean> = {}
      LABELS.forEach((l) => { out[l] = prev[l] !== undefined ? prev[l] : true })
      return out
    })
  }, [rawId])

  function toggleSeries(label: string) {
    setVisibleSeries((prev) => ({ ...prev, [label]: !(prev[label] !== false) }))
  }

  const EMPTY_TELEMETRY: PCSTelemetry = useMemo(() => ({
    series: [],
    samples: [],
    stats: { cumulativeCharge: 0, chargeCycles: 0, cumulativeDischarge: 0, dischargeCycles: 0 },
    realtime: {
      totalVoltage: 0, totalCurrent: 0, totalActivePower: 0, totalReactivePower: 0,
      totalApparentPower: 0, totalPowerFactor: 0, soc: 0,
      phaseAVoltage: 0, phaseBVoltage: 0, phaseCVoltage: 0,
      phaseACurrent: 0, phaseBCurrent: 0, phaseCCurrent: 0,
      moduleTemperature: 0, dcBusVoltage: 0,
    },
    latestHour: 0,
  }), [])

  const telemetry = useMemo(
    () => (mounted && now ? buildPCSTelemetry(rawId, selectedDate, now) : EMPTY_TELEMETRY),
    [rawId, selectedDate, now, mounted, EMPTY_TELEMETRY],
  )

  const hoveredSample = useMemo(
    () => closestByHour(telemetry.samples, hoveredHour),
    [telemetry.samples, hoveredHour],
  )

  const filteredSeries = useMemo(
    () => telemetry.series.filter((s) => visibleSeries[s.label] !== false),
    [telemetry.series, visibleSeries],
  )

  const tooltip: TooltipItem[] = useMemo(() => {
    if (!hoveredSample) return []
    const items: TooltipItem[] = []
    if (visibleSeries['BESS Power'] !== false)
      items.push({ label: 'BESS Power', value: `${hoveredSample.bessPower.toFixed(2)} kW`, color: '#4a8ff7' })
    if (visibleSeries['Charge Energy'] !== false)
      items.push({ label: 'Charge Energy', value: `${hoveredSample.chargeEnergy.toFixed(2)} kWh`, color: '#f5a623' })
    if (visibleSeries['Discharge Energy'] !== false)
      items.push({ label: 'Discharge Energy', value: `${hoveredSample.dischargeEnergy.toFixed(2)} kWh`, color: '#28b3d6' })
    if (visibleSeries['SOC (state Of Charge)'] !== false)
      items.push({ label: 'SOC (state Of Charge)', value: `${hoveredSample.soc.toFixed(1)} %`, color: '#22c55e' })
    return items
  }, [hoveredSample, visibleSeries])

  const { stats, realtime } = telemetry

  // ── Device tab list (mock; real impl would come from API)
  // Only include actual devices present in the system (two PCS units in this demo)
  const ALL_DEVICES = useMemo(() => ['1#PCS', '2#PCS'], [])

  const statusCards = [
    { label: 'Operating Status', isStatus: true, value: 'Running', color: '#16a34a' },
    { label: 'Rated Power', value: '125', unit: 'kW' },
    { label: 'Cumulative Charge', value: stats.cumulativeCharge.toFixed(1), unit: 'kWh' },
    { label: 'Charge Cycles', value: String(stats.chargeCycles) },
    { label: 'Cumulative Discharge', value: stats.cumulativeDischarge.toFixed(2), unit: 'kWh' },
    { label: 'Discharge Cycles', value: String(stats.dischargeCycles) },
  ]

  const realtimeMetrics = [
    { label: 'Total Voltage', value: `${realtime.totalVoltage} V` },
    { label: 'Total Current', value: `${realtime.totalCurrent} A` },
    { label: 'Total Active Power', value: `${realtime.totalActivePower} kW` },
    { label: 'Total Reactive Power', value: `${realtime.totalReactivePower} kVar` },
    { label: 'Total Apparent Power', value: `${realtime.totalApparentPower} kVA` },
    { label: 'Total Power Factor', value: `${realtime.totalPowerFactor}` },
    { label: 'SOC (state Of Charge)', value: `${realtime.soc} %` },
    { label: 'Phase A Voltage', value: `${realtime.phaseAVoltage} V` },
    { label: 'Phase B Voltage', value: `${realtime.phaseBVoltage} V` },
    { label: 'Phase C Voltage', value: `${realtime.phaseCVoltage} V` },
    { label: 'Phase A Current', value: `${realtime.phaseACurrent} A` },
    { label: 'Phase B Current', value: `${realtime.phaseBCurrent} A` },
    { label: 'Phase C Current', value: `${realtime.phaseCCurrent} A` },
    { label: 'Module Temperature', value: `${realtime.moduleTemperature} °C` },
    { label: 'DC Bus Voltage', value: `${realtime.dcBusVoltage} V` },
  ]

  return (
    <DashboardLayout initialActiveTab="PCS" visitedRoute={`/monitor/pcs/details?id=${encodeURIComponent(rawId)}`}>
      <main
        className="flex-1 overflow-auto py-5"
        style={{ paddingInline: 24, maxWidth: 'none', marginInline: 0 }}
      >
            {/* Page header – back button + device tab switcher */}
            <div className="mb-5 flex items-center gap-0 border-b border-[#e6edf5]">
              <button
                type="button"
                onClick={() => router.push('/monitor/pcs')}
                className="mr-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#1b2532] transition-colors hover:bg-[#edf2f8]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              {ALL_DEVICES.map((device) => {
                const isActive = device === rawId
                return (
                  <button
                    key={device}
                    type="button"
                    onClick={() => router.push(`/monitor/pcs/details?id=${encodeURIComponent(device)}`)}
                    className={`relative flex items-center gap-2 px-5 pb-3 pt-1 text-[15px] font-medium transition-colors ${isActive
                        ? 'text-[#0f1724]'
                        : 'text-[#6b7280] hover:text-[#374151]'
                      }`}
                  >
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: isActive ? '#22c55e' : '#9ca3af' }}
                    />
                    {device}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t-full bg-[#22c55e]" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* ── 6-column status cards ── */}
            <div className="mb-5 grid grid-cols-6 gap-4">
              {statusCards.map((card) => (
                <div
                  key={card.label}
                  className="flex h-[120px] flex-col justify-center rounded-[14px] border border-[#e6edf5] bg-white px-5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-1.5 text-[12.5px] font-medium text-[#8da0ba]">{card.label}</div>
                  {card.isStatus ? (
                    <div className="text-[24px] font-bold" style={{ color: card.color ?? '#16a34a' }}>
                      {card.value}
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[28px] font-bold leading-none text-[#0b1220]">{card.value}</span>
                      {card.unit ? (
                        <span className="text-[14px] font-semibold text-[#8da0ba]">{card.unit}</span>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Power And Energy Curves ── */}
            <div className="mb-5 rounded-[16px] border border-[#e6edf5] bg-white px-6 py-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-semibold tracking-tight text-[#101828]">
                  Power And Energy Curves
                </h2>
                <DateControl value={selectedDate} onChange={setSelectedDate} />
              </div>

              <div className="mb-4">
                <ChartLegend
                  series={telemetry.series}
                  visibleMap={visibleSeries}
                  onToggle={toggleSeries}
                  onHover={setHoveredSeries}
                />
              </div>

              <div style={{ height: 480 }}>
                <BESSChartPlot
                  series={filteredSeries}
                  hoverX={hoveredSample?.hour}
                  hoverY={hoveredSample?.bessPower}
                  hoverBottomLabel={hoveredSample ? formatTimeLabel(hoveredSample.hour) : undefined}
                  hoverLeftLabel={hoveredSample ? hoveredSample.bessPower.toFixed(1) : undefined}
                  tooltipTitle={hoveredSample ? formatTimeLabel(hoveredSample.hour) : undefined}
                  tooltipItems={hoveredSample ? tooltip : undefined}
                  onHoverHourChange={setHoveredHour}
                  hoveredSeriesLabel={hoveredSeries}
                  onHoverSeriesChange={setHoveredSeries}
                />
              </div>
            </div>

            {/* ── Real-time Data ── */}
            <div className="mb-5 rounded-[16px] border border-[#e6edf5] bg-white px-6 py-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
              <h2 className="mb-5 text-[20px] font-semibold tracking-tight text-[#101828]">Real-time Data</h2>
              <div className="grid grid-cols-3 gap-x-12 gap-y-3.5">
                {realtimeMetrics.map((m) => (
                  <div key={m.label} className="flex items-baseline gap-2">
                    <span className="text-[14px] text-[#6b7280]">{m.label}:</span>
                    <span className="text-[16px] font-semibold text-[#1b2532]">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Status ── */}
            <div className="rounded-[16px] border border-[#e6edf5] bg-white px-6 py-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
              <h2 className="mb-5 text-[20px] font-semibold tracking-tight text-[#101828]">Status</h2>
              <div className="grid grid-cols-4 gap-x-16 gap-y-4">
                {PCS_STATUSES.map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <span
                      className={`h-3 w-3 flex-shrink-0 rounded-full ${s.active ? 'bg-[#22c55e]' : 'bg-[#d1d5db]'}`}
                    />
                    <span className="text-[15px] text-[#2b3441]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
      </main>
    </DashboardLayout>
  )
}
