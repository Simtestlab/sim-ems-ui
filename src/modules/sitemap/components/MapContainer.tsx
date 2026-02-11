'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_SITES } from '../constants/mockData';
import { MapController } from './MapController';
import { SiteMarker } from './SiteMarker';

export default function MapView() {
  return (
    <MapContainer 
      center={[11.4102, 76.6950]} 
      zoom={6} 
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController />
      {MOCK_SITES.map((site) => (
        <SiteMarker
          key={site.id}
          id={site.id}
          position={[site.lat, site.lng]}
          name={site.name}
          capacity={site.capacity} // Passing capacity for the bubble and colors
        />
      ))}
    </MapContainer>
  );
}