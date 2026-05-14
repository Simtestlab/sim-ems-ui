"use client"

import type React from 'react'
import { cn } from '@/shared/utils/cn'

export type MonitoringCardTheme = 'pv' | 'pcs' | 'ev' | 'dg'

export type MonitoringCardMetric = {
	key: string
	label: string
	value: React.ReactNode
	unit?: string
	icon?: React.ReactNode
	highlighted?: boolean
	dimmed?: boolean
	onMouseEnter?: () => void
	onMouseLeave?: () => void
}

type MonitoringCardProps = {
	theme?: MonitoringCardTheme
	title: React.ReactNode
	subtitle?: React.ReactNode
	leading?: React.ReactNode
	statusLabel: React.ReactNode
	metrics: MonitoringCardMetric[]
	footer?: React.ReactNode
	onMouseEnter?: () => void
	onMouseLeave?: () => void
	onClick?: () => void
	onKeyDown?: React.KeyboardEventHandler<HTMLElement>
	role?: React.AriaRole
	tabIndex?: number
	className?: string
	size?: 'normal' | 'large'
}

const CARD_THEMES = {
	pv: {
		cardBorder: '#dfeaf8',
		cardBackground: 'linear-gradient(180deg, #fbfdff 0%, #ffffff 100%)',
		titleColor: '#2c3b52',
		subtitleColor: '#9fb0c9',
		separatorColor: '#edf3fb',
		avatarBorder: '#eef4fb',
		avatarBackground: '#ffffff',
		statusBackground: '#eef5ff',
		statusBorder: '#cde8ff',
		statusText: '#2f8cf0',
		statusDot: '#3b9cff',
		metricBackground: '#ffffff',
		metricBorder: '#eff4fb',
		metricLabel: '#9cb0cb',
		metricUnit: '#9cb0cb',
		metricIcon: '#28c4ef',
		metricIconOpacity: 0.5,
		metricRing: 'ring-[#dceffd]',
		metricShadow: 'shadow-[0_8px_20px_rgba(28,106,255,0.06)]',
	},
	pcs: {
		cardBorder: '#e6f7ef',
		cardBackground: 'linear-gradient(180deg, #fbfdfc 0%, #ffffff 100%)',
		titleColor: '#0b1220',
		subtitleColor: '#6b788c',
		separatorColor: '#eef6f2',
		avatarBorder: '#eef9f3',
		avatarBackground: '#ffffff',
		statusBackground: '#ecfdf4',
		statusBorder: '#bbf0d0',
		statusText: '#0b8a4a',
		statusDot: '#0b8a4a',
		metricBackground: '#fbfefe',
		metricBorder: '#eef6f2',
		metricLabel: '#8da0ba',
		metricUnit: '#8da0ba',
		metricIcon: '#8fd7b0',
		metricIconOpacity: 0.98,
		metricRing: 'ring-[#d6f5e5]',
		metricShadow: 'shadow-[0_8px_20px_rgba(11,138,74,0.08)]',
	},
	ev: {
		cardBorder: '#b8e8d8',
		cardBackground: 'linear-gradient(180deg, #f5fcf9 0%, #ffffff 100%)',
		titleColor: '#0b1a16',
		subtitleColor: '#5d8070',
		separatorColor: '#ddf0e8',
		avatarBorder: '#cceee0',
		avatarBackground: '#f0faf5',
		statusBackground: '#e4f9ef',
		statusBorder: '#82dfb8',
		statusText: '#0a7855',
		statusDot: '#0a7855',
		metricBackground: '#f3fbf7',
		metricBorder: '#c8ead9',
		metricLabel: '#6a9882',
		metricUnit: '#6a9882',
		metricIcon: '#3dc893',
		metricIconOpacity: 0.88,
		metricRing: 'ring-[#a8e4c6]',
		metricShadow: 'shadow-[0_8px_20px_rgba(10,120,85,0.08)]',
	},
	dg: {
		cardBorder: '#fde5d3',
		cardBackground: 'linear-gradient(180deg, #fffcfa 0%, #ffffff 100%)',
		titleColor: '#1f1410',
		subtitleColor: '#8b6f5c',
		separatorColor: '#fef4ec',
		avatarBorder: '#fef0e5',
		avatarBackground: '#fffaf5',
		statusBackground: '#fff4ed',
		statusBorder: '#ffd9b8',
		statusText: '#c2410c',
		statusDot: '#ea580c',
		metricBackground: '#fffcf9',
		metricBorder: '#fee8d6',
		metricLabel: '#a67c5d',
		metricUnit: '#a67c5d',
		metricIcon: '#fb923c',
		metricIconOpacity: 0.85,
		metricRing: 'ring-[#fed7aa]',
		metricShadow: 'shadow-[0_8px_20px_rgba(234,88,12,0.08)]',
	},
} as const

