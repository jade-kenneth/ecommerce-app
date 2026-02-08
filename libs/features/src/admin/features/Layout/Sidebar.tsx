'use client';

import { Home, LogOut, Package, Settings, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { logout } from '~/providers/AuthProvider';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: 'Manage Products',
    href: '/admin/manage-products',
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    label: 'Manage Orders',
    href: '/admin/manage-orders',
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings',
    href: '/admin/settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const globalStore = useGlobalStore((state) => state.authenticate);

  return (
    <aside className="w-[20%] bg-gradient-to-b bg-cyan-600 to-[bg-cyan-700] text-white min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            📦
          </div>
          <span>AmyStore</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 border-2 border-white text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
        onClick={async () => {
          await logout();
          globalStore.setIsAuthenticated(false);
          router.push('/');
        }}
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
}
