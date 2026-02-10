'use client';
import { useLiveTelemetry } from '../context/LiveTelemetryContext';

interface HealthCardProps {
  title: string;
  children: React.ReactNode;
}

function HealthCard({ title, children }: HealthCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
      {children}
    </div>
  );
}

interface BadgeProps {
  type: 'green' | 'blue' | 'orange' | 'red' | 'gray';
  children: React.ReactNode;
}

function Badge({ type, children }: BadgeProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[type]}`}>
      {children}
    </span>
  );
}

function InverterStatusCard() {
  const { latestTelemetry } = useLiveTelemetry();

  if (!latestTelemetry) {
    return (
      <HealthCard title="System Status">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-28"></div>
        </div>
      </HealthCard>
    );
  }

  const { inverter } = latestTelemetry;

  const getBadgeType = (action: string) => {
    switch (action.toLowerCase()) {
      case 'peak_shaving':
        return 'green';
      case 'load_shifting':
        return 'blue';
      case 'grid_support':
        return 'orange';
      case 'idle':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <HealthCard title="System Status">
      <div className="space-y-2">
        <div>
          <Badge type={getBadgeType(inverter.action)}>
            {inverter.action.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>Reason: {inverter.reason.replace('_', ' ')}</div>
          <div>Priority: {inverter.priority || 'normal'}</div>
        </div>
      </div>
    </HealthCard>
  );
}

function GridQualityCard() {
  const { latestTelemetry } = useLiveTelemetry();

  if (!latestTelemetry) {
    return (
      <HealthCard title="Grid Quality">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
        </div>
      </HealthCard>
    );
  }

  const { grid } = latestTelemetry;

  // Check if frequency is out of normal range (49.8-50.2 Hz)
  const isFrequencyOutOfRange = grid.frequency < 49.8 || grid.frequency > 50.2;
  const frequencyColor = isFrequencyOutOfRange ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100';

  return (
    <HealthCard title="Grid Quality">
      <div className="space-y-2">
        <div className={`text-lg font-semibold ${frequencyColor}`}>
          {grid.frequency.toFixed(2)} Hz
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>Voltage: {grid.voltage.toFixed(0)} V</div>
        </div>
      </div>
    </HealthCard>
  );
}

function BatteryHealthCard() {
  const { latestTelemetry } = useLiveTelemetry();

  if (!latestTelemetry) {
    return (
      <HealthCard title="BMS Health">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
        </div>
      </HealthCard>
    );
  }

  const { battery } = latestTelemetry;

  // Check if temperature is high (>40°C)
  const isHighTemp = battery.temperature_c > 40;
  const tempColor = isHighTemp ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100';

  const hasFaults = battery.faults && battery.faults.length > 0;

  return (
    <HealthCard title="BMS Health">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`text-lg font-semibold ${tempColor}`}>
            {battery.temperature_c.toFixed(0)}°C
          </div>
          {hasFaults && (
            <div className="text-red-500 dark:text-red-400" title="Battery faults detected">
              ⚠️
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>SOH: {(battery.soh * 100).toFixed(1)}%</div>
          <div>Cycles: {battery.cycle_count || 0}</div>
        </div>
      </div>
    </HealthCard>
  );
}

function SolarConditionsCard() {
  const { latestTelemetry } = useLiveTelemetry();

  if (!latestTelemetry) {
    return (
      <HealthCard title="Solar Conditions">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
        </div>
      </HealthCard>
    );
  }

  const { solar } = latestTelemetry;

  return (
    <HealthCard title="Solar Conditions">
      <div className="space-y-2">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {solar.irradiance_w_m2.toFixed(0)} W/m²
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>Efficiency: {(solar.efficiency * 100).toFixed(1)}%</div>
          <div>Panel Temp: {solar.panel_temp_c?.toFixed(0) || '—'}°C</div>
        </div>
      </div>
    </HealthCard>
  );
}

export default function SystemHealthGrid() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <InverterStatusCard />
        <GridQualityCard />
        <BatteryHealthCard />
        <SolarConditionsCard />
      </div>
    </div>
  );
}