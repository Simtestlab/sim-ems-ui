'use client';

import { useSearchParams } from 'next/navigation';

export function Navbar() {
  const searchParams = useSearchParams();
  const site = searchParams?.get('site') || 'Site 1';

  return (
    <div className="mt-2 ml-0 text-sm md:text-base text-gray-600 text-center md:text-left">
      Selected: <span className="font-medium text-gray-800">{site}</span>
    </div>
  );
}
