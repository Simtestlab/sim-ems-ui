'use client';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';

interface SiteMarkerProps {
  id: string;
  position: [number, number];
  name: string;
  capacity: number;
}

export const SiteMarker = ({ id, position, name, capacity }: SiteMarkerProps) => {
  const router = useRouter();

  // Logic for color based on performance
  const getStatusColors = (cap: number) => {
    if (cap > 12) return { bg: '#10b981', text: '#059669', light: '#ecfdf5' }; // Green
    if (cap >= 7) return { bg: '#f59e0b', text: '#d97706', light: '#fffbeb' }; // Orange
    return { bg: '#ef4444', text: '#dc2626', light: '#fef2f2' }; // Red
  };

  const colors = getStatusColors(capacity);

  const customIcon = L.divIcon({
    className: 'energy-marker-container',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
        <div style="
          background: white; 
          border: 1.5px solid ${colors.bg}; 
          color: ${colors.text};
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 11px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          white-space: nowrap;
        ">
          ${capacity}kW
        </div>
        
        <div style="
          background: ${colors.bg}; 
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 0 10px ${colors.bg}66;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12V22L22 10H13V2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 55], // Anchors the bottom of the circle to the coordinate
  });

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{
        click: () => router.push(`/sitemap?site=${id}`),
      }}
    >
      <Tooltip direction="top" offset={[0, -50]}>
        <span className="font-bold">{name}</span>
      </Tooltip>
    </Marker>
  );
};