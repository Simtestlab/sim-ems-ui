import React, { Suspense } from 'react';
import AppWrapper from '@/components/AppWrapper';
import { RootPageLayout } from '@/components/RootPageLayout';
import AlertsPage from '@/modules/alerts/pages/AlertPage';

export default function Page() {
  return (
    <AppWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <RootPageLayout>
          <AlertsPage />
        </RootPageLayout>
      </Suspense>
    </AppWrapper>
  );
}

