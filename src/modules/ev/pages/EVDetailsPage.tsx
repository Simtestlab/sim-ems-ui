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

  const statusCards = [
    { label: 'Operating Status', isStatus: true, value: 'Charging', color: '#0a7855' },
    { label: 'Rated Power', value: '100', unit: 'kW' },
    { label: 'Cumulative Charge', value: stats.cumulativeCharge.toFixed(1), unit: 'kWh' },
    { label: 'Daily Charge', value: telemetry.samples[telemetry.samples.length-1]?.chargeEnergy?.toFixed(1) ?? '0', unit: 'kWh' },
    { label: 'Today Peak Power', value: String(Math.max(...telemetry.samples.map(s => s.chargerPower), 0).toFixed(0)), unit: 'kW' },
  ]

  const realtimeMetrics = [
    { label: 'Charging Power', value: Number(realtime.chargerPower ?? telemetry.samples[telemetry.samples.length-1]?.chargerPower ?? 0).toFixed(2), unit: 'kW' },
    { label: 'Output Voltage', value: Number(realtime.voltage || 0).toFixed(1), unit: 'V' },
    { label: 'Output Current', value: Number(realtime.current || 0).toFixed(1), unit: 'A' },
    { label: 'Session Energy', value: Number(realtime.sessionEnergy ?? telemetry.samples[telemetry.samples.length-1]?.chargeEnergy ?? 0).toFixed(1), unit: 'kWh' },
    { label: 'Cable Temperature', value: Number(realtime.cableTemperature || 0).toFixed(1), unit: '°C' },
  ]

  const currentTimeLabel = formatHeaderDateTime(now)

  const router = useRouter()
  const ALL_DEVICES = useMemo(() => ['1#EV', '2#EV', '3#EV'], [])

  return (
    <DashboardLayout visitedRoute={`/monitor/ev/details?id=${encodeURIComponent(rawId)}`} initialActiveTab="EV">
      <main className="flex-1 overflow-auto py-6" style={{ paddingInline: 24, maxWidth: 'none', marginInline: 0 }}>
        <div className="mb-6 flex items-center gap-0 border-b border-[#e6edf5]">
          <button type="button" onClick={() => router.push('/monitor/ev')} className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-[#1b2532] transition-colors hover:bg-[#f1f6fb]">
            <ChevronLeft className="h-6 w-6" />
          </button>

          {ALL_DEVICES.map((device) => {
            const isActive = device === rawId
            return (
              <button
                key={device}
                type="button"
                onClick={() => router.push(`/monitor/ev/details?id=${encodeURIComponent(device)}`)}
                className={`relative flex items-center gap-2 px-5 pb-3 pt-1 text-[15px] font-medium transition-colors ${isActive ? 'text-[#0f1724]' : 'text-[#6b7280] hover:text-[#374151]'}`}
              >
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: isActive ? '#16a34a' : '#9ca3af' }} />
                {device}
                {isActive && <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t-full bg-[#16a34a]" />}
              </button>
            )
          })}

          <div className="ml-auto flex items-center gap-4">
            <div className="text-[13px] text-[#6b7280]">{currentTimeLabel}</div>
            <DateControl value={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>

        {/* status cards */}
        <div className="mb-6 grid grid-cols-5 gap-4">
          {statusCards.map((card) => (
            <div key={card.label} className="flex h-[140px] flex-col justify-center rounded-[12px] border border-[#e6edf5] bg-white px-6 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
              <div className="mb-2 text-[13px] font-medium text-[#8da0ba]">{card.label}</div>
              {card.isStatus ? (
                <div className="flex items-center gap-3">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: card.color ?? '#16a34a' }} />
                  <div className="text-[26px] font-bold" style={{ color: card.color ?? '#16a34a' }}>{card.value}</div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] font-bold text-[#0b1220]">{card.value}</span>
                  {card.unit ? <span className="text-[14px] font-semibold text-[#8da0ba]">{card.unit}</span> : null}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="mb-6 rounded-[12px] border border-[#e6edf5] bg-white px-6 py-5 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[22px] font-semibold text-[#0f1724]">Charger Power & Energy</h2>
            <ChartLegend series={telemetry.series} visibleMap={visibleSeries} onToggle={toggleSeries} onHover={setHoveredSeries} />
          </div>

          <div style={{ height: 520 }}>
            <EVChartPlot
              series={filteredSeries}
              hoverX={hoveredSample?.hour}
              hoverY={hoveredSample?.chargerPower}
              hoverBottomLabel={hoveredSample ? formatTimeLabel(hoveredSample.hour) : undefined}
              hoverLeftLabel={hoveredSample ? hoveredSample.chargerPower.toFixed(1) : undefined}
              tooltipTitle={hoveredSample ? formatTimeLabel(hoveredSample.hour) : undefined}
              tooltipItems={hoveredSample ? tooltipItems : undefined}
              onHoverHourChange={setHoveredHour}
              hoveredSeriesLabel={hoveredSeries}
              onHoverSeriesChange={setHoveredSeries}
            />
          </div>
        </div>

        {/* Real-time data */}
          <div className="mb-6 rounded-[12px] border border-[#e6edf5] bg-white px-6 py-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
          <h2 className="mb-4 text-[20px] font-semibold text-[#0f1724]">Real-time Data</h2>
          <div className="grid grid-cols-5 gap-x-12 gap-y-4">
            {realtimeMetrics.map((m) => (
              <div key={m.label} className="flex items-baseline gap-3">
                <span className="text-[14px] text-[#6b7280]">{m.label}:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-semibold text-[#1b2532]">{m.value}</span>
                  {m.unit ? <span className="text-[14px] text-[#6b7280]">{m.unit}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status indicators */}
        <div className="rounded-[12px] border border-[#e6edf5] bg-white px-6 py-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
          <h2 className="mb-4 text-[20px] font-semibold text-[#0f1724]">Status</h2>
          <div className="grid grid-cols-5 gap-x-8 gap-y-4">
            {['Available','Charging','Gun Connected','Fault','Offline'].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className={`h-3.5 w-3.5 rounded-full ${s === 'Charging' ? 'bg-[#16a34a]' : s === 'Fault' ? 'bg-[#ef4444]' : 'bg-[#d1d5db]'}`}></span>
                <div className="text-[16px] font-medium text-[#2b3441]">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
