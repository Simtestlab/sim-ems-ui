'use client';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { MicrogridTelemetry } from '../types/telemetry';

interface LiveTelemetryContextType {
    latestTelemetry: MicrogridTelemetry | null;
    isConnected: boolean;
    lastUpdateTime: Date | null;
    connect: () => void;
    disconnect: () => void;
}

const LiveTelemetryContext = createContext<LiveTelemetryContextType | undefined>(undefined);

interface LiveTelemetryProviderProps {
    children: React.ReactNode;
    wsUrl?: string;
}

const DEFAULT_WS_URL = 'wss://sim-ems-websocket.onrender.com/ws/dashboard/ems_sim_01';

export function LiveTelemetryProvider({
    children,
    wsUrl = DEFAULT_WS_URL
}: LiveTelemetryProviderProps) {
    const [latestTelemetry, setLatestTelemetry] = useState<MicrogridTelemetry | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 10;

    const getReconnectDelay = useCallback(() => {
        const baseDelay = 1000; // 1 second
        const maxDelay = 30000; // 30 seconds
        const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempts.current), maxDelay);
        return delay + Math.random() * 1000;
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.CONNECTING ||
            wsRef.current?.readyState === WebSocket.OPEN) {
            return; // Already connecting or connected
        }

        try {
            console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected successfully to:', wsUrl);
                setIsConnected(true);
                reconnectAttempts.current = 0;

                // Clear any pending reconnection attempts
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                try {
                    const telemetry: MicrogridTelemetry = JSON.parse(event.data);
                    setLatestTelemetry(telemetry);
                    setLastUpdateTime(new Date());
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', {
                        error: error,
                        message: error instanceof Error ? error.message : 'Unknown parse error',
                        rawData: event.data
                    });
                }
            };

            ws.onclose = (event) => {
                console.log('WebSocket connection closed:', {
                    code: event.code,
                    reason: event.reason || 'No reason provided',
                    wasClean: event.wasClean,
                    url: wsUrl
                });
                setIsConnected(false);
                wsRef.current = null;

                // Only attempt reconnection if it wasn't a manual disconnection
                if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                    const delay = getReconnectDelay();
                    console.log(`Reconnecting in ${(delay/1000).toFixed(1)}s (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts.current++;
                        connect();
                    }, delay);
                } else if (reconnectAttempts.current >= maxReconnectAttempts) {
                    console.error('Max reconnection attempts reached. Connection abandoned.');
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error occurred:', {
                    url: wsUrl,
                    readyState: wsRef.current?.readyState,
                    readyStateText: wsRef.current?.readyState === 0 ? 'CONNECTING' :
                                   wsRef.current?.readyState === 1 ? 'OPEN' :
                                   wsRef.current?.readyState === 2 ? 'CLOSING' :
                                   wsRef.current?.readyState === 3 ? 'CLOSED' : 'UNKNOWN',
                    attempts: reconnectAttempts.current,
                    error: error
                });
                setIsConnected(false);
            };

        } catch (error) {
            console.error('Failed to create WebSocket connection:', {
                url: wsUrl,
                error: error,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
            setIsConnected(false);
        }
    }, [wsUrl, getReconnectDelay]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close(1000, 'Manual disconnection');
            wsRef.current = null;
        }

        setIsConnected(false);
        reconnectAttempts.current = 0;
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        connect();

        // Cleanup on unmount
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    // Handle page visibility changes - reconnect when page becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !isConnected) {
                console.log('Page became visible, attempting to reconnect...');
                connect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [connect, isConnected]);

    const value: LiveTelemetryContextType = {
        latestTelemetry,
        isConnected,
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
    if (!context) {
        throw new Error('useLiveTelemetry must be used within a LiveTelemetryProvider');
    }
    return context;
}