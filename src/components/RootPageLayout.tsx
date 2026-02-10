'use client';

import { Header } from '@/components/Header';
import { SiteTabs } from '@/components/SiteTabs';
import Footer from '@/components/Footer';

interface RootPageLayoutProps {
  children: React.ReactNode;
}

export function RootPageLayout({ children }: RootPageLayoutProps) {
  return (
    <div className="bg-slate-50 flex flex-col min-h-screen max-h-screen overflow-hidden">
      {/* Header Section - Fixed height */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <Header />
        <SiteTabs />
      </div>

      {/* Main Content - Flexible with viewport constraints */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
        {children}
      </main>

      {/* Footer - Fixed height */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}