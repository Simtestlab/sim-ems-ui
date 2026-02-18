import React from 'react';
import { render, screen } from '@testing-library/react';
import { SettingsCard } from '@/modules/settings/components/SettingsCard';

describe('SettingsCard', () => {
  it('renders title and status toggle when provided', () => {
    const onToggle = jest.fn();
    render(
      <SettingsCard title="My Card" isActive={true} onToggle={onToggle}>
        <div>Child</div>
      </SettingsCard>
    );

    expect(screen.getByText('My Card')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE') || screen.getByText('IDLE')).toBeDefined();
  });

  it('renders custom header when supplied', () => {
    render(
      <SettingsCard title="Custom" customHeader={<div>CustomHeader</div>}>
        <div />
      </SettingsCard>
    );

    expect(screen.getByText('CustomHeader')).toBeInTheDocument();
  });
});
