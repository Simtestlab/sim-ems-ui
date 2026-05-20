"use client"

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, CalendarDays } from 'lucide-react'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Props = { params?: { id?: string } }

type Sample = { hour: number; v1: number; v2: number }

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const TIME_LABELS = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00',
  '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00',
  '19:00','20:00','21:00','22:00','23:00']

/** Build flat-line samples at 0 for a shutdown DG */
function buildFlatSamples(): Sample[] {
  return TIME_LABELS.map((_, i) => ({ hour: i, v1: 0, v2: 0 }))
}

/* ─── SVG dual-axis line chart ───────────────────────────────────────────── */
type ChartProps = {
  title: string
  date: string
  series1Label: string
  series1Color: string
  series1Unit: string
  series2Label: string
  series2Color: string
  series2Unit: string
  samples: Sample[]
}

function DualLineChart({ title, date, series1Label, series1Color, series1Unit, series2Label, series2Color, series2Unit, samples }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(500)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const PAD = { top: 24, right: 40, bottom: 48, left: 44 }
  const height = 180
  const chartW = Math.max(width - PAD.left - PAD.right, 100)
  const chartH = height - PAD.top - PAD.bottom

  // For a shutdown DG all values are 0 → draw flat bottom line with Y range 0-1
  const yMax = 1
  const xMax = TIME_LABELS.length - 1

  const toX = (i: number) => (i / xMax) * chartW
  const toY = (v: number) => chartH - (v / yMax) * chartH

  const buildPolyline = (key: 'v1' | 'v2') =>
    samples.map((s, i) => `${toX(i)},${toY(s[key])}`).join(' ')

  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1]
  // show every 2 hours
  const xTickIndices = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-semibold text-[#0f1724]">{title}</h3>
        <div className="flex items-center gap-1.5 border border-[#e2e8f0] rounded px-2.5 py-1 text-[12px] text-[#64748b]">
          <CalendarDays className="w-3.5 h-3.5"/>
          {date}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-2">
        <span className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
          <span className="inline-block w-5 h-[2px]" style={{ background: series1Color }}/>
          {series1Label}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
          <span className="inline-block w-5 h-[2px]" style={{ background: series2Color }}/>
          {series2Label}
        </span>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="flex-1 min-h-0">
        <svg width={width} height={height}>
          <g transform={`translate(${PAD.left},${PAD.top})`}>
            {/* Grid */}
            {yTicks.map(tick => (
              <g key={tick}>
                <line x1={0} y1={toY(tick)} x2={chartW} y2={toY(tick)} stroke="#f1f5f9" strokeWidth={1}/>
                <text x={-6} y={toY(tick)+4} textAnchor="end" fontSize={10} fill="#94a3b8">{tick === 1 ? '1' : tick.toFixed(1)}</text>
                <text x={chartW+6} y={toY(tick)+4} textAnchor="start" fontSize={10} fill="#94a3b8">{tick === 1 ? '1' : tick.toFixed(1)}</text>
              </g>
            ))}

            {/* Y-axis labels */}
            <text x={-PAD.left+2} y={-10} fontSize={11} fill="#64748b">{series1Unit}</text>
            <text x={chartW+PAD.right-4} y={-10} textAnchor="end" fontSize={11} fill="#64748b">{series2Unit}</text>

            {/* X-axis ticks */}
            {xTickIndices.map(i => (
              <text key={i} x={toX(i)} y={chartH+16} textAnchor="middle" fontSize={10} fill="#94a3b8">
                {TIME_LABELS[i]}
              </text>
            ))}

            {/* Baseline */}
            <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke="#e2e8f0" strokeWidth={1}/>

            {/* Series 1 */}
            <polyline
              points={buildPolyline('v1')}
              fill="none"
              stroke={series1Color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Series 2 */}
            <polyline
              points={buildPolyline('v2')}
              fill="none"
              stroke={series2Color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Axes */}
            <line x1={0} y1={0} x2={0} y2={chartH} stroke="#e2e8f0" strokeWidth={1}/>
            <line x1={chartW} y1={0} x2={chartW} y2={chartH} stroke="#e2e8f0" strokeWidth={1}/>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* ─── Metric card ────────────────────────────────────────────────────────── */
type MetricCardProps = {
  label: string
  value: string | number
  unit?: string
  iconBg: string
  icon: React.ReactNode
}

function MetricCard({ label, value, unit, iconBg, icon }: MetricCardProps) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#e8edf5] rounded-xl px-4 py-3 min-w-0">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-[#94a3b8] leading-tight whitespace-nowrap">{label}</div>
        <div className="text-[18px] font-bold text-[#0f1724] leading-tight">
          {value}
          {unit && <span className="text-[12px] font-medium text-[#64748b] ml-1">{unit}</span>}
        </div>
      </div>
    </div>
  )
}

