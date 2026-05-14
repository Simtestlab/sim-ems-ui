/**
 * EV (Electric Vehicle) theme tokens.
 */
export const evTheme = {
  id: 'ev' as const,

  // Card
  cardBorder: '#b8e8d8',
  cardBackground: 'linear-gradient(180deg, #f5fcf9 0%, #ffffff 100%)',

  // Typography
  titleColor: '#0b1a16',
  subtitleColor: '#5d8070',

  // Dividers
  separatorColor: '#ddf0e8',

  // Avatar / icon container
  avatarBorder: '#cceee0',
  avatarBackground: '#f0faf5',

  // Status badge
  statusBackground: '#e4f9ef',
  statusBorder: '#82dfb8',
  statusText: '#0a7855',
  statusDot: '#0a7855',

  // Metric tiles
  metricBackground: '#f3fbf7',
  metricBorder: '#c8ead9',
  metricLabel: '#6a9882',
  metricUnit: '#6a9882',
  metricIcon: '#3dc893',

  // Tailwind utility classes
  metricRing: 'ring-[#a8e4c6]',
  metricShadow: 'shadow-[0_8px_20px_rgba(10,120,85,0.08)]',

  // Sidebar / nav accent
  accent: '#0a7855',
  primary: '#10b981',
  background: '#f5f7fa',
} as const

export type EVTheme = typeof evTheme
