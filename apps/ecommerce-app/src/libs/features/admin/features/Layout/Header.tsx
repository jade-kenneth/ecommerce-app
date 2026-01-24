'use client';

import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  userName?: string;
  userEmail?: string;
}

export function Header({
  title = 'Welcome!',
  subtitle = "We're glad you're here",
  userName = 'Jadey Darunday',
  userEmail = 'jadey@gmail.com',
}: HeaderProps) {
  return (
    <header className="w-full bg-gradient-to-b bg-cyan-600 to-[bg-cyan-700] text-white px-8 py-6 flex items-center justify-between shadow-md">
      {/* Left content */}
      <div>
        <h1 className="text-2xl font-bold">
          {title}
          {subtitle && <span className="font-semibold"> {subtitle}</span>}
        </h1>
      </div>

      {/* Right content */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
          <Settings className="w-6 h-6" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/20">
          <div className="text-right">
            <p className="font-semibold text-sm">{userName}</p>
            <p className="text-xs text-white/70">{userEmail}</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-cyan-700">
            {userName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
        </div>
      </div>
    </header>
  );
}
