import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/modules/auth/hooks/usePermissions', () => ({
  usePermissions: jest.fn(),
}));

jest.mock('@/modules/auth/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/modules/settings/components/PeakShavingCard', () => ({ __esModule: true, default: () => React.createElement('div', null, 'Peak Shaving') }));
jest.mock('@/modules/settings/components/PVSelfConsumptionCard', () => ({ __esModule: true, default: () => React.createElement('div', null, 'PV Self-Consumption') }));
jest.mock('@/modules/settings/components/TimeOfUseOptimizationCard', () => ({ __esModule: true, default: () => React.createElement('div', null, 'Time-of-Use Optimization') }));
jest.mock('@/modules/settings/components/MicrogridIslandingCard', () => ({ __esModule: true, default: () => React.createElement('div', null, 'Microgrid / Islanding') }));
jest.mock('@/modules/settings/components/GridServicesCard', () => ({ __esModule: true, default: () => React.createElement('div', null, 'Grid Services') }));

import SettingsPage from '@/modules/settings/pages/SettingsPage';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';
import { useAuth } from '@/modules/auth/context/AuthContext';

describe('SettingsPage', () => {
  const mockUsePermissions = usePermissions as jest.MockedFunction<typeof usePermissions>;
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { name: 'tester' } } as any);
  });


  it('shows Access Denied when user cannot modify settings', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: false } as any);
    render(<SettingsPage />);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('You do not have permission to access system settings.')).toBeInTheDocument();
  });

  it('Access Denied section has min-h-screen and bg-gray-50 container', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: false } as any);
    const { container } = render(<SettingsPage />);
    expect(container.querySelector('.min-h-screen.bg-gray-50')).toBeInTheDocument();
  });

  it('Access Denied card has correct styling classes', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: false } as any);
    const { container } = render(<SettingsPage />);
    expect(container.querySelector('.bg-white.rounded-lg.shadow-lg')).toBeInTheDocument();
  });

  it('renders page heading "EMS Logic Controller" when permission granted', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'EMS Logic Controller' })).toBeInTheDocument();
  });

  it('renders page subtitle when permission granted', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    render(<SettingsPage />);
    expect(screen.getByText('Control & Setpoints (Monitoring handled in Analytics)')).toBeInTheDocument();
  });


  it('page container has h-screen and bg-gray-50 classes', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    const { container } = render(<SettingsPage />);
    expect(container.querySelector('.h-screen.bg-gray-50')).toBeInTheDocument();
  });

  it('inner wrapper has max-w + padding classes', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    const { container } = render(<SettingsPage />);
    expect(container.querySelector('.max-w-\\[1400px\\].mx-auto.px-6.py-6')).toBeInTheDocument();
  });

  it('cards grid has responsive column classes', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    const { container } = render(<SettingsPage />);
    expect(container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.xl\\:grid-cols-3.gap-6')).toBeInTheDocument();
  });


  it('renders all five settings cards when permission granted', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    render(<SettingsPage />);

    expect(screen.getByText('Peak Shaving')).toBeInTheDocument();
    expect(screen.getByText('PV Self-Consumption')).toBeInTheDocument();
    expect(screen.getByText('Time-of-Use Optimization')).toBeInTheDocument();
    expect(screen.getByText('Microgrid / Islanding')).toBeInTheDocument();
    expect(screen.getByText('Grid Services')).toBeInTheDocument();
  });

  it('renders exactly 5 settings cards — no more, no less', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    render(<SettingsPage />);

    const cardNames = [
      'Peak Shaving',
      'PV Self-Consumption',
      'Time-of-Use Optimization',
      'Microgrid / Islanding',
      'Grid Services',
    ];
    cardNames.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument());
    expect(cardNames).toHaveLength(5);
  });


  it('does not show page heading when access is denied', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: false } as any);
    render(<SettingsPage />);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not show Access Denied when permission is granted', () => {
    mockUsePermissions.mockReturnValue({ canModifySettings: true } as any);
    render(<SettingsPage />);
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });
});
