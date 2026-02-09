'use client';
import { useLiveTelemetry } from '@/modules/live/context/LiveTelemetryContext';
import { ConnectionErrorPage } from '@/modules/live/components/ConnectionErrorPage';

interface ConnectionWrapperProps {
  children: React.ReactNode;
}

export function ConnectionWrapper({ children }: ConnectionWrapperProps) {
  const { isConnected, status } = useLiveTelemetry();

  // Show error page if connection failed or in error state
  if (status === 'ERROR' || (!isConnected && status === 'DISCONNECTED')) {
    return <ConnectionErrorPage />;
  }

  // Show normal app content when connected or connecting
  return <>{children}</>;
}