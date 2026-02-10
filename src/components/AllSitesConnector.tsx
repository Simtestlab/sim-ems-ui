'use client';

import { getAllSites } from '@/config/sites';
import { useSiteTelemetry } from '@/modules/live/hooks/useSiteTelemetry';


function SiteConnector({ siteId }: { siteId: string }) {
  useSiteTelemetry(siteId);
  return null;
}

export function AllSitesConnector() {
  const sites = getAllSites();
  
  return (
    <>
      {sites.map((site) => (
        <SiteConnector key={site.id} siteId={site.id} />
      ))}
    </>
  );
}