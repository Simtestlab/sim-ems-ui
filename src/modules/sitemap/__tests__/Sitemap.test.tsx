// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock Functions
const mockSetSite = vi.fn();
const mockSetView = vi.fn();
const mockFlyTo = vi.fn();

let mockLastUpdated = Date.now();

// Zustand-Compatible Nav Store Mock
vi.mock('@/store/useNavStore', () => ({
  useNavStore: (selector: any) =>
    selector({
      selectedSite: 'alpha',
      setSite: mockSetSite,
    }),
}));

// Zustand-Compatible Telemetry Store Mock
vi.mock('@/store/telemetryStore', () => ({
  useTelemetryStore: (selector: any) =>
    selector({
      sites: {
        alpha: {
          status: 'CONNECTED',
          lastUpdated: mockLastUpdated,
        },
        beta: {
          status: 'OFFLINE',
          lastUpdated: mockLastUpdated,
        },
      },
    }),
}));

// Config Mock
vi.mock('@/config/sites', () => ({
  getAllSites: () => [
    { id: 'alpha', name: 'Alpha Site', lat: 12, lng: 77 },
    { id: 'beta', name: 'Beta Site', lat: 13, lng: 78 },
  ],
  getSiteConfig: (id: string) => ({
    id,
    name: id === 'alpha' ? 'Alpha Site' : 'Beta Site',
    lat: id === 'alpha' ? 12 : 13,
    lng: id === 'alpha' ? 77 : 78,
    capacity: 100,
  }),
}));

// Leaflet Mock
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  ZoomControl: () => (
    <button
      data-testid="zoom-control"
      onClick={() => mockSetView([12, 77], 10)}
    >
      Zoom
    </button>
  ),
  useMap: () => ({
    setView: mockSetView,
    flyTo: mockFlyTo,
  }),
}));

// SiteMarker Mock
vi.mock('../components/SiteMarker', () => ({
  SiteMarker: ({ id }: any) => (
    <div
      data-testid="map-marker"
      onClick={() => mockSetSite(id)}
    >
      {id}
    </div>
  ),
}));

// Import After Mocks
import MapView from '../components/MapContainer';
import SiteSidePanel from '../components/SiteSidePanel';

describe('Sitemap Integration Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    mockLastUpdated = Date.now();
  });

  // Map Rendering
  it('renders map container and tile layer', () => {
    render(<MapView />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  // Zoom Control
  it('calls setView when zoom control is clicked', () => {
    render(<MapView />);
    fireEvent.click(screen.getByTestId('zoom-control'));
    expect(mockSetView).toHaveBeenCalled();
  });

  // Marker Rendering
  it('renders markers for all sites', () => {
    render(<MapView />);
    expect(screen.getAllByTestId('map-marker')).toHaveLength(2);
  });

  // Marker Navigation
  it('navigates when a marker is clicked', () => {
    render(<MapView />);
    fireEvent.click(screen.getAllByTestId('map-marker')[0]);
    expect(mockSetSite).toHaveBeenCalledWith('alpha');
  });

  // Tab Navigation
  it('navigates when Alpha tab is clicked', () => {
    render(<MapView />);
    fireEvent.click(screen.getByText(/alpha/i));
    expect(mockSetSite).toHaveBeenCalledWith('alpha');
  });

  it('navigates when Beta tab is clicked', () => {
    render(<MapView />);
    fireEvent.click(screen.getByText(/beta/i));
    expect(mockSetSite).toHaveBeenCalledWith('beta');
  });

  // MapController flyTo
  it('calls flyTo when site is selected', () => {
    render(<MapView />);

    expect(mockFlyTo).toHaveBeenCalled();

    const call = mockFlyTo.mock.calls[0];
    expect(call[1]).toBe(13); // zoom level
    expect(call[2]).toEqual({ duration: 1.5 });
  });

  // SidePanel connected
  it('shows connected when telemetry is fresh', () => {
    render(<SiteSidePanel />);
    expect(screen.getByText(/connected/i)).toBeInTheDocument();
  });

  // SidePanel disconnected
  it('shows disconnected when update older than 5s', () => {
    vi.useFakeTimers();

    mockLastUpdated = Date.now() - 6000;

    render(<SiteSidePanel />);

    expect(screen.getByText(/disconnected/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

});
