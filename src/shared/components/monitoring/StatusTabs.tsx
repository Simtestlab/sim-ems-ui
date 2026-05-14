"use client"

import type React from 'react'
import { cn } from '@/shared/utils/cn'

export type MonitoringStatusTabItem = {
	key: string
	label: string
}

type MonitoringStatusTabsProps = {
	statusTabs: MonitoringStatusTabItem[]
	selectedStatus: string
	counts: Record<string, number>
	onSelectStatus: (status: string) => void
	secondaryRow?: React.ReactNode
	className?: string
	size?: 'normal' | 'large'
}

export default function MonitoringStatusTabs({
	statusTabs,
	selectedStatus,
	counts,
	onSelectStatus,
	secondaryRow,
	className,
	size = 'normal',
}: MonitoringStatusTabsProps) {
	return (
		<div className={cn('border-b border-[#e9eef5] bg-white shadow-sm', className)}>
			<div className="flex items-center gap-4 px-4 pt-2 pb-2">
				<div className={cn('flex items-center gap-x-5', size === 'large' ? 'text-[15px]' : 'text-[14px]')}>
					{statusTabs.map((tab) => {
						const isActive = selectedStatus === tab.key

						return (
							<button
								key={tab.key}
								onClick={() => onSelectStatus(tab.key)}
								className={cn(
									'relative whitespace-nowrap pb-2 transition-colors',
									isActive ? 'font-semibold text-[#111111]' : 'text-[#6f6f6f] hover:text-[#2d2d2d]',
								)}
								style={size === 'large' ? { paddingBottom: 10 } : undefined}
							>
								<span className={size === 'large' ? 'text-[15px]' : 'text-[14px]'}>{tab.label}</span>
								<span className={size === 'large' ? 'ml-2 text-[15px]' : 'ml-2 text-[14px]'}>({counts[tab.key] ?? 0})</span>
								{isActive ? <span className={size === 'large' ? 'absolute bottom-0 left-0 h-1.5 w-full bg-[#111111]' : 'absolute bottom-0 left-0 h-[2px] w-full bg-[#111111]'} /> : null}
							</button>
						)
					})}
				</div>

				{secondaryRow ? (
					<div className="shrink-0 border-l border-[#e9eef5] pl-4 text-[13px] text-[#5d6a7d]">
						{secondaryRow}
					</div>
				) : null}
			</div>
		</div>
	)
}
