"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LiveTelemetryProvider } from "@/modules/live/context/LiveTelemetryContext";
import { ConnectionWrapper } from "@/components/ConnectionWrapper";
import { useNavStore } from "@/store/useNavStore";

function ApplicationLoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Loading Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>

          {/* Loading Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Application...
          </h1>
          <p className="text-gray-600 mb-6">
            Initializing EMS Dashboard
          </p>

          {/* Loading Progress */}
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Application:</span>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-blue-400 animate-pulse"></div>
                <span className="font-medium">Loading</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  const { selectedSite } = useNavStore();
  
  return (
    <div className="bg-white min-h-screen flex flex-col">
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Only show loading on the very first app initialization
  useEffect(() => {
    // Check if this is the initial page load (not navigation)
    if (document.readyState === 'complete') {
      // Page is already loaded
      setIsInitialLoad(false);
    } else {
      // Wait for page to finish loading
      const handleLoad = () => setIsInitialLoad(false);
      window.addEventListener('load', handleLoad);
      
      // Fallback timer in case load event doesn't fire
      const timer = setTimeout(() => setIsInitialLoad(false), 2000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timer);
      };
    }
  }, []); // Empty dependency array - only run once on mount

  // Do not render the shell for the login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show application loading screen only during initial app load
  if (isInitialLoad) {
    return <ApplicationLoadingScreen />;
  }

  return <PageShell>{children}</PageShell>;
}

// Export as both named and default for compatibility
export default AppWrapper;
