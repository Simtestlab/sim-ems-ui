import { render, screen } from '@testing-library/react';
import MapView from '@/modules/sitemap/components/MapContainer';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  ZoomControl: () => <div data-testid="zoom-control" />,
  useMap: () => ({
    flyTo: jest.fn(),
  }),
}));

jest.mock('@/config/sites', () => ({
  getAllSites: () => [
    { id: 'alpha', name: 'Alpha', lat: 12, lng: 77, capacity: 100 },
    { id: 'beta', name: 'Beta', lat: 13, lng: 78, capacity: 50 },
  ],
  getAllSiteIds: () => ['alpha', 'beta'],
  getSiteConfig: (id: string) => ({
    id,
    name: id === 'alpha' ? 'Alpha' : 'Beta',
    lat: id === 'alpha' ? 12 : 13,
    lng: id === 'alpha' ? 77 : 78,
    capacity: id === 'alpha' ? 100 : 50,
  }),
}));

jest.mock('@/modules/sitemap/components/SiteMarker', () => ({
  SiteMarker: ({ id }: any) => (
    <div data-testid="site-marker">{id}</div>
  ),
}));

describe('MapView', () => {
  it('renders map container', () => {
    render(<MapView />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders tile layer and zoom control', () => {
    render(<MapView />);
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-control')).toBeInTheDocument();
  });

  it('renders all site markers', () => {
    render(<MapView />);
    expect(screen.getAllByTestId('site-marker')).toHaveLength(2);
  });
});
