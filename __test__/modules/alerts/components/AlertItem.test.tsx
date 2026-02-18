import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertItem } from '@/modules/alerts/components/AlertItem';
import type { ColItem } from '@/modules/alerts/types/alerts';

describe('AlertItem Component', () => {
  const mockItem: ColItem = {
    id: 'test-1',
    title: 'Test Alert',
    desc: 'This is a test alert description',
    time: '10:30:00 AM',
  };

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render alert item with all required information', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);

      expect(screen.getByText('Test Alert')).toBeInTheDocument();
      expect(screen.getByText('This is a test alert description')).toBeInTheDocument();
      expect(screen.getByText('10:30:00 AM')).toBeInTheDocument();
    });

    it('should render with default background class when cardBgClass is not provided', () => {
      const { container } = render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const cardElement = container.querySelector('.bg-white.border-gray-200');
      
      expect(cardElement).toBeInTheDocument();
    });

    it('should render with custom background class when cardBgClass is provided', () => {
      const { container } = render(
        <AlertItem item={mockItem} cardBgClass="bg-red-50 border-red-100" onRemove={mockOnRemove} />
      );
      const cardElement = container.querySelector('.bg-red-50.border-red-100');
      
      expect(cardElement).toBeInTheDocument();
    });

    it('should render dismiss button with correct aria-label', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const dismissButton = screen.getByLabelText('Dismiss Test Alert');
      
      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onRemove with item id when dismiss button is clicked', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const dismissButton = screen.getByLabelText('Dismiss Test Alert');
      
      fireEvent.click(dismissButton);
      
      expect(mockOnRemove).toHaveBeenCalledTimes(1);
      expect(mockOnRemove).toHaveBeenCalledWith('test-1');
    });

    it('should not throw error when onRemove is not provided and button is clicked', () => {
      render(<AlertItem item={mockItem} />);
      const dismissButton = screen.getByLabelText('Dismiss Test Alert');
      
      expect(() => fireEvent.click(dismissButton)).not.toThrow();
    });

    it('should have hover effect on dismiss button', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const dismissButton = screen.getByLabelText('Dismiss Test Alert');
      
      expect(dismissButton).toHaveClass('hover:text-gray-700');
    });
  });

  describe('Styling', () => {
    it('should apply minimum height to card', () => {
      const { container } = render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const card = container.querySelector('.min-h-\\[96px\\]');
      
      expect(card).toBeInTheDocument();
    });

    it('should have proper text styling for title', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const title = screen.getByText('Test Alert');
      
      expect(title).toHaveClass('text-gray-600', 'font-semibold');
    });

    it('should have proper text styling for description', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const description = screen.getByText('This is a test alert description');
      
      expect(description).toHaveClass('text-sm', 'text-gray-700');
    });

    it('should have proper text styling for time', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const time = screen.getByText('10:30:00 AM');
      
      expect(time).toHaveClass('text-xs', 'text-gray-400');
    });
  });

  describe('Edge Cases', () => {
    it('should render with empty description', () => {
      const itemWithEmptyDesc: ColItem = { ...mockItem, desc: '' };
      render(<AlertItem item={itemWithEmptyDesc} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('Test Alert')).toBeInTheDocument();
    });

    it('should render with long title', () => {
      const itemWithLongTitle: ColItem = {
        ...mockItem,
        title: 'This is a very long title that should still be displayed correctly in the alert item component',
      };
      render(<AlertItem item={itemWithLongTitle} onRemove={mockOnRemove} />);
      
      expect(screen.getByText(itemWithLongTitle.title)).toBeInTheDocument();
    });

    it('should render with long description', () => {
      const itemWithLongDesc: ColItem = {
        ...mockItem,
        desc: 'This is a very long description that contains a lot of information about the alert and should wrap properly within the card without breaking the layout or causing any display issues.',
      };
      render(<AlertItem item={itemWithLongDesc} onRemove={mockOnRemove} />);
      
      expect(screen.getByText(itemWithLongDesc.desc)).toBeInTheDocument();
    });

    it('should render with special characters in title', () => {
      const itemWithSpecialChars: ColItem = {
        ...mockItem,
        title: 'Alert: Battery @ 12% → Critical!',
      };
      render(<AlertItem item={itemWithSpecialChars} onRemove={mockOnRemove} />);
      
      expect(screen.getByText('Alert: Battery @ 12% → Critical!')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible dismiss button', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const dismissButton = screen.getByLabelText('Dismiss Test Alert');
      
      expect(dismissButton).toHaveAttribute('aria-label');
    });

    it('should be keyboard accessible', () => {
      render(<AlertItem item={mockItem} onRemove={mockOnRemove} />);
      const dismissButton = screen.getByLabelText('Dismiss Test Alert');
      
      dismissButton.focus();
      expect(dismissButton).toHaveFocus();
    });
  });
});
