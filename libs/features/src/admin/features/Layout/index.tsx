import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

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
