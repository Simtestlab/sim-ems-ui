import { Suspense } from 'react';
import AppWrapper from '@/components/AppWrapper';
import { RootPageLayout } from '@/components/RootPageLayout';
import SiteMapPage from '@/modules/sitemap/pages/SiteMap';

export default function Page() {
  return (
    <AppWrapper>
        <RootPageLayout>
          <SiteMapPage />
        </RootPageLayout>
    </AppWrapper>
  );
}
