/**
 * React hook for checking user permissions
 */

import { useAuth } from '@/modules/auth/context/AuthContext';
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
} from '@/modules/auth/services/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const typedUser = user as User | null;

  return {
    user,
    isSuperAdmin: isSuperAdmin(typedUser),
    isOrgAdmin: isOrgAdmin(typedUser),
    isSiteManager: isSiteManager(typedUser),
    canManageUsers: canManageUsers(typedUser),
    canControlDevices: canControlDevices(typedUser),
    canViewAnalytics: canViewAnalytics(typedUser),
    canModifySettings: canModifySettings(typedUser),
    canViewAllOrganizations: canViewAllOrganizations(typedUser),
    canManageOrganizations: canManageOrganizations(typedUser),
    features: getUserFeatures(typedUser),
  };
}