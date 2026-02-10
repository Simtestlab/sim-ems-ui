'use client';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';
import { useNavStore } from '@/store/useNavStore';
import { COLORS } from '@/modules/live/utils/constants';
import { RadialEnergyMonitor } from '@/modules/live/components/RadialEnergyMonitor';

export function LivePage() {
  const { selectedSite } = useNavStore();
  const energyData = useEnergySimulation(selectedSite);

  if (!energyData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const { solar, grid, home, battery, flows, rawTelemetry } = energyData;
  const { getIconComponent } = useEnergyIcons(flows);

  const SolarIcon = getIconComponent('solar');
  const GridIcon = getIconComponent('grid');
  const HomeIcon = getIconComponent('home');
  const BatteryIcon = getIconComponent('battery');

  const selfSufficiency = (() => {
    if (!home?.value) return '—';
    const gridImport = Math.max(0, grid?.value ?? 0);
    const perc = Math.max(0, Math.min(100, Math.round((1 - gridImport / Math.max(0.0001, home.value)) * 100)));
    return `${perc}%`;
  })();

  return (
    // Main Dashboard Grid - Full Height, No Outer Padding
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 bg-gray-200 gap-[1px] border-t border-gray-200">
          
          {/* LEFT COLUMN: Solar & Grid */}
          {/* Using grid-rows-2 forces these to be exactly equal height */}
          <div className="lg:col-span-1 grid grid-rows-2 gap-[1px]">
            
            {/* CARD 1: SOLAR */}
            <div className="bg-white p-6 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</div>
              <div className="flex justify-center mb-4">
                <SolarIcon size={36} style={{ color: COLORS.solar }} />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Solar</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {rawTelemetry?.solar.power_ac_kw?.toFixed(2) ?? '—'} 
                <span className="text-sm font-medium text-gray-500">kW</span>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                <div className="flex justify-between px-2">
                  <span>Irradiance:</span> 
                  <span className="font-medium text-gray-900">{rawTelemetry?.solar.irradiance_w_m2?.toFixed(0) ?? '—'} W/m²</span>
                </div>
                <div className="flex justify-between px-2">
                  <span>Efficiency:</span> 
                  <span className="font-medium text-gray-900">{rawTelemetry?.solar.efficiency ? (rawTelemetry.solar.efficiency * 100).toFixed(1) : '—'}%</span>
                </div>
                <div className="flex justify-between px-2">
                  <span>Panel Temp:</span> 
                  <span className="font-medium text-gray-900">{rawTelemetry?.solar.panel_temp_c?.toFixed(1) ?? '—'}°C</span>
                </div>
              </div>
            </div>

            {/* CARD 2: GRID */}
            <div className="bg-white p-6 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Connection</div>
              <div className="flex justify-center mb-4">
                <GridIcon size={34} style={{ color: COLORS.grid }} />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Grid</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {rawTelemetry?.grid.power_kw?.toFixed(2) ?? '—'} 
                <span className="text-sm font-medium text-gray-500">kW</span>
              </div>
              
              <div className="w-full space-y-2 text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span>Voltage</span>
                  <span className="font-medium text-gray-900">{rawTelemetry?.grid.voltage?.toFixed(0) ?? '—'} V</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span>Frequency</span>
                  <span className="font-medium text-gray-900">{rawTelemetry?.grid.frequency?.toFixed(1) ?? '—'} Hz</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Status</span>
                  <span className="font-medium text-green-600 uppercase">{rawTelemetry?.grid.status ?? 'unknown'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Visualization */}
          {/* col-span-2 gives this double width compared to sides */}
          <div className="lg:col-span-2 bg-white relative flex flex-col">
            {/* Visualization Container */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              <div className="w-full h-full max-w-none max-h-none flex items-center justify-center">
                <RadialEnergyMonitor />
              </div>
            </div>

            {/* Bottom Status Bar integrated into Center Panel */}
            <div className="h-16 border-t border-gray-100 bg-gray-50 flex divide-x divide-gray-200">
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500">Efficiency</span>
                <span className="font-semibold text-gray-900">{rawTelemetry?.solar.efficiency ? (rawTelemetry.solar.efficiency * 100).toFixed(1) + '%' : '—'}</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500">Current Price</span>
                <span className="font-semibold text-gray-900">{rawTelemetry?.grid.price ? `$${rawTelemetry.grid.price.toFixed(3)}/kWh` : '—'}</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500">Self Sufficiency</span>
                <span className="font-semibold text-green-600">{selfSufficiency}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Load & Battery */}
          {/* Identical structure to Left Column for symmetry */}
          <div className="lg:col-span-1 grid grid-rows-2 gap-[1px]">
            
            {/* CARD 3: LOAD */}
            <div className="bg-white p-6 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Consumption</div>
              <div className="flex justify-center mb-4">
                <HomeIcon size={34} style={{ color: COLORS.home }} />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Load</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {home?.value?.toFixed(2) ?? '—'} 
                <span className="text-sm font-medium text-gray-500">kW</span>
              </div>
              
              <div className="w-full text-center text-sm text-gray-600 space-y-1">
                <div>Self Sufficiency: <span className="font-medium text-gray-900">{selfSufficiency}</span></div>
                <div>Total Consumed: <span className="font-medium text-gray-900">— kWh</span></div>
              </div>
            </div>

            {/* CARD 4: BATTERY */}
            <div className="bg-white p-6 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Storage</div>
              <div className="flex justify-center mb-4">
                <BatteryIcon size={36} style={{ color: COLORS.battery }} />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Battery</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {rawTelemetry?.battery.soc ? (rawTelemetry.battery.soc * 100).toFixed(1) : '—'} 
                <span className="text-sm font-medium text-gray-500">%</span>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                <div className="flex justify-between px-2">
                  <span>Power:</span> 
                  <span className="font-medium text-gray-900">{rawTelemetry?.battery.power_kw?.toFixed(2) ?? '—'} kW</span>
                </div>
                <div className="flex justify-between px-2">
                  <span>Temp:</span> 
                  <span className="font-medium text-gray-900">{rawTelemetry?.battery.temperature_c?.toFixed(1) ?? '—'}°C</span>
                </div>
                <div className="col-span-2 text-center mt-2 pt-2 border-t border-gray-100">
                  Voltage: <span className="font-medium text-gray-900">{rawTelemetry?.battery.voltage?.toFixed(0) ?? '—'} V</span>
                </div>
              </div>
            </div>
          </div>

        </div>
  );
}