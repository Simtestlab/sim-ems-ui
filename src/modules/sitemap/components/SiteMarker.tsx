'use client';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useNavStore } from '@/store/useNavStore';

export const SiteMarker = ({ id, position, name, capacity }: any) => {
  const setSite = useNavStore((state) => state.setSite);
  const status = useTelemetryStore((state) => state.sites[id]?.status);

  const isLive = status === 'CONNECTED';
  const color = isLive ? (capacity > 10 ? '#10b981' : '#f59e0b') : '#ef4444';

  const customIcon = L.divIcon({
    className: 'live-energy-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="background: white; border: 1.5px solid ${color}; color: ${color}; padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 10px; margin-bottom: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${isLive ? capacity + 'kW' : 'ERROR'}
        </div>
        <div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px ${color}66;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14H12V22L22 10H13V2Z"/></svg>
        </div>
      </div>
    `,
    iconSize: [50, 60],
    iconAnchor: [25, 55],
  });

  return (
    <Marker position={position} icon={customIcon} eventHandlers={{ click: () => setSite(id) }} />
  );
};