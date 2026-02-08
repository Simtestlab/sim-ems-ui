'use client';

import { useNavStore } from '@/store/useNavStore';

export function SelectedSite() {
  const { selectedSite } = useNavStore();

  return (
    <div className="mt-2 ml-0 text-sm md:text-base text-gray-600 text-center md:text-left">
      Selected: <span className="font-medium text-gray-800">{selectedSite}</span>
    </div>
  );
}
