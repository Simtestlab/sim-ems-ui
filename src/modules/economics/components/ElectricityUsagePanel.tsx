"use client"

import { useState, useEffect } from 'react'
import { Battery, Zap, Wind, Car, Plug } from 'lucide-react'

type EnergyNode = {
  id: string
  label: string
  value: string
  icon: React.ReactNode
  position: { top: string; left: string }
}

export default function ElectricityUsagePanel() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day')
  const [selectedDate, setSelectedDate] = useState('2026-05-19')

  // Update date format based on period
  useEffect(() => {
    const now = new Date()
    if (period === 'day') {
      setSelectedDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)
    } else if (period === 'week') {
      const weekNum = Math.ceil((now.getDate() + 6 - now.getDay()) / 7)
      setSelectedDate(`${now.getFullYear()}w${weekNum}`)
    } else if (period === 'month') {
      setSelectedDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    } else {
      setSelectedDate(`${now.getFullYear()}`)
    }
  }, [period])

  const nodes: EnergyNode[] = [
    {
      id: 'pv',
      label: 'PV',
      value: '+0kWh',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="10" width="6" height="12" fill="#1890ff" opacity="0.2" stroke="#1890ff" strokeWidth="1.5"/>
          <rect x="13" y="10" width="6" height="12" fill="#1890ff" opacity="0.2" stroke="#1890ff" strokeWidth="1.5"/>
          <rect x="20" y="10" width="6" height="12" fill="#1890ff" opacity="0.2" stroke="#1890ff" strokeWidth="1.5"/>
        </svg>
      ),
      position: { top: '15%', left: '35%' },
    },
    {
      id: 'ev',
      label: 'EV Charger',
      value: '+0kWh',
      icon: <Car className="w-8 h-8 text-[#1890ff]" />,
      position: { top: '35%', left: '15%' },
    },
    {
      id: 'grid',
      label: 'Grid',
      value: '+0kWh',
      icon: <Plug className="w-8 h-8 text-[#1890ff]" />,
      position: { top: '20%', left: '75%' },
    },
    {
      id: 'storage',
      label: 'Storage',
      value: '+0kWh',
      icon: <Battery className="w-8 h-8 text-[#1890ff]" />,
      position: { top: '75%', left: '20%' },
    },
    {
      id: 'wind',
      label: 'Wind',
      value: '+0kWh',
      icon: <Wind className="w-8 h-8 text-[#1890ff]" />,
      position: { top: '45%', left: '85%' },
    },
    {
      id: 'genset',
      label: 'Genset',
      value: '+0kWh',
      icon: <Zap className="w-8 h-8 text-[#1890ff]" />,
      position: { top: '75%', left: '80%' },
    },
    {
      id: 'load',
      label: 'Load',
      value: '+0kWh',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="8" y="8" width="16" height="16" fill="none" stroke="#1890ff" strokeWidth="1.5"/>
          <path d="M16 12v8M12 16h8" stroke="#1890ff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      position: { top: '90%', left: '50%' },
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e6edf5] flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#0f1724]">Electricity Usage</h3>

        <div className="flex items-center gap-2">
          {/* Date Picker - format changes based on period */}
          {period === 'day' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 px-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none"
            />
          )}
          {period === 'week' && (
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="2026w21"
              className="h-8 px-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none w-24"
            />
          )}
          {period === 'month' && (
            <input
              type="month"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 px-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none"
            />
          )}
          {period === 'year' && (
            <input
              type="number"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="2026"
              min="2000"
              max="2100"
              className="h-8 px-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none w-20"
            />
          )}

          {/* Period Selector */}
          <div className="flex rounded border border-[#d9d9d9] overflow-hidden">
            {(['day', 'week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 h-8 text-[12px] font-medium transition-colors ${
                  period === p
                    ? 'bg-[#1890ff] text-white'
                    : 'bg-white text-[#6b7280] hover:bg-[#f8f9fc]'
                } ${p !== 'day' ? 'border-l border-[#d9d9d9]' : ''}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Flow Visualization */}
      <div className="p-6">
        <div className="relative w-full h-[320px]">
          {/* Central Hub/Cloud */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#e6f7ff] to-[#bae7ff] border-2 border-[#1890ff] flex items-center justify-center shadow-lg">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8z"
                  fill="white"
                  opacity="0.5"
                />
                <circle cx="24" cy="24" r="14" stroke="#1890ff" strokeWidth="2" fill="none" />
                <circle cx="24" cy="24" r="4" fill="#1890ff" />
              </svg>
            </div>
          </div>

          {/* Energy Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: node.position.top, left: node.position.left }}
            >
              <div className="flex flex-col items-center gap-1">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-white border border-[#e6edf5] flex items-center justify-center shadow-sm">
                  {node.icon}
                </div>
                {/* Label */}
                <div className="text-[12px] font-medium text-[#0f1724] whitespace-nowrap">
                  {node.label}
                </div>
                {/* Value */}
                <div className="text-[11px] text-[#6b7280] bg-[#f8f9fc] px-2 py-0.5 rounded whitespace-nowrap">
                  {node.value}
                </div>
              </div>

              {/* Connector line to center (SVG) */}
              <svg
                className="absolute top-6 left-6 pointer-events-none"
                style={{
                  width: '200px',
                  height: '200px',
                  overflow: 'visible',
                }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={`calc(50% - ${node.position.left})`}
                  y2={`calc(50% - ${node.position.top})`}
                  stroke="#d9d9d9"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
