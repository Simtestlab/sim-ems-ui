export interface SiteConfig {
  id: string;
  name: string;
  wsUrl: string;
}

export const SITE_CONFIG: SiteConfig[] = [
  {
    id: 'ems_sim_01',
    name: 'Alpha',
    wsUrl: 'ws://localhost:8001/ws/dashboard/ems_sim_01',
  },
  {
    id: 'ems_sim_02',
    name: 'Beta',
    wsUrl: 'ws://localhost:8001/ws/dashboard/ems_sim_02',
  },
];

/**
 * Get site configuration by site ID
 * @param id - The site ID to look up
 * @returns SiteConfig if found, undefined otherwise
 */
export function getSiteConfig(id: string): SiteConfig | undefined {
  return SITE_CONFIG.find(site => site.id === id);
}

/**
 * Get all available site IDs
 * @returns Array of all site IDs
 */
export function getAllSiteIds(): string[] {
  return SITE_CONFIG.map(site => site.id);
}

/**
 * Get all available sites
 * @returns Array of all site configurations
 */
export function getAllSites(): SiteConfig[] {
  return SITE_CONFIG;
}