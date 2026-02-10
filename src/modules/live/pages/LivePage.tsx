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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 min-h-0">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
          <div className="text-slate-600 font-medium">Loading energy data...</div>
        </div>
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
    // Main Dashboard Container - Constrained to viewport with header/footer space
    <div className="h-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 overflow-hidden">
      {/* Header Indicator Bar */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-violet-500"></div>
      
      {/* Main Dashboard Content - Compact layout */}
      <div className="h-full p-2 sm:p-3 lg:p-4 overflow-hidden">
        <div className="h-full grid grid-cols-1 xl:grid-cols-12 gap-2 sm:gap-3 lg:gap-4 overflow-hidden">
          
          {/* LEFT COLUMN: Solar & Grid - Compact responsive layout */}
          <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 xl:grid-rows-2 gap-2 sm:gap-3 lg:gap-4 h-full xl:h-auto">
            
            {/* CARD 1: SOLAR - More compact */}
            <div className="bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-xl shadow-lg border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group">
              {/* Compact status indicator */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Source</span>
              </div>
              
              {/* Smaller icon */}
              <div className="flex justify-center mb-2 p-2 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <SolarIcon size={28} style={{ color: COLORS.solar }} />
              </div>
              
              <h3 className="text-sm lg:text-base font-bold mb-1 text-slate-800 tracking-tight">Solar Generation</h3>
              <div className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-2 lg:mb-3 tracking-tight">
                {rawTelemetry?.solar.power_ac_kw?.toFixed(2) ?? '—'} 
                <span className="text-xs font-semibold text-slate-500 ml-1">kW</span>
              </div>
              
              {/* Compact info grid */}
              <div className="w-full space-y-1 text-xs">
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Irradiance</span> 
                  <span className="font-bold text-slate-900">{rawTelemetry?.solar.irradiance_w_m2?.toFixed(0) ?? '—'} <span className="text-[10px]">W/m²</span></span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Efficiency</span> 
                  <span className="font-bold text-slate-900">{rawTelemetry?.solar.efficiency ? (rawTelemetry.solar.efficiency * 100).toFixed(1) : '—'}<span className="text-[10px]">%</span></span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Panel Temp</span> 
                  <span className="font-bold text-slate-900">{rawTelemetry?.solar.panel_temp_c?.toFixed(1) ?? '—'}<span className="text-xs">°C</span></span>
                </div>
              </div>
            </div>

            {/* CARD 2: GRID - Compact design */}
            <div className="bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-xl shadow-lg border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group">
              {/* Compact status indicator */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Connection</span>
              </div>
              
              {/* Smaller icon */}
              <div className="flex justify-center mb-2 p-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <GridIcon size={28} style={{ color: COLORS.grid }} />
              </div>
              
              <h3 className="text-sm lg:text-base font-bold mb-1 text-slate-800 tracking-tight">Grid Connection</h3>
              <div className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-2 lg:mb-3 tracking-tight">
                {rawTelemetry?.grid.power_kw?.toFixed(2) ?? '—'} 
                <span className="text-xs font-semibold text-slate-500 ml-1">kW</span>
              </div>
              
              {/* Compact info grid */}
              <div className="w-full space-y-1 text-xs">
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Voltage</span>
                  <span className="font-bold text-slate-900">{rawTelemetry?.grid.voltage?.toFixed(0) ?? '—'} <span className="text-[10px]">V</span></span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Frequency</span>
                  <span className="font-bold text-slate-900">{rawTelemetry?.grid.frequency?.toFixed(1) ?? '—'} <span className="text-[10px]">Hz</span></span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-emerald-50 to-green-100 rounded border border-emerald-200/50">
                  <span className="text-slate-600 font-medium">Status</span>
                  <span className="font-bold text-emerald-700 uppercase tracking-wide text-[10px] flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    {rawTelemetry?.grid.status ?? 'unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Visualization - Compact and viewport-optimized */}
          <div className="xl:col-span-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/60 relative flex flex-col hover:shadow-xl transition-all duration-300 overflow-hidden group h-full">
            {/* Compact header */}
            <div className="flex items-center justify-between p-2 sm:p-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                <h2 className="font-bold text-slate-800 text-sm lg:text-base tracking-tight">Energy Flow Monitor</h2>
              </div>
              <div className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Site: {selectedSite || 'Default'}
              </div>
            </div>

            {/* Visualization Container - Optimized height */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-3 lg:p-4 overflow-hidden">
              <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
                <div className="w-full h-full max-w-lg max-h-full aspect-square">
                  <RadialEnergyMonitor />
                </div>
              </div>
            </div>

            {/* Compact Status Bar */}
            <div className="border-t border-slate-200/60 bg-gradient-to-r from-slate-50/90 via-slate-100/80 to-slate-50/90 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
                <div className="flex flex-col items-center justify-center py-2 px-2 hover:bg-slate-100/50 transition-colors duration-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    Solar Efficiency
                  </span>
                  <span className="font-extrabold text-sm lg:text-base text-blue-600">{rawTelemetry?.solar.efficiency ? (rawTelemetry.solar.efficiency * 100).toFixed(1) + '%' : '—'}</span>
                </div>
                <div className="flex flex-col items-center justify-center py-2 px-2 hover:bg-slate-100/50 transition-colors duration-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <div className="w-1 h-1 bg-violet-400 rounded-full"></div>
                    Energy Price
                  </span>
                  <span className="font-extrabold text-sm lg:text-base text-violet-600">{rawTelemetry?.grid.price ? `$${rawTelemetry.grid.price.toFixed(3)}/kWh` : '—'}</span>
                </div>
                <div className="flex flex-col items-center justify-center py-2 px-2 hover:bg-slate-100/50 transition-colors duration-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    Self Sufficiency
                  </span>
                  <span className="font-extrabold text-sm lg:text-base text-emerald-600">{selfSufficiency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Load & Battery - Compact design */}
          <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 xl:grid-rows-2 gap-2 sm:gap-3 lg:gap-4 h-full xl:h-auto">
            
            {/* CARD 3: LOAD - Compact consumption tracking */}
            <div className="bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-xl shadow-lg border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group">
              {/* Compact status indicator */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Consumption</span>
              </div>
              
              {/* Smaller icon */}
              <div className="flex justify-center mb-2 p-2 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <HomeIcon size={28} style={{ color: COLORS.home }} />
              </div>
              
              <h3 className="text-sm lg:text-base font-bold mb-1 text-slate-800 tracking-tight">Load Demand</h3>
              <div className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-2 lg:mb-3 tracking-tight">
                {home?.value?.toFixed(2) ?? '—'} 
                <span className="text-xs font-semibold text-slate-500 ml-1">kW</span>
              </div>
              
              {/* Compact info grid */}
              <div className="w-full space-y-1 text-xs">
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-emerald-50 to-green-100 rounded border border-emerald-200/50">
                  <span className="text-slate-600 font-medium">Self Sufficiency</span>
                  <span className="font-bold text-emerald-700">{selfSufficiency}</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Peak Demand</span>
                  <span className="font-bold text-slate-900">{((home?.value ?? 0) * 1.15).toFixed(2)} <span className="text-[10px]">kW</span></span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Load Factor</span>
                  <span className="font-bold text-slate-900">{home?.value ? (home.value / Math.max(home.value * 1.15, 0.001) * 100).toFixed(0) : '—'}<span className="text-[10px]">%</span></span>
                </div>
              </div>
            </div>

            {/* CARD 4: BATTERY - Compact with charge indicators */}
            <div className="bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-xl shadow-lg border border-slate-200/60 flex flex-col items-center justify-center relative hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group">
              {/* Compact status indicator with battery level */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  (rawTelemetry?.battery.soc ?? 0) > 0.8 ? 'bg-green-400' :
                  (rawTelemetry?.battery.soc ?? 0) > 0.5 ? 'bg-yellow-400' :
                  (rawTelemetry?.battery.soc ?? 0) > 0.2 ? 'bg-orange-400' : 'bg-red-400'
                }`}></div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Storage</span>
              </div>
              
              {/* Smaller icon */}
              <div className="flex justify-center mb-2 p-2 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <BatteryIcon size={28} style={{ color: COLORS.battery }} />
              </div>
              
              <h3 className="text-sm lg:text-base font-bold mb-1 text-slate-800 tracking-tight">Battery Storage</h3>
              <div className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                {rawTelemetry?.battery.soc ? (rawTelemetry.battery.soc * 100).toFixed(1) : '—'} 
                <span className="text-xs font-semibold text-slate-500 ml-1">%</span>
              </div>
              
              {/* Compact battery level indicator */}
              <div className="w-full mb-2">
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      (rawTelemetry?.battery.soc ?? 0) > 0.8 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      (rawTelemetry?.battery.soc ?? 0) > 0.5 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                      (rawTelemetry?.battery.soc ?? 0) > 0.2 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${((rawTelemetry?.battery.soc ?? 0) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Compact info grid */}
              <div className="w-full space-y-1 text-xs">
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Power Flow</span> 
                  <span className="font-bold text-slate-900">
                    {rawTelemetry?.battery.power_kw ? 
                      `${rawTelemetry.battery.power_kw > 0 ? '+' : ''}${rawTelemetry.battery.power_kw.toFixed(2)}` : '—'
                    } <span className="text-[10px]">kW</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Temperature</span> 
                  <span className="font-bold text-slate-900">{rawTelemetry?.battery.temperature_c?.toFixed(1) ?? '—'}<span className="text-[10px]">°C</span></span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded border border-slate-200/50">
                  <span className="text-slate-600 font-medium">Voltage</span>
                  <span className="font-bold text-slate-900">{rawTelemetry?.battery.voltage?.toFixed(0) ?? '—'} <span className="text-[10px]">V</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}