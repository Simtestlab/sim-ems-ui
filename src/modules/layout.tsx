import React from 'react';
import { Header } from '@/components/Header';
import { SiteTabs } from '@/components/SiteTabs';
import Footer from '@/components/Footer';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 flex flex-col flex-1 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <Header />
        <SiteTabs />
      </div>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">{children}</main>

      <Footer />
    </div>
  );
}
