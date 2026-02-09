"use client";

import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useNavStore } from '@/store/useNavStore';

export default function SystemMetricsBar() {
  const { selectedSite } = useNavStore();
  const energyData = useEnergySimulation(selectedSite);

  if (!energyData) {
    return null;
  }

  const { rawTelemetry } = energyData;

  // Calculate self-consumption: (Solar Power - Grid Export) / Solar Power
  const calculateSelfConsumption = (): string => {
    if (!energyData || !rawTelemetry) return '—';
    
    const solarPower = Math.max(0, rawTelemetry.solar.power_ac_kw);
    const gridExport = Math.min(0, rawTelemetry.grid.power_kw); // Negative values are exports
    
    if (solarPower <= 0.1) return '0%'; // No solar production
    
    const selfConsumed = solarPower + gridExport; // gridExport is negative, so this is solar - export
    const percentage = Math.max(0, Math.min(100, (selfConsumed / solarPower) * 100));
    
    return `${percentage.toFixed(0)}%`;
  };

  const solarEfficiency = rawTelemetry?.solar.efficiency 
    ? `${(rawTelemetry.solar.efficiency * 100).toFixed(1)}%` 
    : '—';
    
  const currentPrice = rawTelemetry?.grid.price 
    ? `$${rawTelemetry.grid.price.toFixed(3)}/kWh` 
    : '—';
    
  const selfConsumption = calculateSelfConsumption();

  return (
    <div className="w-full flex justify-center p-6">
      <div className="max-w-4xl w-full bg-white/80 dark:bg-slate-800/70 rounded-full border border-gray-200 dark:border-slate-700 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Efficiency:</span>
            <span className="font-medium">{solarEfficiency}</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Current Price:</span>
            <span className="font-medium">{currentPrice}</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Self-Consumption:</span>
            <span className="font-medium">{selfConsumption}</span>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-xs text-gray-500 mr-2">Status:</span>
            <span className="font-medium text-green-600">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
