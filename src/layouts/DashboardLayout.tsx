import React from 'react';
import { DashboardHeader, SiteTabs } from '@/modules/dashboard';
import Footer from '@/modules/dashboard/components/Footer';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 flex flex-col flex-1 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <DashboardHeader />
        <SiteTabs />
      </div>

      <main className="flex-1 h-full overflow-auto bg-white">{children}</main>

      <Footer />
    </div>
  );
}
