'use client';
import { useEffect, useState } from 'react';
import { useLiveTelemetry } from '../context/LiveTelemetryContext';

interface EnergyValue {
  value: number;
  label: string;
}

interface EnergyFlowState {
  isSolarProducing: boolean;
  isBatteryCharging: boolean;
  isBatteryDischarging: boolean;
  isGridImporting: boolean;
  isGridExporting: boolean;
  isHomeConsuming: boolean;
}

interface EnergySimulationData {
  solar: EnergyValue;
  grid: EnergyValue;
  battery: EnergyValue;
  home: EnergyValue;
  flows: EnergyFlowState;
}

// Helper function to format power values with dynamic units
const formatPowerValue = (value: number): EnergyValue => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1000) {
    const mwValue = value / 1000;
    return {
      value: parseFloat(mwValue.toFixed(2)),
      label: `${Math.abs(mwValue).toFixed(2)} MW`
    };
  } else {
    return {
      value: parseFloat(value.toFixed(1)),
      label: `${Math.abs(value).toFixed(1)} kW`
    };
  }
};

export function useEnergySimulation(): EnergySimulationData | null {
  const { latestTelemetry, isConnected } = useLiveTelemetry();
  
  const [energyData, setEnergyData] = useState<{
    solar: number;
    grid: number;
    battery: number;
    home: number;
  } | null>(null);

  // Update energy data based on real telemetry only
  useEffect(() => {
    if (isConnected && latestTelemetry) {
      // Use real telemetry data
      const solar = latestTelemetry.solar.power_ac_kw;
      const battery = latestTelemetry.battery.power_kw;
      const grid = latestTelemetry.grid.power_kw;
      
      // Calculate home consumption: Solar + Grid + Battery = Home
      // Home consumption is positive, so: Home = Solar + Grid + Battery
      // Note: Battery positive = discharging, negative = charging
      // Note: Grid positive = importing, negative = exporting
      const home = solar + grid + battery;
      
      setEnergyData({
        solar: parseFloat(solar.toFixed(1)),
        battery: parseFloat(battery.toFixed(1)),
        grid: parseFloat(grid.toFixed(1)),
        home: parseFloat(home.toFixed(1))
      });
      
      console.log('Real telemetry energy balance:', {
        solar, battery, grid, home,
        input: solar + grid + battery,
        output: home,
        balanced: Math.abs((solar + grid + battery) - home) < 0.1
      });
    } else if (isConnected && !latestTelemetry) {
      // Connected but waiting for data - set to zero values
      setEnergyData({
        solar: 0,
        grid: 0,
        battery: 0,
        home: 0
      });
    } else {
      // Not connected - return null for error page
      setEnergyData(null);
    }
  }, [latestTelemetry, isConnected]);

  // Return null only if not connected (for error page)
  if (!isConnected) {
    return null;
  }

  // Return zero data if connected but no telemetry yet
  const dataToUse = energyData || {
    solar: 0,
    grid: 0,
    battery: 0,
    home: 0
  };

  // Calculate flow states
  const flows: EnergyFlowState = {
    isSolarProducing: dataToUse.solar > 0.1,
    isBatteryCharging: dataToUse.battery < -0.1,
    isBatteryDischarging: dataToUse.battery > 0.1,
    isGridImporting: dataToUse.grid > 0.1,
    isGridExporting: dataToUse.grid < -0.1,
    isHomeConsuming: dataToUse.home > 0.1
  };

  return {
    solar: formatPowerValue(dataToUse.solar),
    grid: formatPowerValue(dataToUse.grid),
    battery: formatPowerValue(dataToUse.battery),
    home: formatPowerValue(dataToUse.home),
    flows
  };
}