"use client"

import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

export default function HistoricalPriceChartCard() {
  const option = useMemo(() => {
    const now = new Date('2026-05-19T14:30:00')
    const hours = 48
    const timeData: string[] = []
    const actualPrice: number[] = []
    const pastPrice: number[] = []
    const futurePrice: number[] = []

    for (let i = 0; i <= 48; i++) {
      const time = new Date(now.getTime() + i * 30 * 60000)
      const formattedTime = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
      timeData.push(formattedTime)

      // Actual Price starts at 1, drops to 0 around the 2nd index
      if (i < 2) {
        actualPrice.push(1)
      } else {
        actualPrice.push(0)
      }

      pastPrice.push(null as any)
      futurePrice.push(null as any)
    }

    return {
      grid: {
        top: 40,
        right: 60,
        bottom: 50,
        left: 60,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e6edf5',
        borderWidth: 1,
        textStyle: { color: '#0f1724', fontSize: 12 },
        formatter: (params: any) => {
          let html = `<div style="font-weight:600;margin-bottom:4px;">${params[0].axisValue}</div>`
          params.forEach((p: any) => {
            if (p.value != null) {
              html += `<div style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};"></span>
                <span>${p.seriesName}:</span>
                <span style="font-weight:600;">${p.value.toFixed(2)} CNY</span>
              </div>`
            }
          })
          return html
        },
      },
      legend: {
        data: ['Actual Price', 'Day-ahead Price (past)', 'Day-ahead Price (future)'],
        top: 10,
        left: 'center',
        itemWidth: 14,
        itemHeight: 10,
        textStyle: { fontSize: 12, color: '#6b7280' },
      },
      xAxis: {
        type: 'category',
        data: timeData,
        axisLine: { lineStyle: { color: '#e6edf5' } },
        axisLabel: {
          color: '#6b7280',
          fontSize: 11,
          rotate: 0,
          interval: 4,
          formatter: (value: string) => value,
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'CNY',
        nameTextStyle: { color: '#0f1724', fontSize: 11, padding: [0, 20, 0, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
        min: 0,
        max: 1,
      },
      series: [
        {
          name: 'Actual Price',
          type: 'line',
          data: actualPrice,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          connectNulls: false,
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
          z: 1,
        },
        {
          name: 'Day-ahead Price (past)',
          type: 'line',
          data: pastPrice,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          connectNulls: false,
          lineStyle: { color: '#52c41a', width: 2 },
          itemStyle: { color: '#52c41a' },
          z: 2,
        },
        {
          name: 'Day-ahead Price (future)',
          type: 'line',
          data: futurePrice,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          connectNulls: false,
          lineStyle: { color: '#faad14', width: 2 },
          itemStyle: { color: '#faad14' },
          z: 2,
        },
      ],
    }
  }, [])

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] p-6">
      <h2 className="text-[16px] font-semibold text-[#0f1724] mb-4">Historical Electricity Price</h2>
      <ReactECharts option={option} style={{ height: '280px' }} />
    </div>
  )
}
