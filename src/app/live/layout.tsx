import React from 'react';
import PageLayout from '@/modules/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
