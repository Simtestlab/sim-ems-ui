'use client';
import { useLiveTelemetry } from '../context/LiveTelemetryContext';

export function useAdvancedTelemetryData() {
  const { latestTelemetry, isConnected } = useLiveTelemetry();

  // Enhanced metrics for Solar card
  const solarMetrics = {
    irradiance: latestTelemetry?.solar.irradiance_w_m2,
    efficiency: latestTelemetry?.solar.efficiency ? (latestTelemetry.solar.efficiency * 100) : null,
    dailyYield: null, // Could be calculated if we track cumulative data
    peakPower: latestTelemetry?.solar.power_ac_kw, // Current power as peak for now
  };

  // Enhanced metrics for Grid card  
  const gridMetrics = {
    voltage: latestTelemetry?.grid.voltage,
    frequency: latestTelemetry?.grid.frequency,
    price: latestTelemetry?.grid.price,
    status: latestTelemetry?.grid.status,
  };

  // Enhanced metrics for Battery card
  const batteryMetrics = {
    soc: latestTelemetry?.battery.soc ? (latestTelemetry.battery.soc * 100) : null,
    soh: latestTelemetry?.battery.soh ? (latestTelemetry.battery.soh * 100) : null,
    voltage: latestTelemetry?.battery.voltage,
    temperature: latestTelemetry?.battery.temperature_c,
    faults: latestTelemetry?.battery.faults,
  };

  // Calculate load metrics (derived from energy balance)
  const loadMetrics = {
    // Add any derived load-specific metrics here
    totalConsumption: null, // Could calculate daily/hourly totals
  };

  return {
    isConnected,
    solar: solarMetrics,
    grid: gridMetrics,
    battery: batteryMetrics,
    load: loadMetrics,
    inverter: latestTelemetry?.inverter,
    lastUpdate: latestTelemetry ? new Date() : null,
  };
}