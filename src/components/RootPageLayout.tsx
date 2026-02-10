'use client';

import { Header } from '@/components/Header';
import { SiteTabs } from '@/components/SiteTabs';
import Footer from '@/components/Footer';

interface RootPageLayoutProps {
  children: React.ReactNode;
}

export function RootPageLayout({ children }: RootPageLayoutProps) {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <Header />
        <SiteTabs />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}