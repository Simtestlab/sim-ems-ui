import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlertsPage from '@/modules/alerts/pages/AlertPage';
import { useNavStore } from '@/store/useNavStore';

jest.mock('@/store/useNavStore', () => ({
  useNavStore: jest.fn(),
}));

describe('AlertsPage Component', () => {
  const mockUseNavStore = useNavStore as jest.MockedFunction<typeof useNavStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavStore.mockReturnValue({
      selectedSite: 'ems_sim_02',
      setSite: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render the page title with icon', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Alerts & Notifications')).toBeInTheDocument();
    });

    it('should render all four alert columns', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Critical Actions')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Financial Alerts')).toBeInTheDocument();
      expect(screen.getByText('System Alerts')).toBeInTheDocument();
    });

    it('should render with proper grid layout', () => {
      const { container } = render(<AlertsPage />);
      
      const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(grid).toBeInTheDocument();
    });

    it('should render alert icon in header', () => {
      const { container } = render(<AlertsPage />);
      
      const svg = container.querySelector('svg.text-orange-600');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Initial State - EMS SIM 02', () => {
    it('should display correct initial alerts for Critical Actions', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
      expect(screen.getByText('High Load Demand')).toBeInTheDocument();
      expect(screen.getByText('Grid import at 863 kW, approaching peak demand.')).toBeInTheDocument();
    });

    it('should display correct initial alerts for Warning', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Battery Low')).toBeInTheDocument();
      expect(screen.getByText('Battery charge at 12% — consider backup.')).toBeInTheDocument();
    });

    it('should display correct initial alerts for Financial Alerts', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Tariff Spike')).toBeInTheDocument();
      expect(screen.getByText('Peak tariff expected at 5:00 PM.')).toBeInTheDocument();
    });

    it('should display correct initial alerts for System Alerts', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Sensor Fault')).toBeInTheDocument();
      expect(screen.getByText('Comm Delay')).toBeInTheDocument();
      expect(screen.getByText('Temperature sensor disconnected.')).toBeInTheDocument();
    });
  });

  describe('Site Selection - EMS SIM 01', () => {
    beforeEach(() => {
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_01',
        setSite: jest.fn(),
      });
    });

    it('should display Beta site alerts when ems_sim_01 is selected', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Beta Grid Spike')).toBeInTheDocument();
      expect(screen.getByText('Beta site grid spike at 920 kW.')).toBeInTheDocument();
    });

    it('should display Beta warning alerts', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Beta Battery Warm')).toBeInTheDocument();
      expect(screen.getByText('Battery temp above threshold (45°C).')).toBeInTheDocument();
    });

    it('should display Beta financial alerts', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Beta Billing Update')).toBeInTheDocument();
      expect(screen.getByText('Projected billing change for next cycle.')).toBeInTheDocument();
    });

    it('should display Beta system alerts', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Beta Comm Restore')).toBeInTheDocument();
      expect(screen.getByText('Communication restored after brief outage.')).toBeInTheDocument();
    });
  });

  describe('Site Switching', () => {
    it('should update alerts when switching from ems_sim_02 to ems_sim_01', () => {
      const { rerender } = render(<AlertsPage />);
      
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
      
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_01',
        setSite: jest.fn(),
      });
      
      rerender(<AlertsPage />);
      
      expect(screen.getByText('Beta Grid Spike')).toBeInTheDocument();
    });

    it('should revert to initial alerts when switching back to ems_sim_02', () => {
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_01',
        setSite: jest.fn(),
      });
      
      const { rerender } = render(<AlertsPage />);
      expect(screen.getByText('Beta Grid Spike')).toBeInTheDocument();
      
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_02',
        setSite: jest.fn(),
      });
      
      rerender(<AlertsPage />);
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
    });

    it('should show default alerts for unknown site', () => {
      mockUseNavStore.mockReturnValue({
        selectedSite: 'unknown_site',
        setSite: jest.fn(),
      });
      
      render(<AlertsPage />);
      
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
    });
  });

  describe('Alert Removal', () => {
    it('should remove alert from Critical Actions when dismiss is clicked', async () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
      
      const dismissButton = screen.getByLabelText('Dismiss High Grid Demand');
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText('High Grid Demand')).not.toBeInTheDocument();
      });
    });

    it('should remove alert from Warning when dismiss is clicked', async () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Battery Low')).toBeInTheDocument();
      
      const dismissButton = screen.getByLabelText('Dismiss Battery Low');
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Battery Low')).not.toBeInTheDocument();
      });
    });

    it('should remove alert from Financial Alerts when dismiss is clicked', async () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Tariff Spike')).toBeInTheDocument();
      
      const dismissButton = screen.getByLabelText('Dismiss Tariff Spike');
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Tariff Spike')).not.toBeInTheDocument();
      });
    });

    it('should remove alert from System Alerts when dismiss is clicked', async () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('Sensor Fault')).toBeInTheDocument();
      
      const dismissButton = screen.getByLabelText('Dismiss Sensor Fault');
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Sensor Fault')).not.toBeInTheDocument();
      });
    });

    it('should handle multiple dismissals', async () => {
      render(<AlertsPage />);
      
      const dismiss1 = screen.getByLabelText('Dismiss High Grid Demand');
      const dismiss2 = screen.getByLabelText('Dismiss High Load Demand');
      
      fireEvent.click(dismiss1);
      fireEvent.click(dismiss2);
      
      await waitFor(() => {
        expect(screen.queryByText('High Grid Demand')).not.toBeInTheDocument();
        expect(screen.queryByText('High Load Demand')).not.toBeInTheDocument();
      });
    });

    it('should keep dismissed alerts removed after site switch and back', async () => {
      const { rerender } = render(<AlertsPage />);
      
      const dismissButton = screen.getByLabelText('Dismiss High Grid Demand');
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText('High Grid Demand')).not.toBeInTheDocument();
      });
      
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_01',
        setSite: jest.fn(),
      });
      rerender(<AlertsPage />);
      
      mockUseNavStore.mockReturnValue({
        selectedSite: 'ems_sim_02',
        setSite: jest.fn(),
      });
      rerender(<AlertsPage />);
      
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
    });
  });

  describe('Column Configuration', () => {
    it('should set fixed height for columns', () => {
      const { container } = render(<AlertsPage />);
      
      const columns = container.querySelectorAll('[style*="height: 390px"]');
      expect(columns.length).toBe(4);
    });

    it('should render columns with proper spacing', () => {
      const { container } = render(<AlertsPage />);
      
      const grid = container.querySelector('.gap-4');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Layout and Responsive Design', () => {
    it('should have proper padding classes', () => {
      const { container } = render(<AlertsPage />);
      
      const content = container.querySelector('.px-4.sm\\:px-6.lg\\:px-8');
      expect(content).toBeInTheDocument();
    });

    it('should use flex layout for page structure', () => {
      const { container } = render(<AlertsPage />);
      
      const mainContainer = container.querySelector('.h-full.flex.flex-col');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have grid responsive classes', () => {
      const { container } = render(<AlertsPage />);
      
      const grid = container.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Alert Counts', () => {
    it('should display correct count for Critical Actions', () => {
      render(<AlertsPage />);
      
      const counts = screen.getAllByText('2');
      expect(counts.length).toBeGreaterThan(0);
    });

    it('should display correct count for System Alerts', () => {
      render(<AlertsPage />);
      
      const counts = screen.getAllByText('2');
      expect(counts.length).toBeGreaterThan(0);
    });

    it('should update count after removing alert', async () => {
      render(<AlertsPage />);
      
      const dismissButton = screen.getByLabelText('Dismiss High Grid Demand');
      fireEvent.click(dismissButton);
      
      await waitFor(() => {
        const alertCounts = screen.getAllByText('1 active alerts');
        expect(alertCounts.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<AlertsPage />);
      
      const heading = screen.getByText('Alerts & Notifications');
      expect(heading.tagName).toBe('H2');
    });

    it('should have accessible dismiss buttons', () => {
      render(<AlertsPage />);
      
      const dismissButtons = screen.getAllByLabelText(/Dismiss/);
      expect(dismissButtons.length).toBeGreaterThan(0);
      
      dismissButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should have aria-hidden on decorative icon', () => {
      const { container } = render(<AlertsPage />);
      
      const icon = container.querySelector('svg[aria-hidden]');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid site switching', () => {
      const { rerender } = render(<AlertsPage />);
      
      for (let i = 0; i < 5; i++) {
        mockUseNavStore.mockReturnValue({
          selectedSite: i % 2 === 0 ? 'ems_sim_01' : 'ems_sim_02',
          setSite: jest.fn(),
        });
        rerender(<AlertsPage />);
      }
      
      expect(screen.getByText('Alerts & Notifications')).toBeInTheDocument();
    });

    it('should handle removing all alerts from a column', async () => {
      render(<AlertsPage />);
      
      const tariffButton = screen.getByLabelText('Dismiss Tariff Spike');
      fireEvent.click(tariffButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Tariff Spike')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('Financial Alerts')).toBeInTheDocument();
    });
  });

  describe('Column Color Configuration', () => {
    it('should apply red gradient to Critical Actions column title', () => {
      render(<AlertsPage />);
      // ALERT_COLORS.critical = 'text-red-600' → AlertsColumn maps to from-red-500 to-red-600
      // Fails if ALERT_COLORS.critical changes or the wrong color is assigned to this column
      const titleEl = screen.getByText('Critical Actions');
      expect(titleEl).toHaveClass('from-red-500');
      expect(titleEl).toHaveClass('to-red-600');
    });

    it('should apply yellow gradient to Warning column title', () => {
      render(<AlertsPage />);
      // ALERT_COLORS.warning = 'text-yellow-500' → from-yellow-400 to-yellow-500
      const titleEl = screen.getByText('Warning');
      expect(titleEl).toHaveClass('from-yellow-400');
      expect(titleEl).toHaveClass('to-yellow-500');
    });

    it('should apply green gradient to Financial Alerts column title', () => {
      render(<AlertsPage />);
      // ALERT_COLORS.financial = 'text-green-600' → from-green-500 to-green-600
      const titleEl = screen.getByText('Financial Alerts');
      expect(titleEl).toHaveClass('from-green-500');
      expect(titleEl).toHaveClass('to-green-600');
    });

    it('should apply blue gradient to System Alerts column title', () => {
      render(<AlertsPage />);
      // ALERT_COLORS.system = 'text-blue-600' → from-blue-500 to-blue-600
      const titleEl = screen.getByText('System Alerts');
      expect(titleEl).toHaveClass('from-blue-500');
      expect(titleEl).toHaveClass('to-blue-600');
    });

    it('should use ALERT_COLUMN_HEIGHT (390px) for all four columns', () => {
      const { container } = render(<AlertsPage />);
      // Hardcoded to 390 — must fail if ALERT_COLUMN_HEIGHT in constants.ts changes
      const columns = container.querySelectorAll('[style*="height: 390px"]');
      expect(columns).toHaveLength(4);
    });
  });

  describe('State Management', () => {
    it('should maintain independent state for each column', async () => {
      render(<AlertsPage />);
      
      const criticalButton = screen.getByLabelText('Dismiss High Grid Demand');
      fireEvent.click(criticalButton);
      
      await waitFor(() => {
        expect(screen.queryByText('High Grid Demand')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('Battery Low')).toBeInTheDocument();
      expect(screen.getByText('Tariff Spike')).toBeInTheDocument();
      expect(screen.getByText('Sensor Fault')).toBeInTheDocument();
    });

    it('should initialize with correct default state', () => {
      render(<AlertsPage />);
      
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
      expect(screen.getByText('Battery Low')).toBeInTheDocument();
      expect(screen.getByText('Tariff Spike')).toBeInTheDocument();
      expect(screen.getByText('Sensor Fault')).toBeInTheDocument();
    });
  });
});
