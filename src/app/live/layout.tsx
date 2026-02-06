import React from 'react';
import PageLayout from '@/app/shared/PageLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
