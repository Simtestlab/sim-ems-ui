import { create } from 'zustand';

type NavState = {
  selectedSite: string;
  setSite: (site: string) => void;
};

export const useNavStore = create<NavState>((set) => ({
  selectedSite: 'Site 1',
  setSite: (site) => set({ selectedSite: site }),
}));
