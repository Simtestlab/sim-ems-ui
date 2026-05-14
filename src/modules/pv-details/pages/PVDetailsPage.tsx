"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePVMonitoringStore } from '@/modules/pv-monitoring/store/pvMonitoringStore'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

type Point = {
  x: number
  y: number
}

type LineSeries = {
  label: string
  color: string
  points: Point[]
  fillId?: string
  muted?: boolean
}

type TooltipItem = {
  label: string
  value: string
  color: string
}

type Metric = {
  label: string
  value: string
}

type PowerSample = {
  hour: number
  activePower: number
  dcPower: number
  intensity: number
}

type CurrentSample = {
  hour: number
  current: number
}

type BranchPage = {
  plottedSeries: LineSeries[]
  legendSeries: LineSeries[]
}

type TelemetrySnapshot = {
  powerSeries: LineSeries[]
  powerSamples: PowerSample[]
  branchPages: BranchPage[]
  metrics: Metric[]
  latestHour: number
}

const TIME_TICKS = [0, 3, 6, 9, 12, 15, 18, 21, 23]

const BRANCH_COLORS = ['#17a86b', '#36dff2', '#f4c36f', '#9ec5ff', '#ffb1d4']

function hslToHex(h: number, s: number, l: number) {
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

function getBranchColor(index: number) {
  if (index < BRANCH_COLORS.length) return BRANCH_COLORS[index]
  const h = (index * 47) % 360
  return hslToHex(h, 70, 52)
}

const STATUSES = [
  { label: 'Running', active: true },
  { label: 'Communication Normal', active: true },
  { label: 'Alarm', active: false },
  { label: 'Fault', active: false },
  { label: 'Derating Running', active: false },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hashString(input: string) {
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
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

function formatHeaderDateTime(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`
}

function formatTimeLabel(hour: number) {
  const wholeHour = Math.floor(hour)
  const minutes = Math.floor((hour - wholeHour) * 60)

  return `${String(wholeHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function solarFactor(hour: number) {
  const sunrise = 6
  const sunset = 18.4

  if (hour <= sunrise || hour >= sunset) {
    return 0
  }

  const progress = (hour - sunrise) / (sunset - sunrise)
  return Math.pow(Math.sin(progress * Math.PI), 1.18)
}

function oscillation(seed: number, hour: number, channel: number) {
  return Math.sin(hour * 1.63 + seed * 0.0019 + channel) + Math.cos(hour * 0.71 + seed * 0.0008 + channel * 0.7) * 0.45
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

function createCurrentSamples(hours: number[], seed: number, branchOffset: number, limit: number) {
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

function closestByHour<T extends { hour: number }>(samples: T[], targetHour: number | null) {
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

function buildPolyline(points: Point[], width: number, height: number, xMax: number, yMax: number) {
  return points
    .map((point) => {
      const x = (point.x / xMax) * width
      const y = height - (point.y / yMax) * height
      return `${x},${y}`
    })
    .join(' ')
}

function buildTelemetrySnapshot(deviceId: string, selectedDate: string, now: Date): TelemetrySnapshot {
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
    <div className="flex items-center gap-6 whitespace-nowrap overflow-hidden text-[13px] text-[#31445f]">
      {series.map((item) => {
        const visible = visibleMap ? visibleMap[item.label] !== false : true

        return (
            <button
              key={item.label}
              type="button"
              onClick={() => onToggle?.(item.label)}
              onMouseEnter={() => onHover?.(item.label)}
              onMouseLeave={() => onHover?.(null)}
              className={`flex items-center gap-2 focus:outline-none ${!visible ? 'opacity-40' : ''}`}
              style={{ flex: '0 0 auto' }}
            >
            <span className="relative inline-flex h-4 w-8 items-center justify-center">
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full" style={{ backgroundColor: item.color, opacity: visible ? 1 : 0.45 }} />
              <span className="relative h-4 w-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.color, opacity: visible ? 1 : 0.45 }} />
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function DateControl({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="inline-flex h-11 min-w-[188px] items-center justify-center gap-3 rounded-[8px] border border-[#d9e2ee] bg-white px-4 text-[12px] font-medium text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CalendarDays className="h-4 w-4 text-[#adb8c7]" />
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-[12px] font-medium text-[#34455d] outline-none"
      />
    </label>
  )
}

function ChartPlot({
  leftUnit,
  rightUnit,
  yTicks,
  rightTicks,
  series,
  hoverX,
  hoverY,
  hoverBottomLabel,
  hoverLeftLabel,
  hoverRightLabel,
  tooltipTitle,
  tooltipItems,
  onHoverHourChange,
  hoveredSeriesLabel,
  onHoverSeriesChange,
}: {
  leftUnit: string
  rightUnit?: string
  yTicks: number[]
  rightTicks?: number[]
  series: LineSeries[]
  hoverX?: number
  hoverY?: number
  hoverBottomLabel?: string
  hoverLeftLabel?: string
  hoverRightLabel?: string
  tooltipTitle?: string
  tooltipItems?: TooltipItem[]
  onHoverHourChange?: (hour: number | null) => void
  hoveredSeriesLabel?: string | null
  onHoverSeriesChange?: (label: string | null) => void
}) {
  const width = 1120
  const height = 380
  const topPadding = 28
  const bottomPadding = 44
  const leftPadding = 76
  const rightPadding = rightUnit ? 56 : 20
  const plotWidth = width - leftPadding - rightPadding
  const plotHeight = height - topPadding - bottomPadding
  const xMax = 23
  const yMax = Math.max(...yTicks)

  const svgRef = useRef<SVGSVGElement | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null)
  const [localHoveredSeriesLabel, setLocalHoveredSeriesLabel] = useState<string | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [clampedTooltipPos, setClampedTooltipPos] = useState<{ left: number; top: number; placeAbove: boolean } | null>(null)

  const hoverXPixel = hoverX === undefined ? null : leftPadding + (hoverX / xMax) * plotWidth
  const hoverYPixel = hoverY === undefined ? null : topPadding + (1 - hoverY / yMax) * plotHeight

  function updateTooltipFromEvent(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = clamp(event.clientX - bounds.left, 0, bounds.width)
    const y = clamp(event.clientY - bounds.top, 0, bounds.height)
    setTooltipPos({ left: x, top: y })
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

    const sampleHours = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.x)))).sort((a, b) => a - b)

    if (sampleHours.length === 0) {
      onHoverHourChange(null)
      setTooltipPos(null)
      return
    }

    const snapIncrement = 0.25
    const snappedHour = Math.round(floatHour / snapIncrement) * snapIncrement
    const nearest = Number(clamp(snappedHour, 0, 23).toFixed(2))

    onHoverHourChange(nearest)
    // compute which series is closest to pointer Y at the snapped hour and highlight it
    const rawY = clamp(event.clientY - bounds.top, topPadding, topPadding + plotHeight)
    const dataY = Number(((1 - (rawY - topPadding) / plotHeight) * yMax).toFixed(3))

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

    // only set highlight when reasonably close (15% of y range)
    if (candidate && minDiff <= yMax * 0.15) {
      setLocalHoveredSeriesLabel(candidate)
      onHoverSeriesChange?.(candidate)
    } else {
      setLocalHoveredSeriesLabel(null)
      onHoverSeriesChange?.(null)
    }

    updateTooltipFromEvent(event)
  }

  function handleMouseLeave() {
    onHoverHourChange?.(null)
    setTooltipPos(null)
    setLocalHoveredSeriesLabel(null)
    onHoverSeriesChange?.(null)
  }

  useEffect(() => {
    if (hoverX === undefined || svgRef.current == null) return
    const bounds = svgRef.current.getBoundingClientRect()
    const scaleX = bounds.width / width
    const scaleY = bounds.height / height
    const viewX = leftPadding + (hoverX / xMax) * plotWidth
    const viewY = hoverY === undefined ? topPadding : topPadding + (1 - hoverY / yMax) * plotHeight
    setTooltipPos({ left: viewX * scaleX, top: viewY * scaleY })
  }, [hoverX, hoverY])

  useLayoutEffect(() => {
    if (!tooltipPos || !svgRef.current) {
      setClampedTooltipPos(null)
      return
    }

    const container = svgRef.current
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    const tooltipEl = tooltipRef.current
    const tw = tooltipEl?.offsetWidth ?? 320
    const th = tooltipEl?.offsetHeight ?? 120
    const margin = 8
    const offset = 12

    let left = tooltipPos.left
    left = Math.max(margin + tw / 2, Math.min(left, containerWidth - margin - tw / 2))

    const topAbove = tooltipPos.top - offset - th
    let top: number
    let placeAbove = true

    if (topAbove >= margin) {
      top = topAbove
      placeAbove = true
    } else {
      const topBelow = tooltipPos.top + offset
      if (topBelow + th <= containerHeight - margin) {
        top = topBelow
        placeAbove = false
      } else {
        top = Math.max(margin, Math.min(tooltipPos.top - th - offset, containerHeight - margin - th))
        placeAbove = top <= tooltipPos.top
      }
    }

    setClampedTooltipPos({ left, top, placeAbove })
  }, [tooltipPos, tooltipItems])

  return (
    <div className="relative h-full">
      <svg
        ref={svgRef}
        className="h-full w-full select-none"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        onDragStart={(event) => event.preventDefault()}
        onMouseMove={handlePointerMove}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: 'none', userSelect: 'none' }}
      >
        <defs>
          {Array.from(new Set(series.map((s) => s.fillId).filter(Boolean))).map((fid) => {
            const example = series.find((s) => s.fillId === fid)
            const color = example?.color ?? '#cfd3d9'
            return (
              <linearGradient key={fid} id={fid} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.16" />
                <stop offset="50%" stopColor={color} stopOpacity="0.06" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            )
          })}
        </defs>

        <text x={leftPadding - 8} y={14} fill="#6b7280" fontSize="12" fontWeight="500" textAnchor="end">{leftUnit}</text>
        {rightUnit ? <text x={leftPadding + plotWidth + 8} y={14} fill="#6b7280" fontSize="12" fontWeight="500" textAnchor="start">{rightUnit}</text> : null}

        {yTicks.map((tick, index) => {
          const y = topPadding + (index / (yTicks.length - 1)) * plotHeight
          return (
            <g key={tick}>
              <line x1={leftPadding} x2={leftPadding + plotWidth} y1={y} y2={y} stroke="#dfe8f4" strokeWidth="1" />
              <text x={leftPadding - 8} y={y + 5} fill="#9ca3af" fontSize="12" textAnchor="end">{yTicks[yTicks.length - 1 - index]}</text>
              {rightTicks ? <text x={leftPadding + plotWidth + 8} y={y + 5} fill="#9ca3af" fontSize="12">{rightTicks[rightTicks.length - 1 - index]}</text> : null}
            </g>
          )
        })}

        {TIME_TICKS.map((hour) => {
          const x = leftPadding + (hour / xMax) * plotWidth
          return (
            <text key={hour} x={x} y={height - 12} fill="#9ca3af" fontSize="12" textAnchor="middle">
              {String(hour).padStart(2, '0')}:00
            </text>
          )
        })}

        {series.map((item) => {
          const polylinePoints = buildPolyline(item.points, plotWidth, plotHeight, xMax, yMax)
          const first = item.points[0]
          const last = item.points[item.points.length - 1]
          const areaPath = item.fillId
            ? `M ${(first.x / xMax) * plotWidth},${plotHeight - (first.y / yMax) * plotHeight} ${polylinePoints.split(' ').map((point) => `L ${point}`).join(' ')} L ${(last.x / xMax) * plotWidth},${plotHeight} L ${(first.x / xMax) * plotWidth},${plotHeight} Z`
            : null

          const activeHovered = hoveredSeriesLabel ?? localHoveredSeriesLabel
          const isHighlighted = activeHovered ? activeHovered === item.label : null
          const strokeOpacity = activeHovered ? (isHighlighted ? 1 : 0.12) : (item.muted ? 0.45 : 1)
          const fillOpacity = activeHovered ? (isHighlighted ? 1 : 0.06) : 1
          const strokeWidth = activeHovered ? (isHighlighted ? 3 : 1) : 2

          return (
            <g key={item.label} transform={`translate(${leftPadding} ${topPadding})`}>
              {areaPath ? <path d={areaPath} fill={`url(#${item.fillId})`} style={{ opacity: fillOpacity }} /> : null}
              <polyline
                fill="none"
                points={polylinePoints}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeOpacity}
              />
            </g>
          )
        })}

        {hoverXPixel !== null ? (
          <>
            <line x1={hoverXPixel} x2={hoverXPixel} y1={topPadding} y2={topPadding + plotHeight} stroke="#c2c8d1" strokeDasharray="4 4" strokeWidth="1.25" />
            {hoverYPixel !== null ? <line x1={leftPadding} x2={leftPadding + plotWidth} y1={hoverYPixel} y2={hoverYPixel} stroke="#a8adb5" strokeDasharray="4 4" strokeWidth="1.25" /> : null}

            {hoverLeftLabel && hoverYPixel !== null ? (
              <g transform={`translate(${leftPadding - 66} ${hoverYPixel - 17})`}>
                <rect width="64" height="34" rx="6" fill="#545d6b" />
                <text x="32" y="22" fill="#ffffff" fontSize="13" textAnchor="middle">{hoverLeftLabel}</text>
              </g>
            ) : null}

            {hoverRightLabel && hoverYPixel !== null ? (
              <g transform={`translate(${leftPadding + plotWidth + 6} ${hoverYPixel - 17})`}>
                <rect width="80" height="34" rx="6" fill="#545d6b" />
                <text x="40" y="22" fill="#ffffff" fontSize="13" textAnchor="middle">{hoverRightLabel}</text>
              </g>
            ) : null}

            {hoverBottomLabel ? (
              <g transform={`translate(${hoverXPixel - 34} ${height - 26})`}>
                <rect width="68" height="34" rx="6" fill="#545d6b" />
                <text x="34" y="22" fill="#ffffff" fontSize="13" textAnchor="middle">{hoverBottomLabel}</text>
              </g>
            ) : null}
          </>
        ) : null}
      </svg>

      {tooltipTitle && tooltipItems && tooltipPos ? (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 w-[320px] rounded-[10px] border border-[#edf1f5] bg-white/95 px-6 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
          style={{
            left: clampedTooltipPos ? clampedTooltipPos.left : tooltipPos.left,
            top: clampedTooltipPos ? clampedTooltipPos.top : tooltipPos.top,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="mb-2 text-[18px] text-[#5f6773]">{tooltipTitle}</div>
          <div className="space-y-2 text-[14px] text-[#2c3948]">
            {tooltipItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium">{item.label}:</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MetricsPanel({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <h3 className="mb-7 text-[22px] font-semibold tracking-tight text-[#101828]">Real-time Data</h3>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-baseline gap-4 text-[14px] text-[#737b89]">
            <span>{metric.label}:</span>
            <span className="text-[16px] font-semibold text-[#3b3f46]">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusPanel() {
  return (
    <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <h3 className="mb-7 text-[22px] font-semibold tracking-tight text-[#101828]">Device Status</h3>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 text-[16px] text-[#2b3441] md:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((status) => (
          <div key={status.label} className="flex items-center gap-3">
            <span className={`h-3.5 w-3.5 rounded-full ${status.active ? 'bg-[#4dd390]' : 'bg-[#b9bdc2]'}`} />
            <span>{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PVDetailsPage({ params }: { params?: { id?: string } }) {
  const router = useRouter()
  const id = params?.id ? decodeURIComponent(params.id) : '1#PV'
  const addVisitedTab = usePVMonitoringStore((s) => s.addVisitedTab)
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => formatDateLabel(new Date()))
  const [hoveredPowerHour, setHoveredPowerHour] = useState<number | null>(null)
  const [hoveredBranchHour, setHoveredBranchHour] = useState<number | null>(null)
  const [branchPage, setBranchPage] = useState(0)
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [hoveredSeriesPower, setHoveredSeriesPower] = useState<string | null>(null)
  const [hoveredSeriesBranch, setHoveredSeriesBranch] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const route = `/pv/details?id=${encodeURIComponent(id)}`
    addVisitedTab(route)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    setHoveredPowerHour(null)
    setHoveredBranchHour(null)
    setBranchPage(0)
  }, [id, selectedDate])

  useEffect(() => {
    const labels = new Set<string>()
    const snapshot = mounted ? buildTelemetrySnapshot(id, selectedDate, now) : ({ powerSeries: [], branchPages: [] } as Partial<TelemetrySnapshot>)
    snapshot.powerSeries?.forEach((s) => labels.add(s.label))
    snapshot.branchPages?.forEach((p) => p.legendSeries.forEach((s) => labels.add(s.label)))

    if (labels.size === 0) return

    setVisibleSeries((prev) => {
      const out: Record<string, boolean> = {}
      labels.forEach((l) => {
        if (prev[l] !== undefined) {
          out[l] = prev[l]
          return
        }

        if (l.startsWith('Branch ')) {
          const n = parseInt(l.slice(7), 10)
          out[l] = !Number.isNaN(n) ? n <= 4 : true
        } else {
          out[l] = true
        }
      })
      return out
    })
  }, [id, mounted, selectedDate, now])

  function toggleSeries(label: string) {
    setVisibleSeries((prev) => ({ ...prev, [label]: !(prev[label] !== false) }))
  }

  const telemetry = useMemo(() => {
    if (!mounted) {
      return {
        powerSeries: [],
        powerSamples: [],
        branchPages: [],
        metrics: [],
        latestHour: 0,
      } as TelemetrySnapshot
    }

    return buildTelemetrySnapshot(id, selectedDate, now)
  }, [id, selectedDate, now, mounted])
  const hoveredPowerSample = useMemo(() => closestByHour(telemetry.powerSamples, hoveredPowerHour), [telemetry.powerSamples, hoveredPowerHour])
  const allBranchLegend = (telemetry.branchPages ?? []).flatMap((p) => p.legendSeries ?? [])
  const currentBranchPage = telemetry.branchPages[branchPage] ?? telemetry.branchPages[0] ?? { plottedSeries: [], legendSeries: [] }
  const currentLegendSeries = currentBranchPage?.legendSeries ?? []
  const telemetryBranchCount = (telemetry.branchPages ?? []).length
  const powerTooltip: TooltipItem[] = useMemo(() => {
    if (!hoveredPowerSample) {
      return []
    }
    const items: TooltipItem[] = []
    const activePower = hoveredPowerSample.activePower ?? 0
    const dcPower = hoveredPowerSample.dcPower ?? 0
    const intensity = hoveredPowerSample.intensity ?? 0
    
    if (visibleSeries['Active Power'] !== false) items.push({ label: 'Active Power', value: `${activePower.toFixed(2)} kW`, color: '#28b3d6' })
    if (visibleSeries['DC Power'] !== false) items.push({ label: 'DC Power', value: `${dcPower.toFixed(2)} kW`, color: '#ea5aad' })
    if (visibleSeries['Intensity'] !== false) items.push({ label: 'Intensity', value: `${intensity.toFixed(2)} W/m²`, color: '#ffa42b' })

    return items
  }, [hoveredPowerSample, visibleSeries])

  const branchTooltip: TooltipItem[] = useMemo(() => {
    if (hoveredBranchHour == null) {
      return []
    }
    return allBranchLegend
      .filter((s) => visibleSeries[s.label] !== false)
      .map((series) => {
        const sample = closestByHour(series.points.map((p) => ({ hour: p.x, value: p.y })), hoveredBranchHour)
        const value = sample?.value ?? 0
        return { label: series.label, value: `${value.toFixed(2)} A`, color: series.color }
      })
  }, [allBranchLegend, hoveredBranchHour, visibleSeries])

  const hoveredBranchAvg = useMemo(() => {
    if (hoveredBranchHour == null) {
      return undefined
    }

    const values = allBranchLegend
      .filter((s) => visibleSeries[s.label] !== false)
      .map((series) => {
        const sample = closestByHour(series.points.map((p) => ({ hour: p.x, value: p.y })), hoveredBranchHour)
        return sample?.value ?? 0
      })

    return values.reduce((s, v) => s + v, 0) / Math.max(1, values.length)
  }, [allBranchLegend, hoveredBranchHour, visibleSeries])

  return (
    <DashboardLayout
      initialActiveTab="PV"
      visitedRoute={`/monitor/pv/details?id=${encodeURIComponent(id)}`}
    >
          <main className="flex-1 overflow-auto px-5 py-5" style={{ maxWidth: 'none', marginInline: 0 }}>
            <div className="mb-5 flex items-center gap-4 text-[#1b2532]">
              <button type="button" onClick={() => router.push('/monitor/pv')} className="rounded-full p-1 text-[#1b2532] transition-colors hover:bg-[#edf2f8]">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#52d08e]" />
                  <h1 className="text-[23px] font-semibold tracking-tight">{id}</h1>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-5 text-[14px] text-[#9aa2ad]">
                  <span>Rated Power: <strong className="font-semibold text-[#41454b]">125kW</strong></span>
                  <span className="h-5 w-px bg-[#dde4ee]" />
                  <span>Model: <strong className="font-semibold text-[#41454b]">SG125CX</strong></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 xl:col-span-6">
                <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)] flex flex-col min-h-[460px] h-[460px]">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <h2 className="text-[18px] font-semibold tracking-tight text-[#101828]">Power Curves</h2>
                    <DateControl value={selectedDate} onChange={setSelectedDate} />
                  </div>

                  <div className="mb-3 flex items-center">
                    <ChartLegend series={telemetry.powerSeries} visibleMap={visibleSeries} onToggle={toggleSeries} onHover={setHoveredSeriesPower} />
                  </div>

                  <div className="flex-1">
                    <ChartPlot
                    leftUnit="kW"
                    rightUnit="W/m²"
                    yTicks={[0, 20, 40, 60, 80, 100]}
                    rightTicks={[0, 100, 200, 300, 400, 500, 600, 700]}
                    series={telemetry.powerSeries.filter((s) => visibleSeries[s.label] !== false)}
                    hoverX={hoveredPowerSample?.hour}
                    hoverY={hoveredPowerSample?.activePower ?? 0}
                    hoverBottomLabel={hoveredPowerSample ? formatTimeLabel(hoveredPowerSample.hour ?? 0) : undefined}
                    hoverLeftLabel={hoveredPowerSample ? (hoveredPowerSample.activePower ?? 0).toFixed(2) : undefined}
                    hoverRightLabel={hoveredPowerSample ? (hoveredPowerSample.intensity ?? 0).toFixed(2) : undefined}
                    tooltipTitle={hoveredPowerSample ? formatTimeLabel(hoveredPowerSample.hour ?? 0) : undefined}
                    tooltipItems={hoveredPowerSample ? powerTooltip : undefined}
                    onHoverHourChange={setHoveredPowerHour}
                    hoveredSeriesLabel={hoveredSeriesPower}
                    onHoverSeriesChange={setHoveredSeriesPower}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-6">
                <div className="rounded-[20px] border border-[#e6edf5] bg-white px-5 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)] flex flex-col min-h-[460px] h-[460px]">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <h2 className="text-[18px] font-semibold tracking-tight text-[#101828]">Current Curves</h2>
                    <DateControl value={selectedDate} onChange={setSelectedDate} />
                  </div>

                    <div className="mb-3 flex items-center justify-between gap-4">
                    <ChartLegend series={currentLegendSeries} visibleMap={visibleSeries} onToggle={toggleSeries} onHover={setHoveredSeriesBranch} />
                    <div className="flex shrink-0 items-center gap-3 text-[12px] font-medium text-[#3f4f64]">
                      <button type="button" onClick={() => setBranchPage((value) => Math.max(value - 1, 0))} disabled={branchPage === 0} className="disabled:opacity-40">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <div>{branchPage + 1}/{telemetryBranchCount}</div>
                      <button type="button" onClick={() => setBranchPage((value) => Math.min(value + 1, telemetryBranchCount - 1))} disabled={branchPage === telemetryBranchCount - 1} className="disabled:opacity-40">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <ChartPlot
                      leftUnit="A"
                      yTicks={[0, 1, 2, 3, 4, 5, 6, 7]}
                      series={allBranchLegend.filter((s) => visibleSeries[s.label] !== false)}
                      hoverX={hoveredBranchHour ?? undefined}
                      hoverY={hoveredBranchAvg}
                      hoverBottomLabel={hoveredBranchHour != null ? formatTimeLabel(hoveredBranchHour) : undefined}
                      hoverLeftLabel={hoveredBranchAvg !== undefined ? hoveredBranchAvg.toFixed(2) : undefined}
                      tooltipTitle={hoveredBranchHour != null ? formatTimeLabel(hoveredBranchHour) : undefined}
                      tooltipItems={hoveredBranchHour != null ? branchTooltip : undefined}
                      onHoverHourChange={setHoveredBranchHour}
                      hoveredSeriesLabel={hoveredSeriesBranch}
                      onHoverSeriesChange={setHoveredSeriesBranch}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <MetricsPanel metrics={telemetry.metrics} />
              </div>

              <div className="col-span-12">
                <StatusPanel />
              </div>
            </div>
          </main>
    </DashboardLayout>
  )
}
