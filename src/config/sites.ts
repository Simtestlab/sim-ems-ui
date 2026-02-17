export interface SiteConfig {
  id: string;
  name: string;
  wsUrl: string;
  lat: number;   
  lng: number;   
  capacity: number;
}

const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8001/ws/dashboard';
const ALPHA_ID = process.env.NEXT_PUBLIC_ALPHA_ID || 'device_01_id';
const BETA_ID = process.env.NEXT_PUBLIC_BETA_ID || 'device_02_id';

export const SITE_CONFIG: SiteConfig[] = [
  {
    id: ALPHA_ID,
    name: 'Alpha',
    wsUrl: `${WS_BASE}/${ALPHA_ID}`,
    lat: 13.0827,
    lng: 80.2707,
    capacity: 15,
  },
  {
    id: BETA_ID,
    name: 'Beta',
    wsUrl: `${WS_BASE}/${BETA_ID}`, 
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