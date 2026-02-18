import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LivePage } from '@/modules/live/pages/LivePage';
import { useNavStore } from '@/store/useNavStore';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';

jest.mock('@/store/useNavStore');
jest.mock('@/modules/live/hooks/useEnergySimulation');
jest.mock('@/modules/live/hooks/useEnergyIcons');
jest.mock('@/modules/live/components/RadialEnergyMonitor', () => ({
  RadialEnergyMonitor: () => <div data-testid="radial-energy-monitor">Radial Energy Monitor</div>
}));

describe('LivePage Component', () => {
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

  describe('Loading State', () => {
    it('should show loading spinner when energy data is null', () => {
      mockUseEnergySimulation.mockReturnValue(null);
      render(<LivePage />);
      
      expect(screen.getByText('Loading energy data...')).toBeInTheDocument();
    });

    it('should show loading spinner with animation', () => {
      mockUseEnergySimulation.mockReturnValue(null);
      const { container } = render(<LivePage />);
      
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should have gradient background in loading state', () => {
      mockUseEnergySimulation.mockReturnValue(null);
      const { container } = render(<LivePage />);
      
      const loadingContainer = container.querySelector('.bg-gradient-to-br.from-slate-50.to-slate-100');
      expect(loadingContainer).toBeInTheDocument();
    });
  });

  describe('Rendering - Main Layout', () => {
    it('should render main dashboard container', () => {
      const { container } = render(<LivePage />);
      
      const mainContainer = container.querySelector('.bg-gradient-to-br.from-slate-50.via-slate-100.to-slate-200');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should render header indicator bar', () => {
      const { container } = render(<LivePage />);
      
      const headerBar = container.querySelector('.h-0\\.5.bg-gradient-to-r.from-blue-500.via-emerald-500.to-violet-500');
      expect(headerBar).toBeInTheDocument();
    });

    it('should have responsive grid layout', () => {
      const { container } = render(<LivePage />);
      
      const grid = container.querySelector('.grid.grid-cols-1.xl\\:grid-cols-12');
      expect(grid).toBeInTheDocument();
    });

    it('should render all four main sections', () => {
      const { container } = render(<LivePage />);
      
      expect(container.querySelector('.xl\\:col-span-3')).toBeInTheDocument();
      expect(container.querySelector('.xl\\:col-span-6')).toBeInTheDocument();
      expect(container.querySelectorAll('.xl\\:col-span-3')).toHaveLength(2);
    });
  });

  describe('Solar Card', () => {
    it('should render solar card with correct title', () => {
      render(<LivePage />);
      expect(screen.getByText('Solar Generation')).toBeInTheDocument();
    });

    it('should display solar power value', () => {
      render(<LivePage />);
      expect(screen.getByText(/5\.20/)).toBeInTheDocument();
      const kwElements = screen.getAllByText(/kW/);
      expect(kwElements.length).toBeGreaterThan(0);
    });

    it('should display irradiance value', () => {
      render(<LivePage />);
      expect(screen.getByText('Irradiance')).toBeInTheDocument();
      expect(screen.getByText(/850/)).toBeInTheDocument();
    });

    it('should display efficiency percentage', () => {
      render(<LivePage />);
      expect(screen.getByText('Efficiency')).toBeInTheDocument();
      const efficiencyElements = screen.getAllByText(/18\.0/);
      expect(efficiencyElements.length).toBeGreaterThan(0);
    });

    it('should display panel temperature', () => {
      render(<LivePage />);
      expect(screen.getByText('Panel Temp')).toBeInTheDocument();
      expect(screen.getByText(/45\.2/)).toBeInTheDocument();
    });

    it('should have source status indicator', () => {
      const { container } = render(<LivePage />);
      expect(screen.getByText('Source')).toBeInTheDocument();
      
      const indicator = container.querySelector('.bg-yellow-400.rounded-full.animate-pulse');
      expect(indicator).toBeInTheDocument();
    });

    it('should have hover effects', () => {
      const { container } = render(<LivePage />);
      const solarCard = container.querySelector('.hover\\:shadow-xl.hover\\:scale-\\[1\\.01\\]');
      expect(solarCard).toBeInTheDocument();
    });
  });

  describe('Grid Card', () => {
    it('should render grid card with correct title', () => {
      render(<LivePage />);
      expect(screen.getByText('Grid Connection')).toBeInTheDocument();
    });

    it('should display grid power value', () => {
      render(<LivePage />);
      const gridPowerElements = screen.getAllByText(/2\.10/);
      expect(gridPowerElements.length).toBeGreaterThan(0);
    });

    it('should display voltage', () => {
      render(<LivePage />);
      const voltageElements = screen.getAllByText('Voltage');
      expect(voltageElements.length).toBeGreaterThan(0);
      expect(screen.getByText(/240/)).toBeInTheDocument();
    });

    it('should display frequency', () => {
      render(<LivePage />);
      expect(screen.getByText('Frequency')).toBeInTheDocument();
      expect(screen.getByText(/60\.0/)).toBeInTheDocument();
    });

    it('should display grid status', () => {
      render(<LivePage />);
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('connected')).toBeInTheDocument();
    });

    it('should have connection status indicator', () => {
      render(<LivePage />);
      expect(screen.getByText('Connection')).toBeInTheDocument();
    });
  });

  describe('Energy Flow Monitor (Center)', () => {
    it('should render energy flow monitor title', () => {
      render(<LivePage />);
      expect(screen.getByText('Energy Flow Monitor')).toBeInTheDocument();
    });

    it('should display selected site ID', () => {
      render(<LivePage />);
      expect(screen.getByText(/Site: ems_sim_01/)).toBeInTheDocument();
    });

    it('should render RadialEnergyMonitor component', () => {
      render(<LivePage />);
      expect(screen.getByTestId('radial-energy-monitor')).toBeInTheDocument();
    });

    it('should have status indicator', () => {
      const { container } = render(<LivePage />);
      const statusDot = container.querySelector('.bg-gradient-to-r.from-green-400.to-emerald-500.rounded-full.animate-pulse');
      expect(statusDot).toBeInTheDocument();
    });

    it('should display solar efficiency in status bar', () => {
      render(<LivePage />);
      expect(screen.getByText('Solar Efficiency')).toBeInTheDocument();
      expect(screen.getByText('18.0%')).toBeInTheDocument();
    });

    it('should display energy price in status bar', () => {
      render(<LivePage />);
      expect(screen.getByText('Energy Price')).toBeInTheDocument();
      expect(screen.getByText('$0.125/kWh')).toBeInTheDocument();
    });

    it('should calculate and display self sufficiency', () => {
      render(<LivePage />);
      const selfSufficiencyElements = screen.getAllByText('Self Sufficiency');
      expect(selfSufficiencyElements.length).toBeGreaterThan(0);
      const percentElements = screen.getAllByText(/64%/);
      expect(percentElements.length).toBeGreaterThan(0);
    });
  });

  describe('Load Card', () => {
    it('should render load demand card with correct title', () => {
      render(<LivePage />);
      expect(screen.getByText('Load Demand')).toBeInTheDocument();
    });

    it('should display home power consumption', () => {
      render(<LivePage />);
      const homeValue = screen.getAllByText(/5\.80/);
      expect(homeValue.length).toBeGreaterThan(0);
    });

    it('should have consumption status indicator', () => {
      render(<LivePage />);
      expect(screen.getByText('Consumption')).toBeInTheDocument();
    });

    it('should calculate and display peak demand', () => {
      render(<LivePage />);
      expect(screen.getByText('Peak Demand')).toBeInTheDocument();
      const peakElements = screen.getAllByText(/6\.67/);
      expect(peakElements.length).toBeGreaterThan(0);
    });

    it('should calculate and display load factor', () => {
      render(<LivePage />);
      expect(screen.getByText('Load Factor')).toBeInTheDocument();
      expect(screen.getByText(/87/)).toBeInTheDocument();
    });
  });

  describe('Battery Card', () => {
    it('should render battery storage card with correct title', () => {
      render(<LivePage />);
      expect(screen.getByText('Battery Storage')).toBeInTheDocument();
    });

    it('should display battery state of charge percentage', () => {
      render(<LivePage />);
      const socElements = screen.getAllByText(/75\.0/);
      expect(socElements.length).toBeGreaterThan(0);
    });

    it('should have storage status indicator', () => {
      render(<LivePage />);
      expect(screen.getByText('Storage')).toBeInTheDocument();
    });

    it('should display battery power flow', () => {
      render(<LivePage />);
      expect(screen.getByText('Power Flow')).toBeInTheDocument();
      expect(screen.getByText(/-1\.50/)).toBeInTheDocument();
    });

    it('should display battery temperature', () => {
      render(<LivePage />);
      expect(screen.getByText('Temperature')).toBeInTheDocument();
      expect(screen.getByText(/25\.5/)).toBeInTheDocument();
    });

    it('should display battery voltage', () => {
      render(<LivePage />);
      const voltageLabels = screen.getAllByText('Voltage');
      expect(voltageLabels.length).toBeGreaterThan(0);
    });

    it('should show correct status color for high SOC', () => {
      const { container } = render(<LivePage />);
      const indicator = container.querySelector('.bg-yellow-400.rounded-full.animate-pulse');
      expect(indicator).toBeInTheDocument();
    });

    it('should show red status color for low SOC', () => {
      const lowBatteryData = {
        ...mockEnergyData,
        rawTelemetry: {
          ...mockEnergyData.rawTelemetry!,
          battery: {
            ...mockEnergyData.rawTelemetry!.battery,
            soc: 0.15 
          }
        }
      };
      mockUseEnergySimulation.mockReturnValue(lowBatteryData);
      
      const { container } = render(<LivePage />);
      const indicator = container.querySelector('.bg-red-400.rounded-full.animate-pulse');
      expect(indicator).toBeInTheDocument();
    });

    it('should render battery level progress bar', () => {
      const { container } = render(<LivePage />);
      const progressBar = container.querySelector('.h-1\\.5.bg-slate-200');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Self Sufficiency Calculation', () => {
    it('should calculate self sufficiency correctly for grid import', () => {
      render(<LivePage />);
      const percentElements = screen.getAllByText(/64%/);
      expect(percentElements.length).toBeGreaterThan(0);
    });

    it('should show 100% when no grid import', () => {
      const noGridData = {
        ...mockEnergyData,
        grid: { value: 0, label: '0 kW' },
        home: { value: 5.2, label: '5.2 kW' }
      };
      mockUseEnergySimulation.mockReturnValue(noGridData);
      
      render(<LivePage />);
      const percentElements = screen.getAllByText('100%');
      expect(percentElements.length).toBeGreaterThan(0);
    });

    it('should show — when home value is zero', () => {
      const zeroHomeData = {
        ...mockEnergyData,
        home: { value: 0, label: '0 kW' }
      };
      mockUseEnergySimulation.mockReturnValue(zeroHomeData);
      
      render(<LivePage />);
      const selfSufficiencyElements = screen.getAllByText('—');
      expect(selfSufficiencyElements.length).toBeGreaterThan(0);
    });

    it('should handle grid export (negative values)', () => {
      const gridExportData = {
        ...mockEnergyData,
        grid: { value: -2.0, label: '2.0 kW' }, 
        home: { value: 3.2, label: '3.2 kW' }
      };
      mockUseEnergySimulation.mockReturnValue(gridExportData);
      
      render(<LivePage />);
      const percentElements = screen.getAllByText('100%');
      expect(percentElements.length).toBeGreaterThan(0);
    });
  });

  describe('Site Switching', () => {
    it('should display different site ID when changed', () => {
      const { rerender } = render(<LivePage />);
      expect(screen.getByText(/Site: ems_sim_01/)).toBeInTheDocument();
      
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_02',
        setSite: jest.fn(),
      });
      
      rerender(<LivePage />);
      expect(screen.getByText(/Site: ems_sim_02/)).toBeInTheDocument();
    });

    it('should trigger useEnergySimulation with new site ID', () => {
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_02',
        setSite: jest.fn(),
      });
      
      render(<LivePage />);
      expect(mockUseEnergySimulation).toHaveBeenCalledWith('ems_sim_02');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      const { container } = render(<LivePage />);
      const content = container.querySelector('.p-2.sm\\:p-3.lg\\:p-4');
      expect(content).toBeInTheDocument();
    });

    it('should have responsive grid gaps', () => {
      const { container } = render(<LivePage />);
      const grid = container.querySelector('.gap-2.sm\\:gap-3.lg\\:gap-4');
      expect(grid).toBeInTheDocument();
    });

    it('should have responsive text sizes', () => {
      const { container } = render(<LivePage />);
      const responsiveText = container.querySelector('.text-sm.lg\\:text-base');
      expect(responsiveText).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing rawTelemetry data', () => {
      const noTelemetryData = {
        ...mockEnergyData,
        rawTelemetry: null
      };
      mockUseEnergySimulation.mockReturnValue(noTelemetryData);
      
      render(<LivePage />);
      const placeholders = screen.getAllByText('—');
      expect(placeholders.length).toBeGreaterThan(0);
    });

    it('should handle zero values gracefully', () => {
      const zeroData = {
        solar: { value: 0, label: '0 kW' },
        grid: { value: 0, label: '0 kW' },
        battery: { value: 0, label: '0 kW' },
        home: { value: 0, label: '0 kW' },
        flows: {
          isSolarProducing: false,
          isBatteryCharging: false,
          isBatteryDischarging: false,
          isGridImporting: false,
          isGridExporting: false,
          isHomeConsuming: false
        },
        rawTelemetry: {
          ...mockEnergyData.rawTelemetry!,
          solar: { ...mockEnergyData.rawTelemetry!.solar, power_ac_kw: 0 },
          grid: { ...mockEnergyData.rawTelemetry!.grid, power_kw: 0 },
          battery: { ...mockEnergyData.rawTelemetry!.battery, power_kw: 0 }
        }
      };
      mockUseEnergySimulation.mockReturnValue(zeroData);
      
      render(<LivePage />);
      expect(screen.getByText('Solar Generation')).toBeInTheDocument();
    });

    it('should handle very large power values', () => {
      const largeData = {
        ...mockEnergyData,
        solar: { value: 9999.9, label: '9999.9 kW' },
        rawTelemetry: {
          ...mockEnergyData.rawTelemetry!,
          solar: { ...mockEnergyData.rawTelemetry!.solar, power_ac_kw: 9999.9 }
        }
      };
      mockUseEnergySimulation.mockReturnValue(largeData);
      
      render(<LivePage />);
      expect(screen.getByText(/9999\.90/)).toBeInTheDocument();
    });

    it('should handle negative battery power (charging)', () => {
      render(<LivePage />);
      expect(screen.getByText(/-1\.50/)).toBeInTheDocument();
    });

    it('should handle positive battery power (discharging)', () => {
      const dischargingData = {
        ...mockEnergyData,
        battery: { value: 2.3, label: '2.3 kW' },
        rawTelemetry: {
          ...mockEnergyData.rawTelemetry!,
          battery: { ...mockEnergyData.rawTelemetry!.battery, power_kw: 2.3 }
        }
      };
      mockUseEnergySimulation.mockReturnValue(dischargingData);
      
      render(<LivePage />);
      expect(screen.getByText(/\+2\.30/)).toBeInTheDocument();
    });
  });

  describe('Visual Indicators', () => {
    it('should have animated pulse indicators', () => {
      const { container } = render(<LivePage />);
      const pulsingElements = container.querySelectorAll('.animate-pulse');
      expect(pulsingElements.length).toBeGreaterThan(0);
    });

    it('should have gradient backgrounds', () => {
      const { container } = render(<LivePage />);
      const gradients = container.querySelectorAll('[class*="bg-gradient"]');
      expect(gradients.length).toBeGreaterThan(0);
    });

    it('should have hover effects on cards', () => {
      const { container } = render(<LivePage />);
      const hoverCards = container.querySelectorAll('.hover\\:shadow-xl');
      expect(hoverCards.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML structure', () => {
      const { container } = render(<LivePage />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should have descriptive headings', () => {
      render(<LivePage />);
      expect(screen.getByText('Solar Generation')).toBeInTheDocument();
      expect(screen.getByText('Grid Connection')).toBeInTheDocument();
      expect(screen.getByText('Load Demand')).toBeInTheDocument();
      expect(screen.getByText('Battery Storage')).toBeInTheDocument();
    });
  });
});
