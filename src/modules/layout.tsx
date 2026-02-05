import React from 'react';
import { Header } from '@/modules/Live/components/Header/header';
import { SiteTabs } from '@/modules/Live/components/SiteTabs';
import Footer from '@/modules/dashboard/components/Footer';

export default function LivePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 flex flex-col flex-1 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <Header />
        <SiteTabs />
      </div>

      <main className="flex-1 h-full overflow-auto bg-white">{children}</main>

      <Footer />
    </div>
  );
}
