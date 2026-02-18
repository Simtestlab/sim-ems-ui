import React from 'react';
import { render, screen } from '@testing-library/react';
import { SolarCard, GridCard, LoadCard, BatteryCard } from '@/modules/live/components/KPICards';
import { useNavStore } from '@/store/useNavStore';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';

jest.mock('@/store/useNavStore');
jest.mock('@/modules/live/hooks/useEnergySimulation');
jest.mock('@/modules/live/hooks/useEnergyIcons');

describe('KPICards Components', () => {
  const mockUseNavStore = useNavStore as jest.MockedFunction<typeof useNavStore>;
  const mockUseEnergySimulation = useEnergySimulation as jest.MockedFunction<typeof useEnergySimulation>;
  const mockUseEnergyIcons = useEnergyIcons as jest.MockedFunction<typeof useEnergyIcons>;

  const mockEnergyData = {
    solar: { value: 5.2, label: '5.2 kW' },
    grid: { value: 2.1, label: '2.1 kW' },
    battery: { value: -1.5, label: '1.5 kW' },
    home: { value: 5.8, label: '5.8 kW' },
    flows: {
      isSolarProducing: true,
      isBatteryCharging: true,
      isBatteryDischarging: false,
      isGridImporting: true,
      isGridExporting: false,
      isHomeConsuming: true
    },
    rawTelemetry: {
      device_id: 'test-device',
      timestamp: '2026-02-17T10:00:00Z',
      solar: {
        power_ac_kw: 5.2,
        power_dc_kw: 5.5,
        irradiance_w_m2: 850,
        panel_temp_c: 45.2,
        efficiency: 0.18
      },
      grid: {
        frequency: 60.0,
        voltage: 240,
        power_kw: 2.1,
        price: 0.125,
        status: 'connected' as const,
        trip_occurred: false
      },
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
      inverter: {
        priority: 'battery',
        action: 'peak_shaving' as const,
        reason: 'Peak demand period',
        peak_demand_threshold: 10.0
      }
    }
  };

  const mockIconComponent = ({ size, style }: { size: number; style: any }) => (
    <div data-testid="mock-icon" style={style}>Icon</div>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseNavStore.mockReturnValue({
      selectedSite: 'ems_sim_01',
      setSite: jest.fn(),
    });

    mockUseEnergySimulation.mockReturnValue(mockEnergyData);

    mockUseEnergyIcons.mockReturnValue({
      getIconComponent: jest.fn((type: string) => mockIconComponent as any)
    });
  });

  describe('SolarCard Component', () => {
    describe('Rendering', () => {
      it('should render solar card with title', () => {
        render(<SolarCard />);
        expect(screen.getByText('Solar')).toBeInTheDocument();
      });

      it('should render solar icon', () => {
        render(<SolarCard />);
        const icon = screen.getByTestId('mock-icon');
        expect(icon).toBeInTheDocument();
      });

      it('should display AC Power value', () => {
        render(<SolarCard />);
        expect(screen.getByText('AC Power:')).toBeInTheDocument();
        expect(screen.getByText(/5\.20 kW/)).toBeInTheDocument();
      });

      it('should display Irradiance value', () => {
        render(<SolarCard />);
        expect(screen.getByText('Irradiance:')).toBeInTheDocument();
        expect(screen.getByText(/850 W\/m²/)).toBeInTheDocument();
      });

      it('should display Efficiency value', () => {
        render(<SolarCard />);
        expect(screen.getByText('Efficiency:')).toBeInTheDocument();
        expect(screen.getByText(/18\.0%/)).toBeInTheDocument();
      });

      it('should display Panel Temperature', () => {
        render(<SolarCard />);
        expect(screen.getByText('Panel Temp:')).toBeInTheDocument();
        expect(screen.getByText(/45\.2°C/)).toBeInTheDocument();
      });

      it('should have white background', () => {
        const { container } = render(<SolarCard />);
        const card = container.querySelector('.bg-white');
        expect(card).toBeInTheDocument();
      });

      it('should have rounded corners', () => {
        const { container } = render(<SolarCard />);
        const card = container.querySelector('.rounded-2xl');
        expect(card).toBeInTheDocument();
      });
    });

    describe('No Data Handling', () => {
      it('should return null when no energy data', () => {
        mockUseEnergySimulation.mockReturnValue(null);
        const { container } = render(<SolarCard />);
        expect(container.firstChild).toBeNull();
      });

      it('should show — for missing telemetry data', () => {
        const noTelemetryData = {
          ...mockEnergyData,
          rawTelemetry: null
        };
        mockUseEnergySimulation.mockReturnValue(noTelemetryData);
        
        render(<SolarCard />);
        const placeholders = screen.getAllByText(/—/);
        expect(placeholders.length).toBeGreaterThan(0);
      });
    });
  });

  describe('GridCard Component', () => {
    describe('Rendering', () => {
      it('should render grid card with title', () => {
        render(<GridCard />);
        expect(screen.getByText('Grid')).toBeInTheDocument();
      });

      it('should render grid icon', () => {
        render(<GridCard />);
        const icon = screen.getByTestId('mock-icon');
        expect(icon).toBeInTheDocument();
      });

      it('should display Grid Power value', () => {
        render(<GridCard />);
        expect(screen.getByText('Grid Power:')).toBeInTheDocument();
        expect(screen.getByText(/2\.10 kW/)).toBeInTheDocument();
      });

      it('should display Voltage', () => {
        render(<GridCard />);
        expect(screen.getByText('Voltage:')).toBeInTheDocument();
        expect(screen.getByText(/240 V/)).toBeInTheDocument();
      });

      it('should display Frequency', () => {
        render(<GridCard />);
        expect(screen.getByText('Frequency:')).toBeInTheDocument();
        expect(screen.getByText(/60\.0 Hz/)).toBeInTheDocument();
      });

      it('should display Status', () => {
        render(<GridCard />);
        expect(screen.getByText('Status:')).toBeInTheDocument();
        expect(screen.getByText('connected')).toBeInTheDocument();
      });

      it('should display Price', () => {
        render(<GridCard />);
        expect(screen.getByText('Price:')).toBeInTheDocument();
        expect(screen.getByText(/\$0\.125/)).toBeInTheDocument();
      });

      it('should display Connection status', () => {
        render(<GridCard />);
        expect(screen.getByText('Connection:')).toBeInTheDocument();
        expect(screen.getByText('LIVE')).toBeInTheDocument();
      });

      it('should have grid layout for data', () => {
        const { container } = render(<GridCard />);
        const gridLayout = container.querySelector('.grid.grid-cols-2');
        expect(gridLayout).toBeInTheDocument();
      });
    });

    describe('No Data Handling', () => {
      it('should return null when no energy data', () => {
        mockUseEnergySimulation.mockReturnValue(null);
        const { container } = render(<GridCard />);
        expect(container.firstChild).toBeNull();
      });

      it('should show — for missing telemetry data', () => {
        const noTelemetryData = {
          ...mockEnergyData,
          rawTelemetry: null
        };
        mockUseEnergySimulation.mockReturnValue(noTelemetryData);
        
        render(<GridCard />);
        const placeholders = screen.getAllByText(/—/);
        expect(placeholders.length).toBeGreaterThan(0);
      });
    });
  });

  describe('LoadCard Component', () => {
    describe('Rendering', () => {
      it('should render load card with title', () => {
        render(<LoadCard />);
        expect(screen.getByText('Load')).toBeInTheDocument();
      });

      it('should render home icon', () => {
        render(<LoadCard />);
        const icon = screen.getByTestId('mock-icon');
        expect(icon).toBeInTheDocument();
      });

      it('should display Current Load', () => {
        render(<LoadCard />);
        expect(screen.getByText('Current Load:')).toBeInTheDocument();
        expect(screen.getByText('5.8 kW')).toBeInTheDocument();
      });

      it('should display Total Consumed placeholder', () => {
        render(<LoadCard />);
        expect(screen.getByText('Total Consumed:')).toBeInTheDocument();
        expect(screen.getByText('— kWh')).toBeInTheDocument();
      });

      it('should display Self Sufficiency', () => {
        render(<LoadCard />);
        expect(screen.getByText('Self Sufficiency:')).toBeInTheDocument();
        expect(screen.getByText('64%')).toBeInTheDocument();
      });
    });

    describe('Self Sufficiency Calculation', () => {
      it('should calculate self sufficiency correctly with grid import', () => {
        render(<LoadCard />);
        expect(screen.getByText('64%')).toBeInTheDocument();
      });

      it('should show 100% when no grid import', () => {
        const noGridData = {
          ...mockEnergyData,
          grid: { value: 0, label: '0 kW' }
        };
        mockUseEnergySimulation.mockReturnValue(noGridData);
        
        render(<LoadCard />);
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      it('should show — when home value is zero', () => {
        const zeroHomeData = {
          ...mockEnergyData,
          home: { value: 0, label: '0 kW' }
        };
        mockUseEnergySimulation.mockReturnValue(zeroHomeData);
        
        render(<LoadCard />);
        expect(screen.getByText('Self Sufficiency:')).toBeInTheDocument();
        const sufficiencyValue = screen.getByText('Self Sufficiency:').parentElement;
        expect(sufficiencyValue?.textContent).toContain('—');
      });

      it('should handle grid export (negative values)', () => {
        const gridExportData = {
          ...mockEnergyData,
          grid: { value: -2.0, label: '2.0 kW' }
        };
        mockUseEnergySimulation.mockReturnValue(gridExportData);
        
        render(<LoadCard />);
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      it('should cap self sufficiency at 100%', () => {
        const exportingData = {
          ...mockEnergyData,
          grid: { value: -5.0, label: '5.0 kW' }, 
          home: { value: 2.0, label: '2.0 kW' }
        };
        mockUseEnergySimulation.mockReturnValue(exportingData);
        
        render(<LoadCard />);
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      it('should not show negative percentages', () => {
        const highImportData = {
          ...mockEnergyData,
          grid: { value: 10.0, label: '10.0 kW' }, 
          home: { value: 5.0, label: '5.0 kW' }
        };
        mockUseEnergySimulation.mockReturnValue(highImportData);
        
        render(<LoadCard />);
        const text = screen.getByText(/Self Sufficiency:/).parentElement?.textContent;
        expect(text).toContain('0%');
      });
    });

    describe('No Data Handling', () => {
      it('should return null when no energy data', () => {
        mockUseEnergySimulation.mockReturnValue(null);
        const { container } = render(<LoadCard />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('BatteryCard Component', () => {
    describe('Rendering', () => {
      it('should render battery card with title', () => {
        render(<BatteryCard />);
        expect(screen.getByText('Battery')).toBeInTheDocument();
      });

      it('should render battery icon', () => {
        render(<BatteryCard />);
        const icon = screen.getByTestId('mock-icon');
        expect(icon).toBeInTheDocument();
      });

      it('should display State of Charge', () => {
        render(<BatteryCard />);
        expect(screen.getByText('State of Charge:')).toBeInTheDocument();
        expect(screen.getByText(/75\.0%/)).toBeInTheDocument();
      });

      it('should display Power Flow', () => {
        render(<BatteryCard />);
        expect(screen.getByText('Power Flow:')).toBeInTheDocument();
        expect(screen.getByText(/-1\.50 kW/)).toBeInTheDocument();
      });

      it('should display Voltage', () => {
        render(<BatteryCard />);
        expect(screen.getByText('Voltage:')).toBeInTheDocument();
        expect(screen.getByText(/52 V/)).toBeInTheDocument();
      });

      it('should display Temperature', () => {
        render(<BatteryCard />);
        expect(screen.getByText('Temperature:')).toBeInTheDocument();
        expect(screen.getByText(/25\.5°C/)).toBeInTheDocument();
      });
    });

    describe('Battery States', () => {
      it('should show charging state (negative power)', () => {
        render(<BatteryCard />);
        expect(screen.getByText(/-1\.50 kW/)).toBeInTheDocument();
      });

      it('should show discharging state (positive power)', () => {
        const dischargingData = {
          ...mockEnergyData,
          rawTelemetry: {
            ...mockEnergyData.rawTelemetry!,
            battery: {
              ...mockEnergyData.rawTelemetry!.battery,
              power_kw: 2.3
            }
          }
        };
        mockUseEnergySimulation.mockReturnValue(dischargingData);
        
        render(<BatteryCard />);
        expect(screen.getByText(/2\.30 kW/)).toBeInTheDocument();
      });

      it('should display low SOC correctly', () => {
        const lowSocData = {
          ...mockEnergyData,
          rawTelemetry: {
            ...mockEnergyData.rawTelemetry!,
            battery: {
              ...mockEnergyData.rawTelemetry!.battery,
              soc: 0.15
            }
          }
        };
        mockUseEnergySimulation.mockReturnValue(lowSocData);
        
        render(<BatteryCard />);
        expect(screen.getByText(/15\.0%/)).toBeInTheDocument();
      });

      it('should display high SOC correctly', () => {
        const highSocData = {
          ...mockEnergyData,
          rawTelemetry: {
            ...mockEnergyData.rawTelemetry!,
            battery: {
              ...mockEnergyData.rawTelemetry!.battery,
              soc: 0.95
            }
          }
        };
        mockUseEnergySimulation.mockReturnValue(highSocData);
        
        render(<BatteryCard />);
        expect(screen.getByText(/95\.0%/)).toBeInTheDocument();
      });
    });

    describe('No Data Handling', () => {
      it('should return null when no energy data', () => {
        mockUseEnergySimulation.mockReturnValue(null);
        const { container } = render(<BatteryCard />);
        expect(container.firstChild).toBeNull();
      });

      it('should show — for missing telemetry data', () => {
        const noTelemetryData = {
          ...mockEnergyData,
          rawTelemetry: null
        };
        mockUseEnergySimulation.mockReturnValue(noTelemetryData);
        
        render(<BatteryCard />);
        const placeholders = screen.getAllByText(/—/);
        expect(placeholders.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Common Card Features', () => {
    it('should have consistent styling across all cards', () => {
      const { container: solarContainer } = render(<SolarCard />);
      const { container: gridContainer } = render(<GridCard />);
      const { container: loadContainer } = render(<LoadCard />);
      const { container: batteryContainer } = render(<BatteryCard />);

      expect(solarContainer.querySelector('.bg-white')).toBeInTheDocument();
      expect(gridContainer.querySelector('.bg-white')).toBeInTheDocument();
      expect(loadContainer.querySelector('.bg-white')).toBeInTheDocument();
      expect(batteryContainer.querySelector('.bg-white')).toBeInTheDocument();
    });

    it('should have flex layout for all cards', () => {
      const { container: solarContainer } = render(<SolarCard />);
      expect(solarContainer.querySelector('.flex.flex-col')).toBeInTheDocument();
    });

    it('should center content in all cards', () => {
      const { container: solarContainer } = render(<SolarCard />);
      expect(solarContainer.querySelector('.items-center.justify-center')).toBeInTheDocument();
    });
  });

  describe('Integration with Hooks', () => {
    it('should call useNavStore to get selected site', () => {
      render(<SolarCard />);
      expect(mockUseNavStore).toHaveBeenCalled();
    });

    it('should call useEnergySimulation with selected site', () => {
      render(<SolarCard />);
      expect(mockUseEnergySimulation).toHaveBeenCalledWith('ems_sim_01');
    });

    it('should call useEnergyIcons with flows data', () => {
      render(<SolarCard />);
      expect(mockUseEnergyIcons).toHaveBeenCalledWith(mockEnergyData.flows);
    });

    it('should update when site changes', () => {
      const { rerender } = render(<SolarCard />);
      
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_02',
        setSite: jest.fn(),
      });
      
      rerender(<SolarCard />);
      expect(mockUseEnergySimulation).toHaveBeenCalledWith('ems_sim_02');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero energy values', () => {
      const zeroData = {
        ...mockEnergyData,
        solar: { value: 0, label: '0 kW' },
        rawTelemetry: {
          ...mockEnergyData.rawTelemetry!,
          solar: {
            ...mockEnergyData.rawTelemetry!.solar,
            power_ac_kw: 0,
            irradiance_w_m2: 0,
            efficiency: 0,
            panel_temp_c: 20
          }
        }
      };
      mockUseEnergySimulation.mockReturnValue(zeroData);
      
      render(<SolarCard />);
      expect(screen.getByText(/0\.00 kW/)).toBeInTheDocument();
    });

    it('should handle very large values', () => {
      const largeData = {
        ...mockEnergyData,
        rawTelemetry: {
          ...mockEnergyData.rawTelemetry!,
          solar: {
            ...mockEnergyData.rawTelemetry!.solar,
            power_ac_kw: 9999.99
          }
        }
      };
      mockUseEnergySimulation.mockReturnValue(largeData);
      
      render(<SolarCard />);
      expect(screen.getByText(/9999\.99 kW/)).toBeInTheDocument();
    });

    it('should format decimal values consistently', () => {
      render(<SolarCard />);
      expect(screen.getByText(/5\.20 kW/)).toBeInTheDocument();
    });
  });
});
