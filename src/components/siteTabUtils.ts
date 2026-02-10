export const DATA_FRESHNESS_THRESHOLD = 15000;

export type ConnectionHealth = 'healthy' | 'stale' | 'disconnected';

export function getConnectionHealthFromState(siteState: any, currentTime: number): ConnectionHealth {
  if (!siteState || !siteState.isConnected) return 'disconnected';
  if (!siteState.lastUpdateTime) return 'stale';

  const lastUpdate = new Date(siteState.lastUpdateTime).getTime();
  if (currentTime - lastUpdate > DATA_FRESHNESS_THRESHOLD) return 'stale';

  return 'healthy';
}

export function getStatusColor(health: ConnectionHealth): string {
  switch (health) {
    case 'healthy':
      return 'bg-green-500';
    case 'stale':
      return 'bg-red-500';
    case 'disconnected':
      return 'bg-gray-400';
  }
}

export function getStatusAnimation(health: ConnectionHealth): string {
  return health === 'healthy' ? 'pulse' : '';
}

export function getStatusTitle(health: ConnectionHealth): string {
  switch (health) {
    case 'healthy':
      return 'Connected - Receiving data';
    case 'stale':
      return 'Connected - No recent data';
    case 'disconnected':
      return 'Disconnected';
  }
}