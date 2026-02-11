'use client';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSiteStore } from '@/store/useSiteStore';
import { ExtendedSiteConfig } from '../constants/mockData';

export const MapController = () => {
  const map = useMap();
  // Cast the state to our extended type
  const activeSite = useSiteStore((state) => state.activeSite) as ExtendedSiteConfig | null;

  useEffect(() => {
    if (activeSite && activeSite.lat && activeSite.lng) {
      map.flyTo([activeSite.lat, activeSite.lng], 13, {
        duration: 1.5,
      });
    }
  }, [activeSite, map]);

  return null;
};