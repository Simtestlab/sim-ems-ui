import { getSiteConfig, SiteConfig } from '@/config/sites';
export const fetchSiteDetails = async (siteId: string): Promise<SiteConfig | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const site = getSiteConfig(siteId) || null;
      resolve(site);
    }, 300);
  });
};