"use client";

import { useMemo, useState } from "react";
import DashboardLayout from '@/shared/components/layout/DashboardLayout'
import PCSCard from '@/modules/pcs/components/PCSCard';
import EmptyState from '@/shared/components/feedback/EmptyState';
import MonitoringFilters from '@/shared/components/monitoring/Filters'
import PCSStatusTabs from '@/modules/pcs/components/StatusTabs';

type PCSListItem = {
  id: number
  title: string
  status: string
  realTimePower: string
  dailyCharge: string
  dailyDischarge: string
  soc: string
  ratedPower: string
}

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'standby', label: 'Standby' },
  { key: 'normal', label: 'Normal' },
  { key: 'gridConnectedOperation', label: 'Grid-connected Operation' },
  { key: 'shutdown', label: 'Shutdown' },
  { key: 'alarm', label: 'Alarm' },
  { key: 'fault', label: 'Fault' },
  { key: 'communicationLoss', label: 'Communication Loss' },
  { key: 'offGridRunning', label: 'Off-grid Running' },
];

export default function PCSPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');

  const data = useMemo<PCSListItem[]>(() => [
    { id: 1, title: '1#PCS', status: 'normal', realTimePower: '0', dailyCharge: '0', dailyDischarge: '0', soc: '0', ratedPower: '125kW' },
    { id: 2, title: '2#PCS', status: 'normal', realTimePower: '0', dailyCharge: '0', dailyDischarge: '0', soc: '0', ratedPower: '125kW' },
  ], []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: data.length };
    STATUS_TABS.forEach((t) => {
      if (t.key === 'all') return;
      map[t.key] = data.filter((d) => d.status === t.key).length;
    });
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (selectedStatus !== 'all' && d.status !== selectedStatus) return false;
      if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [data, selectedStatus, query]);

  function resetFilters() {
    setQueryInput('');
    setQuery('');
    setSelectedStatus('all');
  }

  function applyFilters() {
    setQuery(queryInput.trim());
  }

  return (
    <DashboardLayout visitedRoute="/monitor/pcs" initialActiveTab="PCS">
      <MonitoringFilters
        query={queryInput}
        onQueryChange={setQueryInput}
        onSearch={applyFilters}
        onReset={resetFilters}
        queryClassName="w-[360px]"
      />

      <PCSStatusTabs
        statusTabs={STATUS_TABS}
        selectedStatus={selectedStatus}
        counts={counts}
        onSelectStatus={setSelectedStatus}
      />

      <main className="flex-1 min-w-0 overflow-hidden w-full pt-8 pb-6 px-4 max-w-none mx-0" style={{ maxWidth: 'none', marginInline: 0 }}>
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
            alignContent: 'start',
          }}>
            {filtered.map((inverter) => (
              <PCSCard key={inverter.id} pcs={inverter} />
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
