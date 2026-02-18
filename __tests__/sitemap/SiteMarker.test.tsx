import { render, fireEvent } from '@testing-library/react';
import { SiteMarker } from '@/modules/sitemap/components/SiteMarker';

const mockSetSite = jest.fn();

jest.mock('react-leaflet', () => ({
  Marker: ({ eventHandlers }: any) => (
    <div data-testid="marker" onClick={eventHandlers.click} />
  ),
}));

jest.mock('@/store/useNavStore', () => ({
  useNavStore: (selector: any) =>
    selector({
      setSite: mockSetSite,
    }),
}));

jest.mock('@/store/telemetryStore', () => ({
  useTelemetryStore: (selector: any) =>
    selector({
      sites: {
        alpha: { status: 'CONNECTED' },
      },
    }),
}));

describe('SiteMarker', () => {
  it('calls setSite on click', () => {
    const { getByTestId } = render(
      <SiteMarker
        id="alpha"
        position={[12, 77]}
        name="Alpha"
        capacity={100}
      />
    );

    fireEvent.click(getByTestId('marker'));
    expect(mockSetSite).toHaveBeenCalledWith('alpha');
  });
});
