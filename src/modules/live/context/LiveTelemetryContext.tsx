'use client';
import React, { createContext, useContext } from 'react';
import { MicrogridTelemetry } from '../types/telemetry';
import { useSiteTelemetry } from '../hooks/useSiteTelemetry';
import type { TelemetryStatus } from '../../../store/telemetryStore';

interface LiveTelemetryContextType {
    latestTelemetry: MicrogridTelemetry | null;
    isConnected: boolean;
    status: TelemetryStatus;
    lastUpdateTime: Date | null;
    connect: () => void;
    disconnect: () => void;
}

const LiveTelemetryContext = createContext<LiveTelemetryContextType | undefined>(undefined);

interface LiveTelemetryProviderProps {
    children: React.ReactNode;
    siteId: string;
}

export function LiveTelemetryProvider({
    children,
    siteId
}: LiveTelemetryProviderProps) {
    const {
        telemetry,
        isConnected,
        status,
        lastUpdateTime,
        connect,
        disconnect
    } = useSiteTelemetry(siteId);

    const value: LiveTelemetryContextType = {
        latestTelemetry: telemetry,
        isConnected,
        status,
        lastUpdateTime,
        connect,
        disconnect
    };

    return (
        <LiveTelemetryContext.Provider value={value}>
            {children}
        </LiveTelemetryContext.Provider>
    );
}

export function useLiveTelemetry(): LiveTelemetryContextType {
    const context = useContext(LiveTelemetryContext);
    console.log("useLiveTelemetry - context value:", context);
    if (!context) {
        throw new Error('useLiveTelemetry must be used within a LiveTelemetryProvider');
    }
    return context;
}