import React, { Suspense } from 'react';
import AlertsPage from '@/modules/alerts/pages/AlertPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlertsPage />
    </Suspense>
  );
}
