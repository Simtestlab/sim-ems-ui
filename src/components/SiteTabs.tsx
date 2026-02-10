'use client';

import { useNavStore } from '@/store/useNavStore';
import { getAllSites } from '@/config/sites';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useEffect, useState } from 'react';
import {
  getConnectionHealthFromState,
  getStatusTitle,
} from './siteTabUtils';

export function SiteTabs() {
  const sites = getAllSites();
  const { selectedSite, setSite } = useNavStore();
  
  const allSitesData = useTelemetryStore((state) => state.sites);

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 500);
    return () => clearInterval(interval);
  }, []);

  // derive connection health from telemetry store + a moving clock
  const getConnectionStatus = (siteId: string) => {
    const health = getConnectionHealthFromState(allSitesData?.[siteId], currentTime);
    return {
      health,
      isConnected: health === 'healthy',
      title: getStatusTitle(health),
    };
  };

  const handleSiteChange = (siteId: string) => {
    setSite(siteId);
    // The actual connection will be handled by the useSiteTelemetry hook
    // when components consuming that hook mount/update
  };

  return (
    <div className="bg-white">
      <div className="flex gap-0 overflow-x-auto border-b border-gray-100">
        {sites.map((site) => {
          const isSelected = selectedSite === site.id;
          const status = getConnectionStatus(site.id);
          const isConnected = status.isConnected;
          
          return (
            <button
              key={site.id}
              onClick={() => handleSiteChange(site.id)}
              className={`relative px-3 sm:px-4 py-1.5 text-xs font-medium transition-colors border-b-2 ${
                isSelected
                  ? 'border-emerald-500 text-black bg-emerald-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{site.name}</span>
                {/* Connection status indicator */}
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-400' : 'bg-gray-300'
                  }`}
                  title={status.title}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
