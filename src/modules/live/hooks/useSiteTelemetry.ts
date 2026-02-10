'use client';
import { useEffect, useCallback } from 'react';
import { useTelemetryStore, type TelemetryStatus } from '../../../store/telemetryStore';
import type { MicrogridTelemetry } from '../types/telemetry';
import { getSiteConfig } from '../../../config/sites';

interface SiteTelemetryResult {
  telemetry: MicrogridTelemetry | null;
  isConnected: boolean;
  status: TelemetryStatus;
  lastUpdateTime: Date | null;
  connect: () => void;
  disconnect: () => void;
}

const DEFAULT_SITE_DATA = {
  latestTelemetry: null,
  isConnected: false,
  status: 'DISCONNECTED' as TelemetryStatus,
  lastUpdateTime: null,
  reconnectAttempts: 0,
};

export function useSiteTelemetry(siteId: string): SiteTelemetryResult {
  const connectStore = useTelemetryStore((state) => state.connect);
  const disconnectStore = useTelemetryStore((state) => state.disconnect);
  
  // Get site configuration
  const siteConfig = getSiteConfig(siteId);
  
  // Use separate selectors to avoid creating new objects
  const telemetry = useTelemetryStore((state) => state.sites[siteId]?.latestTelemetry ?? null);
  const isConnected = useTelemetryStore((state) => state.sites[siteId]?.isConnected ?? false);
  const status = useTelemetryStore((state) => state.sites[siteId]?.status ?? 'DISCONNECTED');
  const lastUpdateTime = useTelemetryStore((state) => state.sites[siteId]?.lastUpdateTime ?? null);

  const connect = useCallback(() => {
    if (siteConfig) {
      connectStore(siteId, siteConfig.wsUrl);
    } else {
      console.error(`Site configuration not found for siteId: ${siteId}`);
    }
  }, [connectStore, siteId, siteConfig]);

  const disconnect = useCallback(() => {
    disconnectStore(siteId);
  }, [disconnectStore, siteId]);

  // Auto-connect on mount or when siteId changes
  useEffect(() => {
    if (siteConfig) {
      connect();
    }

    // Cleanup function - but don't disconnect immediately to allow background data collection
    // Only disconnect when component unmounts and there are no other consumers
    return () => {
      // For now, we'll let the store manage cleanup
      // In the future, you might implement reference counting here
    };
  }, [siteId, siteConfig, connect]);

  return {
    telemetry,
    isConnected,
    status,
    lastUpdateTime,
    connect,
    disconnect,
  };
}