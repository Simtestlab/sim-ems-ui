"use client"

import React, { useState, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import DashboardCard from '@/modules/dashboard/components/DashboardCard'
import PlantOverview from '@/modules/pv-monitoring/components/PlantOverview'
import ChartPlaceholder from '../components/ChartPlaceholder'

type Period = 'day' | 'month' | 'year'

/* ─── Deterministic pseudo-random (seed-based) ───────────────────────────── */
function sr(seed: number) {
  return ((Math.abs(Math.sin(seed * 9301 + 49297)) * 233280) % 233280) / 233280
}

/* ─── Axis label generators ─────────────────────────────────────────────── */
function dayLabels() {
  return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
}
function monthLabels(value: string) {
  const [y, m] = value.split('-').map(Number)
  const days = new Date(y, m, 0).getDate()
  return Array.from({ length: days }, (_, i) => String(i + 1).padStart(2, '0'))
}
function yearLabels() {
  return Array.from({ length: 12 }, (_, i) => `M${i + 1}`)
}

/* ─── Power Curves data generator ──────────────────────────────────────────
   Returns: { labels, pv, bess, wind, load, grid, soc }
*/
function genPowerCurves(period: Period, value: string) {
  const labels = period === 'day' ? dayLabels()
    : period === 'month' ? monthLabels(value)
    : yearLabels()
  const n = labels.length

  const pv = Array.from({ length: n }, (_, i) => {
    if (period === 'day') {
      if (i < 6 || i > 18) return 0
      const x = (i - 6) / 12
      return +Math.max(0, (-4 * x * (x - 1)) * 195 + (sr(i * 3) - 0.5) * 18).toFixed(1)
    }
    if (period === 'month') return +(70 + sr(i * 7) * 130).toFixed(1)
    return +(50 + sr(i * 11) * 150).toFixed(1)
  })

  const load = Array.from({ length: n }, (_, i) => {
    if (period === 'day') {
      const base = (i >= 8 && i <= 22) ? 90 : 55
      return +(base + sr(i * 13) * 35).toFixed(1)
    }
    return +(75 + sr(i * 17) * 50).toFixed(1)
  })

  const wind = Array.from({ length: n }, (_, i) => +(15 + sr(i * 19) * 30).toFixed(1))

  const bess = Array.from({ length: n }, (_, i) => {
    const surplus = pv[i] + wind[i] - load[i]
    return +(surplus * 0.5 + (sr(i * 23) - 0.5) * 20).toFixed(1)
  })

  const grid = Array.from({ length: n }, (_, i) =>
    +(load[i] - pv[i] - wind[i] - bess[i] + (sr(i * 29) - 0.5) * 10).toFixed(1)
  )

  // SOC: starts at 62%, integrates bess charge/discharge
  const soc: number[] = []
  let s = 62
  for (let i = 0; i < n; i++) {
    s = Math.min(100, Math.max(10, s - bess[i] * 0.04 + (sr(i * 31) - 0.5) * 1.5))
    soc.push(+s.toFixed(1))
  }

  return { labels, pv, bess, wind, load, grid, soc }
}

/* ─── Energy Statistics data generator ─────────────────────────────────────
   Returns: { labels, bessCharge, bessDischarge, pvEnergy, windEnergy, dgEnergy }
*/
function genEnergyStats(period: Period, value: string) {
  const labels = period === 'day' ? dayLabels()
    : period === 'month' ? monthLabels(value)
    : yearLabels()
  const n = labels.length

  const scale = period === 'year' ? 3000 : period === 'month' ? 100 : 3

  const pvEnergy = Array.from({ length: n }, (_, i) => {
    if (period === 'day') {
      if (i < 6 || i > 18) return 0
      const x = (i - 6) / 12
      return +Math.max(0, (-4 * x * (x - 1)) * scale + sr(i * 7) * scale * 0.2).toFixed(2)
    }
    return +(sr(i * 7) * scale).toFixed(2)
  })

  const bessCharge = Array.from({ length: n }, (_, i) => {
    if (period === 'day') return i >= 9 && i <= 15 ? +(sr(i * 11) * scale * 0.6).toFixed(2) : 0
    return +(sr(i * 11) * scale * 0.4).toFixed(2)
  })

  const bessDischarge = Array.from({ length: n }, (_, i) => {
    if (period === 'day') return (i < 9 || i > 17) ? +(sr(i * 13) * scale * 0.5).toFixed(2) : 0
    return +(sr(i * 13) * scale * 0.5).toFixed(2)
  })

  const windEnergy = Array.from({ length: n }, (_, i) =>
    +(sr(i * 17) * scale * 0.25).toFixed(2)
  )

  const dgEnergy = Array.from({ length: n }, () => 0)

  return { labels, pvEnergy, bessCharge, bessDischarge, windEnergy, dgEnergy }
}

/* ─── Chart option builders ─────────────────────────────────────────────── */
function powerCurvesOption(period: Period, value: string) {
  const { labels, pv, bess, wind, load, grid, soc } = genPowerCurves(period, value)
  const areaColor = (hex: string, a0 = 0.25, a1 = 0.05) => ({
    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [{ offset: 0, color: hex.replace(')', `,${a0})`) }, { offset: 1, color: hex.replace(')', `,${a1})`) }],
  })
  const mkSeries = (name: string, data: number[], color: string, yAxis = 0, area = false) => ({
    name, type: 'line', data, smooth: true, showSymbol: false,
    yAxisIndex: yAxis,
    lineStyle: { color, width: 2 },
    itemStyle: { color },
    ...(area ? { areaStyle: { color: areaColor(color.startsWith('#') ? `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)}` : color) } } : {}),
  })

  return {
    grid: { top: 60, right: 60, bottom: 40, left: 60, containLabel: false },
    legend: {
      top: 8, left: 'center', itemWidth: 12, itemHeight: 8,
      textStyle: { fontSize: 11, color: '#4b5563' },
    },
    tooltip: {
      trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e6edf5', borderWidth: 1,
      textStyle: { color: '#0f1724', fontSize: 12 },
    },
    xAxis: {
      type: 'category', data: labels,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10,
        interval: period === 'day' ? 1 : period === 'month' ? 2 : 0 },
    },
    yAxis: [
      { type: 'value', name: 'kW', nameTextStyle: { color: '#94a3b8', fontSize: 11 },
        axisLabel: { color: '#94a3b8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '%', min: 0, max: 100,
        nameTextStyle: { color: '#94a3b8', fontSize: 11 },
        axisLabel: { color: '#94a3b8', fontSize: 10, formatter: '{value}' },
        splitLine: { show: false },
        axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: 'BESS Power', type: 'line', data: bess, smooth: true, showSymbol: false,
        lineStyle: { color: '#3b82f6', width: 2 }, itemStyle: { color: '#3b82f6' },
        areaStyle: { color: { type:'linear',x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(59,130,246,0.25)'},{offset:1,color:'rgba(59,130,246,0.03)'}] } } },
      { name: 'PV Power', type: 'line', data: pv, smooth: true, showSymbol: false,
        lineStyle: { color: '#22c55e', width: 2 }, itemStyle: { color: '#22c55e' },
        areaStyle: { color: { type:'linear',x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(34,197,94,0.25)'},{offset:1,color:'rgba(34,197,94,0.03)'}] } } },
      { name: 'Wind Turbine Power', type: 'line', data: wind, smooth: true, showSymbol: false,
        lineStyle: { color: '#f59e0b', width: 2 }, itemStyle: { color: '#f59e0b' } },
      { name: 'Grid Power', type: 'line', data: grid, smooth: true, showSymbol: false,
        lineStyle: { color: '#ec4899', width: 2 }, itemStyle: { color: '#ec4899' } },
      { name: 'Load Power', type: 'line', data: load, smooth: true, showSymbol: false,
        lineStyle: { color: '#f87171', width: 2 }, itemStyle: { color: '#f87171' },
        areaStyle: { color: { type:'linear',x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(248,113,113,0.2)'},{offset:1,color:'rgba(248,113,113,0.03)'}] } } },
      { name: 'SOC (state Of Charge)', type: 'line', data: soc, smooth: true, showSymbol: false,
        yAxisIndex: 1,
        lineStyle: { color: '#06b6d4', width: 2 }, itemStyle: { color: '#06b6d4' } },
    ],
  }
}

function energyStatsOption(period: Period, value: string) {
  const { labels, pvEnergy, bessCharge, bessDischarge, windEnergy, dgEnergy } = genEnergyStats(period, value)
  return {
    grid: { top: 70, right: 30, bottom: 40, left: 70, containLabel: false },
    legend: {
      top: 8, left: 'center', itemWidth: 12, itemHeight: 8,
      textStyle: { fontSize: 11, color: '#4b5563' },
    },
    tooltip: {
      trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e6edf5', borderWidth: 1,
      textStyle: { color: '#0f1724', fontSize: 12 },
    },
    xAxis: {
      type: 'category', data: labels,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10,
        interval: period === 'day' ? 1 : period === 'month' ? 2 : 0 },
    },
    yAxis: {
      type: 'value', name: 'kWh',
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLine: { show: false }, axisTick: { show: false },
    },
    series: [
      { name: 'BESS Charge Energy', type: 'line', data: bessCharge, smooth: true,
        showSymbol: true, symbolSize: 5,
        lineStyle: { color: '#3b82f6', width: 2 }, itemStyle: { color: '#3b82f6' } },
      { name: 'BESS Discharge Energy', type: 'line', data: bessDischarge, smooth: true,
        showSymbol: true, symbolSize: 5,
        lineStyle: { color: '#f59e0b', width: 2 }, itemStyle: { color: '#f59e0b' } },
      { name: 'PV Generation Energy', type: 'line', data: pvEnergy, smooth: true,
        showSymbol: true, symbolSize: 5,
        lineStyle: { color: '#22c55e', width: 2 }, itemStyle: { color: '#22c55e' },
        areaStyle: { color: { type:'linear',x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:'rgba(34,197,94,0.3)'},{offset:1,color:'rgba(34,197,94,0.04)'}] } } },
      { name: 'Wind Turbine Generation', type: 'line', data: windEnergy, smooth: true,
        showSymbol: true, symbolSize: 5,
        lineStyle: { color: '#ec4899', width: 2 }, itemStyle: { color: '#ec4899' } },
      { name: 'DG Generation Energy', type: 'line', data: dgEnergy, smooth: true,
        showSymbol: true, symbolSize: 5,
        lineStyle: { color: '#f9a8d4', width: 2 }, itemStyle: { color: '#f9a8d4' } },
    ],
  }
}

/* ─── Period picker helper ──────────────────────────────────────────────── */
function PeriodPicker({ period, value, onChange, onPeriodChange }: {
  period: Period; value: string
  onChange: (v: string) => void
  onPeriodChange: (p: Period) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {period === 'day' && (
        <input type="date" value={value} onChange={e => onChange(e.target.value)}
          className="h-8 rounded-md border border-[#e6edf5] px-3 text-[13px] text-[#374151]" />
      )}
      {period === 'month' && (
        <input type="month" value={value} onChange={e => onChange(e.target.value)}
          className="h-8 rounded-md border border-[#e6edf5] px-3 text-[13px] text-[#374151]" />
      )}
      {period === 'year' && (
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          min="2020" max="2035"
          className="h-8 w-20 rounded-md border border-[#e6edf5] px-3 text-[13px] text-[#374151]" />
      )}
      <div className="inline-flex rounded-md border border-[#e6edf5] bg-[#f3f6fb] p-0.5 text-[12px]">
        {(['day', 'month', 'year'] as Period[]).map(p => (
          <button key={p} onClick={() => onPeriodChange(p)}
            className={`px-3 py-1 rounded transition-all capitalize ${
              period === p ? 'bg-white shadow-sm text-[#1677ff] font-semibold' : 'text-[#6b7280]'
            }`}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function OverviewPage() {
  const today = new Date().toISOString().slice(0, 10)
  const thisMonth = today.slice(0, 7)
  const thisYear = today.slice(0, 4)

  const [pcPeriod, setPcPeriod] = useState<Period>('day')
  const [pcValue, setPcValue] = useState(today)

  const [esPeriod, setEsPeriod] = useState<Period>('day')
  const [esValue, setEsValue] = useState(today)

  function handlePcPeriod(p: Period) {
    setPcPeriod(p)
    setPcValue(p === 'day' ? today : p === 'month' ? thisMonth : thisYear)
  }
  function handleEsPeriod(p: Period) {
    setEsPeriod(p)
    setEsValue(p === 'day' ? today : p === 'month' ? thisMonth : thisYear)
  }

  const pcOption = useMemo(() => powerCurvesOption(pcPeriod, pcValue), [pcPeriod, pcValue])
  const esOption = useMemo(() => energyStatsOption(esPeriod, esValue), [esPeriod, esValue])

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-y-auto bg-transparent">
      <div className="flex-1 p-6 space-y-6">
        <PlantOverview />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 xl:col-span-6">
            <DashboardCard
              title={<span>Power Curves</span>}
              headerRight={
                <div className="flex items-center gap-2">
                  <input type="date" className="h-9 rounded-md border border-[#e6edf5] px-3 text-[13px]" defaultValue="2026-05-13" />
                  <div className="inline-flex rounded-md bg-[#f3f6fb] p-1 text-[13px]"><button className="px-2">Day</button><button className="px-2">Month</button><button className="px-2">Year</button></div>
                </div>
              }
              className="h-[520px]"
            >
              <ChartPlaceholder height={520} />
            </DashboardCard>
          </div>

          <div className="col-span-12 xl:col-span-6">
            <DashboardCard
              title={<span>Power & Energy Statistics</span>}
              headerRight={
                <div className="flex items-center gap-2">
                  <input type="date" className="h-9 rounded-md border border-[#e6edf5] px-3 text-[13px]" defaultValue="2026-05-13" />
                  <div className="inline-flex rounded-md bg-[#f3f6fb] p-1 text-[13px]"><button className="px-2">Day</button><button className="px-2">Month</button><button className="px-2">Year</button></div>
                </div>
              }
              className="h-[520px]"
            >
              <ChartPlaceholder height={520} />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  )
}
