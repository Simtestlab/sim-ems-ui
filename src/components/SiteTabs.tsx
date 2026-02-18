'use client';

import { useNavStore } from '@/store/useNavStore';
import { getAllSites } from '@/config/sites';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useEffect, useState } from 'react';
import {
  getConnectionHealthFromState,
  getStatusTitle,
} from './siteTabUtils';
import { DATA_FRESHNESS_THRESHOLD } from './siteTabUtils';

function useSiteStatus(siteId: string) {
  const siteState = useTelemetryStore((s) => s.sites[siteId]);
  return siteState ?? null;
}

export function SiteTabs() {
  const sites = getAllSites();
  const { selectedSite, setSite } = useNavStore();
  
  const [currentTime, setCurrentTime] = useState(Date.now());

  const allSitesData = useTelemetryStore((state) => state.sites);

  const anyUnstable = Object.values(allSitesData || {}).some((s) => {
    if (!s) return false;
    if (s.status === 'DISCONNECTED' || s.status === 'ERROR') return true;
    if (!s.lastUpdateTime) return true;
    const last = new Date(s.lastUpdateTime).getTime();
    return Date.now() - last > DATA_FRESHNESS_THRESHOLD;
  });

  useEffect(() => {
    const fastInterval = anyUnstable ? 250 : 500;
    const interval = setInterval(() => setCurrentTime(Date.now()), fastInterval);
    return () => clearInterval(interval);
  }, [anyUnstable]);

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
          const siteState = useSiteStatus(site.id);

          const health = getConnectionHealthFromState(siteState, currentTime);
          const status = {
            health,
            isConnected: health === 'healthy',
            title: getStatusTitle(health),
          };
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
