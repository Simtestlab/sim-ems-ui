"use client";

import { useEffect, useMemo, useState } from 'react';
import MonitoringSidebar from '@/modules/pv-monitoring/components/MonitoringSidebar';
import MonitoringHeader from '@/modules/pv-monitoring/components/MonitoringHeader';
import MonitoringFilters from '@/modules/pv-monitoring/components/MonitoringFilters';
import StatusTabs from '@/modules/pv-monitoring/components/StatusTabs';
import BreadcrumbNavigation from '@/modules/pv-monitoring/components/BreadcrumbNavigation';
import PlantOverview from '@/modules/pv-monitoring/components/PlantOverview';
import InverterCard from '@/shared/components/pv/InverterCard';
import Tooltip from '@/shared/components/ui/Tooltip';
import type { InverterData } from '@/modules/pv-monitoring/types';
import { usePVMonitoringStore } from '@/modules/pv-monitoring/store/pvMonitoringStore';
import { formatDateTime } from '@/modules/pv-monitoring/utils/format';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('PV');
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [queryInput, setQueryInput] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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
      { id: 1, title: '1#Inverter', status: 'normal', branch: 'normal', location: 'Demo Site', activePower: '95.94', dailyEnergy: '311.5', loadRatio: '76.75', dailyEffective: '3.69' },
      { id: 2, title: '2#Inverter', status: 'normal', branch: 'normal', location: 'Demo Site', activePower: '78.48', dailyEnergy: '254.8', loadRatio: '62.78', dailyEffective: '3.69' },
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
    <div className="h-screen bg-[#f5f7fa] font-sans text-gray-800 flex flex-col text-[14px] ui-compact">
      <MonitoringHeader
        sidebarCollapsed={sidebarCollapsed}
        currentTimeLabel={formatDateTime(currentTime)}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <MonitoringSidebar 
          sidebarCollapsed={sidebarCollapsed} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <div className="flex-1 min-w-0 overflow-hidden flex flex-col bg-[#f5f7fa]">
          <BreadcrumbNavigation />

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

          <main className="flex-1 min-w-0 overflow-hidden w-full pt-8 pb-6 px-4 max-w-none mx-0" style={{ maxWidth: 'none', marginInline: 0 }}>
            {filtered.length === 0 ? (
              <PlantOverview />
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
        </div>
      </div>
    </div>
  );
}
