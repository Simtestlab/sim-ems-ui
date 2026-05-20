"use client"

import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

export default function BatteryOperationChart() {
  const option = useMemo(() => {
    // Generate 288 points (every 5 minutes for 24 hours)
    const labels: string[] = []
    const data: number[] = []

    for (let i = 0; i < 288; i++) {
      const hours = Math.floor(i / 12)
      const minutes = (i % 12) * 5
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      labels.push(timeString)
      data.push(0) // Default empty line as shown in image
    }

    return {
      grid: {
        top: 30,
        right: 40,
        bottom: 30,
        left: 50,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e6edf5',
        borderWidth: 1,
        textStyle: { color: '#0f1724', fontSize: 12 },
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: '#e6edf5' } },
        axisLabel: {
          color: '#6b7280',
          fontSize: 11,
          formatter: (value: string) => {
            // Only show every 2 hours, plus the last label '23:55'
            if (value.endsWith(':00') && parseInt(value.split(':')[0]) % 2 === 0) {
              return value
            }
            if (value === '23:55') {
              return value
            }
            return ''
          },
          interval: 0, // Force checking every label so our formatter can selectively show them
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'kW',
        nameTextStyle: { color: '#6b7280', fontSize: 11, padding: [0, 20, 0, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { 
          color: '#6b7280', 
          fontSize: 11,
          formatter: (value: number) => value.toFixed(2)
        },
        splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
        min: 0,
        max: 1, // Set default max to 1.00 as shown in the image
      },
      series: [
        {
          name: 'Power',
          type: 'line',
          data: data,
          smooth: true,
          showSymbol: false,
          symbolSize: 4,
          lineStyle: { color: '#1890ff', width: 2 },
          itemStyle: { color: '#1890ff' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.2)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
        },
      ],
    }
  }, [])

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e6edf5]">
        <h3 className="text-[16px] font-semibold text-[#0f1724]">
          Peak-valley-flat Battery Operation Status
        </h3>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ReactECharts option={option} style={{ height: '320px' }} />
      </div>
    </div>
  )
}