export default function MonitoringCard({
	theme = 'pv',
	title,
	subtitle,
	leading,
	statusLabel,
	metrics,
	footer,
	onMouseEnter,
	onMouseLeave,
	onClick,
	onKeyDown,
	role,
	tabIndex,
	className,
	size = 'normal',
}: MonitoringCardProps) {
	const colors = CARD_THEMES[theme]
	const interactive = Boolean(onClick || onKeyDown)

	return (
		<article
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={onClick}
			onKeyDown={onKeyDown}
			role={role}
			tabIndex={tabIndex}
			className={cn(
				'relative w-full rounded-[20px] border transition-all',
				interactive ? 'cursor-pointer' : 'cursor-default',
				size === 'large' ? 'max-w-[420px] p-6 rounded-[14px]' : 'max-w-[380px] p-4',
				className,
			)}
			style={{
				borderColor: colors.cardBorder,
				background: colors.cardBackground,
				boxShadow: '0 8px 22px rgba(15,23,42,0.05)',
			}}
		>
			<header className="mb-4 flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-4">
					<div
						className={cn(
							'flex items-center justify-center rounded-[18px] border p-2 shadow-[0_6px_16px_rgba(15,23,42,0.05)]',
							size === 'large' ? 'h-[72px] w-[72px] p-3' : 'h-[56px] w-[56px] p-2',
						)}
						style={{
							borderColor: colors.avatarBorder,
							background: colors.avatarBackground,
						}}
					>
						{leading}
					</div>

					<div className="min-w-0">
						<div className={cn('truncate font-semibold leading-tight', size === 'large' ? 'text-[20px]' : 'text-[16px]')} style={{ color: colors.titleColor }}>
							{title}
						</div>
						{subtitle ? (
							<div className={cn('mt-1 font-medium', size === 'large' ? 'text-[14px]' : 'text-[12px]')} style={{ color: colors.subtitleColor }}>
								{subtitle}
							</div>
						) : null}
					</div>
				</div>

				<div
					className={cn('flex shrink-0 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold tracking-[0.02em]',
						size === 'large' ? 'h-8 px-3 text-[13px]' : 'h-6')}
					style={{
						background: colors.statusBackground,
						borderColor: colors.statusBorder,
						color: colors.statusText,
					}}
				>
					<span className={cn('rounded-full', size === 'large' ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5')} style={{ background: colors.statusDot }} />
					{statusLabel}
				</div>
			</header>

			<div className="border-t pt-3" style={{ borderColor: colors.separatorColor }} />

			<div className={cn('mb-3 grid grid-cols-2 gap-2.5', size === 'large' ? '' : '')}>
				{metrics.map((metric) => (
					<div
						key={metric.key}
						onMouseEnter={metric.onMouseEnter}
						onMouseLeave={metric.onMouseLeave}
						className={cn(
							'relative overflow-hidden rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-150',
							metric.dimmed ? 'opacity-50' : 'opacity-100',
							metric.highlighted ? `scale-102 ring-1 ${colors.metricRing} ${colors.metricShadow}` : '',
						)}
						style={{
							background: colors.metricBackground,
							border: `1px solid ${colors.metricBorder}`,
							minHeight: size === 'large' ? 110 : 84,
						padding: size === 'large' ? '18px' : '12px',
						}}
					>
						<div className={cn('mb-2 font-semibold uppercase tracking-wide leading-tight', size === 'large' ? 'text-[13px]' : 'text-[11px]')} style={{ color: colors.metricLabel }}>
							{metric.label}
						</div>

						<div className="flex items-baseline gap-1.5">
							<span className={cn('font-bold', size === 'large' ? 'text-[32px]' : 'text-[20px]')} style={{ color: colors.titleColor }}>
								{metric.value !== null && metric.value !== undefined && metric.value !== '' ? metric.value : '--'}
							</span>
							{metric.unit ? (
								<span className={cn('font-semibold', size === 'large' ? 'text-[15px]' : 'text-[12px]')} style={{ color: colors.metricUnit }}>
									{metric.unit}
								</span>
							) : null}
						</div>

						{metric.icon ? (
							<div
								className={`absolute bottom-2.5 right-2.5 transition-transform transition-opacity duration-150 ${metric.highlighted ? 'scale-110' : ''}`}
								style={{ color: colors.metricIcon, opacity: metric.highlighted ? 1 : colors.metricIconOpacity }}
							>
								{metric.icon}
							</div>
						) : null}
					</div>
				))}
			</div>

			{footer}
		</article>
	)
}
