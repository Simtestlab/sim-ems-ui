"use client"

import SharedMonitoringFilters from '@/shared/components/monitoring/Filters'

type BMSMonitoringFiltersProps = {
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
  queryPlaceholder?: string
  stacks?: string[]
  selectedStack?: string
  onStackChange?: (value: string) => void
}

export default function BMSMonitoringFilters({
  query,
  onQueryChange,
  onSearch,
  onReset,
  queryPlaceholder = 'Stack: BMS / 1#Stack',
  stacks = ['1#Stack', '2#Stack', '3#Stack'],
  selectedStack,
  onStackChange,
}: BMSMonitoringFiltersProps) {
  return (
    <SharedMonitoringFilters
      query={query}
      onQueryChange={onQueryChange}
      onSearch={onSearch}
      onReset={onReset}
      queryPlaceholder={queryPlaceholder}
      queryClassName="w-[340px]"
      controls={(
        <select
          value={selectedStack}
          onChange={(e) => onStackChange?.(e.target.value)}
          className="h-11 rounded-[10px] border border-[#dce4ee] bg-white px-3 text-[14px] placeholder-[#9da9b8] shadow-[0_2px_7px_rgba(15,23,42,0.03)]"
        >
          {stacks.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
    />
  )
}
