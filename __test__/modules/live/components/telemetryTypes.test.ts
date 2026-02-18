import {
  BatteryData,
  GridData,
  SolarData,
  InverterData,
  MicrogridTelemetry
} from '@/modules/live/types/telemetry';

describe('Telemetry Types', () => {
  describe('BatteryData Type', () => {
    it('should accept valid battery data', () => {
      const validBattery: BatteryData = {
        soc: 0.75,
        soh: 0.95,
        voltage: 52.1,
        current: -28.8,
        temperature_c: 25.5,
        cycle_count: 450,
        faults: [],
        warnings: [],
        power_kw: -1.5
      };

      expect(validBattery.soc).toBe(0.75);
      expect(validBattery.power_kw).toBe(-1.5);
      expect(validBattery.faults).toEqual([]);
    });

    it('should handle charging state (negative power)', () => {
      const chargingBattery: BatteryData = {
        soc: 0.60,
        soh: 0.95,
        voltage: 52.0,
        current: -30.0,
        temperature_c: 26.0,
        cycle_count: 400,
        faults: [],
        warnings: [],
        power_kw: -2.5
      };

      expect(chargingBattery.power_kw).toBeLessThan(0);
    });

    it('should handle discharging state (positive power)', () => {
      const dischargingBattery: BatteryData = {
        soc: 0.70,
        soh: 0.95,
        voltage: 51.5,
        current: 40.0,
        temperature_c: 28.0,
        cycle_count: 410,
        faults: [],
        warnings: [],
        power_kw: 3.2
      };

      expect(dischargingBattery.power_kw).toBeGreaterThan(0);
    });

    it('should accept empty faults and warnings arrays', () => {
      const battery: BatteryData = {
        soc: 0.80,
        soh: 0.95,
        voltage: 52.5,
        current: -20.0,
        temperature_c: 24.0,
        cycle_count: 300,
        faults: [],
        warnings: [],
        power_kw: -1.0
      };

      expect(battery.faults).toHaveLength(0);
      expect(battery.warnings).toHaveLength(0);
    });

    it('should accept faults and warnings with messages', () => {
      const battery: BatteryData = {
        soc: 0.15,
        soh: 0.85,
        voltage: 48.0,
        current: 5.0,
        temperature_c: 35.0,
        cycle_count: 800,
        faults: ['Low voltage detected'],
        warnings: ['Temperature above nominal', 'SOC below 20%'],
        power_kw: 0.5
      };

      expect(battery.faults).toHaveLength(1);
      expect(battery.warnings).toHaveLength(2);
      expect(battery.warnings[0]).toBe('Temperature above nominal');
    });

    it('should handle SOC range 0 to 1', () => {
      const fullBattery: BatteryData = {
        soc: 1.0,
        soh: 0.95,
        voltage: 54.0,
        current: 0,
        temperature_c: 23.0,
        cycle_count: 200,
        faults: [],
        warnings: [],
        power_kw: 0
      };

      const emptyBattery: BatteryData = {
        soc: 0.0,
        soh: 0.95,
        voltage: 46.0,
        current: 0,
        temperature_c: 22.0,
        cycle_count: 500,
        faults: [],
        warnings: [],
        power_kw: 0
      };

      expect(fullBattery.soc).toBe(1.0);
      expect(emptyBattery.soc).toBe(0.0);
    });
  });

  describe('GridData Type', () => {
    it('should accept valid grid data', () => {
      const validGrid: GridData = {
        frequency: 60.0,
        voltage: 240,
        power_kw: 2.1,
        price: 0.125,
        status: 'connected',
        trip_occurred: false
      };

      expect(validGrid.frequency).toBe(60.0);
      expect(validGrid.status).toBe('connected');
      expect(validGrid.trip_occurred).toBe(false);
    });

    it('should accept connected status', () => {
      const connectedGrid: GridData = {
        frequency: 60.0,
        voltage: 240,
        power_kw: 1.5,
        price: 0.120,
        status: 'connected',
        trip_occurred: false
      };

      expect(connectedGrid.status).toBe('connected');
    });

    it('should accept disconnected status', () => {
      const disconnectedGrid: GridData = {
        frequency: 0,
        voltage: 0,
        power_kw: 0,
        price: 0,
        status: 'disconnected',
        trip_occurred: false
      };

      expect(disconnectedGrid.status).toBe('disconnected');
    });

    it('should accept fault status', () => {
      const faultGrid: GridData = {
        frequency: 59.5,
        voltage: 220,
        power_kw: 0,
        price: 0.125,
        status: 'fault',
        trip_occurred: true
      };

      expect(faultGrid.status).toBe('fault');
      expect(faultGrid.trip_occurred).toBe(true);
    });

    it('should handle importing (positive power)', () => {
      const importingGrid: GridData = {
        frequency: 60.0,
        voltage: 240,
        power_kw: 5.2,
        price: 0.150,
        status: 'connected',
        trip_occurred: false
      };

      expect(importingGrid.power_kw).toBeGreaterThan(0);
    });

    it('should handle exporting (negative power)', () => {
      const exportingGrid: GridData = {
        frequency: 60.0,
        voltage: 240,
        power_kw: -3.5,
        price: 0.080,
        status: 'connected',
        trip_occurred: false
      };

      expect(exportingGrid.power_kw).toBeLessThan(0);
    });

    it('should accept various price values', () => {
      const expensiveGrid: GridData = {
        frequency: 60.0,
        voltage: 240,
        power_kw: 2.0,
        price: 0.350,
        status: 'connected',
        trip_occurred: false
      };

      const cheapGrid: GridData = {
        frequency: 60.0,
        voltage: 240,
        power_kw: 2.0,
        price: 0.050,
        status: 'connected',
        trip_occurred: false
      };

      expect(expensiveGrid.price).toBe(0.350);
      expect(cheapGrid.price).toBe(0.050);
    });
  });

  describe('SolarData Type', () => {
    it('should accept valid solar data', () => {
      const validSolar: SolarData = {
        power_ac_kw: 5.2,
        power_dc_kw: 5.5,
        irradiance_w_m2: 850,
        panel_temp_c: 45.2,
        efficiency: 0.18
      };

      expect(validSolar.power_ac_kw).toBe(5.2);
      expect(validSolar.irradiance_w_m2).toBe(850);
      expect(validSolar.efficiency).toBe(0.18);
    });

    it('should handle zero production at night', () => {
      const nightSolar: SolarData = {
        power_ac_kw: 0,
        power_dc_kw: 0,
        irradiance_w_m2: 0,
        panel_temp_c: 18.0,
        efficiency: 0
      };

      expect(nightSolar.power_ac_kw).toBe(0);
      expect(nightSolar.irradiance_w_m2).toBe(0);
    });

    it('should handle peak production', () => {
      const peakSolar: SolarData = {
        power_ac_kw: 8.5,
        power_dc_kw: 9.0,
        irradiance_w_m2: 1100,
        panel_temp_c: 55.0,
        efficiency: 0.20
      };

      expect(peakSolar.power_ac_kw).toBeGreaterThan(8.0);
      expect(peakSolar.irradiance_w_m2).toBeGreaterThan(1000);
    });

    it('should show AC power less than DC power (inverter losses)', () => {
      const solar: SolarData = {
        power_ac_kw: 5.2,
        power_dc_kw: 5.5,
        irradiance_w_m2: 850,
        panel_temp_c: 45.0,
        efficiency: 0.18
      };

      expect(solar.power_ac_kw).toBeLessThan(solar.power_dc_kw);
    });

    it('should handle efficiency range 0 to 1', () => {
      const lowEfficiency: SolarData = {
        power_ac_kw: 3.0,
        power_dc_kw: 3.2,
        irradiance_w_m2: 600,
        panel_temp_c: 60.0,
        efficiency: 0.12
      };

      const highEfficiency: SolarData = {
        power_ac_kw: 6.5,
        power_dc_kw: 7.0,
        irradiance_w_m2: 900,
        panel_temp_c: 35.0,
        efficiency: 0.22
      };

      expect(lowEfficiency.efficiency).toBeLessThan(highEfficiency.efficiency);
    });
  });

  describe('InverterData Type', () => {
    it('should accept valid inverter data', () => {
      const validInverter: InverterData = {
        priority: 'battery',
        action: 'peak_shaving',
        reason: 'Peak demand period',
        peak_demand_threshold: 10.0
      };

      expect(validInverter.priority).toBe('battery');
      expect(validInverter.action).toBe('peak_shaving');
    });

    it('should accept peak_shaving action', () => {
      const inverter: InverterData = {
        priority: 'battery',
        action: 'peak_shaving',
        reason: 'Reducing peak load',
        peak_demand_threshold: 12.0
      };

      expect(inverter.action).toBe('peak_shaving');
    });

    it('should accept load_shifting action', () => {
      const inverter: InverterData = {
        priority: 'solar',
        action: 'load_shifting',
        reason: 'Shifting load to off-peak',
        peak_demand_threshold: 10.0
      };

      expect(inverter.action).toBe('load_shifting');
    });

    it('should accept grid_support action', () => {
      const inverter: InverterData = {
        priority: 'grid',
        action: 'grid_support',
        reason: 'Supporting grid stability',
        peak_demand_threshold: 15.0
      };

      expect(inverter.action).toBe('grid_support');
    });

    it('should accept idle action', () => {
      const inverter: InverterData = {
        priority: 'solar',
        action: 'idle',
        reason: 'No action needed',
        peak_demand_threshold: 10.0
      };

      expect(inverter.action).toBe('idle');
    });

    it('should accept various priority values', () => {
      const batteryPriority: InverterData = {
        priority: 'battery',
        action: 'peak_shaving',
        reason: 'Battery priority',
        peak_demand_threshold: 10.0
      };

      const solarPriority: InverterData = {
        priority: 'solar',
        action: 'idle',
        reason: 'Solar priority',
        peak_demand_threshold: 10.0
      };

      expect(batteryPriority.priority).toBe('battery');
      expect(solarPriority.priority).toBe('solar');
    });
  });

  describe('MicrogridTelemetry Type', () => {
    it('should accept complete telemetry data', () => {
      const telemetry: MicrogridTelemetry = {
        device_id: 'test-device-001',
        timestamp: '2026-02-17T10:00:00Z',
        battery: {
          soc: 0.75,
          soh: 0.95,
          voltage: 52.1,
          current: -28.8,
          temperature_c: 25.5,
          cycle_count: 450,
          faults: [],
          warnings: [],
          power_kw: -1.5
        },
        grid: {
          frequency: 60.0,
          voltage: 240,
          power_kw: 2.1,
          price: 0.125,
          status: 'connected',
          trip_occurred: false
        },
        solar: {
          power_ac_kw: 5.2,
          power_dc_kw: 5.5,
          irradiance_w_m2: 850,
          panel_temp_c: 45.2,
          efficiency: 0.18
        },
        inverter: {
          priority: 'battery',
          action: 'peak_shaving',
          reason: 'Peak demand period',
          peak_demand_threshold: 10.0
        }
      };

      expect(telemetry.device_id).toBe('test-device-001');
      expect(telemetry.battery.soc).toBe(0.75);
      expect(telemetry.grid.status).toBe('connected');
      expect(telemetry.solar.power_ac_kw).toBe(5.2);
      expect(telemetry.inverter.action).toBe('peak_shaving');
    });

    it('should have ISO 8601 timestamp format', () => {
      const telemetry: MicrogridTelemetry = {
        device_id: 'device-123',
        timestamp: '2026-02-17T15:30:45.123Z',
        battery: {
          soc: 0.80,
          soh: 0.95,
          voltage: 52.0,
          current: -20.0,
          temperature_c: 25.0,
          cycle_count: 400,
          faults: [],
          warnings: [],
          power_kw: -1.0
        },
        grid: {
          frequency: 60.0,
          voltage: 240,
          power_kw: 1.0,
          price: 0.120,
          status: 'connected',
          trip_occurred: false
        },
        solar: {
          power_ac_kw: 4.0,
          power_dc_kw: 4.2,
          irradiance_w_m2: 700,
          panel_temp_c: 40.0,
          efficiency: 0.17
        },
        inverter: {
          priority: 'solar',
          action: 'idle',
          reason: 'Normal operation',
          peak_demand_threshold: 10.0
        }
      };

      expect(telemetry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should have unique device identifier', () => {
      const telemetry1: MicrogridTelemetry = {
        device_id: 'ems_sim_01',
        timestamp: '2026-02-17T10:00:00Z',
        battery: {
          soc: 0.75,
          soh: 0.95,
          voltage: 52.0,
          current: -20.0,
          temperature_c: 25.0,
          cycle_count: 400,
          faults: [],
          warnings: [],
          power_kw: -1.0
        },
        grid: {
          frequency: 60.0,
          voltage: 240,
          power_kw: 1.0,
          price: 0.120,
          status: 'connected',
          trip_occurred: false
        },
        solar: {
          power_ac_kw: 4.0,
          power_dc_kw: 4.2,
          irradiance_w_m2: 700,
          panel_temp_c: 40.0,
          efficiency: 0.17
        },
        inverter: {
          priority: 'solar',
          action: 'idle',
          reason: 'Normal operation',
          peak_demand_threshold: 10.0
        }
      };

      const telemetry2: MicrogridTelemetry = {
        ...telemetry1,
        device_id: 'ems_sim_02'
      };

      expect(telemetry1.device_id).not.toBe(telemetry2.device_id);
    });
  });

  describe('Type Composition', () => {
    it('should allow creating telemetry with individual components', () => {
      const battery: BatteryData = {
        soc: 0.70,
        soh: 0.95,
        voltage: 51.5,
        current: -25.0,
        temperature_c: 26.0,
        cycle_count: 420,
        faults: [],
        warnings: [],
        power_kw: -1.2
      };

      const grid: GridData = {
        frequency: 60.0,
        voltage: 240,
        power_kw: 1.8,
        price: 0.130,
        status: 'connected',
        trip_occurred: false
      };

      const solar: SolarData = {
        power_ac_kw: 4.5,
        power_dc_kw: 4.8,
        irradiance_w_m2: 750,
        panel_temp_c: 42.0,
        efficiency: 0.175
      };

      const inverter: InverterData = {
        priority: 'battery',
        action: 'load_shifting',
        reason: 'Off-peak charging',
        peak_demand_threshold: 11.0
      };

      const telemetry: MicrogridTelemetry = {
        device_id: 'composite-device',
        timestamp: new Date().toISOString(),
        battery,
        grid,
        solar,
        inverter
      };

      expect(telemetry.battery).toEqual(battery);
      expect(telemetry.grid).toEqual(grid);
      expect(telemetry.solar).toEqual(solar);
      expect(telemetry.inverter).toEqual(inverter);
    });

    it('should support partial updates', () => {
      const baseTelemetry: MicrogridTelemetry = {
        device_id: 'test-device',
        timestamp: '2026-02-17T10:00:00Z',
        battery: {
          soc: 0.75,
          soh: 0.95,
          voltage: 52.0,
          current: -20.0,
          temperature_c: 25.0,
          cycle_count: 400,
          faults: [],
          warnings: [],
          power_kw: -1.0
        },
        grid: {
          frequency: 60.0,
          voltage: 240,
          power_kw: 1.0,
          price: 0.120,
          status: 'connected',
          trip_occurred: false
        },
        solar: {
          power_ac_kw: 4.0,
          power_dc_kw: 4.2,
          irradiance_w_m2: 700,
          panel_temp_c: 40.0,
          efficiency: 0.17
        },
        inverter: {
          priority: 'solar',
          action: 'idle',
          reason: 'Normal operation',
          peak_demand_threshold: 10.0
        }
      };

      const updatedTelemetry: MicrogridTelemetry = {
        ...baseTelemetry,
        timestamp: '2026-02-17T10:01:00Z',
        battery: {
          ...baseTelemetry.battery,
          soc: 0.76
        }
      };

      expect(updatedTelemetry.battery.soc).toBe(0.76);
      expect(updatedTelemetry.grid).toEqual(baseTelemetry.grid);
    });
  });
});


