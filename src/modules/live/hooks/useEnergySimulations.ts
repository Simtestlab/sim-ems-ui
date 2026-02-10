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

interface AdditionalMetrics {
  solarDailyYield: number; // kWh
  solarPeak: number; // kW
  homeTotalConsumed: number; // kWh
  gridBoughtToday: number; // kWh
  gridSoldToday: number; // kWh
  batterySOC: number; // percent
  gridVoltage: number; // V
  gridFrequency: number; // Hz
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
  }>( {
    solar: 5.0,
    grid: 2.5,
    battery: -2.0,
    home: 4.5
  });

  // Additional accumulated metrics
  const [solarDailyYield, setSolarDailyYield] = useState<number>(0); // kWh
  const [solarPeak, setSolarPeak] = useState<number>(0); // kW
  const [homeTotalConsumed, setHomeTotalConsumed] = useState<number>(0); // kWh
  const [gridBoughtToday, setGridBoughtToday] = useState<number>(0); // kWh
  const [gridSoldToday, setGridSoldToday] = useState<number>(0); // kWh
  const [batterySOC, setBatterySOC] = useState<number>(80); // percent

  // Grid electrical constants
  const GRID_VOLTAGE = 220;
  const GRID_FREQUENCY = 50;

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
      
      // integration timestep (seconds) is based on our update interval (1s)
      const dtHours = 1 / 3600; // 1 second -> hours

      // accumulate daily solar yield (kWh)
      setSolarDailyYield(prev => prev + Math.max(0, newData.solar) * dtHours);

      // peak solar
      setSolarPeak(prev => Math.max(prev, Math.abs(newData.solar)));

      // home total consumed (kWh)
      setHomeTotalConsumed(prev => prev + Math.max(0, newData.home) * dtHours);

      // grid bought/sold today (kWh). positive grid means importing (bought), negative exporting (sold)
      if (newData.grid > 0) {
        setGridBoughtToday(prev => prev + newData.grid * dtHours);
      } else if (newData.grid < 0) {
        setGridSoldToday(prev => prev + Math.abs(newData.grid) * dtHours);
      }

      // battery state of charge simulation
      // assume a battery capacity of 10 kWh for SOC calculations
      const BATTERY_CAPACITY_KWH = 10;
      // battery kW: negative = charging (into battery), positive = discharging (out)
      // energy change to battery in kWh over dtHours is -battery_kW * dtHours
      const deltaBatteryKWh = -newData.battery * dtHours;
      setBatterySOC(prev => {
        const energyInBattery = (prev / 100) * BATTERY_CAPACITY_KWH + deltaBatteryKWh;
        const newSOC = Math.max(0, Math.min(100, (energyInBattery / BATTERY_CAPACITY_KWH) * 100));
        return parseFloat(newSOC.toFixed(1));
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
    flows,
    // attach additional metrics under a `_metrics` key to avoid changing primary shape
    // @ts-ignore -- dynamic extension for UI convenience
    _metrics: {
      solarDailyYield: parseFloat(solarDailyYield.toFixed(3)),
      solarPeak: parseFloat(solarPeak.toFixed(2)),
      homeTotalConsumed: parseFloat(homeTotalConsumed.toFixed(3)),
      gridBoughtToday: parseFloat(gridBoughtToday.toFixed(3)),
      gridSoldToday: parseFloat(gridSoldToday.toFixed(3)),
      batterySOC: parseFloat(batterySOC.toFixed(1)),
      gridVoltage: GRID_VOLTAGE,
      gridFrequency: GRID_FREQUENCY
    } as AdditionalMetrics
  } as any;
}