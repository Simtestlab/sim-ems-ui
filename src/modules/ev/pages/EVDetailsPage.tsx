"use client"

import { CalendarDays, ChevronLeft } from 'lucide-react'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

/* Types */
type Point = { x: number; y: number }

type LineSeries = {
  label: string
  color: string
  points: Point[]
  fillId?: string
  dashed?: boolean
  muted?: boolean
}

type EVSample = {
  hour: number
  chargerPower: number
  chargeEnergy: number
  soc: number
}

type EVStats = {
  cumulativeCharge: number
}

type EVRealtime = {
  voltage: number
  current: number
  activePower: number
  chargerPower?: number
  sessionEnergy?: number
  cableTemperature?: number
  soc: number
}

type EVTelemetry = {
  series: LineSeries[]
  samples: EVSample[]
  stats: EVStats
  realtime: EVRealtime
  latestHour: number
}

/* Helpers */
function clamp(v: number, a: number, b: number) {
  return Math.min(Math.max(v, a), b)
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
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatTimeLabel(hour: number) {
  const h = Math.floor(hour)
  const m = Math.floor((hour - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatHeaderDateTime(date: Date) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const h = String(date.getHours()).padStart(2,'0')
  const m = String(date.getMinutes()).padStart(2,'0')
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${h}:${m}`
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

function closestByHour<T extends { hour: number }>(samples: T[], targetHour: number | null) {
  if (!samples.length || targetHour === null) return undefined
  const first = samples[0]
  const last = samples[samples.length - 1]
  if (targetHour <= first.hour) return first
  if (targetHour >= last.hour) return last
  return samples.reduce((closest, s) => Math.abs(s.hour - targetHour) < Math.abs(closest.hour - targetHour) ? s : closest, first)
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

/* Telemetry simulation for EV charger */
function buildEVTelemetry(deviceId: string, selectedDate: string, now: Date): EVTelemetry {
  const todayLabel = formatDateLabel(now)
  const seed = hashString(`${deviceId}:${selectedDate}`)
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const availableHour = selectedDate === todayLabel ? clamp(currentHour, 0.25, 23) : 23
  const hours = buildHours(availableHour, 0.25)

  const batteryCapacity = 75 // kWh
  const chargeStart = 8.5 + (seed % 3) * 0.25
  const chargeEnd = 11.5 + (seed % 3) * 0.25
  const peak = clamp(60 + (seed % 60), 20, 120) // kW

  let soc = 20 + (seed % 20)
  let chargeEnergy = 0

  const samples: EVSample[] = hours.map((hour) => {
    let chargerPower = 0
    if (hour >= chargeStart && hour <= chargeEnd) {
      const progress = (hour - chargeStart) / (chargeEnd - chargeStart)
      const curve = Math.sin(progress * Math.PI)
      const noise = Math.sin(hour * 3.2 + seed * 0.0007) * 1.8
      chargerPower = clamp(curve * peak + Math.max(0, noise), 0, 150)
    } else if (hour > chargeEnd) {
      const decay = Math.exp(-(hour - chargeEnd) * 0.9)
      chargerPower = clamp(peak * 0.12 * decay, 0, 150)
    }

    const dt = 0.25
    if (chargerPower > 0) {
      chargeEnergy += chargerPower * dt
      soc = Math.min(99, soc + (chargerPower * dt / batteryCapacity) * 100)
    }

    return { hour, chargerPower, chargeEnergy, soc }
  })

  const latest = samples[samples.length - 1]
  const latestHour = latest.hour

  const stats: EVStats = {
    cumulativeCharge: 1200 + (seed % 400),
  }

  const realtime: EVRealtime = {
    voltage: Number((400 + (seed % 8) + Math.sin(latestHour * 0.5)).toFixed(1)),
    current: Number((latest.chargerPower > 0 ? latest.chargerPower * 1000 / (400 * 1.732) : 0).toFixed(1)),
    activePower: Number(latest.chargerPower.toFixed(2)),
    chargerPower: Number(latest.chargerPower.toFixed(2)),
    sessionEnergy: Number((latest.chargeEnergy || 0).toFixed(2)),
    cableTemperature: Number((24 + ((seed % 5) * 0.6) + Math.sin(latestHour * 0.3) * 0.3).toFixed(1)),
    soc: Number(latest.soc.toFixed(1)),
  }

  const series: LineSeries[] = [
    {
      label: 'Charger Power',
      color: '#2563eb',
      points: samples.map((s) => ({ x: s.hour, y: s.chargerPower })),
      fillId: 'ev-fill-power',
    },
    {
      label: 'Charge Energy',
      color: '#f59e0b',
      points: samples.map((s) => ({ x: s.hour, y: s.chargeEnergy })),
    },
    {
      label: 'SOC (%)',
      color: '#16a34a',
      points: samples.map((s) => ({ x: s.hour, y: s.soc / 2 })),
    },
  ]

  return { series, samples, stats, realtime, latestHour }
}

/* Inner components: DateControl, Legend, EVChartPlot (scaled) */
function DateControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="inline-flex h-10 min-w-[188px] cursor-pointer items-center justify-center gap-3 rounded-[8px] border border-[#d9e2ee] bg-white px-4 text-[13px] font-medium text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CalendarDays className="h-4 w-4 text-[#adb8c7]" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent text-[13px] font-medium text-[#34455d] outline-none"
      />
    </label>
  )
}

function ChartLegend({ series, visibleMap, onToggle, onHover }: { series: LineSeries[]; visibleMap?: Record<string, boolean>; onToggle?: (label: string) => void; onHover?: (label: string | null) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-8 text-[14px] text-[#31445f]">
      {series.map((item) => {
        const visible = visibleMap ? visibleMap[item.label] !== false : true
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onToggle?.(item.label)}
            onMouseEnter={() => onHover?.(item.label)}
            onMouseLeave={() => onHover?.(null)}
            className={`flex items-center gap-3 transition-opacity focus:outline-none ${!visible ? 'opacity-40' : ''}`}
          >
            <span className="relative inline-flex h-4 w-10 items-center justify-center">
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="relative h-[13px] w-[13px] rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.color }} />
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function EVChartPlot({ series, hoverX, hoverY, hoverBottomLabel, hoverLeftLabel, tooltipTitle, tooltipItems, onHoverHourChange, hoveredSeriesLabel, onHoverSeriesChange }: {
  series: LineSeries[]
  hoverX?: number
  hoverY?: number
  hoverBottomLabel?: string
  hoverLeftLabel?: string
  tooltipTitle?: string
  tooltipItems?: { label: string; value: string; color: string }[]
  onHoverHourChange?: (hour: number | null) => void
  hoveredSeriesLabel?: string | null
  onHoverSeriesChange?: (label: string | null) => void
}) {
  const width = 1400
  const height = 520
  const topPadding = 44
  const bottomPadding = 70
  const leftPadding = 84
  const rightPadding = 132
  const plotWidth = width - leftPadding - rightPadding
  const plotHeight = height - topPadding - bottomPadding
  const xMax = 23
  const yMax = 130

  const Y_TICKS = [0, 30, 60, 90, 120]
  const PCT_TICKS = [0, 20, 40, 60, 80]

  const svgRef = useRef<SVGSVGElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null)
  const [clampedTooltipPos, setClampedTooltipPos] = useState<{ left: number; top: number } | null>(null)
  const [localHoveredLabel, setLocalHoveredLabel] = useState<string | null>(null)

  const hoverXPixel = hoverX === undefined ? null : leftPadding + (hoverX / xMax) * plotWidth
  const hoverYPixel = hoverY === undefined ? null : topPadding + (1 - hoverY / yMax) * plotHeight

  function updateTooltipFromEvent(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    setTooltipPos({ left: clamp(event.clientX - bounds.left, 0, bounds.width), top: clamp(event.clientY - bounds.top, 0, bounds.height) })
  }

  function handlePointerMove(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = clamp(event.clientX - bounds.left, leftPadding, bounds.width - rightPadding)
    const progress = (x - leftPadding) / (bounds.width - leftPadding - rightPadding)
    const floatHour = clamp(progress * xMax, 0, xMax)

    if (!onHoverHourChange) { updateTooltipFromEvent(event); return }

    const snap = 0.25
    const nearest = Number(clamp(Math.round(floatHour / snap) * snap, 0, 23).toFixed(2))
    onHoverHourChange(nearest)

    const rawY = clamp(event.clientY - bounds.top, topPadding, topPadding + plotHeight)
    const dataY = (1 - (rawY - topPadding) / plotHeight) * yMax

    let minDiff = Infinity
    let candidate: string | null = null
    for (const s of series) {
      const sample = s.points.find((p) => Math.abs(p.x - nearest) < 0.001)
      if (!sample) continue
      const diff = Math.abs(sample.y - dataY)
      if (diff < minDiff) { minDiff = diff; candidate = s.label }
    }

    if (candidate && minDiff <= yMax * 0.2) {
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
    setTooltipPos({ left: viewX * (bounds.width / width), top: viewY * (bounds.height / height) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverX, hoverY])

  useLayoutEffect(() => {
    if (!tooltipPos || !svgRef.current) { setClampedTooltipPos(null); return }
    const cw = svgRef.current.getBoundingClientRect().width
    const ch = svgRef.current.getBoundingClientRect().height
    const tw = tooltipRef.current?.offsetWidth ?? 320
    const th = tooltipRef.current?.offsetHeight ?? 120
    const margin = 12
    const offset = 14

    let left = clamp(tooltipPos.left, margin + tw / 2, cw - margin - tw / 2)
    const topAbove = tooltipPos.top - offset - th
    const top = topAbove >= margin ? topAbove : Math.min(tooltipPos.top + offset, ch - margin - th)
    setClampedTooltipPos({ left, top })
  }, [tooltipPos, tooltipItems])

  return (
    <div className="relative h-full">
      <svg ref={svgRef} className="h-full w-full select-none" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" onDragStart={(e) => e.preventDefault()} onMouseMove={handlePointerMove} onMouseLeave={handleMouseLeave} style={{ touchAction: 'none', userSelect: 'none' }}>
        <defs>
          {series.filter((s): s is LineSeries & { fillId: string } => Boolean(s.fillId)).map((s) => (
            <linearGradient key={s.fillId} id={s.fillId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.24" />
              <stop offset="55%" stopColor={s.color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Axis unit labels */}
        <text x={leftPadding - 10} y={20} fill="#374151" fontSize="14" fontWeight="600" textAnchor="end">kW</text>
        <text x={leftPadding + plotWidth + 12} y={20} fill="#374151" fontSize="14" fontWeight="600">kWh</text>
        <text x={leftPadding + plotWidth + 72} y={20} fill="#374151" fontSize="14" fontWeight="600">%</text>

        {/* Grid lines + tick labels */}
        {Y_TICKS.map((_, index) => {
          const y = topPadding + (index / (Y_TICKS.length - 1)) * plotHeight
          const kwVal = Y_TICKS[Y_TICKS.length - 1 - index]
          const pctVal = PCT_TICKS[PCT_TICKS.length - 1 - index]
          return (
            <g key={kwVal}>
              <line x1={leftPadding} x2={leftPadding + plotWidth} y1={y} y2={y} stroke="#e6eef8" strokeWidth="1" />
              <text x={leftPadding - 10} y={y + 6} fill="#9aa6b8" fontSize="13" textAnchor="end">{kwVal}</text>
              <text x={leftPadding + plotWidth + 8} y={y + 6} fill="#9aa6b8" fontSize="13">{kwVal}</text>
              <text x={leftPadding + plotWidth + 72} y={y + 6} fill="#9aa6b8" fontSize="13">{pctVal}</text>
            </g>
          )
        })}

        {/* Time axis ticks */}
        {Array.from({ length: 12 }, (_, i) => i * 2).map((hour) => (
          <text key={hour} x={leftPadding + (hour / xMax) * plotWidth} y={height - 18} fill="#9aa6b8" fontSize="13" textAnchor="middle">{String(hour).padStart(2,'0')}:00</text>
        ))}

        {/* Series */}
        {series.map((item) => {
          const polylinePoints = buildPolyline(item.points, plotWidth, plotHeight, xMax, yMax)
          const first = item.points[0]
          const last = item.points[item.points.length - 1]
          const areaPath = item.fillId && first && last ? `M ${(first.x / xMax) * plotWidth},${plotHeight - (first.y / yMax) * plotHeight} ${polylinePoints.split(' ').map((pt) => `L ${pt}`).join(' ')} L ${(last.x / xMax) * plotWidth},${plotHeight} L ${(first.x / xMax) * plotWidth},${plotHeight} Z` : null

          const activeHovered = hoveredSeriesLabel ?? localHoveredLabel
          const isHighlighted = activeHovered ? activeHovered === item.label : null
          const strokeOpacity = activeHovered ? (isHighlighted ? 1 : 0.12) : item.muted ? 0.45 : 1
          const fillOpacity = activeHovered ? (isHighlighted ? 1 : 0.04) : 1
          const strokeWidth = activeHovered ? (isHighlighted ? 3.5 : 1.5) : 2.6

          return (
            <g key={item.label} transform={`translate(${leftPadding} ${topPadding})`}>
              {areaPath ? <path d={areaPath} fill={`url(#${item.fillId})`} style={{ opacity: fillOpacity }} /> : null}
              <polyline fill="none" points={polylinePoints} stroke={item.color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={strokeOpacity} />
            </g>
          )
        })}

        {/* Hover crosshair */}
        {hoverXPixel !== null ? (
          <>
            <line x1={hoverXPixel} x2={hoverXPixel} y1={topPadding} y2={topPadding + plotHeight} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
            {hoverYPixel !== null ? <line x1={leftPadding} x2={leftPadding + plotWidth} y1={hoverYPixel} y2={hoverYPixel} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" /> : null}
            {hoverLeftLabel && hoverYPixel !== null ? (
              <g transform={`translate(${leftPadding - 82} ${hoverYPixel - 16})`}>
                <rect width="76" height="32" rx="6" fill="#475569" />
                <text x="38" y="20" fill="#fff" fontSize="13" textAnchor="middle">{hoverLeftLabel}</text>
              </g>
            ) : null}
            {hoverBottomLabel ? (
              <g transform={`translate(${hoverXPixel - 44} ${height - 46})`}>
                <rect width="88" height="32" rx="6" fill="#475569" />
                <text x="44" y="20" fill="#fff" fontSize="13" textAnchor="middle">{hoverBottomLabel}</text>
              </g>
            ) : null}
          </>
        ) : null}
      </svg>

      {/* Floating tooltip */}
      {tooltipTitle && tooltipItems && tooltipPos ? (
        <div ref={tooltipRef} className="pointer-events-none absolute z-20 w-[360px] rounded-[10px] border border-[#edf1f5] bg-white/95 px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.12)]" style={{ left: clampedTooltipPos ? clampedTooltipPos.left : tooltipPos.left, top: clampedTooltipPos ? clampedTooltipPos.top : tooltipPos.top, transform: 'translateX(-50%)' }}>
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

/* Main export */
export default function EVDetailsPage({ params }: { params?: { id?: string } }) {
  const rawId = params?.id ? decodeURIComponent(params.id) : '1#EV'
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => formatDateLabel(new Date()))
  const [hoveredHour, setHoveredHour] = useState<number | null>(null)
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null)

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    setHoveredHour(null)
  }, [rawId, selectedDate])

  useEffect(() => {
    const LABELS = ['Charger Power', 'Charge Energy', 'SOC (%)']
    setVisibleSeries((prev) => {
      const out: Record<string, boolean> = {}
      LABELS.forEach((l) => { out[l] = prev[l] !== undefined ? prev[l] : true })
      return out
    })
  }, [rawId])

  function toggleSeries(label: string) { setVisibleSeries((p) => ({ ...p, [label]: !(p[label] !== false) })) }

  const EMPTY_TELEMETRY: EVTelemetry = useMemo(() => ({ series: [], samples: [], stats: { cumulativeCharge: 0 }, realtime: { voltage: 0, current: 0, activePower: 0, soc: 0 }, latestHour: 0 }), [])

  const telemetry = useMemo(() => (mounted ? buildEVTelemetry(rawId, selectedDate, now) : EMPTY_TELEMETRY), [rawId, selectedDate, now, mounted, EMPTY_TELEMETRY])

  const hoveredSample = useMemo(() => closestByHour(telemetry.samples, hoveredHour), [telemetry.samples, hoveredHour])

  const filteredSeries = useMemo(() => telemetry.series.filter((s) => visibleSeries[s.label] !== false), [telemetry.series, visibleSeries])

  const tooltipItems = useMemo(() => {
    if (!hoveredSample) return []
    const items: { label: string; value: string; color: string }[] = []
    if (visibleSeries['Charger Power'] !== false) items.push({ label: 'Charger Power', value: `${hoveredSample.chargerPower.toFixed(2)} kW`, color: '#2563eb' })
    if (visibleSeries['Charge Energy'] !== false) items.push({ label: 'Charge Energy', value: `${hoveredSample.chargeEnergy.toFixed(2)} kWh`, color: '#f59e0b' })
    if (visibleSeries['SOC (%)'] !== false) items.push({ label: 'SOC (%)', value: `${hoveredSample.soc.toFixed(1)} %`, color: '#16a34a' })
    return items
  }, [hoveredSample, visibleSeries])

  const { stats, realtime } = telemetry

  const evSeed = hashString(rawId)
  const monthlyCharge = (1400 + (evSeed % 200)).toFixed(0)
  const yearlyCharge = (8500 + (evSeed % 800)).toFixed(0)
  const dailyCharge = (telemetry.samples[telemetry.samples.length - 1]?.chargeEnergy ?? 0).toFixed(1)
  const todayPeak = Math.max(...telemetry.samples.map(s => s.chargerPower), 0).toFixed(0)
  const isCharging = (realtime.chargerPower ?? realtime.activePower ?? 0) > 0.5

  const router = useRouter()

  const baseV = 380 + (evSeed % 8) * 0.5
  const vcSeries = useMemo((): LineSeries[] => [
    {
      label: 'Voltage',
      color: '#22c55e',
      points: telemetry.samples.map(s => ({
        x: s.hour,
        y: clamp((baseV + (s.chargerPower > 0 ? Math.sin(s.hour * 0.4) * 3 : 0) - 340) / 90 * 100, 0, 100),
      })),
      fillId: 'ev-fill-voltage',
    },
    {
      label: 'Current',
      color: '#06b6d4',
      points: telemetry.samples.map(s => ({
        x: s.hour,
        y: s.chargerPower > 0 ? clamp((s.chargerPower * 1000 / (baseV * 1.732)) / 2, 0, 100) : 0,
      })),
      fillId: 'ev-fill-current',
    },
  ], [telemetry.samples, baseV])

  const powerSeries = useMemo(
    () => telemetry.series.filter(s => s.label === 'Charger Power'),
    [telemetry.series],
  )

  return (
    <DashboardLayout visitedRoute={`/monitor/ev/details?id=${encodeURIComponent(rawId)}`} initialActiveTab="EV">
      <main className="flex-1 overflow-auto py-5" style={{ paddingInline: 24, maxWidth: 'none', marginInline: 0 }}>
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <button type="button" onClick={() => router.push('/monitor/ev')} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#1b2532] transition-colors hover:bg-[#edf2f8]">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="h-3 w-3 flex-shrink-0 rounded-full bg-[#22c55e]" />
          <h1 className="text-[20px] font-bold text-[#0f1724]">{rawId}</h1>
          <div className="ml-2 flex items-center gap-3 text-[14px] text-[#8da0ba]">
            <span>Rated Power: <strong className="font-semibold text-[#374151]">100kW</strong></span>
            <span className="h-4 w-px bg-[#dde4ee]" />
            <span>Model: <strong className="font-semibold text-[#374151]">DC Fast 100</strong></span>
          </div>
          <div className="ml-auto">
            <DateControl value={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>

        {/* Row 1: 6 metric cards */}
        <div className="mb-4 grid grid-cols-6 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#f0fdf4' }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <circle cx="12" cy="12" r="10" fill="#86efac" />
                <path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94a3b8] leading-tight">Operating Status</div>
              <div className="text-[17px] font-bold leading-tight" style={{ color: isCharging ? '#16a34a' : '#64748b' }}>
                {isCharging ? 'Charging' : 'Idle'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#eff6ff' }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94a3b8] leading-tight">Real-time Power</div>
              <div className="text-[17px] font-bold text-[#0f1724] leading-tight">
                {Number(realtime.chargerPower ?? realtime.activePower ?? 0).toFixed(1)}<span className="ml-1 text-[12px] font-medium text-[#64748b]">kW</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#fffbeb' }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94a3b8] leading-tight">Daily Charge</div>
              <div className="text-[17px] font-bold text-[#0f1724] leading-tight">
                {dailyCharge}<span className="ml-1 text-[12px] font-medium text-[#64748b]">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#f0fdfa' }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" stroke="#0d9488" strokeWidth="1.8" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94a3b8] leading-tight">Monthly Charge Energy</div>
              <div className="text-[17px] font-bold text-[#0f1724] leading-tight">
                {monthlyCharge}<span className="ml-1 text-[12px] font-medium text-[#64748b]">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#eef2ff' }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V12M3.27 6.96L12 12.01l8.73-5.05" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94a3b8] leading-tight">Yearly Charge Energy</div>
              <div className="text-[17px] font-bold text-[#0f1724] leading-tight">
                {yearlyCharge}<span className="ml-1 text-[12px] font-medium text-[#64748b]">kWh</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#faf5ff' }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94a3b8] leading-tight">Cumulative Charge</div>
              <div className="text-[17px] font-bold text-[#0f1724] leading-tight">
                {stats.cumulativeCharge.toFixed(1)}<span className="ml-1 text-[12px] font-medium text-[#64748b]">kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Today Peak Power */}
        <div className="mb-5 grid grid-cols-6 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: '#fdf2f8' }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#db2777" strokeWidth="1.8" />
                <path d="M8 12l4-4 4 4M12 8v8" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#94a3b8] leading-tight">Today Peak Power</div>
              <div className="text-[17px] font-bold text-[#0f1724] leading-tight">
                {todayPeak}<span className="ml-1 text-[12px] font-medium text-[#64748b]">kW</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts: side by side */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col rounded-[14px] border border-[#e6edf5] bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)]" style={{ height: 380 }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#0f1724]">EV Power Curve</h2>
              <ChartLegend series={powerSeries} visibleMap={visibleSeries} onToggle={toggleSeries} onHover={setHoveredSeries} />
            </div>
            <div className="flex-1">
              <EVChartPlot
                series={powerSeries}
                hoverX={hoveredSample?.hour}
                hoverY={hoveredSample?.chargerPower}
                hoverBottomLabel={hoveredSample ? formatTimeLabel(hoveredSample.hour) : undefined}
                hoverLeftLabel={hoveredSample ? hoveredSample.chargerPower.toFixed(1) : undefined}
                tooltipTitle={hoveredSample ? formatTimeLabel(hoveredSample.hour) : undefined}
                tooltipItems={hoveredSample ? [{ label: 'Charging Power', value: `${hoveredSample.chargerPower.toFixed(2)} kW`, color: '#2563eb' }] : undefined}
                onHoverHourChange={setHoveredHour}
                hoveredSeriesLabel={hoveredSeries}
                onHoverSeriesChange={setHoveredSeries}
              />
            </div>
          </div>

          <div className="flex flex-col rounded-[14px] border border-[#e6edf5] bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)]" style={{ height: 380 }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#0f1724]">EV Voltage / Current Curve</h2>
              <ChartLegend series={vcSeries} />
            </div>
            <div className="flex-1">
              <EVChartPlot
                series={vcSeries}
                hoverX={hoveredSample?.hour}
                hoverBottomLabel={hoveredSample ? formatTimeLabel(hoveredSample.hour) : undefined}
                onHoverHourChange={setHoveredHour}
                hoveredSeriesLabel={hoveredSeries}
                onHoverSeriesChange={setHoveredSeries}
              />
            </div>
          </div>
        </div>

        {/* Real-time Data */}
        <div className="mt-5 rounded-[14px] border border-[#e6edf5] bg-white px-6 py-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
          <h2 className="mb-4 text-[17px] font-semibold text-[#0f1724]">Real-time Data</h2>
          <div className="grid grid-cols-4 gap-x-10 gap-y-3">
            {([
              { label: 'Voltage', value: `${realtime.voltage}V` },
              { label: 'Current', value: `${realtime.current.toFixed(1)}A` },
              { label: 'Active Power', value: `${realtime.activePower.toFixed(2)}kW` },
              { label: 'Charger Power', value: `${(realtime.chargerPower ?? 0).toFixed(2)}kW` },
              { label: 'Session Energy', value: `${(realtime.sessionEnergy ?? 0).toFixed(2)}kWh` },
              { label: 'Cable Temperature', value: `${realtime.cableTemperature ?? '--'}\u00b0C` },
              { label: 'SOC', value: `${realtime.soc.toFixed(1)}%` },
              { label: 'Daily Charge', value: `${dailyCharge}kWh` },
            ] as { label: string; value: string }[]).map((field) => (
              <div key={field.label} className="text-[13px]">
                <span className="text-[#64748b]">{field.label}: </span>
                <span className="font-bold text-[#0f1724]">{field.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Status */}
        <div className="mt-4 rounded-[14px] border border-[#e6edf5] bg-white px-6 py-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
          <h2 className="mb-4 text-[17px] font-semibold text-[#0f1724]">Device Status</h2>
          <div className="flex flex-wrap items-center gap-12">
            {([
              { label: isCharging ? 'Charging' : 'Running', active: isCharging },
              { label: 'Communication Normal', active: true },
              { label: 'Alarm', active: false },
              { label: 'Fault', active: false },
              { label: 'Cable Connected', active: isCharging },
            ] as { label: string; active: boolean }[]).map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className={`h-3 w-3 flex-shrink-0 rounded-full ${s.active ? 'bg-[#22c55e]' : 'bg-[#cbd5e1]'}`} />
                <span className="text-[13px] text-[#374151]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
