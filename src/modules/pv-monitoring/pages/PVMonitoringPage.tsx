"use client";

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/shared/components/layout/DashboardLayout';
import MonitoringFilters from '@/modules/pv-monitoring/components/MonitoringFilters';
import StatusTabs from '@/modules/pv-monitoring/components/StatusTabs';
import InverterCard from '@/shared/components/pv/InverterCard';
import EmptyState from '@/shared/components/feedback/EmptyState';
import Tooltip from '@/shared/components/ui/Tooltip';
import type { InverterData } from '@/modules/pv-monitoring/types';
import { usePVMonitoringStore } from '@/modules/pv-monitoring/store/pvMonitoringStore';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'standby', label: 'Standby' },
  { key: 'normal', label: 'Normal' },
  { key: 'shutdown', label: 'Shutdown' },
  { key: 'alarm', label: 'Alarm' },
  { key: 'fault', label: 'Fault' },
  { key: 'communicationLoss', label: 'Communication Loss' },
]

export default function PVMonitoringPage() {
  const [activeTab, setActiveTab] = useState('PV');
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [queryInput, setQueryInput] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  const addVisitedTab = usePVMonitoringStore((s) => s.addVisitedTab)
  const hoveredId = usePVMonitoringStore((s) => s.hoveredId)
  const hoveredMetric = usePVMonitoringStore((s) => s.hoveredMetric)
  const setHoveredId = usePVMonitoringStore((s) => s.setHoveredId)
  const setHoveredMetric = usePVMonitoringStore((s) => s.setHoveredMetric)

  useEffect(() => {
    addVisitedTab('/pv')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const data = useMemo<InverterData[]>(
    () => [
      { id: 1, title: '1#Inverter', status: 'normal', branch: 'normal', location: 'Gvault Site', activePower: '95.94', dailyEnergy: '311.5', loadRatio: '76.75', dailyEffective: '3.69' },
      { id: 2, title: '2#Inverter', status: 'normal', branch: 'normal', location: 'Gvault Site', activePower: '78.48', dailyEnergy: '254.8', loadRatio: '62.78', dailyEffective: '3.69' },
    ],
    [],
  )

  const locations = useMemo(() => {
    return Array.from(new Set(data.map(item => item.location).filter((item): item is string => Boolean(item))))
  }, [data])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: data.length }
    STATUS_TABS.forEach(t => {
      if (t.key === 'all') return
      map[t.key] = data.filter(d => d.status === t.key).length
    })
    return map
  }, [data])

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (selectedStatus !== 'all' && d.status !== selectedStatus) return false
      if (location && location !== '' && (d as { location?: string }).location !== location) return false
      if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [data, selectedStatus, location, query])

  function resetFilters() {
    setQueryInput('')
    setLocationInput('')
    setQuery('')
    setLocation('')
    setSelectedStatus('all')
  }

  function applyFilters() {
    setQuery(queryInput.trim())
    setLocation(locationInput)
  }

  return (
    <DashboardLayout initialActiveTab={activeTab} visitedRoute="/monitor/pv">
      <MonitoringFilters
        query={queryInput}
        location={locationInput}
        locations={locations}
        onQueryChange={setQueryInput}
        onLocationChange={setLocationInput}
        onSearch={applyFilters}
        onReset={resetFilters}
      />
      <StatusTabs
        statusTabs={STATUS_TABS}
        selectedStatus={selectedStatus}
        counts={counts}
        onSelectStatus={setSelectedStatus}
      />

      <main className="flex-1 min-w-0 overflow-auto w-full p-5" style={{ maxWidth: 'none', marginInline: 0 }}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No devices found"
            description={`There are no devices matching the current filter${selectedStatus !== 'all' ? ` (${STATUS_TABS.find(t => t.key === selectedStatus)?.label ?? selectedStatus})` : ''}.`}
          />
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 360px))', 
            gap: 16, 
            justifyContent: 'start', 
            alignContent: 'start' 
          }}>
            {filtered.map(inverter => (
              <InverterCard
                key={inverter.id}
                inverter={inverter}
                hoveredId={hoveredId}
                hoveredMetric={hoveredMetric}
                onHoverCard={setHoveredId}
                onHoverMetric={setHoveredMetric}
                onNavigate={(route) => addVisitedTab(route)}
                Tooltip={Tooltip}
              />
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
