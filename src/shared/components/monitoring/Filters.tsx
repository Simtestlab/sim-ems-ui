"use client"

import type React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type MonitoringFiltersProps = {
	query: string
	onQueryChange: (value: string) => void
	onSearch: () => void
	onReset: () => void
	queryPlaceholder?: string
	controls?: React.ReactNode
	className?: string
	queryClassName?: string
	showQuery?: boolean
	showActions?: boolean
	showReset?: boolean
}

export default function MonitoringFilters({
	query,
	onQueryChange,
	onSearch,
	onReset,
	queryPlaceholder = 'Equipment Name',
	controls,
	className,
	queryClassName,
	showQuery = true,
	showActions = true,
	showReset = true,
}: MonitoringFiltersProps) {
	return (
		<div className={cn('border-b border-[#edf1f5] bg-white px-4 py-3 shadow-sm', className)}>
			<div className="flex flex-wrap items-center gap-4">
				{showQuery && (
					<div className="relative group">
						<input
							type="text"
							placeholder={queryPlaceholder}
							value={query}
							onChange={(event) => onQueryChange(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									onSearch()
								}
							}}
							className={cn(
								'h-11 w-[340px] rounded-[10px] border border-[#dce4ee] bg-white px-4 text-[14px] placeholder-[#9da9b8] shadow-[0_2px_7px_rgba(15,23,42,0.03)] transition-all focus:border-[#1890ff] focus:outline-none focus:ring-2 focus:ring-[#1890ff]/15',
								queryClassName,
							)}
						/>
						<Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b1bac7] transition-colors group-focus-within:text-[#1890ff]" />
					</div>
				)}

				{controls}

					{showActions && (
						<div className="flex items-center gap-4">
							<button className="h-11 rounded-[10px] bg-[#2563f6] px-8 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(37,99,246,0.24)] transition-all hover:bg-[#3c75f8]" onClick={onSearch}>
								Search
							</button>
							{showReset ? (
								<button className="h-11 rounded-[10px] border border-[#dce4ee] bg-white px-6 text-[14px] font-semibold text-[#617187] shadow-[0_2px_7px_rgba(15,23,42,0.03)] transition-all hover:border-[#bcc6d2]" onClick={onReset}>
									Reset
								</button>
							) : null}
						</div>
					)}
			</div>
		</div>
	)
}
