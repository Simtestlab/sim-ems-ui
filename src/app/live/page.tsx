import { Suspense } from "react";
import AppWrapper from "@/components/AppWrapper";
import { RootPageLayout } from "@/components/RootPageLayout";
import { LivePage } from "@/modules/live/pages/LivePage";

export default function LiveRoute() {
  return (
    <AppWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <RootPageLayout>
          <LivePage />
        </RootPageLayout>
      </Suspense>
    </AppWrapper>
  );
}