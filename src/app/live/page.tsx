import { Suspense } from "react";
import { RootPageLayout } from "@/components/RootPageLayout";
import { LivePage } from "@/modules/live/pages/LivePage";

export default function LiveRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RootPageLayout>
        <LivePage />
      </RootPageLayout>
    </Suspense>
  );
}