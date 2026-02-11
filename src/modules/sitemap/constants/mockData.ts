import { SiteConfig } from '@/config/sites';

export interface ExtendedSiteConfig extends SiteConfig {
  lat: number;
  lng: number;
  locationName: string;
  capacity: number;
  color: string;
}

export const MOCK_SITES: ExtendedSiteConfig[] = [
  {
    id: 'site-1',
    name: 'Site 1',
    wsUrl: 'ws://localhost:8080/nilgiris',
    lat: 11.4102,
    lng: 76.6950,
    locationName: 'Nilgiris, Tamil Nadu, IN',
    capacity: 20,
    color: '#f97316'
  },
  {
    id: 'site-2',
    name: 'Site 2',
    wsUrl: 'ws://localhost:8080/alpha',
    lat: 13.0827,
    lng: 80.2707,
    locationName: 'Chennai, TN',
    capacity: 10,
    color: '#3b82f6'
  },
  {
    id: 'site-3',
    name: 'Site 3',
    wsUrl: 'ws://localhost:8080/beta',
    lat: 12.9716,
    lng: 77.5946,
    locationName: 'Bangalore, KA',
    capacity: 15,
    color: '#10b981'
  },
  {
    id: 'site-4',
    name: 'Site 4',
    wsUrl: 'ws://localhost:8080/delta',
    lat: 17.3850,
    lng: 78.4867,
    locationName: 'Hyderabad, TS',
    capacity: 6,
    color: '#a855f7'
  }
];