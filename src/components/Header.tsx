'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { LogoutIcon } from '@/components/LogoutIcon';

export function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const siteParam = searchParams?.get('site');

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

  const buildHref = (p: string) => (siteParam ? `${p}?site=${encodeURIComponent(siteParam)}` : p);
  const isActive = (p: string) => pathname === p || (p === '/live' && pathname === '/live');

  return (
    <header className="bg-white h-12">
      <div className="flex items-center justify-between px-0 h-12">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Simtestlab EMS Logo"
            width={20}
            height={20}
            className="object-contain w-5 h-5 md:w-6 md:h-6"
          />
          <span className="text-sm font-semibold text-gray-800">Sim-EMS</span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.path}
                href={buildHref(link.path)}
                className={`text-xs ${isActive(link.path) ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1 rounded-md hover:bg-gray-50"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-0 hover:bg-gray-50 rounded-full p-1 transition-colors"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
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
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-40 border-b border-gray-200">
          <div className="px-4 py-2 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                href={buildHref(link.path)}
                className={`py-2 px-2 text-sm ${isActive(link.path) ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-gray-900'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