/* ─── Realtime data row ──────────────────────────────────────────────────── */
type DataFieldProps = { label: string; value: string | number; unit?: string }

function DataField({ label, value, unit }: DataFieldProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[12px] text-[#64748b] whitespace-nowrap">{label}:</span>
      <span className="text-[13px] font-bold text-[#0f1724]">{value}</span>
      {unit && <span className="text-[12px] text-[#64748b]">{unit}</span>}
    </div>
  )
}

/* ─── Status indicator ───────────────────────────────────────────────────── */
type StatusDotProps = { label: string; active: boolean }

function StatusDot({ label, active }: StatusDotProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#22c55e]' : 'bg-[#94a3b8]'}`}/>
      <span className="text-[13px] text-[#374151]">{label}</span>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function DGDetailsPage({ params }: Props) {
  const router = useRouter()
  const [today] = useState(() => formatDate(new Date()))
  const [samples] = useState(() => buildFlatSamples())

  /* Realtime data state (all 0 for shutdown DG) */
  const rt = {
    totalActivePower: 0, totalReactivePower: 0,
    phaseAVoltage: 0, phaseBVoltage: 0, phaseCVoltage: 0,
    phaseACurrent: 0, phaseBCurrent: 0, phaseACurrent2: 0, phaseCCurrent: 0,
    frequency: 0, powerFactor: 0,
  }

  const dgId = params?.id ?? '1'
  const dgName = `${dgId}#DG`

  return (
    <DashboardLayout initialActiveTab="DG" visitedRoute={`/monitor/dg/details?id=${dgId}`}>
      <div className="flex-1 overflow-auto bg-[#f8fafc] min-h-0">
        <div className="max-w-none px-6 py-5 space-y-5">

          {/* ── Header ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-lg hover:bg-[#e2e8f0] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#64748b]"/>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]"/>
              <span className="text-[18px] font-bold text-[#0f1724]">{dgName}</span>
            </div>
            <span className="text-[13px] text-[#64748b]">
              Rated Power: <span className="font-semibold text-[#374151]">500kW</span>
            </span>
            <span className="text-[13px] text-[#64748b]">
              Model: <span className="font-semibold text-[#374151]">CUMMINS-QSX15</span>
            </span>
          </div>

          {/* ── Metric Cards Row 1 ── */}
          <div className="grid grid-cols-6 gap-3">
            <MetricCard
              label="Operating Status"
              value="Shutdown"
              iconBg="#f0fdf4"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              }
            />
            <MetricCard
              label="Real-time Power"
              value="0"
              unit="kW"
              iconBg="#eff6ff"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              }
            />
            <MetricCard
              label="Daily Charge"
              value="0"
              unit="kWh"
              iconBg="#fffbeb"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              }
            />
            <MetricCard
              label="Monthly Charge Energy"
              value="0"
              unit="kWh"
              iconBg="#f0fdfa"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#14b8a6" strokeWidth="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              }
            />
            <MetricCard
              label="Yearly Charge Energy"
              value="0"
              unit="kWh"
              iconBg="#eef2ff"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#6366f1" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  <path d="M21 3v4l-4-1"/>
                </svg>
              }
            />
            <MetricCard
              label="Cumulative Charge"
              value="0"
              unit="kWh"
              iconBg="#faf5ff"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
              }
            />
          </div>

          {/* ── Metric Cards Row 2 ── */}
          <div className="grid grid-cols-6 gap-3">
            <MetricCard
              label="Load Factor"
              value="0"
              unit="%"
              iconBg="#fdf2f8"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#ec4899" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              }
            />
            <MetricCard
              label="Fuel Level"
              value="0"
              unit="%"
              iconBg="#f0fdf4"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#16a34a" strokeWidth="2">
                  <path d="M3 22V8l9-6 9 6v14H3z"/>
                  <path d="M9 22V12h6v10"/>
                </svg>
              }
            />
            <MetricCard
              label="Engine Oil Temperature"
              value="0"
              unit="°C"
              iconBg="#f0f9ff"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#0ea5e9" strokeWidth="2">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                </svg>
              }
            />
            <MetricCard
              label="RPM"
              value="0"
              unit="rpm"
              iconBg="#fff1f2"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                </svg>
              }
            />
            <MetricCard
              label="Cumulative Starts"
              value="0"
              iconBg="#ecfeff"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#06b6d4" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              }
            />
            <MetricCard
              label="Cumulative Run Time"
              value="0"
              unit="h"
              iconBg="#f9fafb"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#6b7280" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              }
            />
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-[#e8edf5] rounded-xl p-4" style={{ height: 280 }}>
              <DualLineChart
                title="Power Curve"
                date={today}
                series1Label="Total Active Power"
                series1Color="#22c55e"
                series1Unit="kW"
                series2Label="Total Reactive Power"
                series2Color="#3b82f6"
                series2Unit="kVar"
                samples={samples}
              />
            </div>
            <div className="bg-white border border-[#e8edf5] rounded-xl p-4" style={{ height: 280 }}>
              <DualLineChart
                title="Voltage & Current Curve"
                date={today}
                series1Label="Three-phase Voltage"
                series1Color="#22c55e"
                series1Unit="V"
                series2Label="Three-phase Current"
                series2Color="#3b82f6"
                series2Unit="A"
                samples={samples}
              />
            </div>
          </div>

          {/* ── Real-time Data ── */}
          <div className="bg-white border border-[#e8edf5] rounded-xl p-5">
            <h3 className="text-[16px] font-semibold text-[#0f1724] mb-4">Real-time Data</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3">
              <DataField label="Total Active Power"    value={rt.totalActivePower}    unit="kW"/>
              <DataField label="Total Reactive Power"  value={rt.totalReactivePower}  unit="kVar"/>
              <DataField label="Phase A Voltage"       value={rt.phaseAVoltage}       unit="V"/>
              <DataField label="Phase B Voltage"       value={rt.phaseBVoltage}       unit="V"/>
              <DataField label="Phase C Voltage"       value={rt.phaseCVoltage}       unit="V"/>
              <DataField label="Phase A Current"       value={rt.phaseACurrent}       unit="A"/>
              <DataField label="Phase B Current"       value={rt.phaseBCurrent}       unit="A"/>
              <DataField label="Phase C Current"       value={rt.phaseCCurrent}       unit="A"/>
              <DataField label="Frequency"             value={rt.frequency}           unit="Hz"/>
              <DataField label="Power Factor"          value={rt.powerFactor}/>
            </div>
          </div>

          {/* ── Status ── */}
          <div className="bg-white border border-[#e8edf5] rounded-xl p-5">
            <h3 className="text-[16px] font-semibold text-[#0f1724] mb-4">Status</h3>
            <div className="grid grid-cols-4 gap-4">
              <StatusDot label="Running Status"  active={false}/>
              <StatusDot label="Breaker Status"  active={false}/>
              <StatusDot label="Alarm Status"    active={false}/>
              <StatusDot label="Remote Mode"     active={true}/>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
