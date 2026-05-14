/**
 * Battery / PCS theme tokens.
 * Used by MonitoringCard (theme="pcs") and any BESS-specific styled components.
 */
export const batteryTheme = {
  id: 'battery' as const,

  // Card
  cardBorder: '#e6f7ef',
  cardBackground: 'linear-gradient(180deg, #fbfdfc 0%, #ffffff 100%)',

  // Typography
  titleColor: '#0b1220',
  subtitleColor: '#6b788c',

  // Dividers
  separatorColor: '#eef6f2',

  // Avatar / icon container
  avatarBorder: '#eef9f3',
  avatarBackground: '#ffffff',

  // Status badge
  statusBackground: '#ecfdf4',
  statusBorder: '#bbf0d0',
  statusText: '#0b8a4a',
  statusDot: '#0b8a4a',

  // Metric tiles
  metricBackground: '#fbfefe',
  metricBorder: '#eef6f2',
  metricLabel: '#8da0ba',
  metricUnit: '#8da0ba',
  metricIcon: '#8fd7b0',

  // Tailwind utility classes
  metricRing: 'ring-[#d6f5e5]',
  metricShadow: 'shadow-[0_8px_20px_rgba(11,138,74,0.08)]',

  // Sidebar / nav accent
  accent: '#0b8a4a',
  primary: '#10b981',
  background: '#f5f7fa',
} as const

export type BatteryTheme = typeof batteryTheme
