export interface SiteConfig {
  id: string;
  name: string;
  wsUrl: string;
  lat: number;   // Added for GPS emulation
  lng: number;   // Added for GPS emulation
  capacity: number;
}

export const SITE_CONFIG: SiteConfig[] = [
  {
    id: 'device_01_id',
    name: 'Alpha',
    wsUrl: 'ws://localhost:8001/ws/dashboard/device_01_id',
    lat: 13.0827,
    lng: 80.2707,
    capacity: 15,
  },
  {
    id: 'device_02_id',
    name: 'Beta',
    wsUrl: 'ws://localhost:8001/ws/dashboard/device_02_id',
    lat: 12.9716,
    lng: 77.5946,
    capacity: 5,
  },
];

export function getSiteConfig(id: string): SiteConfig | undefined {
  return SITE_CONFIG.find(site => site.id === id);
}

export function getAllSiteIds(): string[] {
  return SITE_CONFIG.map(site => site.id);
}

export function getAllSites(): SiteConfig[] {
  return SITE_CONFIG;
}