import React from 'react';

import dynamic from 'next/dynamic';

interface LayoutProps {
  children: React.ReactNode;
}
const Sidebar = dynamic(() => import('./Sidebar').then((mod) => mod.Sidebar), {
  ssr: false,
});
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-[80%]">
        {/* Header */}

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-muted/30 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
