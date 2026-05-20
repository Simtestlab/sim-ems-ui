"use client"

import { useMemo, useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { Calendar } from 'lucide-react'

type SingleRevenueChartProps = {
  title: string
  seriesName: string
  seriesColor: string
}

function SingleRevenueChart({ title, seriesName, seriesColor }: SingleRevenueChartProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day')
  const [selectedDate, setSelectedDate] = useState('2026-05-19')

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

  const option = useMemo(() => {
    const now = new Date()
    const isToday = selectedDate === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const currentHour = now.getHours()

    const generateTimeData = () => {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      if (period === 'day') {
        const selectedDateObj = new Date(selectedDate)
        const isSelectedPast = selectedDateObj < today
        const isSelectedFuture = selectedDateObj > today

        return Array.from({ length: 48 }, (_, i) => {
          const h = Math.floor(i / 2)
          const m = i % 2 === 0 ? '00' : '30'
          const label = `${String(h).padStart(2, '0')}:${m}`

          let isPast = false
          if (isSelectedPast) {
            isPast = true
          } else if (isSelectedFuture) {
            isPast = false
          } else {
            const pointMins = h * 60 + (i % 2 === 0 ? 0 : 30)
            const currentMins = now.getHours() * 60 + now.getMinutes()
            isPast = pointMins <= currentMins
          }
          return { label, isPast }
        })
      } else if (period === 'week') {
        let start = new Date()
        const match = selectedDate.match(/^(\d{4})w(\d{1,2})$/)
        if (match) {
          const getMondayOfISOWeek = (year: number, week: number) => {
            const jan4 = new Date(year, 0, 4)
            const dayOfWeek = jan4.getDay()
            const mondayOfWeek1 = new Date(jan4)
            mondayOfWeek1.setDate(jan4.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
            const monday = new Date(mondayOfWeek1)
            monday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7)
            monday.setHours(0, 0, 0, 0)
            return monday
          }
          start = getMondayOfISOWeek(parseInt(match[1], 10), parseInt(match[2], 10))
        } else {
          const day = now.getDay()
          const diff = day === 0 ? -6 : 1 - day
          start = new Date(now)
          start.setDate(now.getDate() + diff)
          start.setHours(0, 0, 0, 0)
        }

        return Array.from({ length: 7 }, (_, i) => {
          const d = new Date(start)
          d.setDate(start.getDate() + i)
          return {
            label: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            isPast: d <= today,
          }
        })
      } else if (period === 'month') {
        const matchMonth = selectedDate.match(/^(\d{4})-(\d{2})$/)
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        if (matchMonth) {
          year = parseInt(matchMonth[1], 10)
          month = parseInt(matchMonth[2], 10)
        }
        const daysInMonth = new Date(year, month, 0).getDate()
        return Array.from({ length: daysInMonth }, (_, i) => {
          const d = new Date(year, month - 1, i + 1)
          return {
            label: `${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
            isPast: d <= today,
          }
        })
      } else {
        const matchYear = selectedDate.match(/^(\d{4})$/)
        const year = matchYear ? parseInt(matchYear[1], 10) : now.getFullYear()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        
        return Array.from({ length: 12 }, (_, i) => {
          const d = new Date(year, i, 1)
          return {
            label: `${String(year)}-${String(i + 1).padStart(2, '0')}`,
            isPast: d <= currentMonthStart,
          }
        })
      }
    }

    const points = generateTimeData()
    const timeData = points.map(p => p.label)
    const emptyData = points.map(p => p.isPast ? 0 : null)

    return {
      grid: {
        top: 60,
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
        formatter: (params: any) => {
          let html = `<div style="font-weight:600;margin-bottom:4px;">${params[0].axisValue}</div>`
          params.forEach((p: any) => {
            if (p.value !== null && p.value !== undefined) {
              html += `<div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};"></span>
                <span style="color:#6b7280;">${p.seriesName}: ${p.value} CNY</span>
              </div>`
            }
          })
          return html
        }
      },
      legend: {
        data: ['Valley', 'Flat', 'Peak', seriesName],
        top: 10,
        left: 'center',
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12, color: '#bfbfbf' },
      },
      xAxis: {
        type: 'category',
        data: timeData,
        axisLine: { lineStyle: { color: '#e6edf5' } },
        axisLabel: {
          color: '#bfbfbf',
          fontSize: 11,
          rotate: 0,
          interval: period === 'day' ? 2 : period === 'month' ? 1 : 0,
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'CNY',
        nameTextStyle: { color: '#0f1724', fontSize: 11, padding: [0, 20, 0, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#bfbfbf', fontSize: 11 },
        splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
        min: 0,
      },
      series: [
        {
          name: 'Valley',
          type: 'bar',
          stack: 'total',
          data: emptyData,
          itemStyle: { color: '#52c41a' },
        },
        {
          name: 'Flat',
          type: 'bar',
          stack: 'total',
          data: emptyData,
          itemStyle: { color: '#fadb14' },
        },
        {
          name: 'Peak',
          type: 'bar',
          stack: 'total',
          data: emptyData,
          itemStyle: { color: '#fa8c16' },
        },
        {
          name: seriesName,
          type: 'line',
          data: emptyData,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: seriesColor, width: 2 },
          itemStyle: { color: seriesColor },
        },
      ],
    }
  }, [period, selectedDate, seriesName, seriesColor])

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] overflow-hidden mb-6 last:mb-0">
      <div className="px-6 py-4 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#0f1724]">{title}</h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            {period === 'day' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-8 pl-8 pr-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none"
              />
            )}
            {period === 'week' && (
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="2026w21"
                className="h-8 pl-8 pr-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none w-28"
              />
            )}
            {period === 'month' && (
              <input
                type="month"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-8 pl-8 pr-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none"
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
                className="h-8 pl-8 pr-3 rounded border border-[#d9d9d9] text-[12px] text-[#0f1724] focus:border-[#1890ff] focus:outline-none w-24"
              />
            )}
          </div>

          <div className="flex bg-[#f5f5f5] p-0.5 rounded border border-[#d9d9d9]">
            {(['day', 'week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 h-7 text-[12px] transition-all rounded ${
                  period === p
                    ? 'bg-white text-[#0f1724] shadow-sm font-medium'
                    : 'text-[#6b7280] hover:text-[#0f1724]'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <ReactECharts option={option} style={{ height: '240px' }} />
      </div>
    </div>
  )
}

export default function RevenueStatisticsChart() {
  return (
    <div className="space-y-6">
      <SingleRevenueChart 
        title="Historical Income Statistics" 
        seriesName="Historical Income" 
        seriesColor="#1890ff" 
      />
      <SingleRevenueChart 
        title="Historical Expenditure Statistics" 
        seriesName="Historical Cost" 
        seriesColor="#ff4d4f" 
      />
      <SingleRevenueChart 
        title="Historical Profit Statistics" 
        seriesName="Historical Profit" 
        seriesColor="#52c41a" 
      />
    </div>
  )
}
