'use client';
import { create } from 'zustand';
import { MicrogridTelemetry } from '@/modules/live/types/telemetry';

export type TelemetryStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

interface SiteTelemetryState {
  latestTelemetry: MicrogridTelemetry | null;
  isConnected: boolean;
  status: TelemetryStatus;
  lastUpdateTime: Date | null;
  reconnectAttempts: number;
}

interface TelemetryStore {
  sites: Record<string, SiteTelemetryState>;
  connect: (siteId: string, wsUrl: string) => void;
  disconnect: (siteId: string) => void;
  disconnectAll: () => void;
  updateTelemetry: (siteId: string, telemetry: MicrogridTelemetry) => void;
  updateStatus: (siteId: string, status: TelemetryStatus, isConnected: boolean) => void;
  incrementReconnectAttempts: (siteId: string) => void;
  resetReconnectAttempts: (siteId: string) => void;
}

const socketRegistry = new Map<string, WebSocket>();
const reconnectTimeouts = new Map<string, NodeJS.Timeout>();

const DEFAULT_SITE_STATE: SiteTelemetryState = {
  latestTelemetry: null,
  isConnected: false,
  status: 'DISCONNECTED',
  lastUpdateTime: null,
  reconnectAttempts: 0,
};

const MAX_RECONNECT_ATTEMPTS = 10;

const getReconnectDelay = (attempts: number): number => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const delay = Math.min(baseDelay * Math.pow(2, attempts), maxDelay);
  return delay + Math.random() * 1000;
};

export const useTelemetryStore = create<TelemetryStore>((set, get) => ({
  sites: {},

  updateTelemetry: (siteId: string, telemetry: MicrogridTelemetry) => {
    set((state) => ({
      sites: {
        ...state.sites,
        [siteId]: {
          ...state.sites[siteId],
          latestTelemetry: telemetry,
          lastUpdateTime: new Date(),
        },
      },
    }));
  },

  updateStatus: (siteId: string, status: TelemetryStatus, isConnected: boolean) => {
    set((state) => ({
      sites: {
        ...state.sites,
        [siteId]: {
          ...state.sites[siteId],
          status,
          isConnected,
        },
      },
    }));
  },

  incrementReconnectAttempts: (siteId: string) => {
    set((state) => ({
      sites: {
        ...state.sites,
        [siteId]: {
          ...state.sites[siteId],
          reconnectAttempts: state.sites[siteId]?.reconnectAttempts + 1 || 1,
        },
      },
    }));
  },

  resetReconnectAttempts: (siteId: string) => {
    set((state) => ({
      sites: {
        ...state.sites,
        [siteId]: {
          ...state.sites[siteId],
          reconnectAttempts: 0,
        },
      },
    }));
  },

  connect: (siteId: string, wsUrl: string) => {
    const { sites, updateStatus, updateTelemetry, incrementReconnectAttempts, resetReconnectAttempts } = get();
    
    // Initialize site state if it doesn't exist
    if (!sites[siteId]) {
      set((state) => ({
        sites: {
          ...state.sites,
          [siteId]: { ...DEFAULT_SITE_STATE },
        },
      }));
    }

    // Check if already connecting or connected for this specific site
    const existingSocket = socketRegistry.get(siteId);
    if (existingSocket?.readyState === WebSocket.CONNECTING || 
        existingSocket?.readyState === WebSocket.OPEN) {
      console.log(`WebSocket for site ${siteId} already connecting/connected`);
      return;
    }

    // Clean up any existing socket for this site
    if (existingSocket) {
      existingSocket.close(1000, 'Replacing connection');
      socketRegistry.delete(siteId);
    }

    try {
      console.log(`Attempting to connect to WebSocket for site ${siteId}: ${wsUrl}`);
      updateStatus(siteId, 'CONNECTING', false);

      const ws = new WebSocket(wsUrl);
      socketRegistry.set(siteId, ws);

      ws.onopen = () => {
        console.log(`WebSocket connected successfully for site ${siteId}: ${wsUrl}`);
        updateStatus(siteId, 'CONNECTED', true);
        resetReconnectAttempts(siteId);

        // Clear any pending reconnection attempts
        const timeoutId = reconnectTimeouts.get(siteId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          reconnectTimeouts.delete(siteId);
        }
      };

      ws.onmessage = (event) => {
        try {
          const telemetry: MicrogridTelemetry = JSON.parse(event.data);
          updateTelemetry(siteId, telemetry);
        } catch (error) {
          console.error(`Failed to parse WebSocket message for site ${siteId}:`, {
            error,
            message: error instanceof Error ? error.message : 'Unknown parse error',
            rawData: event.data,
          });
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket connection closed for site ${siteId}:`, {
          code: event.code,
          reason: event.reason || 'No reason provided',
          wasClean: event.wasClean,
          url: wsUrl,
        });
        updateStatus(siteId, 'DISCONNECTED', false);
        socketRegistry.delete(siteId);

        const currentState = get().sites[siteId];
        const reconnectAttempts = currentState?.reconnectAttempts || 0;

        // Only attempt reconnection if it wasn't a manual disconnection
        if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = getReconnectDelay(reconnectAttempts);
          console.log(`Reconnecting site ${siteId} in ${(delay/1000).toFixed(1)}s (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);

          const timeoutId = setTimeout(() => {
            incrementReconnectAttempts(siteId);
            get().connect(siteId, wsUrl);
          }, delay);
          
          reconnectTimeouts.set(siteId, timeoutId);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error(`Max reconnection attempts reached for site ${siteId}. Connection abandoned.`);
          updateStatus(siteId, 'ERROR', false);
        }
      };

      ws.onerror = (error) => {
        console.log(`WebSocket connection error for site ${siteId} - will be handled by error page`);
      };

    } catch (error) {
      console.error(`Failed to create WebSocket connection for site ${siteId}:`, {
        url: wsUrl,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      updateStatus(siteId, 'ERROR', false);
    }
  },

  disconnect: (siteId: string) => {
    const timeoutId = reconnectTimeouts.get(siteId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      reconnectTimeouts.delete(siteId);
    }

    const socket = socketRegistry.get(siteId);
    if (socket) {
      socket.close(1000, 'Manual disconnection');
      socketRegistry.delete(siteId);
    }

    const { updateStatus, resetReconnectAttempts } = get();
    updateStatus(siteId, 'DISCONNECTED', false);
    resetReconnectAttempts(siteId);
  },

  disconnectAll: () => {
    const { disconnect } = get();
    // Disconnect all sites
    socketRegistry.forEach((_, siteId) => {
      disconnect(siteId);
    });
    // Clear any remaining timeouts
    reconnectTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    reconnectTimeouts.clear();
  },
}));

// Handle page visibility changes - reconnect when page becomes visible
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const store = useTelemetryStore.getState();
      Object.keys(store.sites).forEach((siteId) => {
        const siteState = store.sites[siteId];
        if (!siteState.isConnected && siteState.status !== 'ERROR') {
          console.log(`Page became visible, attempting to reconnect site ${siteId}...`);
          // Note: We would need the wsUrl here. This is a limitation.
          // In practice, you might store the wsUrl in the site state or handle this differently.
        }
      });
    }
  });
}