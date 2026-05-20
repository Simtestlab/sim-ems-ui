"use client"

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import * as echarts from 'echarts'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import MonitoringFilters from '@/modules/meter/components/MonitoringFilters'
import ChartCard from '@/modules/live-monitoring/components/ChartCard'
import { generateDayData } from '@/modules/live-monitoring/utils/simulation'
import { makeTooltipFormatter } from '@/modules/live-monitoring/utils/chart'

const ReactECharts = dynamic(() => import('echarts-for-react').then((m) => m.default), { ssr: false })

export default function Page() {
  const [query, setQuery] = useState('')
  const [selectedMeter, setSelectedMeter] = useState<string>('1#Grid Meter')
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))

  const sim = useMemo(() => generateDayData(42, new Date(date), 10, 1), [date, selectedMeter])

  // Dynamic metric values based on selected meter
  const metrics = useMemo(() => {
    if (selectedMeter === '1#Grid Meter') {
      return [
        { id: 'va', label: 'Phase A Voltage', value: '399.4', unit: 'V' },
        { id: 'vb', label: 'Phase B Voltage', value: '399', unit: 'V' },
        { id: 'vc', label: 'Phase C Voltage', value: '400.1', unit: 'V' },
        { id: 'ia', label: 'Phase A Current', value: '172.6', unit: 'A' },
        { id: 'ib', label: 'Phase B Current', value: '178.9', unit: 'A' },
        { id: 'ic', label: 'Phase C Current', value: '176.1', unit: 'A' },
        { id: 'p', label: 'Active Power', value: '-118.04', unit: 'kW' },
        { id: 'q', label: 'Reactive Power', value: '-16.53', unit: 'kVar' },
        { id: 's', label: 'Apparent Power', value: '119.19', unit: 'kVA' },
        { id: 'pf', label: 'Power Factor', value: '0.99' },
        { id: 'f', label: 'Grid Frequency', value: '49.99', unit: 'Hz' },
        { id: 'vthd', label: 'Voltage THD', value: '2.17', unit: '%' },
        { id: 'cthd', label: 'Current THD', value: '3.7', unit: '%' },
      ]
    } else if (selectedMeter === '1#Energystoragemeter') {
      return [
        { id: 'va', label: 'Phase A Voltage', value: '397.1', unit: 'V' },
        { id: 'vb', label: 'Phase B Voltage', value: '397.4', unit: 'V' },
        { id: 'vc', label: 'Phase C Voltage', value: '397.9', unit: 'V' },
        { id: 'ia', label: 'Phase A Current', value: '58.5', unit: 'A' },
        { id: 'ib', label: 'Phase B Current', value: '60', unit: 'A' },
        { id: 'ic', label: 'Phase C Current', value: '61.4', unit: 'A' },
        { id: 'p', label: 'Active Power', value: '40', unit: 'kW' },
        { id: 'q', label: 'Reactive Power', value: '4', unit: 'kVar' },
        { id: 's', label: 'Apparent Power', value: '40.2', unit: 'kVA' },
        { id: 'pf', label: 'Power Factor', value: '0.995' },
        { id: 'f', label: 'Grid Frequency', value: '49.98', unit: 'Hz' },
        { id: 'vthd', label: 'Voltage THD', value: '2.81', unit: '%' },
        { id: 'cthd', label: 'Current THD', value: '4.2', unit: '%' },
      ]
    } else {
      // 2#Energystoragemeter
      return [
        { id: 'va', label: 'Phase A Voltage', value: '396.8', unit: 'V' },
        { id: 'vb', label: 'Phase B Voltage', value: '397.2', unit: 'V' },
        { id: 'vc', label: 'Phase C Voltage', value: '396.5', unit: 'V' },
        { id: 'ia', label: 'Phase A Current', value: '62.3', unit: 'A' },
        { id: 'ib', label: 'Phase B Current', value: '61.8', unit: 'A' },
        { id: 'ic', label: 'Phase C Current', value: '63.1', unit: 'A' },
        { id: 'p', label: 'Active Power', value: '42.5', unit: 'kW' },
        { id: 'q', label: 'Reactive Power', value: '5.2', unit: 'kVar' },
        { id: 's', label: 'Apparent Power', value: '42.8', unit: 'kVA' },
        { id: 'pf', label: 'Power Factor', value: '0.993' },
        { id: 'f', label: 'Grid Frequency', value: '50.01', unit: 'Hz' },
        { id: 'vthd', label: 'Voltage THD', value: '2.95', unit: '%' },
        { id: 'cthd', label: 'Current THD', value: '4.5', unit: '%' },
      ]
    }
  }, [selectedMeter])

  // chart series visibility
  const [visibleVoltage, setVisibleVoltage] = useState<Record<string, boolean>>({
    'Phase A Voltage': true,
    'Phase B Voltage': true,
    'Phase C Voltage': true,
  })

  const [visiblePower, setVisiblePower] = useState<Record<string, boolean>>({
    'Active Power': true,
    'Reactive Power': true,
  })

  // build voltage series from simulated timeline - dynamic based on meter
  const voltageSeries = useMemo(() => {
    const labels = sim.hours
    const availableHour = sim.availableHour
    
    // Different base voltages for different meters
    let baseVoltages = { a: 400, b: 399, c: 400.5 }
    if (selectedMeter === '1#Energystoragemeter') {
      baseVoltages = { a: 397.1, b: 397.4, c: 397.9 }
    } else if (selectedMeter === '2#Energystoragemeter') {
      baseVoltages = { a: 396.8, b: 397.2, c: 396.5 }
    }
    
    const a = labels.map((h) => (h <= availableHour ? baseVoltages.a + Math.sin(h * 0.7) * 3 : null))
    const b = labels.map((h) => (h <= availableHour ? baseVoltages.b + Math.sin(h * 0.72 + 0.6) * 3.6 : null))
    const c = labels.map((h) => (h <= availableHour ? baseVoltages.c + Math.sin(h * 0.68 + 1.2) * 2.8 : null))
    return { labels: sim.labels, a, b, c }
  }, [sim, selectedMeter])

  const voltageOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'line', snap: true, lineStyle: { color: '#c2c8d1', width: 1 } }, formatter: makeTooltipFormatter({ default: 'V' }) },
      grid: { left: 56, right: 44, top: 64, bottom: 28 },
      xAxis: { type: 'category', data: voltageSeries.labels, boundaryGap: false, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8ba0c7', fontSize: 12, margin: 8 } },
      yAxis: { type: 'value', name: 'V', axisLabel: { color: '#8ba0c7', fontSize: 12 }, splitLine: { lineStyle: { color: 'rgba(20,40,60,0.04)' } } },
      series: [
        {
          name: 'Phase A Voltage',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: voltageSeries.a,
          lineStyle: { width: 2, color: '#2563eb' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: 'rgba(37,99,235,0.18)' }, { offset: 1, color: 'rgba(37,99,235,0)' } ]) },
          emphasis: { focus: 'series' },
        },
        {
          name: 'Phase B Voltage',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: voltageSeries.b,
          lineStyle: { width: 2, color: '#f59e0b' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: 'rgba(245,158,11,0.18)' }, { offset: 1, color: 'rgba(245,158,11,0)' } ]) },
          emphasis: { focus: 'series' },
        },
        {
          name: 'Phase C Voltage',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: voltageSeries.c,
          lineStyle: { width: 2, color: '#7c6cff' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: 'rgba(124,108,255,0.18)' }, { offset: 1, color: 'rgba(124,108,255,0)' } ]) },
          emphasis: { focus: 'series' },
        },
      ].filter(Boolean),
      animationDuration: 1000,
    }
  }, [voltageSeries])

  const powerOption = useMemo(() => {
    // Scale power data based on selected meter
    let powerScale = 1
    let reactiveScale = 0.18
    if (selectedMeter === '1#Energystoragemeter') {
      powerScale = 0.35  // Lower power for storage meter 1
      reactiveScale = 0.04
    } else if (selectedMeter === '2#Energystoragemeter') {
      powerScale = 0.38  // Slightly higher for storage meter 2
      reactiveScale = 0.05
    }
    
    const activeSeries = {
      name: 'Active Power',
      type: 'line',
      smooth: true,
      showSymbol: false,
      yAxisIndex: 0,
      data: sim.active.map((v: any) => (v == null ? null : v * powerScale)),
      lineStyle: { width: 2, color: '#17a86b', shadowBlur: 8, shadowColor: 'rgba(23,168,107,0.12)' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: 'rgba(23,168,107,0.28)' }, { offset: 1, color: 'rgba(23,168,107,0)' } ]) },
      emphasis: { focus: 'series' },
    } as any

    const reactiveSeries = {
      name: 'Reactive Power',
      type: 'line',
      smooth: true,
      showSymbol: false,
      yAxisIndex: 0,
      data: sim.dc.map((v: any) => (v == null ? null : (v * reactiveScale))),
      lineStyle: { width: 2, color: '#f97316', shadowBlur: 8, shadowColor: 'rgba(249,115,22,0.12)' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: 'rgba(249,115,22,0.18)' }, { offset: 1, color: 'rgba(249,115,22,0)' } ]) },
      emphasis: { focus: 'series' },
    } as any

    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'line', snap: true, lineStyle: { color: '#c2c8d1', width: 1 } }, formatter: makeTooltipFormatter({ default: 'kW' }) },
      grid: { left: 56, right: 44, top: 48, bottom: 28 },
      xAxis: { type: 'category', data: sim.labels, boundaryGap: false, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8ba0c7', fontSize: 12, margin: 8 } },
      yAxis: { type: 'value', name: 'kW', axisLabel: { color: '#8ba0c7', fontSize: 12 }, splitLine: { lineStyle: { color: 'rgba(20,40,60,0.04)' } } },
      series: [activeSeries, reactiveSeries],
      animationDuration: 1000,
    } as any
  }, [sim, selectedMeter])

  const historicalOption = useMemo(() => {
    // Different power factor values for different meters
    let basePF = 0.99
    if (selectedMeter === '1#Energystoragemeter') {
      basePF = 0.995
    } else if (selectedMeter === '2#Energystoragemeter') {
      basePF = 0.993
    }
    
    const pfSeries = {
      name: 'Power Factor',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: sim.labels.map(() => basePF),
      lineStyle: { width: 2, color: '#ea5aad' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ { offset: 0, color: 'rgba(234,90,173,0.22)' }, { offset: 1, color: 'rgba(234,90,173,0)' } ]) },
      emphasis: { focus: 'series' },
    } as any

    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'line', snap: true, lineStyle: { color: '#c2c8d1', width: 1 } }, formatter: makeTooltipFormatter({ default: '' }) },
      grid: { left: 40, right: 36, top: 48, bottom: 28 },
      xAxis: { type: 'category', data: sim.labels, boundaryGap: false, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8ba0c7', fontSize: 12, margin: 8 } },
      yAxis: { type: 'value', axisLabel: { color: '#8ba0c7', fontSize: 12 }, splitLine: { lineStyle: { color: 'rgba(20,40,60,0.04)' } } },
      series: [pfSeries],
      animationDuration: 1000,
    } as any
  }, [sim, selectedMeter])

  const metersList = ['1#Grid Meter', '1#Energystoragemeter', '2#Energystoragemeter']

  return (
    <DashboardLayout initialActiveTab="Meter" visitedRoute="/monitor/meter">
      <MonitoringFilters query={query} onQueryChange={setSelectedMeter} onSearch={() => {}} onReset={() => setQuery('')} meterId={selectedMeter} meters={metersList} />

      <main className="flex-1 overflow-auto py-4" style={{ paddingInline: 16, maxWidth: 'none', marginInline: 0 }}>
        <div className="p-4 space-y-4">
          {/* Data summary */}
          <div className="rounded-[12px] border border-[#e6edf5] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
            <h2 className="mb-3 text-[18px] font-semibold text-[#0f1724]">Data</h2>
            <div className="w-full">
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {metrics.map((m) => (
                  <div key={m.id} className="flex flex-col px-2 py-1" style={{ maxWidth: 180 }}>
                    <div className="text-[12px] font-medium text-[#6b7280]">{m.label}</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-[18px] font-semibold text-[#0f1724]">{m.value}</div>
                      {m.unit ? <div className="text-[12px] text-[#9aa4b2]">{m.unit}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-12 gap-3 items-stretch">
            <div className="col-span-12">
              <ChartCard
                title="Voltage Curve"
                headerControls={
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-md border border-[#e6edf5] bg-white px-3 text-[13px] text-[#34455d] shadow-[0_1px_2px_rgba(15,23,42,0.04)]" />
                }
                leftLegend={
                  <div className="w-full flex justify-center">
                    {['Phase A Voltage','Phase B Voltage','Phase C Voltage'].map((label) => (
                      <button key={label} onClick={() => setVisibleVoltage((p) => ({ ...p, [label]: !(p[label] !== false) }))} className={`flex items-center gap-2 text-[12px] font-medium ${visibleVoltage[label] === false ? 'opacity-40' : ''}`}>
                        <span className="h-3 w-3 rounded-full" style={{ background: label.includes('A') ? '#2563eb' : label.includes('B') ? '#f59e0b' : '#7c6cff' }} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                }
                compact={true}
              >
                <div style={{ height: '100%' }}>
                  <ReactECharts option={voltageOption} style={{ height: '100%', width: '100%' }} lazyUpdate={true} />
                </div>
              </ChartCard>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <ChartCard title="Power Curve" compact={true} headerControls={<div className="w-28" /> } leftLegend={
                <>
                  {['Active Power','Reactive Power'].map((label) => (
                    <button key={label} onClick={() => setVisiblePower((p) => ({ ...p, [label]: !(p[label] !== false) }))} className={`flex items-center gap-2 text-[12px] font-medium ${visiblePower[label] === false ? 'opacity-40' : ''}`}>
                      <span style={{ background: label.includes('Active') ? '#17a86b' : '#f97316' }} className="h-3 w-3 rounded-full border-2 border-white shadow-sm" />
                      <span>{label}</span>
                    </button>
                  ))}
                </>
              }>
                <div style={{ height: '100%' }}>
                  <ReactECharts option={powerOption} style={{ height: '100%', width: '100%' }} lazyUpdate={true} />
                </div>
              </ChartCard>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <ChartCard title="Historical Data Curve" compact={true} headerControls={<div className="w-28" />} leftLegend={<div className="w-full flex justify-center"><span className="text-[12px] font-medium text-[#6b7280]">Power Factor</span></div>}>
                <div style={{ height: '100%' }}>
                  <ReactECharts option={historicalOption} style={{ height: '100%', width: '100%' }} lazyUpdate={true} />
                </div>
              </ChartCard>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
