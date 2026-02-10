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
    // Main Dashboard - Responsive Layout with Footer Space
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-3 lg:p-6 min-h-0">
      <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 max-h-full overflow-hidden">
          
          {/* LEFT COLUMN: Solar & Grid - Viewport Constrained */}
          <div className="lg:col-span-3 grid grid-rows-2 gap-3 lg:gap-6 min-h-0">
            
            {/* CARD 1: SOLAR */}
            <div className="bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-lg transition-all duration-300 min-h-0 overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</div>
              <div className="flex justify-center mb-4 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full">
                <SolarIcon size={32} style={{ color: COLORS.solar }} />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-1 text-slate-800">Solar</h3>
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 lg:mb-6">
                {rawTelemetry?.solar.power_ac_kw?.toFixed(2) ?? '—'} 
                <span className="text-sm font-medium text-slate-500 ml-1">kW</span>
              </div>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Irradiance</span> 
                  <span className="font-semibold text-slate-900">{rawTelemetry?.solar.irradiance_w_m2?.toFixed(0) ?? '—'} W/m²</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Efficiency</span> 
                  <span className="font-semibold text-slate-900">{rawTelemetry?.solar.efficiency ? (rawTelemetry.solar.efficiency * 100).toFixed(1) : '—'}%</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Panel Temp</span> 
                  <span className="font-semibold text-slate-900">{rawTelemetry?.solar.panel_temp_c?.toFixed(1) ?? '—'}°C</span>
                </div>
              </div>
            </div>

            {/* CARD 2: GRID */}
            <div className="bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-lg transition-all duration-300 min-h-0 overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Connection</div>
              <div className="flex justify-center mb-4 p-3 bg-gradient-to-br from-violet-50 to-violet-100 rounded-full">
                <GridIcon size={32} style={{ color: COLORS.grid }} />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-slate-800">Grid</h3>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                {rawTelemetry?.grid.power_kw?.toFixed(2) ?? '—'} 
                <span className="text-sm font-medium text-slate-500 ml-1">kW</span>
              </div>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Voltage</span>
                  <span className="font-semibold text-slate-900">{rawTelemetry?.grid.voltage?.toFixed(0) ?? '—'} V</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Frequency</span>
                  <span className="font-semibold text-slate-900">{rawTelemetry?.grid.frequency?.toFixed(1) ?? '—'} Hz</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-emerald-50 rounded-lg">
                  <span className="text-slate-600">Status</span>
                  <span className="font-semibold text-emerald-600 uppercase tracking-wide">{rawTelemetry?.grid.status ?? 'unknown'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Visualization - Viewport Constrained */}
          <div className="lg:col-span-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 relative flex flex-col hover:shadow-lg transition-all duration-300 min-h-0">
            {/* Visualization Container - Properly constrained */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-hidden min-h-0">
              <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
                <div className="w-full h-full max-w-lg max-h-full aspect-square">
                  <RadialEnergyMonitor />
                </div>
              </div>
            </div>

            {/* Enhanced Status Bar - Responsive */}
            <div className="border-t border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm flex-shrink-0">
              <div className="grid grid-cols-3 divide-x divide-slate-200/60">
                <div className="flex flex-col items-center justify-center py-2 lg:py-4 px-2 lg:px-6">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Efficiency</span>
                  <span className="font-bold text-sm lg:text-lg text-slate-900">{rawTelemetry?.solar.efficiency ? (rawTelemetry.solar.efficiency * 100).toFixed(1) + '%' : '—'}</span>
                </div>
                <div className="flex flex-col items-center justify-center py-2 lg:py-4 px-2 lg:px-6">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Current Price</span>
                  <span className="font-bold text-sm lg:text-lg text-slate-900">{rawTelemetry?.grid.price ? `$${rawTelemetry.grid.price.toFixed(3)}/kWh` : '—'}</span>
                </div>
                <div className="flex flex-col items-center justify-center py-2 lg:py-4 px-2 lg:px-6">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Self Sufficiency</span>
                  <span className="font-bold text-sm lg:text-lg text-emerald-600">{selfSufficiency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Load & Battery - Viewport Constrained */}
          <div className="lg:col-span-3 grid grid-rows-2 gap-3 lg:gap-6 min-h-0">
            
            {/* CARD 3: LOAD */}
            <div className="bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-lg transition-all duration-300 min-h-0 overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Consumption</div>
              <div className="flex justify-center mb-4 p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full">
                <HomeIcon size={32} style={{ color: COLORS.home }} />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-slate-800">Load</h3>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                {home?.value?.toFixed(2) ?? '—'} 
                <span className="text-sm font-medium text-slate-500 ml-1">kW</span>
              </div>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Self Sufficiency</span>
                  <span className="font-semibold text-emerald-600">{selfSufficiency}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Total Consumed</span>
                  <span className="font-semibold text-slate-900">— kWh</span>
                </div>
              </div>
            </div>

            {/* CARD 4: BATTERY */}
            <div className="bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-lg transition-all duration-300 min-h-0 overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Storage</div>
              <div className="flex justify-center mb-4 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full">
                <BatteryIcon size={32} style={{ color: COLORS.battery }} />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-slate-800">Battery</h3>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                {rawTelemetry?.battery.soc ? (rawTelemetry.battery.soc * 100).toFixed(1) : '—'} 
                <span className="text-sm font-medium text-slate-500 ml-1">%</span>
              </div>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Power</span> 
                  <span className="font-semibold text-slate-900">{rawTelemetry?.battery.power_kw?.toFixed(2) ?? '—'} kW</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Temperature</span> 
                  <span className="font-semibold text-slate-900">{rawTelemetry?.battery.temperature_c?.toFixed(1) ?? '—'}°C</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Voltage</span>
                  <span className="font-semibold text-slate-900">{rawTelemetry?.battery.voltage?.toFixed(0) ?? '—'} V</span>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>
  );
}