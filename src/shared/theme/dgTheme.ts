/**
 * Diesel Generator (DG) theme tokens.
 * Used by any DG-specific styled components.
 */
export const dgTheme = {
  id: 'dg' as const,

  // Card
  cardBorder: '#e8edf5',
  cardBackground: 'linear-gradient(180deg, #fafbfd 0%, #ffffff 100%)',

  // Typography
  titleColor: '#0b1220',
  subtitleColor: '#6b788c',

  // Dividers
  separatorColor: '#eef0f5',

  // Avatar / icon container
  avatarBorder: '#eef0f8',
  avatarBackground: '#f5f6fb',

  // Status badge
  statusBackground: '#f0f4fc',
  statusBorder: '#d0d8f0',
  statusText: '#3355bb',
  statusDot: '#4466cc',

  // Metric tiles
  metricBackground: '#fafbfd',
  metricBorder: '#eef0f8',
  metricLabel: '#8da0ba',
  metricUnit: '#8da0ba',
  metricIcon: '#c0ccee',

  // Tailwind utility classes
  metricRing: 'ring-[#d0d8f0]',
  metricShadow: 'shadow-[0_8px_20px_rgba(50,80,200,0.06)]',

  // Sidebar / nav accent
  accent: '#3355bb',
  primary: '#4466cc',
  background: '#f5f7fa',
} as const

export type DGTheme = typeof dgTheme
