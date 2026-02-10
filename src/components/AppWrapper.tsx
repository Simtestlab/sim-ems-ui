"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { LiveTelemetryProvider } from "@/modules/live/context/LiveTelemetryContext";
import { ConnectionWrapper } from "@/components/ConnectionWrapper";
import { AllSitesConnector } from "@/components/AllSitesConnector";
import { useNavStore } from "@/store/useNavStore";

function PageShell({ children }: { children: React.ReactNode }) {
  const { selectedSite } = useNavStore();
  
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <AllSitesConnector/>
      <LiveTelemetryProvider siteId={selectedSite}>
        <ConnectionWrapper>
          {children}
        </ConnectionWrapper>
      </LiveTelemetryProvider>
    </div>
  );
}

interface Props {
  children: React.ReactNode;
}

export function AppWrapper({ children }: Props) {
  const pathname = usePathname();

  // Do not render telemetry shell for the login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return <PageShell>{children}</PageShell>;
}

// Export as both named and default for compatibility
export default AppWrapper;
