'use client';
import { useLiveTelemetry } from '../context/LiveTelemetryContext';

const cardClass = 'w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm';

function GridHealthCard() {
    const { latestTelemetry, isConnected } = useLiveTelemetry();

    const gridData = latestTelemetry?.grid;
    const statusColor = gridData?.status === 'connected' ? 'text-green-600' :
        gridData?.status === 'disconnected' ? 'text-red-600' : 'text-orange-600';

    return (
        <div className={cardClass}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Grid Health</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{gridData?.frequency?.toFixed(1) ?? '—'} Hz</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Voltage:</span>
                    <span className="font-medium">{gridData?.voltage?.toFixed(0) ?? '—'} V</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium capitalize ${statusColor}`}>
                        {gridData?.status ?? 'Unknown'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Connection:</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="font-medium text-xs">
                            {isConnected ? 'LIVE' : 'OFFLINE'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BatteryHealthCard() {
    const { latestTelemetry } = useLiveTelemetry();

    const batteryData = latestTelemetry?.battery;

    // Estimate cycle count based on SOH (rough approximation)
    const estimatedCycles = batteryData?.soh ? Math.round((1 - batteryData.soh) * 10000) : null;

    return (
        <div className={cardClass}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Battery Health</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">State of Health:</span>
                    <span className="font-medium">{batteryData?.soh ? `${(batteryData.soh * 100).toFixed(1)}%` : '—'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-medium">{batteryData?.temperature_c?.toFixed(1) ?? '—'}°C</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Est. Cycles:</span>
                    <span className="font-medium">{estimatedCycles ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Faults:</span>
                    <span className={`font-medium ${batteryData?.faults?.length ? 'text-red-600' : 'text-green-600'}`}>
                        {batteryData?.faults?.length ? `${batteryData.faults.length} Active` : 'None'}
                    </span>
                </div>
            </div>
        </div>
    );
}

function InverterLogicCard() {
    const { latestTelemetry } = useLiveTelemetry();

    const inverterData = latestTelemetry?.inverter;

    const getActionColor = (action: string) => {
        switch (action) {
            case 'peak_shaving': return 'bg-blue-100 text-blue-800';
            case 'load_shifting': return 'bg-purple-100 text-purple-800';
            case 'grid_support': return 'bg-green-100 text-green-800';
            case 'idle': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={cardClass}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Inverter Logic</h3>
            <div className="space-y-3">
                <div>
                    <span className="text-gray-600 text-sm block mb-1">Current Action:</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getActionColor(inverterData?.action || 'idle')}`}>
                        {inverterData?.action?.replace('_', ' ').toUpperCase() ?? 'UNKNOWN'}
                    </span>
                </div>
                <div>
                    <span className="text-gray-600 text-sm block mb-1">Reason:</span>
                    <p className="text-sm font-medium text-gray-900 break-words">
                        {inverterData?.reason ?? 'No data available'}
                    </p>
                </div>
            </div>
        </div>
    );
}

function EnvironmentCard() {
    const { latestTelemetry } = useLiveTelemetry();

    const solarData = latestTelemetry?.solar;

    return (
        <div className={cardClass}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Environment</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Solar Irradiance:</span>
                    <span className="font-medium">{solarData?.irradiance_w_m2?.toFixed(0) ?? '—'} W/m²</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Panel Efficiency:</span>
                    <span className="font-medium">{solarData?.efficiency ? `${(solarData.efficiency * 100).toFixed(1)}%` : '—'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">AC Power Output:</span>
                    <span className="font-medium">{solarData?.power_ac_kw?.toFixed(1) ?? '—'} kW</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Weather Conditions:</span>
                    <span className="font-medium text-xs">
                        {solarData?.irradiance_w_m2
                            ? solarData.irradiance_w_m2 > 800 ? 'CLEAR'
                                : solarData.irradiance_w_m2 > 400 ? 'PARTLY CLOUDY'
                                    : solarData.irradiance_w_m2 > 100 ? 'CLOUDY'
                                        : 'OVERCAST'
                            : 'UNKNOWN'
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}

export function AdvancedTelemetryGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6 bg-gray-50">
            <GridHealthCard />
            <BatteryHealthCard />
            <InverterLogicCard />
            <EnvironmentCard />
        </div>
    );
}