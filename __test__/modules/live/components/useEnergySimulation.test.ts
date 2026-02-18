import { renderHook, waitFor } from '@testing-library/react';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useSiteTelemetry } from '@/modules/live/hooks/useSiteTelemetry';
import { MicrogridTelemetry } from '@/modules/live/types/telemetry';

jest.mock('@/modules/live/hooks/useSiteTelemetry');

describe('useEnergySimulation Hook', () => {
  const mockUseSiteTelemetry = useSiteTelemetry as jest.MockedFunction<typeof useSiteTelemetry>;

  const mockTelemetry: MicrogridTelemetry = {
    device_id: 'test-device',
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return energy data when connected with telemetry', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current).not.toBeNull();
      expect(result.current?.solar.value).toBe(5.2);
      expect(result.current?.grid.value).toBe(2.1);
      expect(result.current?.battery.value).toBe(-1.5);
      expect(result.current?.rawTelemetry).toEqual(mockTelemetry);
    });

    it('should return null when not connected', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: null,
        isConnected: false,
        status: 'DISCONNECTED',
        lastUpdateTime: null,
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current).toBeNull();
    });

    it('should return zero values when connected but no telemetry yet', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: null,
        isConnected: true,
        status: 'CONNECTING',
        lastUpdateTime: null,
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current).not.toBeNull();
      expect(result.current?.solar.value).toBe(0);
      expect(result.current?.grid.value).toBe(0);
      expect(result.current?.battery.value).toBe(0);
      expect(result.current?.home.value).toBe(0);
    });
  });

  describe('Energy Balance Calculation', () => {
    it('should calculate home consumption from energy balance', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.home.value).toBe(5.8);
    });

    it('should handle battery discharging (positive power)', () => {
      const dischargingTelemetry = {
        ...mockTelemetry,
        battery: { ...mockTelemetry.battery, power_kw: 2.0 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: dischargingTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.home.value).toBe(9.3);
    });

    it('should handle grid exporting (negative power)', () => {
      const exportingTelemetry = {
        ...mockTelemetry,
        grid: { ...mockTelemetry.grid, power_kw: -3.0 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: exportingTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.home.value).toBe(0.7);
    });
  });

  describe('Flow States', () => {
    it('should detect solar producing when power > 0.1', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.flows.isSolarProducing).toBe(true);
    });

    it('should detect battery charging when power < -0.1', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.flows.isBatteryCharging).toBe(true);
      expect(result.current?.flows.isBatteryDischarging).toBe(false);
    });

    it('should detect battery discharging when power > 0.1', () => {
      const dischargingTelemetry = {
        ...mockTelemetry,
        battery: { ...mockTelemetry.battery, power_kw: 2.0 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: dischargingTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.flows.isBatteryCharging).toBe(false);
      expect(result.current?.flows.isBatteryDischarging).toBe(true);
    });

    it('should detect grid importing when power > 0.1', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.flows.isGridImporting).toBe(true);
      expect(result.current?.flows.isGridExporting).toBe(false);
    });

    it('should detect grid exporting when power < -0.1', () => {
      const exportingTelemetry = {
        ...mockTelemetry,
        grid: { ...mockTelemetry.grid, power_kw: -2.0 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: exportingTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.flows.isGridImporting).toBe(false);
      expect(result.current?.flows.isGridExporting).toBe(true);
    });

    it('should detect home consuming when power > 0.1', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.flows.isHomeConsuming).toBe(true);
    });

    it('should not detect flows for values below threshold', () => {
      const lowPowerTelemetry = {
        ...mockTelemetry,
        solar: { ...mockTelemetry.solar, power_ac_kw: 0 },
        battery: { ...mockTelemetry.battery, power_kw: 0 },
        grid: { ...mockTelemetry.grid, power_kw: 0 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: lowPowerTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.flows.isSolarProducing).toBe(false);
      expect(result.current?.flows.isBatteryCharging).toBe(false);
      expect(result.current?.flows.isBatteryDischarging).toBe(false);
      expect(result.current?.flows.isGridImporting).toBe(false);
      expect(result.current?.flows.isGridExporting).toBe(false);
      expect(result.current?.flows.isHomeConsuming).toBe(false);
    });
  });

  describe('Power Value Formatting', () => {
    it('should format kW values with one decimal place', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.solar.label).toBe('5.2 kW');
      expect(result.current?.grid.label).toBe('2.1 kW');
      expect(result.current?.battery.label).toBe('1.5 kW');
    });

    it('should format MW values when >= 1000 kW', () => {
      const highPowerTelemetry = {
        ...mockTelemetry,
        solar: { ...mockTelemetry.solar, power_ac_kw: 1500.0 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: highPowerTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.solar.label).toBe('1.50 MW');
      expect(result.current?.solar.value).toBe(1.5);
    });

    it('should handle zero values', () => {
      const zeroTelemetry = {
        ...mockTelemetry,
        solar: { ...mockTelemetry.solar, power_ac_kw: 0 },
        battery: { ...mockTelemetry.battery, power_kw: 0 },
        grid: { ...mockTelemetry.grid, power_kw: 0 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: zeroTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.solar.label).toBe('0.0 kW');
      expect(result.current?.grid.label).toBe('0.0 kW');
      expect(result.current?.battery.label).toBe('0.0 kW');
    });

    it('should use absolute values for formatting', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.battery.label).toBe('1.5 kW');
    });
  });

  describe('Telemetry Updates', () => {
    it('should update when telemetry changes', () => {
      const { result, rerender } = renderHook(
        ({ siteId }) => useEnergySimulation(siteId),
        { initialProps: { siteId: 'ems_sim_01' } }
      );

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      rerender({ siteId: 'ems_sim_01' });

      expect(result.current?.solar.value).toBe(5.2);

      const updatedTelemetry = {
        ...mockTelemetry,
        solar: { ...mockTelemetry.solar, power_ac_kw: 7.5 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: updatedTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      rerender({ siteId: 'ems_sim_01' });

      expect(result.current?.solar.value).toBe(7.5);
    });

    it('should handle site ID changes', () => {
      const { result, rerender } = renderHook(
        ({ siteId }) => useEnergySimulation(siteId),
        { initialProps: { siteId: 'ems_sim_01' } }
      );

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      rerender({ siteId: 'ems_sim_01' });

      rerender({ siteId: 'ems_sim_02' });

      expect(mockUseSiteTelemetry).toHaveBeenCalledWith('ems_sim_02');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small values', () => {
      const tinyTelemetry = {
        ...mockTelemetry,
        solar: { ...mockTelemetry.solar, power_ac_kw: 0.01 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: tinyTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.solar.value).toBe(0.0);
      expect(result.current?.flows.isSolarProducing).toBe(false);
    });

    it('should handle very large values', () => {
      const largeTelemetry = {
        ...mockTelemetry,
        solar: { ...mockTelemetry.solar, power_ac_kw: 9999.9 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: largeTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.solar.value).toBe(10.0); 
      expect(result.current?.solar.label).toBe('10.00 MW');
    });

    it('should round values properly', () => {
      const precisionTelemetry = {
        ...mockTelemetry,
        solar: { ...mockTelemetry.solar, power_ac_kw: 5.26789 }
      };

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: precisionTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current?.solar.value).toBe(5.3);
    });
  });

  describe('Connection State Management', () => {
    it('should transition from disconnected to connected', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: null,
        isConnected: false,
        status: 'DISCONNECTED',
        lastUpdateTime: null,
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result, rerender } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current).toBeNull();

      mockUseSiteTelemetry.mockReturnValue({
        telemetry: mockTelemetry,
        isConnected: true,
        status: 'CONNECTED',
        lastUpdateTime: new Date(),
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      rerender();

      expect(result.current).not.toBeNull();
      expect(result.current?.solar.value).toBe(5.2);
    });

    it('should show zero values during initial connection', () => {
      mockUseSiteTelemetry.mockReturnValue({
        telemetry: null,
        isConnected: true,
        status: 'CONNECTING',
        lastUpdateTime: null,
        connect: jest.fn(),
        disconnect: jest.fn()
      });

      const { result } = renderHook(() => useEnergySimulation('ems_sim_01'));

      expect(result.current).not.toBeNull();
      expect(result.current?.solar.value).toBe(0);
      expect(result.current?.grid.value).toBe(0);
      expect(result.current?.battery.value).toBe(0);
      expect(result.current?.home.value).toBe(0);
    });
  });
});


