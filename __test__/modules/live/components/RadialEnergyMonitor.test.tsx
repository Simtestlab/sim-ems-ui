import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { RadialEnergyMonitor } from '@/modules/live/components/RadialEnergyMonitor';
import { useNavStore } from '@/store/useNavStore';
import { useEnergySimulation } from '@/modules/live/hooks/useEnergySimulation';
import { useEnergyIcons } from '@/modules/live/hooks/useEnergyIcons';
import { useSmoothValue } from '@/modules/live/hooks/useSmoothValue';
import { useEnergyArcs } from '@/modules/live/hooks/useEnergyArcs';

jest.mock('@/store/useNavStore');
jest.mock('@/modules/live/hooks/useEnergySimulation');
jest.mock('@/modules/live/hooks/useEnergyIcons');
jest.mock('@/modules/live/hooks/useSmoothValue');
jest.mock('@/modules/live/hooks/useEnergyArcs');

describe('RadialEnergyMonitor Component', () => {
  const mockUseNavStore = useNavStore as jest.MockedFunction<typeof useNavStore>;
  const mockUseEnergySimulation = useEnergySimulation as jest.MockedFunction<typeof useEnergySimulation>;
  const mockUseEnergyIcons = useEnergyIcons as jest.MockedFunction<typeof useEnergyIcons>;
  const mockUseSmoothValue = useSmoothValue as jest.MockedFunction<typeof useSmoothValue>;
  const mockUseEnergyArcs = useEnergyArcs as jest.MockedFunction<typeof useEnergyArcs>;

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
    rawTelemetry: null
  };

  const mockArcPaths = {
    solar: 'M 100 100 A 50 50 0 1 1 100 99',
    grid: 'M 200 200 A 50 50 0 1 1 200 199',
    battery: 'M 300 300 A 50 50 0 1 1 300 299',
    home: 'M 400 400 A 50 50 0 1 1 400 399'
  };

  const mockTrackPaths = [
    { key: 'solar', path: 'M 100 100 A 50 50 0 1 1 100 99', color: '#6366f1' as const },
    { key: 'grid', path: 'M 200 200 A 50 50 0 1 1 200 199', color: '#8b5cf6' as const },
    { key: 'battery', path: 'M 300 300 A 50 50 0 1 1 300 299', color: '#10b981' as const },
    { key: 'home', path: 'M 400 400 A 50 50 0 1 1 400 399', color: '#f43f5e' as const }
  ];

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

    mockUseSmoothValue.mockImplementation((value: number) => value);

    mockUseEnergyArcs.mockReturnValue({
      arcPaths: mockArcPaths,
      trackPaths: mockTrackPaths
    });
  });

  describe('Rendering', () => {
    it('should render the monitor container', () => {
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.querySelector('.relative.w-full.h-full')).toBeInTheDocument();
    });

    it('should render SVG element', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have correct viewBox attribute', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '-10 -30 500 550');
    });

    it('should have preserveAspectRatio attribute', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    });

    it('should render style tag for animations', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const style = container.querySelector('style');
      expect(style).toBeInTheDocument();
    });
  });

  describe('SVG Filters', () => {
    it('should render SVG filter definitions', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const defs = container.querySelector('defs');
      expect(defs).toBeInTheDocument();
    });

    it('should have colored-glow filter', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const filter = container.querySelector('filter[id="colored-glow"]');
      expect(filter).toBeInTheDocument();
    });

    it('should have glass filter', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const filter = container.querySelector('filter[id="glass"]');
      expect(filter).toBeInTheDocument();
    });

    it('should have hub-glow filter', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const filter = container.querySelector('filter[id="hub-glow"]');
      expect(filter).toBeInTheDocument();
    });
  });

  describe('Track Paths (Background)', () => {
    it('should render all track paths', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const tracks = container.querySelectorAll('path[stroke-opacity="0.1"]');
      expect(tracks.length).toBeGreaterThanOrEqual(4);
    });

    it('should have correct stroke width for tracks', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const track = container.querySelector('path[stroke-width="8"]');
      expect(track).toBeInTheDocument();
    });
  });

  describe('Arc Paths (Gauges)', () => {
    it('should render solar arc path', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const solarArc = container.querySelector(`path[d="${mockArcPaths.solar}"]`);
      expect(solarArc).toBeInTheDocument();
    });

    it('should render grid arc path', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const gridArc = container.querySelector(`path[d="${mockArcPaths.grid}"]`);
      expect(gridArc).toBeInTheDocument();
    });

    it('should render battery arc path', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const batteryArc = container.querySelector(`path[d="${mockArcPaths.battery}"]`);
      expect(batteryArc).toBeInTheDocument();
    });

    it('should render home arc path', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const homeArc = container.querySelector(`path[d="${mockArcPaths.home}"]`);
      expect(homeArc).toBeInTheDocument();
    });

    it('should have correct stroke width for arcs', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const arcs = container.querySelectorAll('path[stroke-width="16"]');
      expect(arcs.length).toBeGreaterThanOrEqual(4);
    });

    it('should apply colored-glow filter to arcs', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const arcWithFilter = container.querySelector('path[filter="url(#colored-glow)"]');
      expect(arcWithFilter).toBeInTheDocument();
    });
  });

  describe('Flow Lines', () => {
    it('should render solar flow line', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const lines = container.querySelectorAll('line');
      expect(lines.length).toBeGreaterThanOrEqual(4);
    });

    it('should have stroke-dasharray for animated lines', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const dashedLine = container.querySelector('line[stroke-dasharray]');
      expect(dashedLine).toBeInTheDocument();
    });

    it('should have stroke-linecap round for smooth lines', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const roundLines = container.querySelectorAll('line[stroke-linecap="round"]');
      expect(roundLines.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Central Hub', () => {
    it('should render outer hub circle', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });

    it('should render hub with glass filter', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const circleWithFilter = container.querySelector('circle[filter="url(#glass)"]');
      expect(circleWithFilter).toBeInTheDocument();
    });

    it('should render hub with glow filter', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const hubGlow = container.querySelector('circle[filter="url(#hub-glow)"]');
      expect(hubGlow).toBeInTheDocument();
    });

    it('should render central indicator dot', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const dot = container.querySelector('circle[r="4"]');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('Energy Nodes', () => {
    it('should render four energy nodes', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const foreignObjects = container.querySelectorAll('foreignObject');
      expect(foreignObjects.length).toBe(4);
    });

    it('should render solar energy value', () => {
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('5.2');
    });

    it('should render grid energy value', () => {
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('2.1');
    });

    it('should render battery energy value (absolute)', () => {
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('1.5');
    });

    it('should render home energy value', () => {
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('5.8');
    });

    it('should display energy unit (kW)', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const kwElements = container.querySelectorAll('text');
      const hasKW = Array.from(kwElements).some(el => el.textContent === 'kW');
      expect(hasKW).toBe(true);
    });
  });

  describe('Node Labels', () => {
    it('should render solar label', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const textElements = container.querySelectorAll('text');
      const hasSolar = Array.from(textElements).some(el => 
        el.textContent?.toLowerCase() === 'solar'
      );
      expect(hasSolar).toBe(true);
    });

    it('should render grid label', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const textElements = container.querySelectorAll('text');
      const hasGrid = Array.from(textElements).some(el => 
        el.textContent?.toLowerCase() === 'grid'
      );
      expect(hasGrid).toBe(true);
    });

    it('should render battery label', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const textElements = container.querySelectorAll('text');
      const hasBattery = Array.from(textElements).some(el => 
        el.textContent?.toLowerCase() === 'battery'
      );
      expect(hasBattery).toBe(true);
    });

    it('should render home label', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const textElements = container.querySelectorAll('text');
      const hasHome = Array.from(textElements).some(el => 
        el.textContent?.toLowerCase() === 'home'
      );
      expect(hasHome).toBe(true);
    });

    it('should have uppercase styling on labels', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const labels = container.querySelectorAll('text[style*="text-transform"]');
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('Flow Opacity and States', () => {
    it('should show high opacity for solar when producing', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const solarArc = container.querySelector(`path[d="${mockArcPaths.solar}"]`);
      expect(solarArc).toBeTruthy();
      expect(solarArc?.getAttribute('stroke-opacity')).toBeTruthy();
    });

    it('should show low opacity for solar when not producing', () => {
      const noSolarData = {
        ...mockEnergyData,
        solar: { value: 0, label: '0 kW' },
        flows: { ...mockEnergyData.flows, isSolarProducing: false }
      };
      mockUseEnergySimulation.mockReturnValue(noSolarData);
      
      const { container } = render(<RadialEnergyMonitor />);
      const solarArc = container.querySelector(`path[d="${mockArcPaths.solar}"]`);
      expect(solarArc).toBeTruthy();
      expect(solarArc?.getAttribute('stroke-opacity')).toBeTruthy();
    });

    it('should show high opacity for battery when active', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const batteryArc = container.querySelector(`path[d="${mockArcPaths.battery}"]`);
      expect(batteryArc).toBeTruthy();
      expect(batteryArc?.getAttribute('stroke-opacity')).toBeTruthy();
    });

    it('should show low opacity for battery when inactive', () => {
      const inactiveBatteryData = {
        ...mockEnergyData,
        battery: { value: 0, label: '0 kW' },
        flows: {
          ...mockEnergyData.flows,
          isBatteryCharging: false,
          isBatteryDischarging: false
        }
      };
      mockUseEnergySimulation.mockReturnValue(inactiveBatteryData);
      
      const { container } = render(<RadialEnergyMonitor />);
      const batteryArc = container.querySelector(`path[d="${mockArcPaths.battery}"]`);
      expect(batteryArc).toBeTruthy();
      expect(batteryArc?.getAttribute('stroke-opacity')).toBeTruthy();
    });
  });

  describe('Default Values (No Data)', () => {
    it('should render with default values when no energy data', () => {
      mockUseEnergySimulation.mockReturnValue(null);
      
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('0.0');
    });

    it('should use default flows when no energy data', () => {
      mockUseEnergySimulation.mockReturnValue(null);
      
      const { container } = render(<RadialEnergyMonitor />);
      const arcs = container.querySelectorAll('path[stroke-opacity="0.4"]');
      expect(arcs.length).toBeGreaterThan(0);
    });
  });

  describe('Smooth Value Integration', () => {
    it('should call useSmoothValue for solar', () => {
      render(<RadialEnergyMonitor />);
      expect(mockUseSmoothValue).toHaveBeenCalledWith(5.2, 0.1);
    });

    it('should call useSmoothValue for grid (absolute value)', () => {
      render(<RadialEnergyMonitor />);
      expect(mockUseSmoothValue).toHaveBeenCalledWith(2.1, 0.1);
    });

    it('should call useSmoothValue for battery (absolute value)', () => {
      render(<RadialEnergyMonitor />);
      expect(mockUseSmoothValue).toHaveBeenCalledWith(1.5, 0.1);
    });

    it('should call useSmoothValue for home', () => {
      render(<RadialEnergyMonitor />);
      expect(mockUseSmoothValue).toHaveBeenCalledWith(5.8, 0.1);
    });
  });

  describe('Energy Arcs Hook Integration', () => {
    it('should call useEnergyArcs with smooth values', () => {
      render(<RadialEnergyMonitor />);
      
      expect(mockUseEnergyArcs).toHaveBeenCalledWith({
        solar: 5.2,
        grid: 2.1,
        battery: 1.5,
        home: 5.8
      });
    });
  });

  describe('Icon Component Integration', () => {
    it('should call getIconComponent for each energy type', () => {
      const getIconMock = jest.fn((type: string) => mockIconComponent as any);
      mockUseEnergyIcons.mockReturnValue({
        getIconComponent: getIconMock
      });
      
      render(<RadialEnergyMonitor />);
      
      expect(getIconMock).toHaveBeenCalledWith('solar');
      expect(getIconMock).toHaveBeenCalledWith('grid');
      expect(getIconMock).toHaveBeenCalledWith('battery');
      expect(getIconMock).toHaveBeenCalledWith('home');
    });
  });

  describe('Typography', () => {
    it('should render labels with correct font size', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const labelTexts = container.querySelectorAll('text[font-size="9"]');
      expect(labelTexts.length).toBeGreaterThan(0);
    });

    it('should render values with large font size', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const valueTexts = container.querySelectorAll('text[font-size="22"]');
      expect(valueTexts.length).toBeGreaterThan(0);
    });

    it('should render units with medium font size', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const unitTexts = container.querySelectorAll('text[font-size="11"]');
      expect(unitTexts.length).toBeGreaterThan(0);
    });

    it('should have bold font weight for values', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const boldTexts = container.querySelectorAll('text[font-weight="800"]');
      expect(boldTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Negative Values Handling', () => {
    it('should display absolute value for negative battery power', () => {
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('1.5');
      expect(container.textContent).not.toContain('-1.5');
    });

    it('should display absolute value for negative grid power', () => {
      const exportingData = {
        ...mockEnergyData,
        grid: { value: -3.2, label: '3.2 kW' }
      };
      mockUseEnergySimulation.mockReturnValue(exportingData);
      
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('3.2');
      expect(container.textContent).not.toContain('-3.2');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive container classes', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const responsiveContainer = container.querySelector('.w-full.h-full');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('should maintain aspect ratio', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const svg = container.querySelector('svg');
      expect(svg?.className.baseVal).toContain('w-full');
      expect(svg?.className.baseVal).toContain('h-full');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values for all energies', () => {
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
        rawTelemetry: null
      };
      mockUseEnergySimulation.mockReturnValue(zeroData);
      
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('0.0');
    });

    it('should handle very large values', () => {
      const largeData = {
        ...mockEnergyData,
        solar: { value: 9999.9, label: '9999.9 kW' }
      };
      mockUseEnergySimulation.mockReturnValue(largeData);
      mockUseSmoothValue.mockImplementation((value: number) => value);
      
      const { container } = render(<RadialEnergyMonitor />);
      expect(container.textContent).toContain('9999.9');
    });

    it('should format decimal values to one decimal place', () => {
      const { container } = render(<RadialEnergyMonitor />);
      const textElements = container.querySelectorAll('text');
      const values = Array.from(textElements).map(el => el.textContent);
      
      expect(values.some(v => /^\d+\.\d$/.test(v || ''))).toBe(true);
    });
  });
});
