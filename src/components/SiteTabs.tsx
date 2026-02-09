'use client';

import { useNavStore } from '@/store/useNavStore';
import { getAllSites, getSiteConfig } from '@/config/sites';
import { useTelemetryStore } from '@/store/telemetryStore';

export function SiteTabs() {
  const sites = getAllSites();
  const { selectedSite, setSite } = useNavStore();
  
  // Get connection status for each site to show visual indicators
  const getConnectionStatus = (siteId: string) => {
    const siteState = useTelemetryStore.getState().sites[siteId];
    return siteState?.isConnected || false;
  };

  const handleSiteChange = (siteId: string) => {
    setSite(siteId);
    // The actual connection will be handled by the useSiteTelemetry hook
    // when components consuming that hook mount/update
  };

  return (
    <div className="bg-white">
      <div className="flex gap-0 overflow-x-auto">
        {sites.map((site) => {
          const isSelected = selectedSite === site.id;
          const isConnected = getConnectionStatus(site.id);
          
          return (
            <button
              key={site.id}
              onClick={() => handleSiteChange(site.id)}
              className={`relative px-4 sm:px-6 py-2 text-xs font-medium transition-colors border-b-2 ${
                isSelected
                  ? 'border-green-500 text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{site.name}</span>
                {/* Connection status indicator */}
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                  title={isConnected ? 'Connected' : 'Disconnected'}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
