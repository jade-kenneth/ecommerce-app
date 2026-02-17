'use client';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';
import { ToastContainer } from '~/components/ToastContainer';
import { AuthProvider } from '~/providers/AuthProvider';
import { ClientCartProvider } from '~/providers/CartProvider';
import { ClientApolloProvider } from '~/providers/ClientLayoutProvider';
import { LicenseProvider } from '~/providers/LicenseProvider';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-N7BZ4QRB31';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

    checkLaunchUrl();

    const handler = App.addListener('appUrlOpen', async ({ url }) => {
      try {
        await Browser.close();
      } catch {
        // Ignore close errors; we only need to ensure the browser is dismissed.
      }
      handleDeepLink(url);
    });

    return () => {
      handler.then((h) => h.remove());
    };
  }, [router]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="gtm-base" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TPVR9TRQ');`}
        </Script>
      </head>
      <body className="w-full">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPVR9TRQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
        <ClientApolloProvider>
          <ClientCartProvider>
            <AuthProvider>
              <LicenseProvider excludePaths={['/admin']}>
                {children}
              </LicenseProvider>
              <ToastContainer />
            </AuthProvider>
          </ClientCartProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
