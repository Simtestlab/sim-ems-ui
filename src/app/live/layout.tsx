import React from 'react';
import LivePageLayout from '@/modules/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LivePageLayout>{children}</LivePageLayout>;
}
