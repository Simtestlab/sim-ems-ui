"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import MonitoringStatusTabs from '@/shared/components/monitoring/StatusTabs'
import MonitoringCard from '@/shared/components/monitoring/Card'
import MonitoringFilters from '@/shared/components/monitoring/Filters'
import EmptyState from '@/shared/components/feedback/EmptyState'
import { usePVMonitoringStore } from '@/modules/pv-monitoring/store/pvMonitoringStore'
import { Zap, Lightbulb, BarChart2, PlayCircle } from 'lucide-react'

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'standby', label: 'Standby' },
  { key: 'normal', label: 'Normal' },
  { key: 'grid', label: 'Grid-connected Operation' },
  { key: 'shutdown', label: 'Shutdown' },
  { key: 'alarm', label: 'Alarm' },
  { key: 'fault', label: 'Fault' },
  { key: 'comm', label: 'Communication Loss' },
  { key: 'offgrid', label: 'Off-grid Running' },
]

export default function DGPage() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
  const addVisitedTab = usePVMonitoringStore((s) => s.addVisitedTab)

  function applyFilters() {
    setQuery(queryInput.trim())
  }

  function resetFilters() {
    setQueryInput('')
    setQuery('')
    setSelectedStatus('all')
  }

  const data = useMemo(
    () => [
      {
        id: 'dg-1',
        title: '1#DG',
        rated: '630kW',
        status: 'shutdown',
        metrics: [
          { key: 'rtp', label: 'REAL-TIME POWER', value: '0', unit: 'kW' },
          { key: 'daily', label: 'DAILY GENERATION', value: '0', unit: 'kWh' },
          { key: 'load', label: 'LOAD FACTOR', value: '0', unit: '%' },
          { key: 'starts', label: 'CUMULATIVE STARTS', value: '0' },
        ],
      },
    ],
    [],
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: data.length }
    STATUS_TABS.forEach((tab) => {
      if (tab.key === 'all') return
      map[tab.key] = data.filter((item) => item.status === tab.key).length
    })
    return map
  }, [data])

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        if (selectedStatus !== 'all' && item.status !== selectedStatus) return false
        if (query && !item.title.toLowerCase().includes(query.toLowerCase())) return false
        return true
      }),
    [data, selectedStatus, query],
  )

  return (
    <DashboardLayout initialActiveTab="DG" visitedRoute="/monitor/dg">
      <MonitoringFilters
        query={queryInput}
        onQueryChange={setQueryInput}
        onSearch={applyFilters}
        onReset={resetFilters}
      />

      <MonitoringStatusTabs
        statusTabs={STATUS_TABS}
        selectedStatus={selectedStatus}
        counts={counts}
        onSelectStatus={setSelectedStatus}
      />

      <main className="mx-0 flex min-w-0 flex-1 overflow-auto p-5 max-w-none" style={{ maxWidth: 'none', marginInline: 0 }}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No devices found"
            description={`There are no devices matching the current filter${selectedStatus !== 'all' ? ` (${STATUS_TABS.find(t => t.key === selectedStatus)?.label ?? selectedStatus})` : ''}.`}
          />
        ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 360px))',
            gap: 16,
            justifyContent: 'center',
            alignContent: 'start',
          }}
        >
          {filtered.map((dg) => (
            <MonitoringCard
              key={dg.id}
              theme="dg"
              title={dg.title}
              subtitle={`Rated Power: ${dg.rated}`}
              onClick={() => router.push(`/monitor/dg/details?id=${dg.id}`)}
              leading={
                <div className="text-[#0b1220]">
                  <Zap className="h-5 w-5 text-[#0b1220]" />
                </div>
              }
              statusLabel={<span>{dg.status.toUpperCase()}</span>}
              metrics={dg.metrics.map((metric) => {
                let IconComponent = Zap
                if (metric.key === 'daily') IconComponent = Lightbulb
                else if (metric.key === 'load') IconComponent = BarChart2
                else if (metric.key === 'starts') IconComponent = PlayCircle

                return {
                  key: metric.key,
                  label: metric.label,
                  value: metric.value,
                  unit: metric.unit,
                  icon: <IconComponent className="h-7 w-7" strokeWidth={2.2} />,
                }
              })}
            />
          ))}
        </div>
        )}
      </main>
    </DashboardLayout>
  )
}