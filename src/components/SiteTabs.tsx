'use client';

import { useNavStore } from '@/store/useNavStore';

interface SiteTabsProps {
  sites?: string[];
}

export function SiteTabs({
  sites = ['Site 1', 'Site 2', 'Site 3', 'Site 4'],
}: SiteTabsProps) {
  const { selectedSite, setSite } = useNavStore();

  return (
    <div className="bg-white">
      <div className="flex gap-0 overflow-x-auto">
        {sites.map((site) => (
          <button
            key={site}
            onClick={() => setSite(site)}
                className={`px-4 sm:px-6 py-2 text-xs font-medium transition-colors border-b-2 ${
              selectedSite === site
                ? 'border-green-500 text-black'
                : 'border-transparent text-gray-500'
            }`}
          >
            {site}
          </button>
        ))}
      </div>
    </div>
  );
}
