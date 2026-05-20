export const STATUS_COLORS = {
  normal: { bg: '#effcf5', border: '#bcefcf', text: '#29c77c', dot: '#26c281' },
  warning: { bg: '#fff7ed', border: '#fed7aa', text: '#f59e0b', dot: '#f59e0b' },
  error: { bg: '#fef2f2', border: '#fecaca', text: '#ef4444', dot: '#ef4444' },
  offline: { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280', dot: '#6b7280' },
} as const

export const DEVICE_STATUSES = [
  'normal',
  'standby',
  'shutdown',
  'alarm',
  'fault',
  'communicationLoss',
] as const

export type DeviceStatus = typeof DEVICE_STATUSES[number]
