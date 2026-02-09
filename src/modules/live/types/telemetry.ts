export interface BatteryData {
  soc: number; // State of Charge (0-1)
  soh: number; // State of Health (0-1)
  voltage: number; // Volts
  temperature_c: number; // Celsius
  faults: string[];
  power_kw: number; // Positive = discharging, Negative = charging
}

export interface GridData {
  frequency: number; // Hz
  voltage: number; // Volts
  power_kw: number; // Positive = import, Negative = export
  price: number; // Price per kWh
  status: 'connected' | 'disconnected' | 'fault';
}

export interface SolarData {
  power_ac_kw: number; // AC power output
  irradiance_w_m2: number; // Solar irradiance in W/m²
  efficiency: number; // Panel efficiency (0-1)
}

export interface InverterData {
  action: 'peak_shaving' | 'load_shifting' | 'grid_support' | 'idle';
  reason: string; // Human readable reason
}

export interface MicrogridTelemetry {
  battery: BatteryData;
  grid: GridData;
  solar: SolarData;
  inverter: InverterData;
}