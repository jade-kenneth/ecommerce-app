'use client';

import React, { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}
const Sidebar = dynamic(() => import('./Sidebar').then((mod) => mod.Sidebar), {
  ssr: false,
});
export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-dvh bg-background md:h-screen">
      <Sidebar className="hidden md:flex md:w-72 md:shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Admin
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                Management Panel
              </p>
            </div>

            <button
              type="button"
              aria-expanded={isSidebarOpen}
              aria-controls="admin-mobile-sidebar"
              aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground shadow-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-muted/30 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div
            id="admin-mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="relative h-full w-[min(86vw,20rem)] shadow-2xl"
          >
            <Sidebar
              className="h-full min-h-0 w-full p-5 sm:p-6"
              onNavigate={() => setIsSidebarOpen(false)}
            />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
