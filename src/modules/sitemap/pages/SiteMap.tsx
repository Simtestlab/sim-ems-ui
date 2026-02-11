'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useNavStore } from '@/store/useNavStore'; 
import { useSiteStore } from '@/store/useSiteStore';
import SiteSidePanel from '../components/SiteSidePanel';

const MapView = dynamic(() => import('../components/MapContainer'), { ssr: false });

export default function SiteMap() {
  // Subscribe to the NavStore instead of the URL
  const selectedSiteId = useNavStore((state) => state.selectedSite);
  const setActiveSite = useSiteStore((state) => state.setActiveSite);

  useEffect(() => {
    // Whenever the NavStore site changes (Alpha/Beta), update the active site logic
    if (selectedSiteId) {
      setActiveSite(selectedSiteId);
    }
  }, [selectedSiteId, setActiveSite]);

  return (
    <div className="flex h-[calc(100vh-120px)] w-full overflow-hidden bg-white">
      {/* 60% Map Area */}
      <div className="w-[60%] border-r border-gray-100 relative bg-slate-50">
        <MapView />
      </div>

      {/* 40% Side Panel */}
      <div className="w-[40%] overflow-y-auto bg-white">
        <SiteSidePanel />
      </div>
    </div>
  );
}