'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface SiteTabsProps {
  sites?: string[];
  defaultSite?: string;
}

export function SiteTabs({ sites = ['Site 1', 'Site 2', 'Site 3', 'Site 4'], defaultSite = 'Site 1' }: SiteTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const siteParam = searchParams?.get('site') || defaultSite;

  const handleSelect = useCallback(
    (site: string) => {
      const params = new URLSearchParams(Array.from(searchParams ?? []));
      params.set('site', site);
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ''}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="bg-white">
      <div className="flex gap-0 overflow-x-auto no-scrollbar scrollbar-hide">
        {sites.map((site) => (
          <button
            key={site}
            onClick={() => handleSelect(site)}
            className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 ${
              siteParam === site
                ? 'border-green-500 text-gray-900 bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            role="tab"
            aria-selected={siteParam === site}
          >
            {site}
          </button>
        ))}
      </div>
    </div>
  );
}
