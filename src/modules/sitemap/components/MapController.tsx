'use client';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useNavStore } from '@/store/useNavStore';
import { getSiteConfig } from '@/config/sites'; 
export const MapController = () => {
  const map = useMap();
  const selectedSiteId = useNavStore((state) => state.selectedSite);

  useEffect(() => {
    const siteData = getSiteConfig(selectedSiteId);
    
    if (siteData) {
      map.flyTo([siteData.lat, siteData.lng], 13, {
        duration: 1.5,
      });
    }
  }, [selectedSiteId, map]);

  return null;
};