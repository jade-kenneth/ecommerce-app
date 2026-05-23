/** build 1x */
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import Script from 'next/script';

import { CapacitorDeepLinkBridge } from './CapacitorDeepLinkBridge';
import { SupportChatWidget } from './SupportChatWidget';

import { ToastContainer } from '~/components/ToastContainer';
import { AuthProvider } from '~/providers/AuthProvider';
import { ClientCartProvider } from '~/providers/CartProvider';
import { ClientApolloProvider } from '~/providers/ClientLayoutProvider';
import { FeatureFlagProvider } from '~/providers/FeatureFlagProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Amy Store',
    template: '%s | Amy Store',
  },
  metadataBase: new URL('https://amy-store.site'),
  description: 'Amy Store ecommerce app for shopping, checkout, and order tracking.',
  applicationName: 'Amy Store',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      {
        url: '/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Amy Store',
    title: 'Amy Store',

    description: 'Amy Store ecommerce app for shopping, checkout, and order tracking.',
    images: [
      {
        url: '/favicon.ico',
        width: 424,
        height: 348,
        alt: 'Amy Store logo',
      },
    ],
  },

  verification: {
    google: 'jojN1BJdPqWwW9QxYEXfV3CXAZ6zGju9yGUO9FX67As',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Amy Store',
              url: 'https://amy-store.site',
              logo: 'https://amy-store.site/favicon.ico',
            }),
          }}
        />
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
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
        <CapacitorDeepLinkBridge />
        <FeatureFlagProvider>
          <ClientApolloProvider>
            <AuthProvider>
              <ClientCartProvider>
                {/* <LicenseProvider excludePaths={['/admin']}>{children}</LicenseProvider> */}
                {children}
                <ToastContainer />
                <SupportChatWidget />
                <Analytics />
              </ClientCartProvider>
            </AuthProvider>
          </ClientApolloProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
