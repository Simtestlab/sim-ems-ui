import React, { Suspense } from 'react';
import AppWrapper from '@/components/AppWrapper';
import { RootPageLayout } from '@/components/RootPageLayout';
import AlertsPage from '@/modules/alerts/pages/AlertPage';

export default function Page() {
  return (
    <AppWrapper>
        <RootPageLayout>
          <AlertsPage />
        </RootPageLayout>
    </AppWrapper>
  );
}

