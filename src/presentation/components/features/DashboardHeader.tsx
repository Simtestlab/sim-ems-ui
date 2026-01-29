'use client';

import Image from 'next/image';
import { useAuth } from '@/auth/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function DashboardHeader() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Simtestlab Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Simtestlab EMS</h1>
              <p className="text-xs text-gray-600">Energy Management System</p>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
                <div className="h-4 w-4 bg-gray-300 rounded" />
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <User size={16} className="text-gray-600" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{user.full_name || user.username}</div>
                    <div className="text-xs text-gray-500">
                      {user.role_display}
                      {user.organization && ` • ${user.organization.name}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
