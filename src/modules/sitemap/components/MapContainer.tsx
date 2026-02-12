'use client';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import { getAllSites } from '@/config/sites'; 
import { MapController } from './MapController';
import { SiteMarker } from './SiteMarker';

export default function MapView() {
  const sites = getAllSites(); 

  return (
    <MapContainer 
      center={[12.9716, 77.5946]} 
      zoom={6} 
      className="h-full w-full"
      zoomControl={false} 
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Positioned Zoom Controls */}
      <ZoomControl position="bottomright" />
      
      <MapController />
      {sites.map((site) => (
        <SiteMarker
          key={site.id}
          id={site.id}
          position={[site.lat, site.lng]} 
          name={site.name}
          capacity={site.capacity} 
        />
      ))}
    </MapContainer>
  );
}