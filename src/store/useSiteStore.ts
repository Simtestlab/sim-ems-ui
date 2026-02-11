import { create } from 'zustand';
import { SiteConfig } from '@/config/sites';
import { fetchSiteDetails } from '@/modules/sitemap/services/siteService';

interface SiteState {
  activeSite: SiteConfig | null;
  isLoading: boolean;
  setActiveSite: (siteId: string) => Promise<void>;
}

export const useSiteStore = create<SiteState>((set) => ({
  activeSite: null,
  isLoading: false,
  setActiveSite: async (siteId) => {
    set({ isLoading: true });
    const site = await fetchSiteDetails(siteId);
    set({ activeSite: site, isLoading: false });
  },
}));