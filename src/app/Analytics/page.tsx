import { Suspense } from 'react';
import AnalyticsPage from '@/modules/analytics/pages/AnalyticsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsPage />
    </Suspense>
  );
}