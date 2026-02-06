'use client';
import { useEffect, useState } from 'react';

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

export function useEnergySimulation(): EnergySimulationData {
  const [energyData, setEnergyData] = useState<{
    solar: number;
    grid: number;
    battery: number;
    home: number;
  }>({
    solar: 5.0,
    grid: 2.5,
    battery: -2.0,
    home: 4.5
  });

  useEffect(() => {
    const updateEnergyData = () => {
      // Simulate day/night cycle and weather for solar (0-10 kW)
      const timeOfDay = (Date.now() / 10000) % 24; // Fast simulation of 24h cycle
      const isDaytime = timeOfDay > 6 && timeOfDay < 18;
      const weatherVariation = 0.7 + Math.random() * 0.6; // 70-130% weather efficiency
      const solarBase = isDaytime ? 8.0 : 0.0;
      const solar = solarBase * weatherVariation * (1 + 0.3 * Math.sin((timeOfDay - 6) * Math.PI / 12));
      
      // Home consumption varies between 2-8 kW with some realistic patterns
      const baseHome = 3.0;
      const consumptionSpike = Math.random() < 0.3 ? 3.0 + Math.random() * 2.0 : 0; // 30% chance of spike
      const home = Math.max(2.0, Math.min(8.0, baseHome + Math.random() * 2.0 + consumptionSpike));
      
      // Battery behavior: charging (negative), discharging (positive), or idle
      let battery = 0;
      const batteryAction = Math.random();
      if (batteryAction < 0.4) {
        // 40% chance of charging (negative values)
        battery = -(0.5 + Math.random() * 3.0);
      } else if (batteryAction < 0.8) {
        // 40% chance of discharging (positive values)
        battery = 0.5 + Math.random() * 4.0;
      }
      // 20% chance of being idle (battery = 0)
      
      // Grid balances the equation: Solar + Battery + Grid = Home
      // Rearranged: Grid = Home - Solar - Battery
      const grid = home - solar - battery;
      
      const newData = {
        solar: parseFloat(solar.toFixed(1)),
        home: parseFloat(home.toFixed(1)),
        battery: parseFloat(battery.toFixed(1)),
        grid: parseFloat(grid.toFixed(1))
      };
      
      console.log('Energy balance check:', {
        input: newData.solar + newData.battery + newData.grid,
        output: newData.home,
        balanced: Math.abs((newData.solar + newData.battery + newData.grid) - newData.home) < 0.1
      });
      
      setEnergyData(newData);
    };

    // Update immediately on mount
    updateEnergyData();
    
    const interval = setInterval(updateEnergyData, 1000);
    
    return () => {
      console.log('Cleaning up energy simulation interval');
      clearInterval(interval);
    };
  }, []);

  // Calculate flow states
  const flows: EnergyFlowState = {
    isSolarProducing: energyData.solar > 0.1,
    isBatteryCharging: energyData.battery < -0.1,
    isBatteryDischarging: energyData.battery > 0.1,
    isGridImporting: energyData.grid > 0.1,
    isGridExporting: energyData.grid < -0.1,
    isHomeConsuming: energyData.home > 0.1
  };

  return {
    solar: formatPowerValue(energyData.solar),
    grid: formatPowerValue(energyData.grid),
    battery: formatPowerValue(energyData.battery),
    home: formatPowerValue(energyData.home),
    flows
  };
}