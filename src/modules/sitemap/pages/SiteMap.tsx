'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSiteStore } from '@/store/useSiteStore';
import { MOCK_SITES } from '../constants/mockData';
import SiteSidePanel from '../components/SiteSidePanel';

const MapView = dynamic(() => import('../components/MapContainer'), { ssr: false });

export default function SiteMap() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteId = searchParams.get('site');
  const setActiveSite = useSiteStore((state) => state.setActiveSite);

  useEffect(() => {
    // If no site is in URL, default to the first site
    if (!siteId && MOCK_SITES.length > 0) {
      router.replace(`/sitemap?site=${MOCK_SITES[0].id}`);
    } else if (siteId) {
      setActiveSite(siteId);
    }
  }, [siteId, setActiveSite, router]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
      <div className="flex border-b border-gray-200 bg-gray-50">
        {MOCK_SITES.map((site) => (
          <button
            key={site.id}
            onClick={() => router.push(`/sitemap?site=${site.id}`)}
            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${
              siteId === site.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-400'
            }`}
          >
            {site.name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[60%] relative border-r bg-slate-50">
          <MapView />
        </div>
        <div className="w-[40%] overflow-y-auto bg-white">
          <SiteSidePanel />
        </div>
      </div>
    </div>
  );
}