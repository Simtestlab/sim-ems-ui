export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  pv: '/pv',
  pvDetails: (id?: string) => `/pv/details${id ? `?id=${id}` : ''}`,
  analytics: '/analytics',
  alerts: '/alerts',
  settings: '/settings',
} as const
