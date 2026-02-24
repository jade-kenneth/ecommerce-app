'use client';

import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function CapacitorDeepLinkBridge() {
  const router = useRouter();

  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return;

    const handleDeepLink = (url?: string) => {
      if (!url) return;

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
      } catch {
        return;
      }

      if (parsedUrl.host !== 'payment') return;

      const orderId = parsedUrl.searchParams.get('orderId');
      const path = parsedUrl.pathname;

      let route: string | null = null;
      if (path === '/success') route = '/payment/success';
      if (path === '/failure') route = '/payment/failure';
      if (path === '/cod/success') route = '/payment/cod/success';

      if (!route) return;

      const nextUrl = orderId
        ? `${route}?orderId=${encodeURIComponent(orderId)}`
        : route;

      router.replace(nextUrl);
    };

    const checkLaunchUrl = async () => {
      const launchUrl = await App.getLaunchUrl();
      handleDeepLink(launchUrl?.url);
    };

    void checkLaunchUrl();

    const handler = App.addListener('appUrlOpen', async ({ url }) => {
      try {
        await Browser.close();
      } catch {
        // Ignore close errors; we only need to ensure the browser is dismissed.
      }
      handleDeepLink(url);
    });

    return () => {
      void handler.then((h) => h.remove());
    };
  }, [router]);

  return null;
}
