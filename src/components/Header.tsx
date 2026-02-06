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
    <header className="bg-white h-12">
      <div className="flex items-center justify-between px-0 h-12">
        <div className="flex items-center gap-3">
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
              <button onClick={handleLogout} className="text-red-600">
                <LogoutIcon />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
