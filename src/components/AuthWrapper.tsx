'use client';

import { useAuth } from '@/modules/auth/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      router.push('/login');
      return;
    }

    // If user is authenticated and trying to access login page
    if (user && isPublicRoute) {
      router.push('/live');
      return;
    }
  }, [user, isLoading, isPublicRoute, router]);

  // Show loading screen while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Loading...
            </h1>
            <p className="text-gray-600 mb-6">
              Authenticating user
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated and on protected route, don't render children
  // (router.push above will handle redirect)
  if (!user && !isPublicRoute) {
    return null;
  }

  // If user is authenticated and on login page, don't render children
  // (router.push above will handle redirect)
  if (user && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}