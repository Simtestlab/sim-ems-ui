import AppWrapper from '@/components/AppWrapper';
import { RootPageLayout } from '@/components/RootPageLayout';
import ControllerPage from '@/modules/controller/pages/ControllerPage';

export default function Page() {
  return (
    <AppWrapper>
        <RootPageLayout>
          <ControllerPage />
        </RootPageLayout>
    </AppWrapper>
  );
}
