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
    if (!energyData || !rawTelemetry) return 'N/A';
    
    const solarPower = Math.max(0, Math.abs(rawTelemetry.solar.power_ac_kw));
    const gridPower = rawTelemetry.grid.power_kw;
    
    if (solarPower <= 0.01) return 'N/A'; // No solar production
    
    // If grid power is negative, we're exporting; if positive, we're importing
    const selfConsumed = gridPower <= 0 ? solarPower : Math.max(0, solarPower - gridPower);
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
  
  const inverterStatus = rawTelemetry?.inverter.action 
    ? rawTelemetry.inverter.action.toUpperCase().replace('_', ' ')
    : 'UNKNOWN';

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <div className="flex-1 flex items-center justify-center py-2">
          <span className="text-xs text-gray-500 mr-2">Efficiency:</span>
          <span className="font-medium">{solarEfficiency}</span>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex-1 flex items-center justify-center py-2">
          <span className="text-xs text-gray-500 mr-2">Current Price:</span>
          <span className="font-medium">{currentPrice}</span>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex-1 flex items-center justify-center py-2">
          <span className="text-xs text-gray-500 mr-2">Self-Consumption:</span>
          <span className="font-medium">{selfConsumption}</span>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex-1 flex items-center justify-center py-2">
          <span className="text-xs text-gray-500 mr-2">Status:</span>
          <span className="font-medium text-green-600">{inverterStatus}</span>
        </div>
      </div>
    </div>
  );
}
