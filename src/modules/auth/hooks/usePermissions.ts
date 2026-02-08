/**
 * React hook for checking user permissions
 */

import { useAuth } from '../modules/auth/context/AuthContext';
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
  User,
} from './permissions';

export function usePermissions() {
  const { user } = useAuth();
  const typedUser = user as User | null;

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
