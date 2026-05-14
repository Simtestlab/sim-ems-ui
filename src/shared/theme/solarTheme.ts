/**
 * Solar / PV theme tokens.
 * Used by MonitoringCard (theme="pv") and any PV-specific styled components.
 */
export const solarTheme = {
  id: 'solar' as const,

  // Card
  cardBorder: '#dfeaf8',
  cardBackground: 'linear-gradient(180deg, #fbfdff 0%, #ffffff 100%)',

  // Typography
  titleColor: '#2c3b52',
  subtitleColor: '#9fb0c9',

  // Dividers
  separatorColor: '#edf3fb',

  // Avatar / icon container
  avatarBorder: '#eef4fb',
  avatarBackground: '#ffffff',

  // Status badge
  statusBackground: '#eef5ff',
  statusBorder: '#cde8ff',
  statusText: '#2f8cf0',
  statusDot: '#3b9cff',

  // Metric tiles
  metricBackground: '#ffffff',
  metricBorder: '#eff4fb',
  metricLabel: '#9cb0cb',
  metricUnit: '#9cb0cb',
  metricIcon: '#d9e9ff',

  // Tailwind utility classes (ring + shadow for highlighted state)
  metricRing: 'ring-[#dceffd]',
  metricShadow: 'shadow-[0_8px_20px_rgba(28,106,255,0.06)]',

  // Sidebar / nav accent
  accent: '#1890ff',
  primary: '#3b9cff',
  background: '#f5f7fa',
} as const

export type SolarTheme = typeof solarTheme
