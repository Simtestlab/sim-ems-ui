export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/monitor/overview',
  pv: '/monitor/pv',
  pvDetails: (id?: string) => `/monitor/pv/details${id ? `?id=${id}` : ''}`,
  alerts: '/monitor/alerts',
  settings: '/settings',
} as const
