import { render } from '@testing-library/react';
import { MapController } from '@/modules/sitemap/components/MapController';

const mockFlyTo = jest.fn();

jest.mock('react-leaflet', () => ({
  useMap: () => ({
    flyTo: mockFlyTo,
  }),
}));

jest.mock('@/store/useNavStore', () => ({
  useNavStore: (selector: any) =>
    selector({
      selectedSite: 'alpha',
    }),
}));

jest.mock('@/config/sites', () => ({
  getSiteConfig: () => ({
    lat: 12,
    lng: 77,
  }),
}));

describe('MapController', () => {
  it('calls flyTo when site selected', () => {
    render(<MapController />);
    expect(mockFlyTo).toHaveBeenCalledWith(
      [12, 77],
      13,
      { duration: 1.5 }
    );
  });
});
