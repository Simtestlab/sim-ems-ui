export interface BatteryData {
  soc: number; // State of Charge (0-1)
  soh: number; // State of Health (0-1)
  voltage: number; // Volts
  current: number; // Amperes
  temperature_c: number; // Celsius
  cycle_count: number; // Number of charge cycles
  faults: string[];
  warnings: string[];
  power_kw: number; // Positive = discharging, Negative = charging
}

export interface GridData {
  frequency: number; // Hz
  voltage: number; // Volts
  power_kw: number; // Positive = import, Negative = export
  price: number; // Price per kWh
  status: 'connected' | 'disconnected' | 'fault';
  trip_occurred: boolean;
}

export interface SolarData {
  power_ac_kw: number; // AC power output
  power_dc_kw: number; // DC power input
  irradiance_w_m2: number; // Solar irradiance in W/m²
  panel_temp_c: number; // Panel temperature in Celsius
  efficiency: number; // Panel efficiency (0-1)
}

export interface InverterData {
  priority: string; // Current priority level
  action: 'peak_shaving' | 'load_shifting' | 'grid_support' | 'idle';
  reason: string; // Human readable reason
  peak_demand_threshold: number; // Peak demand threshold in kW
}

export interface MicrogridTelemetry {
  device_id: string;
  timestamp: string;
  battery: BatteryData;
  grid: GridData;
  solar: SolarData;
  inverter: InverterData;
}