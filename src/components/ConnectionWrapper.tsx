'use client';
import { useLiveTelemetry } from '@/modules/live/context/LiveTelemetryContext';
import { ConnectionErrorPage } from '@/modules/live/components/ConnectionErrorPage';

interface ConnectionWrapperProps {
  children: React.ReactNode;
}

export function ConnectionWrapper({ children }: ConnectionWrapperProps) {
  const { isConnected } = useLiveTelemetry();

  // Show universal connection error page if WebSocket is disconnected
  if (!isConnected) {
    return <ConnectionErrorPage />;
  }

  // Show normal app content when connected
  return <>{children}</>;
}