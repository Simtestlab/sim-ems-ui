import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusToggle } from '@/modules/settings/components/StatusToggle';

describe('StatusToggle', () => {
  it('shows correct labels and toggles', () => {
    const onToggle = jest.fn();
    render(<StatusToggle statusOn={true} onToggle={onToggle} onLabel="ONL" offLabel="OFFL" />);

    expect(screen.getByText('ONL')).toBeInTheDocument();
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('hides toggle when showToggle is false', () => {
    render(<StatusToggle statusOn={false} showToggle={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('IDLE')).toBeInTheDocument();
  });
});
