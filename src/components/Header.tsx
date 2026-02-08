'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { LogoutIcon } from '@/components/LogoutIcon';

export function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const links = [
    { label: 'Live', path: '/live' },
    { label: 'Site Map', path: '/sitemap' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Alerts', path: '/alerts' },
  ];

  const isActive = (p: string) => pathname === p;

  return (
    <header className="bg-white h-10">
      <div className="flex items-center justify-between px-3 h-12">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Simtestlab EMS Logo" width={20} height={20} />
          <span className="text-sm font-semibold text-gray-800">Sim-EMS</span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}   
                className={`text-xs ${
                  isActive(link.path)
                    ? 'text-green-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white flex items-center justify-center text-xs">
                {user?.first_name?.[0] || user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{user?.role_display}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogoutIcon />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
