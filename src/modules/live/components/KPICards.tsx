"use client";
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';
import { useNavStore } from '@/store/useNavStore';
import { COLORS } from '@/modules/live/utils/constants';

// compact, equal card size with explicit width so columns can rely on card size
// use white background for clean appearance
// increased height and center alignment
const baseCardClass = 'w-[350px] h-52 bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center shadow-sm';

export function SolarCard() {
	const { selectedSite } = useNavStore();
	const energyData = useEnergySimulation(selectedSite);

	if (!energyData) {
		return null;
	}

	const { solar, flows, rawTelemetry } = energyData;
	const { getIconComponent } = useEnergyIcons(flows);
	const SolarIcon = getIconComponent('solar');

	return (
		<div className={baseCardClass}>
			<div className="flex justify-center mb-2">
				<SolarIcon size={36} style={{ color: COLORS.solar }} />
			</div>
			<h3 className="text-center text-md font-semibold mb-2 text-gray-900">Solar</h3>
			<div className="space-y-1 text-gray-900 dark:text-gray-900 text-sm text-center">
				<div>Current Power: <span className="font-medium">{solar.label}</span></div>
				<div>Irradiance: <span className="font-medium">{rawTelemetry?.solar.irradiance_w_m2?.toFixed(0) ?? '—'} W/m²</span></div>
				<div>Efficiency: <span className="font-medium">{rawTelemetry?.solar.efficiency ? (rawTelemetry.solar.efficiency * 100).toFixed(1) : '—'}%</span></div>
				<div>Status: <span className="font-medium uppercase">{flows.isSolarProducing ? 'GENERATING' : 'IDLE'}</span></div>
			</div>
		</div>
	);
}

export function GridCard() {
	const { selectedSite } = useNavStore();
	const energyData = useEnergySimulation(selectedSite);

	// Only return null if completely disconnected (error page will show)
	if (!energyData) {
		return null;
	}

	const { grid, flows, rawTelemetry } = energyData;
	const { getIconComponent } = useEnergyIcons(flows);
	const GridIcon = getIconComponent('grid');

	return (
		<div className={baseCardClass}>
			<div className="flex justify-center mb-2">
				<GridIcon size={34} style={{ color: COLORS.grid }} />
			</div>
			<h3 className="text-center text-md font-semibold mb-2 text-gray-900">Grid</h3>
			<div className="grid grid-cols-2 gap-1 text-sm text-gray-900 dark:text-gray-900 items-center text-center">
				<div className="col-span-1">
					<div>Grid Power: <span className="font-medium">{grid.label}</span></div>
					<div>Voltage: <span className="font-medium">{rawTelemetry?.grid.voltage?.toFixed(0) ?? '—'} V</span></div>
					<div>Frequency: <span className="font-medium">{rawTelemetry?.grid.frequency?.toFixed(1) ?? '—'} Hz</span></div>
				</div>
				<div className="col-span-1 border-l pl-3">
					<div>Status: <span className="font-medium capitalize">{rawTelemetry?.grid.status ?? (flows.isGridImporting ? 'importing' : flows.isGridExporting ? 'exporting' : 'idle')}</span></div>
					<div>Price: <span className="font-medium">{rawTelemetry?.grid.price ? `$${rawTelemetry.grid.price.toFixed(3)}` : '—'}</span></div>
					<div>Connection: <span className="font-medium">LIVE</span></div>
				</div>
			</div>
		</div>
	);
}

export function LoadCard() {
	const { selectedSite } = useNavStore();
	const energyData = useEnergySimulation(selectedSite);

	// Only return null if completely disconnected (error page will show)
	if (!energyData) {
		return null;
	}

	const { home, grid, flows } = energyData;
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
			<h3 className="text-center text-md font-semibold mb-2 text-gray-900">Load</h3>
			<div className="space-y-1 text-gray-900 dark:text-gray-900 text-sm text-center">
				<div>Current Load: <span className="font-medium">{home.label}</span></div>
				<div>Total Consumed: <span className="font-medium">— kWh</span></div>
				<div>Self Sufficiency: <span className="font-medium">{selfSufficiency}</span></div>
			</div>
		</div>
	);
}

export function BatteryCard() {
	const { selectedSite } = useNavStore();
	const energyData = useEnergySimulation(selectedSite);

	// Only return null if completely disconnected (error page will show)
	if (!energyData) {
		return null;
	}

	const { battery, flows, rawTelemetry } = energyData;
	const { getIconComponent } = useEnergyIcons(flows);
	const BatIcon = getIconComponent('battery');

	return (
		<div className={baseCardClass}>
			<div className="flex justify-center mb-2">
				<BatIcon size={36} style={{ color: COLORS.battery }} />
			</div>
			<h3 className="text-center text-md font-semibold mb-2 text-gray-900">Battery</h3>
			<div className="space-y-1 text-gray-900 dark:text-gray-900 text-sm text-center">
				<div>State of Charge: <span className="font-medium">{rawTelemetry?.battery.soc ? (rawTelemetry.battery.soc * 100).toFixed(1) : '—'}%</span></div>
				<div>Power Flow: <span className="font-medium">{battery.label}</span></div>
				<div>Voltage: <span className="font-medium">{rawTelemetry?.battery.voltage?.toFixed(0) ?? '—'} V</span></div>
				<div>Temperature: <span className="font-medium">{rawTelemetry?.battery.temperature_c?.toFixed(1) ?? '—'}°C</span></div>
			</div>
		</div>
	);
}
