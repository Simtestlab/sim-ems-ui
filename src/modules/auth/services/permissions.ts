/**
 * Permission utilities for role-based access control
 */

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'SITE_MANAGER'
  | 'OPERATOR'
  | 'TECHNICIAN'
  | 'DEVELOPER'
  | 'SUPPORT'
  | 'VIEWER';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  role_display: string;
  organization: {
    id: string;
    name: string;
  } | null;
}

/**
 * Check if user is a Super Admin
 */
export function isSuperAdmin(user: User | null): boolean {
  return user?.role === 'SUPER_ADMIN';
}

/**
 * Check if user is an Organization Admin or higher
 */
export function isOrgAdmin(user: User | null): boolean {
  return user?.role === 'SUPER_ADMIN' || user?.role === 'ORG_ADMIN';
}

/**
 * Check if user is a Site Manager or higher
 */
export function isSiteManager(user: User | null): boolean {
  return (
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'ORG_ADMIN' ||
    user?.role === 'SITE_MANAGER'
  );
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(user: User | null): boolean {
  return isOrgAdmin(user);
}

/**
 * Check if user can control devices (start/stop equipment, change setpoints)
 */
export function canControlDevices(user: User | null): boolean {
  return (
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'ORG_ADMIN' ||
    user?.role === 'SITE_MANAGER' ||
    user?.role === 'OPERATOR'
  );
}

/**
 * Check if user can view analytics and reports
 */
export function canViewAnalytics(user: User | null): boolean {
  // All roles can view analytics
  return !!user;
}

/**
 * Check if user can modify system settings
 */
export function canModifySettings(user: User | null): boolean {
  return isSiteManager(user);
}

/**
 * Check if user can view all organizations (super admin only)
 */
export function canViewAllOrganizations(user: User | null): boolean {
  return isSuperAdmin(user);
}

/**
 * Check if user can create/edit organizations
 */
export function canManageOrganizations(user: User | null): boolean {
  return isSuperAdmin(user);
}

/**
 * Get user's accessible features based on role
 */
export function getUserFeatures(user: User | null): {
  dashboard: boolean;
  analytics: boolean;
  deviceControl: boolean;
  userManagement: boolean;
  settings: boolean;
  adminPanel: boolean;
} {
  return {
    dashboard: !!user,
    analytics: canViewAnalytics(user),
    deviceControl: canControlDevices(user),
    userManagement: canManageUsers(user),
    settings: canModifySettings(user),
    adminPanel: isSuperAdmin(user),
  };
}

/**
 * Role display names
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Organization Admin',
  SITE_MANAGER: 'Site Manager',
  OPERATOR: 'Operator',
  TECHNICIAN: 'Technician',
  DEVELOPER: 'Developer',
  SUPPORT: 'Support',
  VIEWER: 'Viewer',
};

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Full system access, can manage all organizations',
  ORG_ADMIN: 'Can manage users and settings within their organization',
  SITE_MANAGER: 'Can manage devices and settings for assigned sites',
  OPERATOR: 'Can control devices and view real-time data',
  TECHNICIAN: 'Can view data and perform maintenance tasks',
  DEVELOPER: 'Can access API and integration features',
  SUPPORT: 'Can view data to provide customer support',
  VIEWER: 'Read-only access to dashboards and reports',
};
