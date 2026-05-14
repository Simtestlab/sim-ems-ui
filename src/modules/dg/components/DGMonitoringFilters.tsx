"use client"

import SharedMonitoringFilters from '@/shared/components/monitoring/Filters'

type DGMonitoringFiltersProps = {
	query: string
	onQueryChange: (value: string) => void
	onSearch: () => void
	onReset: () => void
	queryPlaceholder?: string
}

export default function DGMonitoringFilters({
	query,
	onQueryChange,
	onSearch,
	onReset,
	queryPlaceholder = 'Equipment Name',
}: DGMonitoringFiltersProps) {
	return (
		<SharedMonitoringFilters
			query={query}
			onQueryChange={onQueryChange}
			onSearch={onSearch}
			onReset={onReset}
			queryPlaceholder={queryPlaceholder}
		/>
	)
}
