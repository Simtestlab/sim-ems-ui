import { create } from 'zustand';
import { getAllSiteIds } from '../config/sites';

type NavState = {
  selectedSite: string;
  setSite: (siteId: string) => void;
};

// Get the first available site ID as default
const defaultSiteId = getAllSiteIds()[0] || 'device_01_id';

export const useNavStore = create<NavState>((set) => ({
  selectedSite: defaultSiteId,
  setSite: (siteId) => set({ selectedSite: siteId }),
}));
