import { MOCK_SITES } from '../constants/mockData';
import { SiteConfig } from '@/config/sites';

export const fetchSiteDetails = async (siteId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const site = MOCK_SITES.find((s) => s.id === siteId) || null;
      resolve(site);
    }, 500);
  });
};