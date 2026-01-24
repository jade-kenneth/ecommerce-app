import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  userName?: string;
  userEmail?: string;
}

export function Layout({
  children,
  headerTitle,
  headerSubtitle,
  userName,
  userEmail,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-[80%]">
        {/* Header */}
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          userName={userName}
          userEmail={userEmail}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-muted/30 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
