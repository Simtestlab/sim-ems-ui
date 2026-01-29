/**
 * Component for role-based conditional rendering
 */

import { ReactNode } from 'react';
import { usePermissions } from '@/auth/usePermissions';

interface ProtectedFeatureProps {
  children: ReactNode;
  requiredPermission?: 
    | 'isSuperAdmin'
    | 'isOrgAdmin'
    | 'isSiteManager'
    | 'canManageUsers'
    | 'canControlDevices'
    | 'canViewAnalytics'
    | 'canModifySettings'
    | 'canViewAllOrganizations'
    | 'canManageOrganizations';
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on user permissions
 * 
 * @example
 * <ProtectedFeature requiredPermission="canManageUsers">
 *   <button>Manage Users</button>
 * </ProtectedFeature>
 */
export default function ProtectedFeature({
  children,
  requiredPermission,
  fallback = null,
}: ProtectedFeatureProps) {
  const permissions = usePermissions();

  // If no permission specified, just check if user exists
  if (!requiredPermission) {
    return permissions.user ? <>{children}</> : <>{fallback}</>;
  }

  // Check the required permission
  const hasPermission = permissions[requiredPermission];

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
