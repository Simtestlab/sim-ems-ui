import { render, screen } from '@testing-library/react';
import SiteSidePanel from '@/modules/sitemap/components/SiteSidePanel';

let mockLastUpdate = new Date();

jest.mock('@/store/useNavStore', () => ({
  useNavStore: (selector: any) =>
    selector({
      selectedSite: 'alpha',
    }),
}));

jest.mock('@/store/telemetryStore', () => ({
  useTelemetryStore: (selector: any) =>
    selector({
      sites: {
        alpha: {
          status: 'CONNECTED',
          lastUpdateTime: mockLastUpdate,
          latestTelemetry: {},
        },
      },
    }),
}));

jest.mock('@/config/sites', () => ({
  getSiteConfig: () => ({
    id: 'alpha',
    name: 'Alpha',
    lat: 12,
    lng: 77,
    capacity: 100,
  }),
}));

describe('SiteSidePanel', () => {
  beforeEach(() => {
    mockLastUpdate = new Date();
  });

  it('shows CONNECTED when fresh', () => {
    render(<SiteSidePanel />);
    expect(screen.getByText(/connected/i)).toBeInTheDocument();
  });

  it('shows DISCONNECTED if stale', () => {
    mockLastUpdate = new Date(Date.now() - 6000);

    render(<SiteSidePanel />);
    expect(screen.getByText(/disconnected/i)).toBeInTheDocument();
  });

  it('renders site name', () => {
    render(<SiteSidePanel />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });
});
