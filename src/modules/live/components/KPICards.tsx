"use client";
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';
import { COLORS } from '@/modules/live/utils/constants';

// compact, equal card size with explicit width so columns can rely on card size
// use the same background as the RadialEnergyMonitor container (bg-gray-50)
// increased height and center alignment
const baseCardClass = 'w-[350px] h-52 bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center';

export function SolarCard() {
	const { solar, flows } = useEnergySimulation();
	// access additional metrics (returned under _metrics)
	// @ts-ignore
	const metrics = (useEnergySimulation() as any)._metrics || {};
	const { getIconComponent } = useEnergyIcons(flows);
	const SolarIcon = getIconComponent('solar');

	return (
		<div className={baseCardClass}>
			<div className="flex justify-center mb-2">
				<SolarIcon size={36} style={{ color: COLORS.solar }} />
			</div>
			<h3 className="text-center text-md font-semibold mb-2">Solar</h3>
			<div className="space-y-1 text-gray-700 dark:text-gray-200 text-sm text-center">
				<div>Current Power: <span className="font-medium">{solar.label}</span></div>
				<div>Daily Yield: <span className="font-medium">{metrics.solarDailyYield?.toFixed(2) ?? '—'} kWh</span></div>
				<div>Peak Power: <span className="font-medium">{metrics.solarPeak ?? solar.value} kW</span></div>
				<div>Status: <span className="font-medium uppercase">{flows.isSolarProducing ? 'GENERATING' : 'IDLE'}</span></div>
			</div>
		</div>
	);
}

export function GridCard() {
	const { grid, flows } = useEnergySimulation();
	const gmetrics = (useEnergySimulation() as any)._metrics || {};
	const { getIconComponent } = useEnergyIcons(flows);
	const GridIcon = getIconComponent('grid');

	return (
		<div className={baseCardClass}>
			<div className="flex justify-center mb-2">
				<GridIcon size={34} style={{ color: COLORS.grid }} />
			</div>
			<h3 className="text-center text-md font-semibold mb-2">Grid</h3>
			<div className="grid grid-cols-2 gap-1 text-sm text-gray-700 dark:text-gray-200 items-center text-center">
				<div className="col-span-1">
					  <div>Grid Power: <span className="font-medium">{grid.label}</span></div>
					  <div>Voltage: <span className="font-medium">{gmetrics.gridVoltage ?? 220} V</span></div>
					  <div>Frequency: <span className="font-medium">{gmetrics.gridFrequency ?? 50} Hz</span></div>
				</div>
				<div className="col-span-1 border-l pl-3">
						<div>Status: <span className="font-medium">{flows.isGridImporting ? 'Importing' : flows.isGridExporting ? 'Exporting' : 'Idle'}</span></div>
						<div>Bought Today: <span className="font-medium">{gmetrics.gridBoughtToday?.toFixed(3) ?? '0.000'} kWh</span></div>
						<div>Sold Today: <span className="font-medium">{gmetrics.gridSoldToday?.toFixed(3) ?? '0.000'} kWh</span></div>
				</div>
			</div>
		</div>
	);
}

export function LoadCard() {
	const { home, grid, flows } = useEnergySimulation();
	const lmetrics = (useEnergySimulation() as any)._metrics || {};
	const { getIconComponent } = useEnergyIcons(flows);
	const HomeIcon = getIconComponent('home');

	const selfSufficiency = (() => {
		if (!home?.value) return '—';
		const gridImport = Math.max(0, grid?.value ?? 0);
		const perc = Math.max(0, Math.min(100, Math.round((1 - gridImport / Math.max(0.0001, home.value)) * 100)));
		return `${perc}%`;
	})();

	return (
		<div className={baseCardClass}>
			<div className="flex justify-center mb-2">
				<HomeIcon size={34} style={{ color: COLORS.home }} />
			</div>
			<h3 className="text-center text-md font-semibold mb-2">Load</h3>
			<div className="space-y-1 text-gray-700 dark:text-gray-200 text-sm text-center">
				<div>Current Load: <span className="font-medium">{home.label}</span></div>
				<div>Total Consumed: <span className="font-medium">{lmetrics.homeTotalConsumed?.toFixed(3) ?? '0.000'} kWh</span></div>
				<div>Self Sufficiency: <span className="font-medium">{selfSufficiency}</span></div>
			</div>
		</div>
	);
}

export function BatteryCard() {
	const { battery, flows } = useEnergySimulation();
	const bmetrics = (useEnergySimulation() as any)._metrics || {};
	const { getIconComponent } = useEnergyIcons(flows);
	const BatIcon = getIconComponent('battery');

	return (
		<div className={baseCardClass}>
			<div className="flex justify-center mb-2">
				<BatIcon size={36} style={{ color: COLORS.battery }} />
			</div>
			<h3 className="text-center text-md font-semibold mb-2">Battery</h3>
			<div className="space-y-1 text-gray-700 dark:text-gray-200 text-sm text-center">
				<div>State of Charge: <span className="font-medium">{bmetrics.batterySOC ?? '—'}%</span></div>
				<div>Power Flow: <span className="font-medium">{battery.label}</span></div>
				<div>Voltage: <span className="font-medium">20 V</span></div>
				<div>Current: <span className="font-medium">2 AH</span></div>
			</div>
		</div>
	);
}
