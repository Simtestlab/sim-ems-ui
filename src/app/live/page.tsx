import PageShell from "@/components/AppWrapper";
import { LivePage } from "@/modules/live/pages/LivePage";

export default function LiveRoute() {
  return (
    <PageShell>
      <LivePage />
    </PageShell>
  );
}