"use client"

import { useMemo, useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { Calendar } from 'lucide-react'

export default function RevenueOverviewChart() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day')
  const [selectedDate, setSelectedDate] = useState('2026-05-20')

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
    let labels: string[] = []
    let incomeData: (number | null)[] = []
    let expenseData: (number | null)[] = []
    let stageProfitData: (number | null)[] = []
    let totalProfitData: (number | null)[] = []

    if (period === 'day') {
      const selectedDateObj = new Date(selectedDate)
      const isToday = selectedDate === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      const currentHour = now.getHours()

      for (let i = 0; i < 24; i++) {
        labels.push(`${String(i).padStart(2, '0')}:00`)
        
        let isPast = false
        if (selectedDateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
          isPast = true
        } else if (isToday && i <= currentHour) {
          isPast = true
        }

        if (isPast) {
          incomeData.push(0)
          expenseData.push(0)
          stageProfitData.push(0)
          totalProfitData.push(0)
        } else {
          incomeData.push(null)
          expenseData.push(null)
          stageProfitData.push(null)
          totalProfitData.push(null)
        }
      }
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
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        labels.push(`${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
        
        let isPast = false
        if (d <= new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
          isPast = true
        }
        
        if (isPast) {
          incomeData.push(0)
          expenseData.push(0)
          stageProfitData.push(0)
          totalProfitData.push(0)
        } else {
          incomeData.push(null)
          expenseData.push(null)
          stageProfitData.push(null)
          totalProfitData.push(null)
        }
      }
    } else if (period === 'month') {
      const matchMonth = selectedDate.match(/^(\d{4})-(\d{2})$/)
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      if (matchMonth) {
        year = parseInt(matchMonth[1], 10)
        month = parseInt(matchMonth[2], 10)
      }
      const daysInMonth = new Date(year, month, 0).getDate()
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(`${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`)
        const d = new Date(year, month - 1, i)
        
        let isPast = false
        if (d <= new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
          isPast = true
        }

        if (isPast) {
          incomeData.push(0)
          expenseData.push(0)
          stageProfitData.push(0)
          totalProfitData.push(0)
        } else {
          incomeData.push(null)
          expenseData.push(null)
          stageProfitData.push(null)
          totalProfitData.push(null)
        }
      }
    } else {
      const matchYear = selectedDate.match(/^(\d{4})$/)
      const year = matchYear ? parseInt(matchYear[1], 10) : now.getFullYear()
      for (let i = 1; i <= 12; i++) {
        labels.push(`${year}-${String(i).padStart(2, '0')}`)
        const d = new Date(year, i - 1, 1)
        
        let isPast = false
        if (d <= new Date(now.getFullYear(), now.getMonth(), 1)) {
          isPast = true
        }

        if (isPast) {
          incomeData.push(0)
          expenseData.push(0)
          stageProfitData.push(0)
          totalProfitData.push(0)
        } else {
          incomeData.push(null)
          expenseData.push(null)
          stageProfitData.push(null)
          totalProfitData.push(null)
        }
      }
    }

    return {
      grid: { top: 60, right: 30, bottom: 20, left: 30, containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e6edf5',
        borderWidth: 1,
        textStyle: { color: '#0f1724', fontSize: 12 },
      },
      legend: {
        data: period === 'day' 
          ? ['Income', 'Expense', 'Stage Profit', 'Total Profit'] 
          : ['Income', 'Expense', 'Stage Profit'],
        top: 0,
        itemGap: 24,
        textStyle: { color: '#0f1724', fontSize: 12 }
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: '#e6edf5' } },
        axisLabel: { color: '#8c8c8c', fontSize: 11, interval: period === 'day' ? 0 : 'auto' },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        name: 'CNY',
        nameTextStyle: { color: '#0f1724', fontSize: 11, padding: [0, 20, 0, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#8c8c8c', fontSize: 11 },
        splitLine: { lineStyle: { color: '#f0f2f5', type: 'solid' } },
        min: 0,
        max: 1, // as shown in the screenshot when empty
      },
      series: [
        {
          name: 'Income',
          type: 'line',
          data: incomeData,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#1890ff' },
          lineStyle: { color: '#1890ff', width: 2 },
          connectNulls: false,
        },
        {
          name: 'Expense',
          type: 'line',
          data: expenseData,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#52c41a' },
          lineStyle: { color: '#52c41a', width: 2 },
          connectNulls: false,
        },
        {
          name: 'Stage Profit',
          type: 'line',
          data: stageProfitData,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#faad14' },
          lineStyle: { color: '#faad14', width: 2 },
          connectNulls: false,
        },
        ...(period === 'day' ? [{
          name: 'Total Profit',
          type: 'line',
          data: totalProfitData,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#ff4d4f' },
          lineStyle: { color: '#ff4d4f', width: 2 },
          connectNulls: false,
        } as any] : [])
      ]
    }
  }, [period, selectedDate])

  return (
    <div className="bg-white rounded-lg border border-[#e6edf5] p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-bold text-[#0f1724]">Revenue Statistics Chart</h3>
        
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

          <div className="flex bg-[#fcfcfc] p-0.5 rounded border border-[#d9d9d9]">
            {(['day', 'week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 h-7 text-[12px] transition-all rounded ${
                  period === p
                    ? 'bg-white text-[#0f1724] shadow-sm font-medium border border-[#d9d9d9]'
                    : 'text-[#6b7280] hover:text-[#0f1724]'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <ReactECharts option={option} style={{ height: '320px' }} />
    </div>
  )
}
