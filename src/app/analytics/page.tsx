import { Suspense } from 'react';
import AppWrapper from '@/components/AppWrapper';
import { RootPageLayout } from '@/components/RootPageLayout';
import AnalyticsPage from '@/modules/analytics/pages/AnalyticsPage';

export default function Page() {
  return (
    <AppWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <RootPageLayout>
          <AnalyticsPage />
        </RootPageLayout>
      </Suspense>
    </AppWrapper>
  );
}
