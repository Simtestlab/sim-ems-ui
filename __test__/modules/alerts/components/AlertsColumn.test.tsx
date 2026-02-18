import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertsColumn } from '@/modules/alerts/components/AlertsColumn';
import type { ColItem } from '@/modules/alerts/types/alerts';

describe('AlertsColumn Component', () => {
  const mockItems: ColItem[] = [
    { id: 'alert-1', title: 'High Grid Demand', desc: 'Grid import at 863 kW', time: '10:02:52 AM' },
    { id: 'alert-2', title: 'High Load Demand', desc: 'Load consumption at 848 kW', time: '10:02:52 AM' },
    { id: 'alert-3', title: 'Battery Warning', desc: 'Battery charge at 15%', time: '09:58:11 AM' },
  ];

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render column with title', () => {
      render(<AlertsColumn title="Critical Actions" items={mockItems} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('Critical Actions')).toBeInTheDocument();
    });

    it('should render correct count of items', () => {
      render(<AlertsColumn title="Critical Actions" items={mockItems} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('3 active alerts')).toBeInTheDocument();
    });

    it('should render all alert items', () => {
      render(<AlertsColumn title="Critical Actions" items={mockItems} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
      expect(screen.getByText('High Load Demand')).toBeInTheDocument();
      expect(screen.getByText('Battery Warning')).toBeInTheDocument();
    });

    it('should render with empty items array', () => {
      render(<AlertsColumn title="Critical Actions" items={[]} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('Critical Actions')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0 active alerts')).toBeInTheDocument();
    });

    it('should display last updated timestamp', () => {
      render(<AlertsColumn title="Critical Actions" items={mockItems} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('Last updated: 10:02:56 PM')).toBeInTheDocument();
    });
  });

  describe('Styling - Color Classes', () => {
    it('should apply red gradient for red color class', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} colorClass="text-red-600" onRemove={mockOnRemove} />
      );
      
      const gradient = container.querySelector('.bg-gradient-to-r.from-red-500.to-red-600');
      expect(gradient).toBeInTheDocument();
    });

    it('should apply yellow gradient for yellow color class', () => {
      const { container } = render(
        <AlertsColumn title="Warning" items={mockItems} colorClass="text-yellow-500" onRemove={mockOnRemove} />
      );
      
      const gradient = container.querySelector('.bg-gradient-to-r.from-yellow-400.to-yellow-500');
      expect(gradient).toBeInTheDocument();
    });

    it('should apply green gradient for green color class', () => {
      const { container } = render(
        <AlertsColumn title="Financial" items={mockItems} colorClass="text-green-600" onRemove={mockOnRemove} />
      );
      
      const gradient = container.querySelector('.bg-gradient-to-r.from-green-500.to-green-600');
      expect(gradient).toBeInTheDocument();
    });

    it('should apply blue gradient for blue color class', () => {
      const { container } = render(
        <AlertsColumn title="System" items={mockItems} colorClass="text-blue-600" onRemove={mockOnRemove} />
      );
      
      const gradient = container.querySelector('.bg-gradient-to-r.from-blue-500.to-blue-600');
      expect(gradient).toBeInTheDocument();
    });

    it('should apply default orange gradient when no color class provided', () => {
      const { container } = render(
        <AlertsColumn title="Alerts" items={mockItems} onRemove={mockOnRemove} />
      );
      
      const gradient = container.querySelector('.bg-gradient-to-r.from-orange-400.to-orange-600');
      expect(gradient).toBeInTheDocument();
    });

    it('should use custom gradient class when provided', () => {
      const { container } = render(
        <AlertsColumn 
          title="Custom" 
          items={mockItems} 
          gradientClass="bg-gradient-to-r from-purple-500 to-purple-600"
          onRemove={mockOnRemove} 
        />
      );
      
      const gradient = container.querySelector('.bg-gradient-to-r.from-purple-500.to-purple-600');
      expect(gradient).toBeInTheDocument();
    });
  });

  describe('Height and Layout', () => {
    it('should apply minHeightPx when provided', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} minHeightPx={400} onRemove={mockOnRemove} />
      );
      
      const column = container.querySelector('.bg-white.border');
      expect(column).toHaveStyle({ height: '400px' });
    });

    it('should not apply height when minHeightPx is not provided', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />
      );
      
      const column = container.querySelector('.bg-white.border') as HTMLElement;
      expect(column?.style.height).toBe('');
    });

    it('should have scrollable content area', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />
      );
      
      const scrollArea = container.querySelector('.overflow-y-auto');
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onRemove with correct id when alert is dismissed', () => {
      render(<AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />);
      
      const dismissButtons = screen.getAllByLabelText(/Dismiss/);
      fireEvent.click(dismissButtons[0]);
      
      expect(mockOnRemove).toHaveBeenCalledTimes(1);
      expect(mockOnRemove).toHaveBeenCalledWith('alert-1');
    });

    it('should handle multiple dismissals', () => {
      render(<AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />);
      
      const dismissButtons = screen.getAllByLabelText(/Dismiss/);
      fireEvent.click(dismissButtons[0]);
      fireEvent.click(dismissButtons[1]);
      
      expect(mockOnRemove).toHaveBeenCalledTimes(2);
      expect(mockOnRemove).toHaveBeenNthCalledWith(1, 'alert-1');
      expect(mockOnRemove).toHaveBeenNthCalledWith(2, 'alert-2');
    });

    it('should work without onRemove callback', () => {
      render(<AlertsColumn title="Critical" items={mockItems} />);
      
      const dismissButtons = screen.getAllByLabelText(/Dismiss/);
      expect(() => fireEvent.click(dismissButtons[0])).not.toThrow();
    });
  });

  describe('Card Background Classes', () => {
    it('should apply red background to items when red gradient is used', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={[mockItems[0]]} colorClass="text-red-600" onRemove={mockOnRemove} />
      );
      
      const card = container.querySelector('.bg-red-50.border-red-100');
      expect(card).toBeInTheDocument();
    });

    it('should apply yellow background to items when yellow gradient is used', () => {
      const { container } = render(
        <AlertsColumn title="Warning" items={[mockItems[0]]} colorClass="text-yellow-500" onRemove={mockOnRemove} />
      );
      
      const card = container.querySelector('.bg-yellow-50.border-yellow-100');
      expect(card).toBeInTheDocument();
    });

    it('should apply green background to items when green gradient is used', () => {
      const { container } = render(
        <AlertsColumn title="Financial" items={[mockItems[0]]} colorClass="text-green-600" onRemove={mockOnRemove} />
      );
      
      const card = container.querySelector('.bg-green-50.border-green-100');
      expect(card).toBeInTheDocument();
    });

    it('should apply blue background to items when blue gradient is used', () => {
      const { container } = render(
        <AlertsColumn title="System" items={[mockItems[0]]} colorClass="text-blue-600" onRemove={mockOnRemove} />
      );
      
      const card = container.querySelector('.bg-blue-50.border-blue-100');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Footer Information', () => {
    it('should update active alerts count based on items length', () => {
      const { rerender } = render(
        <AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />
      );
      
      expect(screen.getByText('3 active alerts')).toBeInTheDocument();
      
      rerender(<AlertsColumn title="Critical" items={[mockItems[0]]} onRemove={mockOnRemove} />);
      expect(screen.getByText('1 active alerts')).toBeInTheDocument();
    });

    it('should display footer with border separator', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />
      );
      
      const footer = container.querySelector('.border-t.border-gray-100');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item', () => {
      render(<AlertsColumn title="Critical" items={[mockItems[0]]} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('High Grid Demand')).toBeInTheDocument();
    });

    it('should handle large number of items', () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        id: `alert-${i}`,
        title: `Alert ${i}`,
        desc: `Description ${i}`,
        time: '10:00:00 AM',
      }));

      render(<AlertsColumn title="Critical" items={manyItems} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('50 active alerts')).toBeInTheDocument();
    });

    it('should render with very long title', () => {
      const longTitle = 'This is a Very Long Title for the Alert Column That Should Still Display Correctly';
      render(<AlertsColumn title={longTitle} items={mockItems} onRemove={mockOnRemove} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  describe('Responsiveness', () => {
    it('should have proper flex layout classes', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />
      );
      
      const column = container.querySelector('.flex.flex-col');
      expect(column).toBeInTheDocument();
    });

    it('should have scrollable content with proper padding', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />
      );
      
      const scrollArea = container.querySelector('.overflow-y-auto.pr-2');
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const { container } = render(
        <AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />
      );
      
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should have accessible dismiss buttons for all items', () => {
      render(<AlertsColumn title="Critical" items={mockItems} onRemove={mockOnRemove} />);
      
      const dismissButtons = screen.getAllByLabelText(/Dismiss/);
      expect(dismissButtons).toHaveLength(mockItems.length);
    });
  });
});
