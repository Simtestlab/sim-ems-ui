/**
 * React hook for checking user permissions
 */

import { useAuth } from './AuthContext';
import {
  isSuperAdmin,
  isOrgAdmin,
  isSiteManager,
  canManageUsers,
  canControlDevices,
  canViewAnalytics,
  canModifySettings,
  canViewAllOrganizations,
  canManageOrganizations,
  getUserFeatures,
} from './permissions';

export function usePermissions() {
  const { user } = useAuth();

  return {
    user,
    isSuperAdmin: isSuperAdmin(user),
    isOrgAdmin: isOrgAdmin(user),
    isSiteManager: isSiteManager(user),
    canManageUsers: canManageUsers(user),
    canControlDevices: canControlDevices(user),
    canViewAnalytics: canViewAnalytics(user),
    canModifySettings: canModifySettings(user),
    canViewAllOrganizations: canViewAllOrganizations(user),
    canManageOrganizations: canManageOrganizations(user),
    features: getUserFeatures(user),
  };
}
